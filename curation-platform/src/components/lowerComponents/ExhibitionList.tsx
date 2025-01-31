import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext"; 
import { getUserExhibitions, addUserExhibition } from "../../firebase/exhibitions";

const ExhibitionList: React.FC = () => {
  const { user } = useUser(); 
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [newExhibitionName, setNewExhibitionName] = useState<string>("");

  useEffect(() => {
    const loadExhibitions = async () => {
      if (user) {
        const userExhibitions = await getUserExhibitions(user.id);
        setExhibitions(userExhibitions);
      }
    };

    loadExhibitions();
  }, [user]);

  const handleCreateExhibition = async () => {
    if (!user || !newExhibitionName) return;

    await addUserExhibition(user.id, newExhibitionName);
    setNewExhibitionName(""); 
    const updatedExhibitions = await getUserExhibitions(user.id);
    setExhibitions(updatedExhibitions); 
  };

  return (
    <div>
      <h1>User Exhibitions</h1>
      <p>This page will display the user’s saved exhibitions and collections.</p>

      {user ? (
        <>
          <div>
            <h3>Your Exhibitions:</h3>
            <ul>
              {exhibitions.map((exhibition) => (
                <li key={exhibition.id}>
                  {exhibition.name}
                </li>
              ))}
            </ul>

            <div>
              <input
                type="text"
                value={newExhibitionName}
                onChange={(e) => setNewExhibitionName(e.target.value)}
                placeholder="Enter new exhibition name"
              />
              <button onClick={handleCreateExhibition}>Create New Exhibition</button>
            </div>
          </div>
        </>
      ) : (
        <p>You need to be logged in to view and create exhibitions.</p>
      )}
    </div>
  );
};

export default ExhibitionList;
