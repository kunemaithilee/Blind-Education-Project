import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Courses from "../pages/Courses/Courses";
import AudioNotes from "../pages/AudioNotes/AudioNotes";
import Lesson from "../pages/Lesson/Lesson";
import Assistant from "../pages/Assistant/Assistant";
import OCR from "../pages/OCR/OCR";
import Progress from "../pages/Progress/Progress";
import Quizzes from "../pages/Quizzes/Quizzes";
import Settings from "../pages/Settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/audio-notes" element={<AudioNotes />} />
      <Route path="/lesson" element={<Lesson />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/ocr" element={<OCR />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;
