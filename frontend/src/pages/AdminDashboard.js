import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();

    const menuItems = [
        { title: 'Exam Management', path: '/admin/exams', icon: '📝', description: 'Create and manage exams' },
        { title: 'Hall Management', path: '/admin/halls', icon: '🏛️', description: 'Manage examination halls' },
        { title: 'Department Management', path: '/admin/departments', icon: '🏫', description: 'Manage departments and subjects' },
        { title: 'Student Management', path: '/admin/students', icon: '👨‍🎓', description: 'Upload and manage students' },
        { title: 'Faculty Management', path: '/admin/faculty', icon: '👩‍🏫', description: 'Add and manage faculty' },
        { title: 'Seat Allocation', path: '/admin/allocation', icon: '🎯', description: 'Allocate seats for exams' },
        { title: 'Invigilator Assignment', path: '/admin/invigilators', icon: '👥', description: 'Assign faculty to halls' },
        { title: 'Reports', path: '/admin/reports', icon: '📊', description: 'View and download reports' }
    ];

    return (
        <div className="dashboard-container">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>

                <div className="dashboard-grid">
                    {menuItems.map((item, index) => (
                        <Link to={item.path} key={index} className="dashboard-card">
                            <div className="dashboard-card-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
