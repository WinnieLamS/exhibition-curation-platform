import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const addObjectToExhibition = async (userId: string, exhibitionId: string, object: any) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    const exhibitionDoc = await getDoc(exhibitionRef);

    if (exhibitionDoc.exists()) {
      // Retrieve the existing exhibition data
      const exhibitionData = exhibitionDoc.data();
      
      // Add the new object to the objects array
      const updatedObjects = [...(exhibitionData?.objects || []), {
        title: object.title,
        description: object.description,
        imageUrl: object.primaryimageurl,
        artist: object.people?.[0]?.name || "Unknown",
        date: object.dated || "Unknown",
      }];
      
      // Update the exhibition, keeping the name intact
      await setDoc(exhibitionRef, {
        name: exhibitionData?.name, // Preserve the exhibition name
        objects: updatedObjects,
      });

      console.log("Object added to exhibition successfully!");
    } else {
      console.error("Exhibition not found!");
    }
  } catch (error) {
    console.error("Error adding object to exhibition:", error);
  }
};


export const getObjectsInExhibition = async (userId: string, exhibitionId: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    const exhibitionDoc = await getDoc(exhibitionRef);

    if (exhibitionDoc.exists()) {
      // Ensure objects is always an array
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

    const exhibitionsList = exhibitionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data()?.name || "Untitled Exhibition", // Default name if no name exists
      objects: doc.data()?.objects || [], // Ensure we always have an array, even if it's empty
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
    const newExhibitionRef = doc(exhibitionsRef); // Create a new document reference
    
    await setDoc(newExhibitionRef, {
      name: exhibitionName, // Ensure exhibition name is passed correctly
      objects: [], // Initialize with an empty objects array
    });

    console.log("New exhibition added:", exhibitionName);
  } catch (error) {
    console.error("Error adding exhibition:", error);
  }
};


export const deleteExhibition = async (userId: string, exhibitionId: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    await deleteDoc(exhibitionRef);
    console.log("Exhibition deleted successfully!");
  } catch (error) {
    console.error("Error deleting exhibition:", error);
  }
};

export const updateExhibitionName = async (exhibitionId: string, newName: string) => {
  try {
    const exhibitionRef = doc(db, "exhibitions", exhibitionId);
    await updateDoc(exhibitionRef, {
      name: newName,
    });
    console.log("Exhibition name updated");
  } catch (error) {
    console.error("Error updating exhibition name:", error);
  }
};

export const updateExhibitionDescription = async (exhibitionId: string, newDescription: string) => {
  try {
    const exhibitionRef = doc(db, "exhibitions", exhibitionId);
    await updateDoc(exhibitionRef, {
      description: newDescription,
    });
    console.log("Exhibition description updated");
  } catch (error) {
    console.error("Error updating exhibition description:", error);
  }
};

