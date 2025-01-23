import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import UserPage from "./components/UserPage";
import HarvardCollectionPage from "./components/HarvardCollectionPage";
import MetCollectionPage from "./components/MetCollectionPage";
import UserExhibitionsPage from "./components/UserExhibitionsPage";
import Layout from "./components/lowerComponents/Layout";
import ClassificationPage from "./components/lowerComponents/ClassificationPage";




const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/harvard-collection" element={<HarvardCollectionPage />} />
          <Route path="/classification/:id" element={<ClassificationPage />} />
          <Route path="met-collection" element={<MetCollectionPage />} />
          <Route path="user-exhibitions" element={<UserExhibitionsPage />} />
          <Route path="user" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
