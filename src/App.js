import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lessons from "./pages/Lessons";
import Create from "./pages/Create";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="lessons" element={<Lessons />} />
          <Route path="create" element={<Create />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
