import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminDb } from "@/lib/firebase-admin";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ workId: string }> },
) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is authorized (only allow your own email)
    const authorizedEmail = process.env.AUTHORIZED_EMAIL;
    if (session.user.email !== authorizedEmail) {
      return NextResponse.json(
        { error: "You are not authorized to update works" },
        { status: 403 },
      );
    }

    // Get work ID from params
    const { workId } = await params;
    if (!workId) {
      return NextResponse.json(
        { error: "Work ID is required" },
        { status: 400 },
      );
    }

    // Get request body
    const body = await request.json().catch(() => ({}));
    const { title, content, excerpt, category, tags } = body;

    // Validate required fields
    if (!title || !content || !excerpt || !category || !tags) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if work exists
    const workRef = adminDb.collection("works").doc(workId);
    const workDoc = await workRef.get();
    if (!workDoc.exists) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    // Update the work document
    await workRef.update({
      title,
      content,
      excerpt,
      category,
      tags,
      // Do not update date, likes, or comments here
    });

    return NextResponse.json({
      success: true,
      message: "Work updated successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating work:", errorMessage);
    return NextResponse.json(
      { error: `Failed to update work: ${errorMessage}` },
      { status: 500 },
    );
  }
}
