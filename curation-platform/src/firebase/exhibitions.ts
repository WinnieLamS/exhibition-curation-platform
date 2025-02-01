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
        objectId: object.id,
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
      // const exhibitionData = exhibitionDoc.data();
      // console.log("Fetched Exhibition Data:", exhibitionData);
      return exhibitionDoc.data()?.objects || []; 
    } else {
      console.error(`Exhibition with ID ${exhibitionId} not found`);
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

export const getExhibitionDetails = async (userId: string, exhibitionId: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    const exhibitionDoc = await getDoc(exhibitionRef);

    if (exhibitionDoc.exists()) {
      const exhibitionData = exhibitionDoc.data();
      // console.log(`Exhibition details for ${exhibitionId}:`, exhibitionData);

     
      return {
        exhibitionId,
        name: exhibitionData?.name || "Untitled Exhibition",
        description: exhibitionData?.description || "No description available",
      };
    } else {
      console.error(`Exhibition with ID ${exhibitionId} not found`);
      return {
        name: "Untitled Exhibition",
        description: "No description available",
      };
    }
  } catch (error) {
    console.error("Error fetching exhibition details:", error);
    return {
      name: "Untitled Exhibition",
      description: "No description available",
    };
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

export const deleteExhibition = async (userId: string, exhibitionId: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    await deleteDoc(exhibitionRef);
    // console.log("Exhibition deleted successfully!");
  } catch (error) {
    console.error("Error deleting exhibition:", error);
  }
};

export const updateExhibitionName = async (userId: string, exhibitionId: string, newName: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
   
    const exhibitionDoc = await getDoc(exhibitionRef);
    if (!exhibitionDoc.exists()) {
      console.error("Exhibition document not found");
      return;
    }

    await updateDoc(exhibitionRef, {
      name: newName,
    });
    console.log("Exhibition name updated");
  } catch (error) {
    console.error("Error updating exhibition name:", error);
  }
};


export const updateExhibitionDescription = async (userId: string, exhibitionId: string, newDescription: string) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    
    const exhibitionDoc = await getDoc(exhibitionRef);
    // console.log("Exhibition Document Data: ", exhibitionDoc.data());

    if (!exhibitionDoc.exists()) {
      console.error("Exhibition document not found");
      return;
    }

    await updateDoc(exhibitionRef, {
      description: newDescription,
    });

    console.log("Exhibition description updated");
  } catch (error) {
    console.error("Error updating exhibition description:", error);
  }
};

export const deleteObjectFromExhibition = async (userId: string, exhibitionId: string, objectId: string) => {
  try {

    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);

    const exhibitionDoc = await getDoc(exhibitionRef);

    if (exhibitionDoc.exists()) {
      const exhibitionData = exhibitionDoc.data();

      if (!exhibitionData?.objects) {
        console.error("Objects field missing in the exhibition data.");
        return;
      }

      const updatedObjects = exhibitionData.objects.filter((object: any) => object.objectId !== objectId);

      await updateDoc(exhibitionRef, { objects: updatedObjects });
    } else {
      console.error("Exhibition document not found!");
    }

  } catch (error) {
    console.error("Error removing object from exhibition in Firestore:", error);
  }
};








