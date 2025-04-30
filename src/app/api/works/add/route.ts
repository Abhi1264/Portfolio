import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminDb } from "@/lib/firebase-admin";
import { authOptions } from "@/lib/auth";

// Helper function to create a URL-friendly slug from title
function createSlugFromTitle(title: string): string {
  // Convert to lowercase, replace spaces and special chars with hyphens
  // Remove any non-alphanumeric characters except hyphens
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

// Helper function to check if a document with the given ID already exists
async function checkIfIdExists(id: string): Promise<boolean> {
  const docRef = adminDb.collection("works").doc(id);
  const doc = await docRef.get();
  return doc.exists;
}

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
      // Create a slug from the title
      let slug = createSlugFromTitle(title);
      
      // Check if work with same slug exists, if so add timestamp to make it unique
      const slugExists = await checkIfIdExists(slug);
      if (slugExists) {
        const timestamp = new Date().getTime().toString().slice(-6); // Use last 6 digits of timestamp
        slug = `${slug}-${timestamp}`;
      }

      // Create a new work document with the slug as the ID
      const workRef = adminDb.collection("works").doc(slug);
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
        id: slug
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