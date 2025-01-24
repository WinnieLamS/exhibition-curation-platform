import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
import "../../css/ClassificationPage.css";

const ClassificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Classification";

  const [allObjects, setAllObjects] = useState<any[]>([]); // Store all data
  const [displayedObjects, setDisplayedObjects] = useState<any[]>([]); // Current page data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(48);
  const [sortOption, setSortOption] = useState<string>("name-asc");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        let allRecords: any[] = [];
        let currentPage = 1;
        let totalPages = 1;

        // Fetch all pages
        do {
          const data = await fetchHarvardData("object", {
            classification: id,
            page: currentPage,
            size: 100, // Request a large number of items per page
          });
          allRecords = [...allRecords, ...data.records];
          totalPages = data.info.pages; // Assuming `info.pages` provides total pages
          currentPage++;
        } while (currentPage <= totalPages);

        setAllObjects(allRecords);
        setDisplayedObjects(allRecords.slice(0, pageSize)); // Show first page initially
      } catch (err: any) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  useEffect(() => {
    // Apply sorting and pagination whenever data, sort option, or pagination changes
    const applySortingAndPagination = () => {
      const [field, order] = sortOption.split("-");
      const isAscending = order === "asc";

      const sortedObjects = [...allObjects].sort((a, b) => {
        let valueA, valueB;

        if (field === "name") {
          valueA = a.title?.toLowerCase() || "";
          valueB = b.title?.toLowerCase() || "";
        } else if (field === "date") {
          valueA = a.dated || "";
          valueB = b.dated || "";
        } else if (field === "artist") {
          valueA = a.people?.[0]?.name?.toLowerCase() || "";
          valueB = b.people?.[0]?.name?.toLowerCase() || "";
        }

        if (valueA < valueB) return isAscending ? -1 : 1;
        if (valueA > valueB) return isAscending ? 1 : -1;
        return 0;
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setDisplayedObjects(sortedObjects.slice(startIndex, endIndex));
    };

    applySortingAndPagination();
  }, [allObjects, sortOption, page, pageSize]);

  const totalPages = Math.ceil(allObjects.length / pageSize);

  return (
    <div className="classification-page">
      <h2>{name}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Page size selector */}
      <div className="page-controls">
        <div className="page-size-selector">
          <label htmlFor="pageSize">Objects per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={48}>48</option>
            <option value={24}>24</option>
            <option value={12}>12</option>
          </select>
        </div>

        {/* Sort selector */}
        <div className="sort-selector">
          <label htmlFor="sortOption">Sort by:</label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="date-desc">Date (Newest First)</option>
            <option value="artist-asc">Artist (A-Z)</option>
            <option value="artist-desc">Artist (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Objects list */}
      <div className="objects-list">
        {displayedObjects.map((obj, index) => (
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
      
      <hr className="separator-line" />
      {/* Pagination controls */}
      <div className="pagination-controls">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <select
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <option key={pageNumber} value={pageNumber}>
              Page {pageNumber}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClassificationPage;
