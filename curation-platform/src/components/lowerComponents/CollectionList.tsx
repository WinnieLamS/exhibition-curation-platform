import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getObjectsInExhibition, updateExhibitionName } from "../../firebase/exhibitions";

const CollectionList: React.FC = () => {
  const { exhibitionId } = useParams<{ exhibitionId: string }>();
  const [objects, setObjects] = useState<any[]>([]);
  const [exhibitionName, setExhibitionName] = useState<string>("");
  const [exhibitionDescription, setExhibitionDescription] = useState<string>("");
  const [newExhibitionName, setNewExhibitionName] = useState<string>("");
  const [newExhibitionDescription, setNewExhibitionDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExhibitionData = async () => {
      try {
        if (exhibitionId) {
          const exhibitionObjects = await getObjectsInExhibition(exhibitionId);
          setObjects(exhibitionObjects);

          const exhibitionDetails = await getExhibitionDetails(exhibitionId);
          setExhibitionName(exhibitionDetails.name);
          setExhibitionDescription(exhibitionDetails.description);
        }
      } catch (err) {
        setError("Failed to load exhibition details or objects.");
        console.error("Error loading exhibition data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitionData();
  }, [exhibitionId]);

  const handleChangeExhibitionName = async () => {
    if (newExhibitionName) {
      await updateExhibitionName(exhibitionId, newExhibitionName);
      setExhibitionName(newExhibitionName);
      setNewExhibitionName("");
    }
  };

  const handleRemoveCollection = async (objectId: string) => {
    try {
      await deleteObjectFromExhibition(exhibitionId, objectId);
      setObjects(objects.filter((obj) => obj.id !== objectId));
    } catch (error) {
      setError("Failed to remove object from exhibition.");
    }
  };

  if (loading) return <p>Loading exhibition data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Collection for Exhibition {exhibitionName}</h1>

      <div>
        <h3>Edit Exhibition Name</h3>
        <input
          type="text"
          value={newExhibitionName}
          onChange={(e) => setNewExhibitionName(e.target.value)}
          placeholder="Enter new exhibition name"
        />
        <button onClick={handleChangeExhibitionName}>Change Exhibition Name</button>
      </div>

      <div>
        <h3>Description</h3>
        <p>{exhibitionDescription || "No description available."}</p>
      </div>

      {objects.length === 0 ? (
        <p>No objects in this exhibition yet.</p>
      ) : (
        <div>
          <h3>Objects:</h3>
          <ul>
            {objects.map((object) => (
              <li key={object.id}>
                <div>
                  <Link to={`/object-page/${object.id}`}>
                    <img
                      src={object.imageUrl || "/assets/placeholder.png"}
                      alt={object.title}
                      style={{ width: "100px", height: "100px", borderRadius: "8px" }}
                    />
                  </Link>
                  <p>{object.title}</p>
                  <p>{object.artist}</p>
                  <button onClick={() => handleRemoveCollection(object.id)}>Remove from Exhibition</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CollectionList;
