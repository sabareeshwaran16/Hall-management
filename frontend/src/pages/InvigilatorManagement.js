import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

const InvigilatorManagement = () => {
    const [exams, setExams] = useState([]);
    const [halls, setHalls] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [invigilators, setInvigilators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        examId: '',
        hallId: '',
        facultyId: '',
        role: 'chief'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examsData, hallsData, facultyData, invigilatorsData] = await Promise.all([
                adminService.getExams(),
                adminService.getHalls(),
                adminService.getFaculty(),
                adminService.getInvigilators()
            ]);
            setExams(examsData.data || examsData || []);
            setHalls(hallsData.data || hallsData || []);
            setFaculty(facultyData.data || facultyData || []);
            setInvigilators(invigilatorsData.data || invigilatorsData || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            exam: formData.examId,
            hall: formData.hallId,
            faculty: formData.facultyId,
            role: formData.role
        };

        try {
            await adminService.assignInvigilator(payload);
            alert('Invigilator assigned successfully!');
            setShowForm(false);
            setFormData({ examId: '', hallId: '', facultyId: '', role: 'chief' });
            fetchData();
        } catch (error) {
            console.error('Error assigning invigilator:', error);
            alert(error.response?.data?.message || 'Failed to assign invigilator');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this assignment?')) {
            try {
                await adminService.deleteInvigilator(id);
                alert('Assignment removed successfully!');
                fetchData();
            } catch (error) {
                console.error('Error removing assignment:', error);
                alert('Failed to remove assignment');
            }
        }
    };



    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <div className="page-header">
                <h1>Invigilator Assignment</h1>
                <button className="btn btn-primary" onClick={() => {
                    setShowForm(!showForm);
                    setFormData({ examId: '', hallId: '', facultyId: '', role: 'chief' });
                }}>
                    {showForm ? 'Cancel' : '+ Assign Invigilator'}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h2>Assign Invigilator to Hall</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Exam *</label>
                            <select
                                value={formData.examId}
                                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                                required
                            >
                                <option value="">-- Select Exam --</option>
                                {exams.map(exam => (
                                    <option key={exam._id} value={exam._id}>
                                        {exam.name} - {new Date(exam.examDate).toLocaleDateString()} ({exam.session})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Hall *</label>
                            <select
                                value={formData.hallId}
                                onChange={(e) => setFormData({ ...formData, hallId: e.target.value })}
                                required
                            >
                                <option value="">-- Select Hall --</option>
                                {halls.map(hall => (
                                    <option key={hall._id} value={hall._id}>
                                        {hall.name} (Capacity: {hall.capacity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Faculty *</label>
                            <select
                                value={formData.facultyId}
                                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                                required
                            >
                                <option value="">-- Select Faculty --</option>
                                {faculty.map(fac => (
                                    <option key={fac._id} value={fac._id}>
                                        {fac.name} ({fac.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Role *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="chief">Chief Invigilator</option>
                                <option value="assistant">Assistant Invigilator</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Assign Invigilator
                        </button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <h2>Current Assignments</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Hall</th>
                            <th>Faculty</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invigilators.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    No invigilator assignments found. Create your first assignment!
                                </td>
                            </tr>
                        ) : (
                            invigilators.map((inv) => (
                                <tr key={inv._id}>
                                    <td><strong>{inv.exam?.name || 'N/A'}</strong></td>
                                    <td>{inv.hall?.name || 'N/A'}</td>
                                    <td>{inv.faculty?.name || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${inv.role === 'chief' ? 'badge-primary' : 'badge-secondary'}`}>
                                            {inv.role === 'chief' ? 'Chief' : 'Assistant'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inv._id)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {faculty.length === 0 && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                    <strong>⚠️ No Faculty Found</strong>
                    <p>You need to create faculty users before assigning them as invigilators.</p>
                    <p>Create users with role "faculty" in the authentication system.</p>
                </div>
            )}
        </div>
    );
};

export default InvigilatorManagement;
