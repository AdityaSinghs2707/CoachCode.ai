import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Materials from "./pages/materials/Materials";
import Practice from "./pages/practice/Practice";
import Notes from "./pages/notes/Notes";
import Tests from "./pages/tests/Tests";
import TestAttempt from "./pages/tests/TestAttempt";
import Roadmap from "./pages/roadmap/Roadmap";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import Announcements from "./pages/announcements/Announcements";
import Contests from "./pages/contests/Contests";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="materials" element={<Materials />} />
        <Route path="practice" element={<Practice />} />
        <Route path="notes" element={<RoleRoute allowedRoles={["student"]}><Notes /></RoleRoute>} />
        <Route path="tests" element={<Tests />} />
        <Route path="tests/:id/attempt" element={<TestAttempt />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="bookmarks" element={<RoleRoute allowedRoles={["student"]}><Bookmarks /></RoleRoute>} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="contests" element={<Contests />} />
        <Route
          path="admin/users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </RoleRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
