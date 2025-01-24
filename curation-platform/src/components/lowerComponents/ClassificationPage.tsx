import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
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
  const [pageSize, setPageSize] = useState<number>(8);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHarvardData("object", {
          classification: id,
          page,
          size: pageSize,
        });
        setObjects(data.records);
      } catch (err: any) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page, pageSize]);

  return (
    <div className="classification-page">
      <h2>{name}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Page size selector */}
      <div className="page-size-selector">
        <label htmlFor="pageSize">Objects per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>

      {/* Objects list */}
      <div className="objects-list">
        {objects.map((obj, index) => (
          <div key={index} className="object-item">
            <Link to={`/object/${obj.objectid}`} className="object-link">
              <img
                src={obj.primaryimageurl || "/placeholder.png"}
                alt={obj.title || "Artwork"}
                className="object-image"
              />
              <p>{obj.title || "Untitled"}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination-controls">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ClassificationPage;
