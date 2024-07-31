import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lessons from "./pages/Lessons";
import Create from "./pages/Create";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Debts from "./pages/Debts";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="create" element={<Create />} />
          <Route path="debts" element={<Debts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
