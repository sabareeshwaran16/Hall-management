import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        examDate: '',
        session: 'FN',
        departments: [],
        duration: 180
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examsRes, deptsRes] = await Promise.all([
                adminService.getExams(),
                adminService.getDepartments()
            ]);
            setExams(examsRes.data || examsRes || []);
            setDepartments(deptsRes.data || deptsRes || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminService.createExam(formData);
            setShowForm(false);
            setFormData({ name: '', examDate: '', session: 'FN', departments: [], duration: 180 });
            fetchData();
        } catch (error) {
            alert('Error creating exam: ' + error.response?.data?.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await adminService.deleteExam(id);
                fetchData();
            } catch (error) {
                alert('Error deleting exam');
            }
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <div className="flex-between mb-3">
                <h1>Exam Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Exam'}
                </button>
            </div>

            {showForm && (
                <div className="card mb-3">
                    <h3>Create New Exam</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Exam Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Exam Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.examDate}
                                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Session</label>
                                <select
                                    className="form-select"
                                    value={formData.session}
                                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                                >
                                    <option value="FN">Forenoon</option>
                                    <option value="AN">Afternoon</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Duration (minutes)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Departments</label>
                            <select
                                multiple
                                className="form-select"
                                style={{ height: '120px' }}
                                value={formData.departments}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({ ...formData, departments: selected });
                                }}
                            >
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name} ({dept.code})
                                    </option>
                                ))}
                            </select>
                            <small>Hold Ctrl/Cmd to select multiple</small>
                        </div>

                        <button type="submit" className="btn btn-primary">Create Exam</button>
                    </form>
                </div>
            )}

            <div className="card">
                <h3>All Exams</h3>
                {exams.length === 0 ? (
                    <p>No exams found. Create one to get started.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Date</th>
                                <th>Session</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam._id}>
                                    <td>{exam.name}</td>
                                    <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                                    <td>{exam.session === 'FN' ? 'Forenoon' : 'Afternoon'}</td>
                                    <td>
                                        <span className={`badge badge-${exam.status === 'allocated' ? 'success' : 'warning'}`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(exam._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ExamManagement;
