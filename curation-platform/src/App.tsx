import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import UserPage from "./components/UserPage";
import HarvardCollectionPage from "./components/HarvardCollectionPage";
import MetCollectionPage from "./components/MetCollectionPage";
import Layout from "./components/lowerComponents/Layout";
import ClassificationPage from "./components/lowerComponents/ClassificationPage";
import ExhibitionList from "./components/lowerComponents/ExhibitionList";
import ObjectPage from "./components/lowerComponents/ObjectPage";
import { ClassificationProvider } from "./contexts/ClassificationContext";




const App: React.FC = () => {
  return (
    <ClassificationProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/harvard-collection" element={<HarvardCollectionPage />} />
          <Route path="/classification/:id" element={<ClassificationPage />} />
          <Route path="/object/:objectid" element={<ObjectPage />} />
          <Route path="met-collection" element={<MetCollectionPage />} />
          <Route path="/user-exhibitions" element={<ExhibitionList />} />
          <Route path="/user-page" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
    </ClassificationProvider>
  );
};

export default App;
