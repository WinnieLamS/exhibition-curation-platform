import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
// import { addObjectToExhibition, getUserExhibitions } from "../../firebase/firestore";
import { useUser } from "../../contexts/UserContext";
import SignInSignUpCard from "../lowerComponents/SignInSignUpCard";
import "../../css/ObjectPage.css";

const ObjectPage: React.FC = () => {
  const { objectid } = useParams<{ objectid: string }>();
  console.log("ObjectPage - objectid:", objectid);

  const { user } = useUser();
  const [object, setObject] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<string>("");
  const [showLogin, setShowLogin] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHarvardData("object", { id: objectid });
        console.log("ObjectPage - API Response:", data);

        if (data.records && data.records.length > 0) {
          setObject(data.records[0]);
        } else {
          setError("Object not found.");
        }
      } catch (err: any) {
        setError("Failed to load object details.");
      } finally {
        setLoading(false);
      }
    };

    if (objectid) {
      fetchData();
    }
  }, [objectid]);

  useEffect(() => {
    const loadExhibitions = async () => {
      if (user) {
        const userExhibitions = await getUserExhibitions(user.id);
        setExhibitions(userExhibitions);
      }
    };

    loadExhibitions();
  }, [user]);

  const handleAddToExhibition = async () => {
    if (!user || !selectedExhibition) return;
    await addObjectToExhibition(user.id, selectedExhibition, object);
    alert("✅ Object added to exhibition!");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="object-page">
      <div className="object-header">
        <h2>{object.title || "Untitled"}</h2>
        <div className="object-image-container">
          <img
            src={object.primaryimageurl || "/placeholder.png"}
            alt={object.title || "Artwork"}
          />
        </div>
      </div>
      
      <hr className="separator-line" />

      <div className="object-details">
        <h3>Description</h3>
        <p>{object.description || "No description available."}</p>
        <p><strong>Artist:</strong> {object.people?.[0]?.name || "Unknown"}</p>
        <p><strong>Date:</strong> {object.dated || "Unknown"}</p>
        <p><strong>Medium:</strong> {object.medium || "Unknown"}</p>
        <p><strong>Dimensions:</strong> {object.dimensions || "Unknown"}</p>
      </div>

      {user ? (
        <div className="add-to-exhibition">
          <h3>Add to Exhibition</h3>
          {exhibitions.length > 0 ? (
            <>
              <select value={selectedExhibition} onChange={(e) => setSelectedExhibition(e.target.value)}>
                <option value="">Select Exhibition</option>
                {exhibitions.map((exhibition) => (
                  <option key={exhibition.id} value={exhibition.id}>
                    {exhibition.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddToExhibition} disabled={!selectedExhibition}>
                Add to Exhibition
              </button>
            </>
          ) : (
            <p>No exhibitions available. Create one in your profile.</p>
          )}
        </div>
      ) : (
        <p>
          Please <span className="login-link" onClick={() => setShowLogin(true)}>Sign In</span> to add objects to exhibitions.
        </p>
      )}

      <SignInSignUpCard visible={showLogin} onClose={() => setShowLogin(false)} />

      <div className="object-footer">
        <p>
          Data provided by Harvard Art Museums API. Visit their 
          <a href="https://www.harvardartmuseums.org/" target="_blank" rel="noopener noreferrer"> website</a>.
        </p>
      </div>
    </div>
  );
};

export default ObjectPage;
