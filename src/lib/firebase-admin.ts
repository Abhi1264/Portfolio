import * as admin from "firebase-admin";

// Define the service account type
interface ServiceAccount {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
}

// Initialize with service account if not already initialized
const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Firebase Admin initialization error:", errorMessage);

      // If we're in development, provide more guidance
      if (process.env.NODE_ENV !== "production") {
        console.error(
          "Ensure your .env.local file has FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY properly set",
        );
      }

      throw new Error("Failed to initialize Firebase Admin SDK");
    }
  }

  return admin;
};

// Initialize and export the admin instance
export const adminApp = getFirebaseAdmin();
export const adminDb = adminApp.firestore();
