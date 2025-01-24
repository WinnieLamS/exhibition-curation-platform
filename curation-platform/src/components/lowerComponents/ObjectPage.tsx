import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
import "../../css/ObjectPage.css";

const ObjectPage: React.FC = () => {
  const { objectid } = useParams<{ objectid: string }>();
  console.log("ObjectPage - objectid:", objectid);
  const [object, setObject] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data for the specific object by its objectid
        const data = await fetchHarvardData("object", { id: objectid });

        console.log("ObjectPage - API Response:", data);
        
        // Assuming API response contains the object details in `records`
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
