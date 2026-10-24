import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Certifications from "./pages/Certifications";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobAnalysis from "./pages/JobAnalysis";
import SkillGaps from "./pages/SkillGaps";
import CareerRoles from "./pages/CareerRoles";
import GitHub from "./pages/GitHub";
import Preferences from "./pages/Preferences";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected application */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/certifications" element={<Certifications />} />
                    <Route path="/resume" element={<ResumeBuilder />} />
                    <Route path="/job-analysis" element={<JobAnalysis />} />
                    <Route path="/skill-gaps" element={<SkillGaps />} />
                    <Route path="/career-roles" element={<CareerRoles />} />
                    <Route path="/github" element={<GitHub />} />
                    <Route path="/preferences" element={<Preferences />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;