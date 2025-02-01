import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClassificationProvider } from "./contexts/ClassificationContext";
import Layout from "./components/lowerComponents/Layout";
import HomePage from "./components/HomePage";
import UserPage from "./components/UserPage";
import MetCollectionPage from "./components/MetCollectionPage";
import HarvardCollectionPage from "./components/HarvardCollectionPage";
import ClassificationPage from "./components/forHarvard/ClassificationPage";
import MetObjectPage from "./components/forMet/MObjectPage";
import HarvardObjectPage from "./components/forHarvard/HObjectPage";
import ExhibitionList from "./components/forUser/ExhibitionList";
import CollectionList from "./components/forUser/CollectionList";

const App: React.FC = () => {
  return (
    <ClassificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="/harvard-collection"
              element={<HarvardCollectionPage />}
            />
            <Route
              path="/classification/:id"
              element={<ClassificationPage />}
            />
            <Route path="/Hobject/:objectid" element={<HarvardObjectPage />} />
            <Route path="/Mobject/:objectid" element={<MetObjectPage />} />
            <Route path="met-collection" element={<MetCollectionPage />} />
            <Route path="/user-exhibitions" element={<ExhibitionList />} />
            <Route path="/user-page" element={<UserPage />} />
            <Route
              path="/collection-list/:exhibitionId"
              element={<CollectionList />}
            />
          </Route>
        </Routes>
      </Router>
    </ClassificationProvider>
  );
};

export default App;
