import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailsPage from "./pages/Documents/DocumentDetailsPage";
import FlashCardListPage from "./pages/FlashCard/FlashCardListPage";
import FlashCardPage from "./pages/FlashCard/FlashCardPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
const App = () => {
  const isAuthenticated = false; // Replace with actual authentication logic
  const loading = false; // Replace with actual loading state

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading....</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/result" element={<QuizResultPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailsPage />} />
          <Route path="/documents/:id/flashcard" element={<FlashCardPage />} />
          <Route path="/flashcards" element={<FlashCardListPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
