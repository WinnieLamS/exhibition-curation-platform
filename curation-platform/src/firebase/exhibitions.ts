import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const addObjectToExhibition = async (userId: string, exhibitionId: string, object: any) => {
  try {
    const exhibitionRef = doc(db, "users", userId, "exhibitions", exhibitionId);
    const exhibitionDoc = await getDoc(exhibitionRef);

    if (exhibitionDoc.exists()) {
      const exhibitionData = exhibitionDoc.data();
      
      const updatedObjects = [
        ...(exhibitionData?.objects || []),
        {
          objectId: object.id,
          title: object.title,
          description: object.description,
          imageUrl: object.primaryimageurl || object.primaryImage || "/placeholder.png", // Handle different image fields
          artist: object.people?.[0]?.name || object.artistDisplayName || "Unknown", // Handle artist info
          date: object.dated || object.objectDate || "Unknown",
          source: object.source || 'unknown', 
        }
      ];

      await setDoc(exhibitionRef, {
        name: exhibitionData?.name, 
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
      const exhibitionData = exhibitionDoc.data();
      return exhibitionData?.objects || [];
    } else {
      console.error("Exhibition not found!");
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
      name: doc.data()?.name || "Untitled Exhibition", 
      objects: doc.data()?.objects || [], 
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
    // console.log("Exhibition name updated");
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

    // console.log("Exhibition description updated");
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








