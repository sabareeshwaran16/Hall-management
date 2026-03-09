import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';

const StudentDashboard = () => {
    const [timetable, setTimetable] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [timetableRes, allocationsRes] = await Promise.all([
                studentService.getTimetable(),
                studentService.getMyAllocations()
            ]);
            setTimetable(timetableRes.data.data);
            setAllocations(allocationsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadHallTicket = async (examId) => {
        try {
            const response = await studentService.downloadHallTicket(examId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `hall_ticket_${examId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error downloading hall ticket');
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <h1>Student Dashboard</h1>

            <div className="card mt-3">
                <h3>📅 Exam Timetable</h3>
                {timetable.length === 0 ? (
                    <p>No upcoming exams scheduled.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Date</th>
                                <th>Session</th>
                                <th>Duration</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetable.map(exam => (
                                <tr key={exam._id}>
                                    <td>{exam.name}</td>
                                    <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                                    <td>{exam.session === 'FN' ? 'Forenoon (9:00 AM)' : 'Afternoon (2:00 PM)'}</td>
                                    <td>{exam.duration} minutes</td>
                                    <td>
                                        <span className={`badge badge-${exam.status === 'allocated' ? 'success' : 'warning'}`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card mt-3">
                <h3>🎯 My Seat Allocations</h3>
                {allocations.length === 0 ? (
                    <p>No seat allocations yet.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Exam</th>
                                <th>Date</th>
                                <th>Hall</th>
                                <th>Seat Number</th>
                                <th>Position</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocations.map(allocation => (
                                <tr key={allocation._id}>
                                    <td>{allocation.exam.name}</td>
                                    <td>{new Date(allocation.exam.examDate).toLocaleDateString()}</td>
                                    <td>
                                        <strong>{allocation.hall.name}</strong><br />
                                        <small>{allocation.hall.building}</small>
                                    </td>
                                    <td><strong className="badge badge-info">{allocation.seatNumber}</strong></td>
                                    <td>Row {allocation.row}, Column {allocation.column}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownloadHallTicket(allocation.exam._id)}
                                        >
                                            📄 Download Hall Ticket
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card mt-3">
                <h3>📋 Instructions</h3>
                <ul style={{ lineHeight: '2' }}>
                    <li>Download your hall ticket before the exam</li>
                    <li>Arrive at the examination hall 15 minutes before the exam starts</li>
                    <li>Bring your hall ticket and valid ID card</li>
                    <li>Mobile phones and electronic devices are strictly prohibited</li>
                    <li>Follow all examination rules and regulations</li>
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;
