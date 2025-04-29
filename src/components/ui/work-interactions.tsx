"use client";

import { useState, useEffect } from "react";
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

export function WorkInteractions({ workId }: WorkInteractionsProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLike = async () => {
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

      // Log response details for debugging
      console.log(`Like API Response Status: ${response.status}`);
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        // No parameter needed here
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response format");
      }

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
  };

  const handleComment = async () => {
    if (!session?.user) {
      toast.error("You need to be signed in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsLoading(true);

    // Create a comment object for optimistic UI update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      text: newComment.trim(),
      userId: session.user.email!,
      userImage: session.user.image || "",
      userName: session.user.name || "",
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setComments((prev) => [...prev, optimisticComment]);
    setNewComment("");

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

      // Log response details for debugging
      console.log(`Comment API Response Status: ${response.status}`);
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        // No parameter needed here
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response format");
      }

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
      setNewComment(optimisticComment.text);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-purple-500/40 pt-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={handleLike}
          disabled={!session}
          className="flex items-center gap-2 text-purple-300 hover:text-purple-400 cursor-pointer"
        >
          {liked ? (
            <AiFillHeart className="text-red-500" />
          ) : (
            <AiOutlineHeart />
          )}
          <span>
            {likes.length} {likes.length === 1 ? "Like" : "Likes"}
          </span>
        </Button>
        <span className="text-purple-300">{comments.length} Comments</span>
      </div>

      {session ? (
        <div className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-4 bg-black/50 border-purple-500/40"
          />
          <Button
            onClick={handleComment}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-purple-500/10 rounded-md text-center">
          <p className="mb-3">Join the discussion by signing in!</p>
          <Button 
            onClick={() => signIn("google")}
            className="bg-purple-600 hover:bg-purple-700 px-8 cursor-pointer"
          >
            Sign In
          </Button>
        </div>
      )}

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
    </div>
  );
}
