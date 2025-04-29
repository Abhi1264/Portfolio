import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminDb } from "@/lib/firebase-admin";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json().catch(() => ({}));
    const { workId } = body;

    if (!workId) {
      return NextResponse.json(
        { error: "Work ID is required" },
        { status: 400 }
      );
    }

    try {
      // Get the work document
      const workRef = adminDb.collection("works").doc(workId);
      const workDoc = await workRef.get();

      if (!workDoc.exists) {
        return NextResponse.json({ error: "Work not found" }, { status: 404 });
      }

      const workData = workDoc.data();
      const likesArray = workData?.likes || [];
      const userEmail = session.user.email;

      // Check if user has already liked
      const userLiked = likesArray.includes(userEmail);

      // Update likes array
      if (userLiked) {
        // Unlike: remove user's email
        await workRef.update({
          likes: likesArray.filter((email: string) => email !== userEmail),
        });
      } else {
        // Like: add user's email
        await workRef.update({
          likes: [...likesArray, userEmail],
        });
      }

      // Return updated likes array
      const updatedDoc = await workRef.get();
      const updatedLikes = updatedDoc.data()?.likes || [];

      return NextResponse.json({
        success: true,
        liked: !userLiked,
        likes: updatedLikes,
      });
    } catch (dbError: unknown) {
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Unknown database error";
      console.error("Firestore operation error:", errorMessage);
      return NextResponse.json(
        { error: `Database error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error handling like:", errorMessage);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
