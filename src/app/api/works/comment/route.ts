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
    const { workId, text } = body;

    if (!workId || !text?.trim()) {
      return NextResponse.json(
        { error: "Work ID and comment text are required" },
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

      // Create new comment object
      const comment = {
        id: Date.now().toString(),
        text: text.trim(),
        userId: session.user.email!,
        userImage: session.user.image || "",
        userName: session.user.name || "",
        createdAt: new Date().toISOString(),
      };

      // Get existing comments
      const workData = workDoc.data();
      const commentsArray = workData?.comments || [];

      // Add new comment
      await workRef.update({
        comments: [...commentsArray, comment],
      });

      // Return the new comment
      return NextResponse.json({
        success: true,
        comment,
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
    console.error("Error adding comment:", errorMessage);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
