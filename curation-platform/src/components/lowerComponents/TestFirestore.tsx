import React, { useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import db from "../../firebase/firestore";

const TestFirestore: React.FC = () => {
  useEffect(() => {
    const testFirestore = async () => {
      try {
        // Add a test document
        const docRef = await addDoc(collection(db, "userData"), {
          name: "Test user",
          email: "test@email",

        });
        console.log("Document written with ID: ", docRef.id);

        const querySnapshot = await getDocs(collection(db, "userData"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => `, doc.data());
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    testFirestore();
  }, []);

  return <div>Check the console for Firestore test results.</div>;
};

export default TestFirestore;
