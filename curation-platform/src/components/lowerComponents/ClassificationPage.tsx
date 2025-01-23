import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
import "../../css/ClassificationPage.css";

const ClassificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Classification";

  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHarvardData("object", {
          classification: id,
          page,
          size: 10,
        });
        setObjects(data.records);
      } catch (err: any) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page]);

  return (
    <div className="classification-page">
      <h2>{name}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="objects-list">
        {objects.map((obj, index) => (
          <div key={index} className="object-item">
            <img
              src={obj.primaryimageurl || "/placeholder.png"}
              alt={obj.title || "Artwork"}
              className="object-image"
            />
            <p>{obj.title || "Untitled"}</p>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ClassificationPage;
