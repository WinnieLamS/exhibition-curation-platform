import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
import {
  addObjectToExhibition,
  getUserExhibitions,
  addUserExhibition,
} from "../../firebase/exhibitions";
import { useUser } from "../../contexts/UserContext";
import SignInSignUpCard from "../lowerComponents/SignInSignUpCard";
import "../../css/ObjectPage.css";

const HObjectPage: React.FC = () => {
  const { objectid } = useParams<{ objectid: string }>();
  const { user, setUser } = useUser();
  const [object, setObject] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<string>("");
  const [showLogin, setShowLogin] = useState(false);
  const [newExhibitionName, setNewExhibitionName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHarvardData("object", { id: objectid });
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
      if (user?.id) {
        const userExhibitions = await getUserExhibitions(user.id);
        setExhibitions(userExhibitions || []);
      }
    };

    loadExhibitions();
  }, [user]);

  const handleAddToExhibition = async () => {
    if (!user || !selectedExhibition) return;

    try {
      // Add the object to the selected exhibition
      await addObjectToExhibition(user.id, selectedExhibition, object);

      // Refresh exhibitions list to get the latest data
      const updatedExhibitions = await getUserExhibitions(user.id);
      setExhibitions(updatedExhibitions); // Update the exhibitions state

      alert("Object added to exhibition!");
    } catch (error) {
      console.error("Error adding object to exhibition:", error);
      alert("Error adding object to exhibition");
    }
  };

  const handleCreateExhibition = async () => {
    if (!user || !newExhibitionName) return;
    await addUserExhibition(user.id, newExhibitionName);
    setNewExhibitionName("");
    const updatedExhibitions = await getUserExhibitions(user.id);
    setExhibitions(updatedExhibitions);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="object-page">
      <div className="object-header">
        <h2>{object?.title || "Untitled"}</h2>
        <div className="object-image-container">
          <img
            src={object?.primaryimageurl || "/placeholder.png"}
            alt={object?.title || "Artwork"}
          />
        </div>
      </div>

      <hr className="separator-line" />

      <div className="object-details">
        <h3>Description</h3>
        <p>{object?.description || "No description available."}</p>
        <p>
          <strong>Artist:</strong> {object?.people?.[0]?.name || "Unknown"}
        </p>
        <p>
          <strong>Date:</strong> {object?.dated || "Unknown"}
        </p>
        <p>
          <strong>Medium:</strong> {object?.medium || "Unknown"}
        </p>
        <p>
          <strong>Dimensions:</strong> {object?.dimensions || "Unknown"}
        </p>
      </div>

      <hr className="separator-line" />

      {user ? (
        <div className="add-to-exhibition">
          <Link to="/user-page" className="image-container">
            <img
              src={user?.avatar}
              alt="User Page"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              className="link-image"
            />
          </Link>
          <h3>Add Collection to Exhibition</h3>
          {exhibitions.length > 0 ? (
            <div className="exhibition-selection">
              <select
                value={selectedExhibition}
                onChange={(e) => setSelectedExhibition(e.target.value)}
              >
                <option value="">Select Exhibition</option>
                {exhibitions.map((exhibition) => (
                  <option key={exhibition.id} value={exhibition.id}>
                    {exhibition.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddToExhibition}
                disabled={!selectedExhibition}
              >
                Add to Exhibition
              </button>
              <div>
                <div className="exhibition-selection">
                  <input
                    type="text"
                    value={newExhibitionName}
                    onChange={(e) => setNewExhibitionName(e.target.value)}
                    placeholder="Enter new exhibition name"
                  />
                  <button onClick={handleCreateExhibition}>
                    Create New Exhibition
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="exhibition-selection">
              <p>No exhibitions available. Create one below:</p>
              <input
                type="text"
                value={newExhibitionName}
                onChange={(e) => setNewExhibitionName(e.target.value)}
                placeholder="Enter new exhibition name"
              />
              <button onClick={handleCreateExhibition}>
                Create New Exhibition
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>
          Please{" "}
          <span className="login-link" onClick={() => setShowLogin(true)}>
            Sign In
          </span>{" "}
          to add objects to exhibitions.
        </p>
      )}

      <SignInSignUpCard
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        setUser={setUser}
        setShowLogin={setShowLogin}
      />

      <hr className="separator-line" />

      <div className="object-footer">
        <p>
          Data provided by Harvard Art Museums API. Visit their
          <a
            href="https://www.harvardartmuseums.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            website
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default HObjectPage;
