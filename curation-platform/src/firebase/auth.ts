import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";


export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; 
  }  catch (error: unknown) {
    if (error instanceof Error) {

      throw new Error(`Sign-up failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during sign-up.");
  }
};

export const signInUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user; 
    } catch (error: unknown) {
      if (error instanceof Error) {

        throw new Error(`Sign-in failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during sign-in.");
    }
};

export const signOutUser = async () => {
  try {
    await signOut(auth); 
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Sign-out error:", error.message); 
    } else {
      console.error("An unknown error occurred during sign-out.");
    }
  }
};
