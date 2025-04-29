"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast } from "sonner";

type Comment = {
  id: string;
  text: string;
  userId: string;
  userImage: string;
  userName: string;
  createdAt: string;
};

type WorkInteractionsProps = {
  workId: string;
};

// Create a completely uncontrolled input component that doesn't re-render during typing
const UncontrolledCommentInput = React.memo(({ 
  onSubmit 
}: { 
  onSubmit: (text: string) => Promise<void>
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = useCallback(async () => {
    if (!inputRef.current || !inputRef.current.value.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    const commentText = inputRef.current.value.trim();
    setIsSubmitting(true);
    
    try {
      await onSubmit(commentText);
      // Clear the input field after successful submission
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);
  
  // Prevent re-renders when typing by using an uncontrolled input
  return (
    <div className="mb-8">
      <Textarea
        ref={inputRef}
        placeholder="Add a comment..."
        className="mb-4 bg-black/50 border-purple-500/40"
      />
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </div>
  );
});

UncontrolledCommentInput.displayName = "UncontrolledCommentInput";

// Similarly, create a memoized component to display a like button
const LikeButton = React.memo(({ 
  liked, 
  likesCount, 
  onLike, 
  disabled 
}: { 
  liked: boolean, 
  likesCount: number, 
  onLike: () => void, 
  disabled: boolean 
}) => {
  return (
    <Button
      variant="ghost"
      onClick={onLike}
      disabled={disabled}
      className="flex items-center gap-2 text-purple-300 hover:text-purple-400 cursor-pointer"
    >
      {liked ? (
        <AiFillHeart className="text-red-500" />
      ) : (
        <AiOutlineHeart />
      )}
      <span>
        {likesCount} {likesCount === 1 ? "Like" : "Likes"}
      </span>
    </Button>
  );
});

LikeButton.displayName = "LikeButton";

// Create a memoized component for comments list
const CommentsList = React.memo(({ comments }: { comments: Comment[] }) => {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar src={comment.userImage} alt={comment.userName} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-purple-300">
                {comment.userName}
              </span>
              <span className="text-sm text-purple-400">
                {format(new Date(comment.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <p className="text-neutral-300 mt-1">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

CommentsList.displayName = "CommentsList";

// Create a stable sign-in prompt that won't re-render unnecessarily
const SignInPrompt = React.memo(() => (
  <div className="mb-8 p-4 bg-purple-500/10 rounded-md text-center">
    <p className="mb-3">Join the discussion by signing in!</p>
    <Button 
      onClick={() => signIn("google")}
      className="bg-purple-600 hover:bg-purple-700 px-8 cursor-pointer"
    >
      Sign In
    </Button>
  </div>
));

SignInPrompt.displayName = "SignInPrompt";

export function WorkInteractions({ workId }: WorkInteractionsProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const docRef = doc(db, "works", workId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const likesArray = data.likes || [];
          setLikes(likesArray);
          setComments(data.comments || []);
          setLiked(
            session?.user?.email
              ? likesArray.includes(session.user.email)
              : false
          );
        }
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    if (workId) {
      fetchInteractions();
    }
  }, [workId, session]);

  const handleLike = useCallback(async () => {
    if (!session?.user?.email) {
      toast.error("You need to be signed in to like works");
      return;
    }

    // Optimistic UI update
    const newLikedState = !liked;
    const userEmail = session.user.email;
    const optimisticLikes = newLikedState
      ? [...likes, userEmail]
      : likes.filter((email) => email !== userEmail);

    setLiked(newLikedState);
    setLikes(optimisticLikes);

    try {
      // Use absolute URL with base path
      const response = await fetch(`${window.location.origin}/api/works/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workId }),
      });

      // Parse response as JSON directly
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update like");
      }

      // Update with actual server data
      setLiked(data.liked);
      setLikes(data.likes);
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert UI on error
      setLiked(liked);
      setLikes(likes);
      toast.error("Failed to update like. Please try again.");
    }
  }, [liked, likes, session, workId]);

  // Stable callback function that doesn't change between renders
  const handleComment = useCallback(async (commentText: string) => {
    if (!session?.user) {
      toast.error("You need to be signed in to comment");
      return;
    }

    // Create a comment object for optimistic UI update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      text: commentText,
      userId: session.user.email!,
      userImage: session.user.image || "",
      userName: session.user.name || "",
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setComments((prev) => [...prev, optimisticComment]);

    try {
      // Use absolute URL with base path
      const response = await fetch(
        `${window.location.origin}/api/works/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workId,
            text: optimisticComment.text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post comment");
      }

      // Replace the temp comment with the real one from server
      setComments((prev) =>
        prev.map((c) => (c.id === optimisticComment.id ? data.comment : c))
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      // Remove the optimistic comment on error
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
      toast.error("Failed to post comment. Please try again.");
      toast.error("Failed to post comment. Please try again.");
    }
  }, [session, workId]);
  // Stable props for the like button - only change when needed
  const likeButtonProps = useMemo(() => ({
    liked,
    likesCount: likes.length,
    onLike: handleLike,
    disabled: !session
  }), [liked, likes.length, handleLike, session]);
  
  // Create the correct comment input component based on session state
  const commentInputComponent = useMemo(() => {
    if (!session) {
      return <SignInPrompt />;
    }
    return <UncontrolledCommentInput onSubmit={handleComment} />;
  }, [session, handleComment]);

  // Render the component with memoized children
  return (
    <div className="mt-8 border-t border-purple-500/40 pt-8">
      <div className="flex items-center gap-4 mb-8">
        <LikeButton {...likeButtonProps} />
        <span className="text-purple-300">{comments.length} Comments</span>
      </div>

      {commentInputComponent}
      <CommentsList comments={comments} />
    </div>
  );
}