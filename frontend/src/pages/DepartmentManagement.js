import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        subjects: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await adminService.getDepartments();
            setDepartments(response.data || response || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching departments:', error);
            alert('Failed to fetch departments');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
            };

            if (editingId) {
                await adminService.updateDepartment(editingId, submitData);
                alert('Department updated successfully!');
            } else {
                await adminService.createDepartment(submitData);
                alert('Department created successfully!');
            }
            setShowForm(false);
            setFormData({ name: '', code: '', subjects: '' });
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            alert(error.response?.data?.message || 'Failed to save department');
        }
    };

    const handleEdit = (dept) => {
        setFormData({
            name: dept.name,
            code: dept.code,
            subjects: dept.subjects ? dept.subjects.join(', ') : ''
        });
        setEditingId(dept._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await adminService.deleteDepartment(id);
                alert('Department deleted successfully!');
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
                alert('Failed to delete department');
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
                <h1>Department Management</h1>
                <button className="btn btn-primary" onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                    setFormData({ name: '', code: '', subjects: '' });
                }}>
                    {showForm ? 'Cancel' : '+ Add Department'}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h2>{editingId ? 'Edit Department' : 'Add New Department'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Department Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Computer Science Engineering"
                            />
                        </div>
                        <div className="form-group">
                            <label>Department Code *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                placeholder="e.g., CSE"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Subjects (comma-separated)</label>
                            <textarea
                                name="subjects"
                                value={formData.subjects}
                                onChange={handleChange}
                                rows="3"
                                placeholder="e.g., Data Structures, Algorithms, Database Management"
                            />
                            <small>Enter subjects separated by commas</small>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update Department' : 'Create Department'}
                        </button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Department Name</th>
                            <th>Code</th>
                            <th>Subjects</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    No departments found. Create your first department!
                                </td>
                            </tr>
                        ) : (
                            departments.map((dept) => (
                                <tr key={dept._id}>
                                    <td><strong>{dept.name}</strong></td>
                                    <td><span className="badge badge-info">{dept.code}</span></td>
                                    <td>
                                        {dept.subjects && dept.subjects.length > 0 ? (
                                            <div style={{ maxWidth: '300px' }}>
                                                {dept.subjects.slice(0, 3).join(', ')}
                                                {dept.subjects.length > 3 && ` (+${dept.subjects.length - 3} more)`}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#999' }}>No subjects</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${dept.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {dept.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(dept)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept._id)}>
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

export default DepartmentManagement;
