import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { fetchHarvardData } from "../../api/harvardApi";
import "../../css/ClassificationPage.css";
import { useLoading } from "../../contexts/LoadingContext";
import { useClassification } from "../../contexts/ClassificationContext";

const MAX_OBJECTS = 200;

const ClassificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { loading, setLoading } = useLoading();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Classification";

  const { sortOption, setSortOption, page, setPage, pageSize, setPageSize } = useClassification();

  const [allObjects, setAllObjects] = useState<any[]>(() => {
    const storedObjects = sessionStorage.getItem(`classification-${id}`);
    return storedObjects ? JSON.parse(storedObjects) : [];
  });

  const [displayedObjects, setDisplayedObjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
 

  useEffect(() => {
    const fetchAllData = async () => {
      if (allObjects.length > 0) {
        return; 
      }

      setLoading(true);
      setError(null);
      try {
        let allRecords: any[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (allRecords.length < MAX_OBJECTS && currentPage <= totalPages) {
          const data = await fetchHarvardData("object", {
            classification: id, 
            page: currentPage,
            size: 50, 
          });

          if (!data || !data.records) {
            setError("No records found.");
            break;
          }

          allRecords = [...allRecords, ...data.records];
          totalPages = data.info.pages;

          if (allRecords.length >= MAX_OBJECTS) {
            allRecords = allRecords.slice(0, MAX_OBJECTS);
            break;
          }

          currentPage++;
        }

        if (allRecords.length === 0) {
          setError("No data available.");
        }

        setAllObjects(allRecords);
      } catch (err: any) {
        console.error("❌ API Error:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, setLoading]);

  useEffect(() => {
    const applySortingAndPagination = () => {
      if (!allObjects.length) return;

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
      
        return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
      

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setDisplayedObjects(sortedObjects.slice(startIndex, endIndex));
    };

    applySortingAndPagination();
  }, [allObjects, sortOption, page, pageSize]);

  const totalPages = Math.ceil(allObjects.length / pageSize);

  const handlePreviousPage = () => setPage(Math.max(page - 1, 1));
  const handleNextPage = () => setPage(Math.min(page + 1, totalPages));

  if (loading) return <> </>;

  return (
    <div className="classification-page">
      <h2>{name}</h2>

      {loading ? (
        null
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
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

            <div className="sort-selector">
              <label htmlFor="sortOption">Sort by:</label>
              <select id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="artist-asc">Artist (A-Z)</option>
              <option value="artist-desc">Artist (Z-A)</option>
            </select>
            </div>
          </div>

          
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

          {/* Pagination */}
          <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>

          <select value={page} onChange={(e) => setPage(Number(e.target.value))}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <option key={pageNumber} value={pageNumber}>
                Page {pageNumber}
              </option>
            ))}
          </select>

          <button onClick={handleNextPage} disabled={page >= totalPages}>
            Next
          </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassificationPage;
