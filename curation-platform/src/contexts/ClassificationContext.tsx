import React, { createContext, useContext, useState, useEffect } from "react";

interface ClassificationContextType {
  sortOption: string;
  setSortOption: (option: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

const ClassificationContext = createContext<ClassificationContextType | undefined>(undefined);

export const ClassificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sortOption, setSortOption] = useState<string>(
    () => sessionStorage.getItem("sortOption") || "name-asc"
  );
  const [page, setPage] = useState<number>(
    () => Number(sessionStorage.getItem("page")) || 1
  );
  const [pageSize, setPageSize] = useState<number>(
    () => Number(sessionStorage.getItem("pageSize")) || 48
  );

  useEffect(() => {
    sessionStorage.setItem("sortOption", sortOption);
    sessionStorage.setItem("page", page.toString());
    sessionStorage.setItem("pageSize", pageSize.toString());
  }, [sortOption, page, pageSize]);

  return (
    <ClassificationContext.Provider value={{ sortOption, setSortOption, page, setPage, pageSize, setPageSize }}>
      {children}
    </ClassificationContext.Provider>
  );
};

export const useClassification = () => {
  const context = useContext(ClassificationContext);
  if (!context) {
    throw new Error("useClassification must be used within a ClassificationProvider");
  }
  return context;
};
