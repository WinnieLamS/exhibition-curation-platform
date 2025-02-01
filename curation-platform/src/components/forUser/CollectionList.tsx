import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getObjectsInExhibition, getExhibitionDetails, deleteObjectFromExhibition, updateExhibitionDescription, updateExhibitionName } from "../../firebase/exhibitions"; 
import { useUser } from "../../contexts/UserContext"; 
import "../../css/CollectionList.css";
import { useLoading } from "../../contexts/LoadingContext";

const CollectionList: React.FC = () => {
  const { exhibitionId } = useParams<{ exhibitionId: string }>();
  const { user } = useUser(); 
  const [objects, setObjects] = useState<any[]>([]);
  const [exhibitionName, setExhibitionName] = useState<string>("");
  const [newExhibitionName, setNewExhibitionName] = useState<string>("");
  const [exhibitionDescription, setExhibitionDescription] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchExhibitionData = async () => {
      try {
        if (exhibitionId && user?.id) { 
          const exhibitionObjects = await getObjectsInExhibition(user.id, exhibitionId);
          console.log(exhibitionObjects);  // Log the fetched objects to check if 'source' is present
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
      
      await deleteObjectFromExhibition(user.id, exhibitionId, objectId);
      setObjects((prevObjects) => prevObjects.filter((obj) => obj.objectId !== objectId));
    } catch (error) {
      setError("Failed to remove object from exhibition.");
      console.error("Error removing object from exhibition:", error);
    }
  };

  const handleAddDescription = async () => {
    try {
      if (!newDescription) {
        return setNewDescription("Please enter a description.");
      }
      if (!exhibitionId) {
        setError("Exhibition ID is missing.");
        return;
      }
      if (!user) {
        setError("User is missing.");
        return;
      }

      await updateExhibitionDescription(user.id, exhibitionId, newDescription);
      setExhibitionDescription(newDescription); 
      setNewDescription(""); 
      setIsEditing(false); 
    } catch (error) {
      setError("Failed to add description.");
      console.error("Error adding description:", error);
    }
  };

  const handleEditDescription = () => {
    setIsEditing(true); 
    setNewDescription(exhibitionDescription); 
  };
  const handleCancelEdit = () => {
    setIsEditing(false); 
    setNewDescription(exhibitionDescription);
  };

  const handleEditExhibitionName = () => {
    setIsEditingName(true); 
    setNewExhibitionName(exhibitionName); 
  };

  const handleCancelEditName = () => {
    setIsEditingName(false); 
    setNewExhibitionName(exhibitionName); 
  };

  const handleSaveExhibitionName = async () => {
    try {
      if (!newExhibitionName) {
        setError("Exhibition name cannot be empty.");
        return;
      }
      if (!user) {
        setError("User is missing.");
        return;
      }
      if (!exhibitionId) {
        setError("exhibitionId is missing.");
        return;
      }
      await updateExhibitionName(user.id, exhibitionId, newExhibitionName);
      setExhibitionName(newExhibitionName); 
      setIsEditingName(false);
    } catch (error) {
      setError("Failed to update exhibition name.");
      console.error("Error updating exhibition name:", error);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="custom-collection-list">
      <div className="custom-collection-header">
        <h1>{exhibitionName}</h1>
        {isEditingName ? (
          <div>
            <input
              type="text"
              value={newExhibitionName}
              onChange={(e) => setNewExhibitionName(e.target.value)}
              placeholder="Enter new exhibition name"
            />
            <button onClick={handleSaveExhibitionName}>Save</button>
            <button onClick={handleCancelEditName}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleEditExhibitionName}>Edit Exhibition Name</button>
        )}
      </div>
  
      <div className="custom-collection-description">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter new description"
            />
            <button onClick={handleAddDescription}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>{exhibitionDescription}</p>
            <button onClick={handleEditDescription}>Edit Description</button>
          </div>
        )}
      </div>
  
      {objects.length === 0 ? (
  <p className="custom-empty-message">No objects in this exhibition yet.</p>
) : (
  <div>
    {objects.map((object) => {
      // console.log(`Object ID: ${object.objectId}, Source: ${object.source}`); 
      const linkPath = object.source === 'met' 
        ? `/Mobject/${object.objectId}` 
        : `/Hobject/${object.objectId}`;

      // console.log(`Link Path: ${linkPath}`); 

      return (
        <div key={object.objectId} className="custom-object-item">
          <Link to={linkPath} className="custom-object-link">
            <img
              src={object.imageUrl || "/assets/placeholder.png"}
              alt={object.title}
              className="custom-object-image"
            />
          </Link>
          <p>{object.title}</p>
          <button onClick={() => handleRemoveCollection(object.objectId)}>
            Remove from Exhibition
          </button>
        </div>
      );
    })}
  </div>
)}

  
      <div className="custom-collection-footer">
        <p>Manage your collection and remove objects as needed.</p>
      </div>
    </div>
  );
  
};

export default CollectionList;
