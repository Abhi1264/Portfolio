import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminDb } from "@/lib/firebase-admin";
import { authOptions } from "@/lib/auth";

// Comment type definition
type Comment = {
  id: string;
  text: string;
  userId: string;
  userImage: string;
  userName: string;
  createdAt: string;
};

export async function DELETE(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get query params
    const url = new URL(request.url);
    const workId = url.searchParams.get("workId");
    const commentId = url.searchParams.get("commentId");

    if (!workId || !commentId) {
      return NextResponse.json(
        { error: "Work ID and comment ID are required" },
        { status: 400 },
      );
    }

    try {
      // Get the work document
      const workRef = adminDb.collection("works").doc(workId);
      const workDoc = await workRef.get();

      if (!workDoc.exists) {
        return NextResponse.json({ error: "Work not found" }, { status: 404 });
      }

      // Get existing comments
      const workData = workDoc.data();
      const comments = workData?.comments || [];

      // Find the comment
      const commentIndex = comments.findIndex(
        (c: Comment) => c.id === commentId,
      );

      if (commentIndex === -1) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 },
        );
      }

      const comment = comments[commentIndex];

      // Check if current user is authorized to delete this comment
      // User can delete their own comments OR if they are the admin
      const authorizedEmail = process.env.AUTHORIZED_EMAIL;
      const isAdmin = session.user.email === authorizedEmail;

      if (comment.userId !== session.user.email && !isAdmin) {
        return NextResponse.json(
          { error: "You are not authorized to delete this comment" },
          { status: 403 },
        );
      }

      // Remove the comment
      comments.splice(commentIndex, 1);

      // Update the work document
      await workRef.update({
        comments: comments,
      });

      // Return success
      return NextResponse.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (dbError: unknown) {
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Unknown database error";
      console.error("Firestore operation error:", errorMessage);
      return NextResponse.json(
        { error: `Database error: ${errorMessage}` },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting comment:", errorMessage);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
