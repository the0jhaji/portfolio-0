import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsGallery from "./pages/ProjectsGallery";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsGallery />} />
    </Routes>
  );
}
