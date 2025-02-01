import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getObjectsInExhibition, getExhibitionDetails, deleteObjectFromExhibition } from "../../firebase/exhibitions"; 
import { useUser } from "../../contexts/UserContext"; 

const CollectionList: React.FC = () => {
  const { exhibitionId } = useParams<{ exhibitionId: string }>();
  const { user } = useUser(); // Get the user context
  const [objects, setObjects] = useState<any[]>([]);
  const [exhibitionName, setExhibitionName] = useState<string>("");
  const [exhibitionDescription, setExhibitionDescription] = useState<string>("");
  const [newExhibitionName, setNewExhibitionName] = useState<string>("");
  // const [newExhibitionDescription, setNewExhibitionDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExhibitionData = async () => {
      try {
        if (exhibitionId && user?.id) { 
          
          const exhibitionObjects = await getObjectsInExhibition(user.id, exhibitionId);
          // console.log("exhibitionId: ", exhibitionId);
          
          setObjects(exhibitionObjects);

       
          const exhibitionDetails = await getExhibitionDetails(user.id, exhibitionId);
          setExhibitionName(exhibitionDetails.name || "Untitled Exhibition");
          setExhibitionDescription(exhibitionDetails.description || "No description available.");
        }
      } catch (err) {
        setError("Failed to load exhibition details or objects.");
        console.error("Error loading exhibition data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitionData();
  }, [exhibitionId, user?.id]);

  const handleRemoveCollection = async (objectId: string) => {
    try {
      if (!user?.id || !exhibitionId) {
        setError("User ID or Exhibition ID is missing.");
        console.error("User ID or Exhibition ID is missing.");
        return;
      }
      
      console.log(`Attempting to remove object with ID: ${objectId}`);
      await deleteObjectFromExhibition(user.id, exhibitionId, objectId);
      setObjects((prevObjects) => {
        console.log("Previous objects:", prevObjects);
        const updatedObjects = prevObjects.filter((obj) => obj.objectId !== objectId);
        console.log("Updated objects after removal:", updatedObjects);
        return updatedObjects;
      });
    } catch (error) {
      setError("Failed to remove object from exhibition.");
      console.error("Error removing object from exhibition:", error);
    }
  };
  

  if (loading) return <p>Loading exhibition data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  

  return (
    
    <div>
      <h1>{exhibitionName}</h1>

      {/* <div>
        <h4>Edit Exhibition Name:</h4>
        <input
          type="text"
          value={newExhibitionName}
          onChange={(e) => setNewExhibitionName(e.target.value)}
          placeholder="Enter new exhibition name"
        />
        <button onClick={handleChangeExhibitionName}>Change Exhibition Name</button>
      </div> */}

      <div>
        <h3>Description</h3>
        <p>{exhibitionDescription || "No description available."}</p>
      </div>

      {objects.length === 0 ? (
        <p>No objects in this exhibition yet.</p>
      ) : (
        <div>
          <div>
            {objects.map((object) => (
              
              <div key={object.objectId || object.id}>
                <div>  
                <Link to={`/object/${object.objectId}`} className="object-link">
                    <img
                      src={object.imageUrl || "/assets/placeholder.png"}
                      alt={object.title}
                     
                    />
                  </Link>
                  <p>{object.title}</p>
                  <button onClick={() => handleRemoveCollection(object.objectId)}>Remove from Exhibition</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionList;
