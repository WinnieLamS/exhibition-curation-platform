import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMetData } from "../api/metApi";// Assuming similar component exists for Met
import "./../css/MetCollectionPage.css";
import { useLoading } from "../contexts/LoadingContext";

const MetCollectionPage = () => {
  const [objects, setObjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch the departments when the component mounts
  useEffect(() => {
    const getDepartments = async () => {
      const data = await fetchMetData("departments", {});
      if (data && data.departments) {
        setDepartments(data.departments);
      }
    };
    getDepartments();
  }, []);

  const fetchObjects = async () => {
    setLoading(true);
    const params = {
      departmentId: selectedDepartment,
      q: "",  // Empty query to fetch all objects
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage, // Offset for pagination
    };

    const data = await fetchMetData("search", params);
    if (data && data.objectIDs) {
      const limitedObjectIDs = data.objectIDs.slice(0, itemsPerPage);

      const objectsData = await Promise.all(
        limitedObjectIDs.map(async (objectID: number) => {
          try {
            const object = await fetchMetData(`objects/${objectID}`, {});
            if (object) {
              return object;
            } else {
              console.error(`Object ${objectID} is invalid or missing`);
              return null;
            }
          } catch (error: any) {
            console.error(`Error fetching object ${objectID}: ${error.message}`);
            return null;
          }
        })
      );

      setObjects(objectsData.filter((object) => object !== null));
    }
    setLoading(false);
  };

  // Fetch objects when the page settings change
  useEffect(() => {
    fetchObjects();
  }, [selectedDepartment, itemsPerPage, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="met-container">
      <h1>Metropolitan Museum of Art Collection</h1>
  
      <div className="met-selector-container">
        {/* Dropdown to select department */}
        <label>Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department.departmentId} value={department.departmentId}>
              {department.displayName}
            </option>
          ))}
        </select>
      </div>
  
      <div className="met-selector-container">
        {/* Dropdown to select items per page */}
        <label>Objects Per Page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
  
      {/* Display loading state */}
      {loading && <p>Loading...</p>}
  
      <div className="met-objects-list">
        {objects.length > 0 ? (
          objects.map((object) => (
            <div key={object.objectID} className="met-object-item">
              <Link to={`/Mobject/${object.objectID}`} className="met-object-link">
                {object.primaryImage && (
                  <img className="met-object-image" src={object.primaryImage} alt={object.title} />
                )}
                <h3>{object.title}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No objects found.</p>
        )}
      </div>
  
      <div className="met-pagination-controls">
       
        <button
          className="met-page-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button className="met-page-button" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
  
};

export default MetCollectionPage;