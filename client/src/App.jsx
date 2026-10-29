import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import AppLayout from './components/layout/AppLayout.jsx';

// Public Pages
import HomePage from './pages/public/HomePage.jsx';
import BooksPage from './pages/public/BooksPage.jsx';
import BookDetailPage from './pages/public/BookDetailPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';

// Student Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage.jsx';
import StudentLoansPage from './pages/student/StudentLoansPage.jsx';
import StudentSavedPage from './pages/student/StudentSavedPage.jsx';
import StudentRecommendationsPage from './pages/student/StudentRecommendationsPage.jsx';
import StudentFinesPage from './pages/student/StudentFinesPage.jsx';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage.jsx';
import StudentAssistantPage from './pages/student/StudentAssistantPage.jsx';
import StudentProfilePage from './pages/student/StudentProfilePage.jsx';

// Librarian Pages
import LibrarianDashboardPage from './pages/librarian/LibrarianDashboardPage.jsx';
import IssueReturnPage from './pages/librarian/IssueReturnPage.jsx';
import LibrarianLoansPage from './pages/librarian/LibrarianLoansPage.jsx';
import LibrarianFinesPage from './pages/librarian/LibrarianFinesPage.jsx';
import LibrarianScanPage from './pages/librarian/LibrarianScanPage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminBooksPage from './pages/admin/AdminBooksPage.jsx';
import AdminNewBookPage from './pages/admin/AdminNewBookPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';
import AdminActivityPage from './pages/admin/AdminActivityPage.jsx';

import NotFoundPage from './pages/NotFoundPage.jsx';

// Role-based Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B12]">
        <div className="w-10 h-10 border-4 border-[#FF4B4B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If student tries to visit librarian/admin, redirect to /student
    if (user.role === 'STUDENT') return <Navigate to="/student" replace />;
    if (user.role === 'LIBRARIAN') return <Navigate to="/librarian" replace />;
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
        <Route path="ebooks" element={<Navigate to="/books" replace />} />
        <Route path="categories" element={<Navigate to="/books" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="my-library"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'LIBRARIAN', 'ADMIN']}>
              <StudentLoansPage />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/loans"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLoansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/saved"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentSavedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/recommendations"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentRecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/fines"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentFinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/notifications"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/assistant"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/profile"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Librarian Routes */}
        <Route
          path="librarian"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <LibrarianDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="librarian/issue-return"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <IssueReturnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="librarian/loans"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <LibrarianLoansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="librarian/fines"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <LibrarianFinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="librarian/scan"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <LibrarianScanPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/books"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminBooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/books/new"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminNewBookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/loans"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <LibrarianLoansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/fines"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <LibrarianFinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/activity"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminActivityPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
