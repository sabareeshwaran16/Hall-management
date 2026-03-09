import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ExamManagement from './pages/ExamManagement';
import HallManagement from './pages/HallManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import StudentManagement from './pages/StudentManagement';
import FacultyManagement from './pages/FacultyManagement';
import InvigilatorManagement from './pages/InvigilatorManagement';
import Reports from './pages/Reports';
import AllocationView from './pages/AllocationView';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';

// Home redirect component
const Home = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" />;
        case 'faculty':
            return <Navigate to="/faculty" />;
        case 'student':
            return <Navigate to="/student" />;
        default:
            return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/exams"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <ExamManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/halls"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <HallManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/departments"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <DepartmentManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/students"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <StudentManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/faculty"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <FacultyManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/invigilators"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <InvigilatorManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/reports"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <Reports />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/allocation"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AllocationView />
                            </PrivateRoute>
                        }
                    />

                    {/* Faculty Routes */}
                    <Route
                        path="/faculty"
                        element={
                            <PrivateRoute allowedRoles={['faculty', 'admin']}>
                                <FacultyDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Student Routes */}
                    <Route
                        path="/student"
                        element={
                            <PrivateRoute allowedRoles={['student']}>
                                <StudentDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Unauthorized */}
                    <Route
                        path="/unauthorized"
                        element={
                            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                                <h1>403 - Unauthorized</h1>
                                <p>You don't have permission to access this page.</p>
                            </div>
                        }
                    />

                    {/* 404 */}
                    <Route
                        path="*"
                        element={
                            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                                <h1>404 - Page Not Found</h1>
                                <p>The page you're looking for doesn't exist.</p>
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
