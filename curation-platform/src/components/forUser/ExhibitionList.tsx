import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext"; 
import { getUserExhibitions, getObjectsInExhibition, addUserExhibition, deleteExhibition } from "../../firebase/exhibitions";
import { Link } from "react-router-dom"; 
import "../../css/ExhibitionList.css";

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

  const handleDeleteExhibition = async (exhibitionId: string) => {
    if (!user) {
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete the exhibition with all collections?");
    if (confirmDelete) {
      await deleteExhibition(user.id, exhibitionId);
      const updatedExhibitions = await getUserExhibitions(user.id);
      setExhibitions(updatedExhibitions);
    }
  };

 
  const getExhibitionImage = async (exhibitionId: string) => {
    if (!user?.id) {
      console.error("User ID is undefined");
      return "/assets/add.png"; 
    }

    try {
      const objects = await getObjectsInExhibition(user.id, exhibitionId);
      if (objects.length > 0) {
        return objects[0].imageUrl;
      } else {
        return "/assets/add.png";
      }
    } catch (error) {
      console.error("Error fetching objects in exhibition:", error);
      return "/assets/add.png"; 
    }
  };

 
  const [exhibitionImages, setExhibitionImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadExhibitionImages = async () => {
      const images: { [key: string]: string } = {};
      for (const exhibition of exhibitions) {
        const imageUrl = await getExhibitionImage(exhibition.id);
        images[exhibition.id] = imageUrl;
      }
      setExhibitionImages(images);
    };

    if (exhibitions.length > 0) {
      loadExhibitionImages();
    }
  }, [exhibitions]);

  return (
    <div className="exhibition-page">

      {user ? (
        <>
          <div>
            <h3>Your Exhibitions</h3>
            <div className="exhibitions-list">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="exhibition-item">
                  <div>
                  <h4>{exhibition.name || "Untitled Exhibition"}</h4>
                    <Link to={`/collection-list/${exhibition.id}`} className="object-link">
                      <img
                        src={exhibitionImages[exhibition.id] || "/assets/add.png"}
                        alt={exhibition.name || "Untitled Exhibition"}
                        className="exhibition-image"
                      />
                    </Link>
                    <button onClick={() => handleDeleteExhibition(exhibition.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="selector-container">
              <input
                type="text"
                value={newExhibitionName}
                onChange={(e) => setNewExhibitionName(e.target.value)}
                placeholder="Enter new exhibition name"
              />
              <div>
              <button onClick={handleCreateExhibition}>Create</button>
              </div>
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
