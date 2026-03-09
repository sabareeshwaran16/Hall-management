import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/facultyService';

const FacultyDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await facultyService.getAssignedHalls();
            setAssignments(res.data.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAttendance = async (examId, hallId) => {
        try {
            const response = await facultyService.downloadAttendanceSheet(examId, hallId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_${hallId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error downloading attendance sheet');
        }
    };

    const handleDownloadSeatingChart = async (examId, hallId) => {
        try {
            const response = await facultyService.downloadSeatingChart(examId, hallId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `seating_chart_${hallId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error downloading seating chart');
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <h1>Faculty Dashboard</h1>

            <div className="card mt-3">
                <h3>👥 My Invigilator Assignments</h3>
                {assignments.length === 0 ? (
                    <p>No assignments yet.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Exam</th>
                                <th>Date</th>
                                <th>Session</th>
                                <th>Hall</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment._id}>
                                    <td>{assignment.exam.name}</td>
                                    <td>{new Date(assignment.exam.examDate).toLocaleDateString()}</td>
                                    <td>{assignment.exam.session === 'FN' ? 'Forenoon' : 'Afternoon'}</td>
                                    <td>
                                        <strong>{assignment.hall.name}</strong><br />
                                        <small>{assignment.hall.building}</small>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${assignment.role === 'chief' ? 'success' : 'info'}`}>
                                            {assignment.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleDownloadAttendance(assignment.exam._id, assignment.hall._id)}
                                            >
                                                📋 Attendance
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleDownloadSeatingChart(assignment.exam._id, assignment.hall._id)}
                                            >
                                                🗺️ Seating Chart
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card mt-3">
                <h3>📋 Invigilator Guidelines</h3>
                <ul style={{ lineHeight: '2' }}>
                    <li>Arrive at the examination hall 30 minutes before the exam starts</li>
                    <li>Download and print the attendance sheet and seating chart</li>
                    <li>Verify student identity using their hall tickets and ID cards</li>
                    <li>Ensure students are seated according to the seating arrangement</li>
                    <li>Collect attendance signatures from all students</li>
                    <li>Monitor the examination hall and ensure discipline</li>
                    <li>Report any irregularities to the chief invigilator immediately</li>
                </ul>
            </div>
        </div>
    );
};

export default FacultyDashboard;
