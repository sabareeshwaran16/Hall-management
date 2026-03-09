import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

const HallManagement = () => {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        building: '',
        floor: '',
        rows: '',
        columns: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchHalls();
    }, []);

    const fetchHalls = async () => {
        try {
            const response = await adminService.getHalls();
            setHalls(response.data || response || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching halls:', error);
            alert('Failed to fetch halls');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminService.updateHall(editingId, formData);
                alert('Hall updated successfully!');
            } else {
                await adminService.createHall(formData);
                alert('Hall created successfully!');
            }
            setShowForm(false);
            setFormData({ name: '', capacity: '', building: '', floor: '', rows: '', columns: '' });
            setEditingId(null);
            fetchHalls();
        } catch (error) {
            console.error('Error saving hall:', error);
            alert(error.response?.data?.message || 'Failed to save hall');
        }
    };

    const handleEdit = (hall) => {
        setFormData({
            name: hall.name,
            capacity: hall.capacity,
            building: hall.building || '',
            floor: hall.floor || '',
            rows: hall.rows || '',
            columns: hall.columns || ''
        });
        setEditingId(hall._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hall?')) {
            try {
                await adminService.deleteHall(id);
                alert('Hall deleted successfully!');
                fetchHalls();
            } catch (error) {
                console.error('Error deleting hall:', error);
                alert('Failed to delete hall');
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
                <h1>Hall Management</h1>
                <button className="btn btn-primary" onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                    setFormData({ name: '', capacity: '', building: '', floor: '', rows: '', columns: '' });
                }}>
                    {showForm ? 'Cancel' : '+ Add Hall'}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h2>{editingId ? 'Edit Hall' : 'Add New Hall'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Hall Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Hall A"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Capacity *</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="e.g., 60"
                                />
                            </div>
                            <div className="form-group">
                                <label>Building</label>
                                <input
                                    type="text"
                                    name="building"
                                    value={formData.building}
                                    onChange={handleChange}
                                    placeholder="e.g., Main Block"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Floor</label>
                                <input
                                    type="text"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    placeholder="e.g., 1st Floor"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rows</label>
                                <input
                                    type="number"
                                    name="rows"
                                    value={formData.rows}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="e.g., 10"
                                />
                            </div>
                            <div className="form-group">
                                <label>Columns</label>
                                <input
                                    type="number"
                                    name="columns"
                                    value={formData.columns}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="e.g., 6"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update Hall' : 'Create Hall'}
                        </button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Hall Name</th>
                            <th>Capacity</th>
                            <th>Building</th>
                            <th>Floor</th>
                            <th>Layout (R×C)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {halls.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>
                                    No halls found. Create your first hall!
                                </td>
                            </tr>
                        ) : (
                            halls.map((hall) => (
                                <tr key={hall._id}>
                                    <td><strong>{hall.name}</strong></td>
                                    <td>{hall.capacity}</td>
                                    <td>{hall.building || '-'}</td>
                                    <td>{hall.floor || '-'}</td>
                                    <td>{hall.rows && hall.columns ? `${hall.rows}×${hall.columns}` : '-'}</td>
                                    <td>
                                        <span className={`badge ${hall.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                                            {hall.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(hall)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(hall._id)}>
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

export default HallManagement;
