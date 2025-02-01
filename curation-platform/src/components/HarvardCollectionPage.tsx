import React, { useEffect } from "react";
import ClassificationCard from "./forHarvard/ClassificationCard";
import "./../css/HarvardCollectionPage.css";
import { useLoading } from "../contexts/LoadingContext";

const classifications = [
  { name: "Fragments ", id: 94 },
  { name: "Drawings", id: 21 },
  { name: "Jewelry", id: 19 },
  { name: "Paintings", id: 26 },
];

const HarvardCollectionPage: React.FC = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => setLoading(false);
  }, [setLoading]);

  return (
    <div className="harvard-collection-page">
      <h2>Harvard Art Museums Collection</h2>
      <div className="classification-grid">
        {classifications.map((classification) => (
          <ClassificationCard
            key={classification.id}
            name={classification.name}
            id={classification.id}
          />
        ))}
      </div>
    </div>
  );
};

export default HarvardCollectionPage;
