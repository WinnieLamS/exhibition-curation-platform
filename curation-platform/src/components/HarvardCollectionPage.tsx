import React, { useState, useEffect } from "react";
import { fetchHarvardData } from "../api/harvardApi";

const HarvardCollectionPage: React.FC = () => {
  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the updated API helper function
        const data = await fetchHarvardData("object", {
          page,
          size: pageSize,
        });
        setObjects(data.records);
      } catch (err: any) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next") setPage((prev) => prev + 1);
    if (direction === "prev" && page > 1) setPage((prev) => prev - 1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPage(1); // Reset to the first page
  };

  return (
    <div>
      <h1>Harvard Art Museums Collection</h1>
      <div>
        <label htmlFor="pageSize">Items per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="objects-list">
        {objects.map((obj, index) => (
          <div key={index} className="object-item">
            <img
              src={obj.primaryimageurl || "/placeholder.png"}
              alt={obj.description || "Artwork"}
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <p>{obj.people?.[0]?.displayname || "Unknown Artist"}</p>
            <p>{obj.dated || "Unknown Date"}</p>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button onClick={() => handlePageChange("prev")} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => handlePageChange("next")}>Next</button>
      </div>
    </div>
  );
};

export default HarvardCollectionPage;
