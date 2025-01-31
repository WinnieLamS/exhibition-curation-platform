import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const addObjectToExhibition = async (userId: string, exhibitionId: string, object: any) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    const exhibitionDoc = await getDoc(exhibitionRef);

    let objects = [];

    if (exhibitionDoc.exists()) {
      objects = exhibitionDoc.data()?.objects || [];
    }

    const newObject = {
      title: object.title,
      description: object.description,
      imageUrl: object.primaryimageurl,
      artist: object.people?.[0]?.name || "Unknown",
      date: object.dated || "Unknown",
    };

    await setDoc(exhibitionRef, {
      objects: [...objects, newObject],
    });

    console.log("Object added to exhibition successfully!");
  } catch (error) {
    console.error("Error adding object to exhibition:", error);
  }
};

export const getObjectsInExhibition = async (userId: string, exhibitionId: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    const exhibitionDoc = await getDoc(exhibitionRef);

    if (exhibitionDoc.exists()) {
      return exhibitionDoc.data()?.objects || [];
    } else {
      console.log("Exhibition does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching objects in exhibition:", error);
    return [];
  }
};

export const getUserExhibitions = async (userId: string) => {
  try {
    const exhibitionsRef = collection(db, "users", userId, "exhibitions");
    const exhibitionsSnapshot = await getDocs(exhibitionsRef);

    const exhibitionsList = exhibitionsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data()?.name,
    }));

    return exhibitionsList;
  } catch (error) {
    console.error("Error fetching user exhibitions:", error);
    return [];
  }
};

export const addUserExhibition = async (userId: string, exhibitionName: string) => {
  try {
    const exhibitionsRef = collection(db, "users", userId, "exhibitions");
    const newExhibitionRef = doc(exhibitionsRef);
    
    await setDoc(newExhibitionRef, {
      name: exhibitionName,
      objects: [], 
    });

    console.log("New exhibition added:", exhibitionName);
  } catch (error) {
    console.error("Error adding exhibition:", error);
  }
};
