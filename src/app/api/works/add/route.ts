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

    // Check if user is authorized (only allow your own email)
    const authorizedEmail = process.env.AUTHORIZED_EMAIL;
    if (session.user.email !== authorizedEmail) {
      return NextResponse.json(
        { error: "You are not authorized to add works" },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json().catch(() => ({}));
    const { title, content, excerpt, category, tags } = body;

    // Validate required fields
    if (!title || !content || !excerpt || !category || !tags) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Create a new work document
      const workRef = adminDb.collection("works").doc();
      await workRef.set({
        title,
        content,
        excerpt,
        category,
        date: new Date().toISOString(),
        tags,
        likes: [],
        comments: []
      });

      // Return success with the new work ID
      return NextResponse.json({
        success: true,
        id: workRef.id
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
    console.error("Error adding work:", errorMessage);
    return NextResponse.json(
      { error: `Failed to add work: ${errorMessage}` },
      { status: 500 }
    );
  }
}