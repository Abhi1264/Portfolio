import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminDb } from "@/lib/firebase-admin";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is authorized (only allow your own email)
    const authorizedEmail = process.env.AUTHORIZED_EMAIL;
    if (session.user.email !== authorizedEmail) {
      return NextResponse.json(
        { error: "You are not authorized to delete works" },
        { status: 403 }
      );
    }

    // Get work ID from request URL
    const url = new URL(request.url);
    const workId = url.searchParams.get('id');

    if (!workId) {
      return NextResponse.json(
        { error: "Work ID is required" },
        { status: 400 }
      );
    }

    try {
      // Check if work exists
      const workRef = adminDb.collection("works").doc(workId);
      const workDoc = await workRef.get();

      if (!workDoc.exists) {
        return NextResponse.json({ error: "Work not found" }, { status: 404 });
      }

      // Delete the work
      await workRef.delete();

      // Return success
      return NextResponse.json({
        success: true,
        message: "Work deleted successfully"
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
    console.error("Error deleting work:", errorMessage);
    return NextResponse.json(
      { error: `Failed to delete work: ${errorMessage}` },
      { status: 500 }
    );
  }
}