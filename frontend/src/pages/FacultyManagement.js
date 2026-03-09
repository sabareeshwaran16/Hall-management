import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            const response = await adminService.getFaculty();
            setFaculty(response.data || response || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching faculty:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminService.createFaculty(formData);
            alert('Faculty created successfully!');
            setShowForm(false);
            setFormData({ name: '', email: '', password: '' });
            fetchFaculty();
        } catch (error) {
            console.error('Error creating faculty:', error);
            alert(error.response?.data?.message || 'Failed to create faculty');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                // We use deleteUser here assuming generic delete endpoint or specific one
                await adminService.deleteUser(id);
                alert('Faculty deleted successfully!');
                fetchFaculty();
            } catch (error) {
                console.error('Error deleting faculty:', error);
                alert('Failed to delete faculty');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <div className="page-header">
                <h1>Faculty Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Faculty'}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h2>Add New Faculty</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Create Faculty</button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculty.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No faculty found.</td>
                            </tr>
                        ) : (
                            faculty.map((fac) => (
                                <tr key={fac._id}>
                                    <td><strong>{fac.name}</strong></td>
                                    <td>{fac.email}</td>
                                    <td><span className="badge badge-info">{fac.role}</span></td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(fac._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyManagement;
