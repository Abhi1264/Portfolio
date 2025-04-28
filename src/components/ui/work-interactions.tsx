"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

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
      const docRef = doc(db, "works", workId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const likesArray = data.likes || [];
        setLikes(likesArray);
        setComments(data.comments || []);
        setLiked(session?.user?.email ? likesArray.includes(session.user.email) : false);
      }
    };

    fetchInteractions();
  }, [workId, session?.user?.email]);

  const handleLike = async () => {
    if (!session?.user?.email) return;
    const userEmail = session.user.email;

    try {
      const workRef = doc(db, "works", workId);
      const workDoc = await getDoc(workRef);
      
      if (!workDoc.exists()) return;
      
      const currentLikes = workDoc.data().likes || [];
      const newLikes = liked
        ? currentLikes.filter((email: string) => email !== userEmail)
        : [...currentLikes, userEmail];

      await updateDoc(workRef, {
        likes: newLikes
      });

      setLiked(!liked);
      setLikes(newLikes);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleComment = async () => {
    if (!session?.user || !newComment.trim()) return;

    setIsLoading(true);
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      userId: session.user.email!,
      userImage: session.user.image || "",
      userName: session.user.name || "",
      createdAt: new Date().toISOString()
    };

    const workRef = doc(db, "works", workId);
    await updateDoc(workRef, {
      comments: arrayUnion(comment)
    });

    setComments(prev => [...prev, comment]);
    setNewComment("");
    setIsLoading(false);
  };

  return (
    <div className="mt-8 border-t border-purple-500/40 pt-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={handleLike}
          disabled={!session}
          className="flex items-center gap-2 text-purple-300 hover:text-purple-400"
        >
          {liked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
          <span>{likes.length} {likes.length === 1 ? "Like" : "Likes"}</span>
        </Button>
        <span className="text-purple-300">{comments.length} Comments</span>
      </div>

      {session && (
        <div className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-4 bg-black/50 border-purple-500/40"
          />
          <Button
            onClick={handleComment}
            disabled={!newComment.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar src={comment.userImage} alt={comment.userName} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">{comment.userName}</span>
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