import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
import "../../css/ClassificationCard.css";

interface ClassificationCardProps {
  name: string;
  id: number;
}

const ClassificationCard: React.FC<ClassificationCardProps> = ({ name, id }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const data = await fetchHarvardData("object", {
          classification: id,
          page: 1,
          size: 1, // Limit to one object
        });
        const object = data.records?.[0];
        setImageUrl(object?.primaryimageurl || null);
      } catch (error) {
        console.error("Failed to load image for classification:", name, error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id, name]);

  return (
    <Link to={`/classification/${id}?name=${encodeURIComponent(name)}`} className="classification-card">
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="classification-image"
          />
        ) : (
          <p>No image available</p>
        )}
        <h3>{name}</h3>
      </div>
    </Link>
  );
};

export default ClassificationCard;
