import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

const Reports = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [allocations, setAllocations] = useState([]);
    const [invigilators, setInvigilators] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await adminService.getExams();
            setExams(response.data || response || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setLoading(false);
        }
    };

    const fetchAllocationData = async (examId) => {
        try {
            const response = await adminService.getAllocations(examId);
            setAllocations(response.data || response || []);
            setStats(response.stats || null);
        } catch (error) {
            console.error('Error fetching allocations:', error);
            alert('Failed to fetch allocation data');
        }
    };

    const handleExamChange = (e) => {
        const examId = e.target.value;
        setSelectedExam(examId);
        if (examId) {
            fetchAllocationData(examId);
            fetchInvigilators(examId);
        } else {
            setAllocations([]);
            setStats(null);
            setInvigilators([]);
        }
    };

    const fetchInvigilators = async (examId) => {
        try {
            const response = await adminService.getInvigilators(examId);
            setInvigilators(response.data || response || []);
        } catch (error) {
            console.error('Error fetching invigilators:', error);
        }
    };

    const downloadReport = async (type) => {
        if (!selectedExam) {
            alert('Please select an exam first');
            return;
        }

        setDownloading(true);
        try {
            let blob;
            let filename;

            switch (type) {
                case 'hallTickets':
                    // Download all hall tickets as ZIP (would need backend implementation)
                    alert('Hall tickets download feature coming soon!');
                    setDownloading(false);
                    return;

                case 'attendance':
                    // Download attendance sheets for all halls
                    alert('Attendance sheets download feature coming soon!');
                    setDownloading(false);
                    return;

                case 'seatingChart':
                    // Download seating charts for all halls
                    alert('Seating charts download feature coming soon!');
                    setDownloading(false);
                    return;

                case 'summary':
                    // Download allocation summary as CSV
                    const csvData = generateCSV();
                    blob = new Blob([csvData], { type: 'text/csv' });
                    filename = `allocation-summary-${selectedExam}.csv`;
                    break;

                default:
                    setDownloading(false);
                    return;
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report');
        } finally {
            setDownloading(false);
        }
    };

    const generateCSV = () => {
        const headers = ['Roll Number', 'Student Name', 'Department', 'Hall', 'Seat Number', 'Row', 'Column', 'Faculty (Invigilator)'];
        const rows = allocations.map(alloc => {
            // Find invigilator for this hall
            const invigilator = invigilators.find(inv =>
                (inv.hall?._id === alloc.hall?._id) || (inv.hall === alloc.hall?._id)
            );
            const facultyName = invigilator?.faculty?.name || 'Unassigned';

            return [
                alloc.student?.rollNumber || 'N/A',
                alloc.student?.name || 'N/A',
                alloc.department?.code || 'N/A',
                alloc.hall?.name || 'N/A',
                alloc.seatNumber,
                alloc.row,
                alloc.column,
                facultyName
            ];
        });

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    };

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <div className="page-header">
                <h1>Reports & Downloads</h1>
            </div>

            <div className="form-card">
                <h2>Select Exam</h2>
                <div className="form-group">
                    <select value={selectedExam} onChange={handleExamChange} style={{ width: '100%' }}>
                        <option value="">-- Select an Exam --</option>
                        {exams.map(exam => (
                            <option key={exam._id} value={exam._id}>
                                {exam.name} - {new Date(exam.examDate).toLocaleDateString()} ({exam.session})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {stats && (
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-card" style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Students</h3>
                        <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>{stats.totalStudents || 0}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Halls Used</h3>
                        <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>{stats.hallsUsed || 0}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Departments</h3>
                        <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>{stats.departments || 0}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Allocated</h3>
                        <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>{allocations.length}</p>
                    </div>
                </div>
            )}

            {selectedExam && (
                <div className="download-section">
                    <h2>Download Reports</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => downloadReport('summary')}
                            disabled={downloading || allocations.length === 0}
                            style={{ padding: '15px', fontSize: '1em' }}
                        >
                            📊 Download Allocation Summary (CSV)
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => downloadReport('hallTickets')}
                            disabled={downloading || allocations.length === 0}
                            style={{ padding: '15px', fontSize: '1em' }}
                        >
                            🎫 Download All Hall Tickets
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => downloadReport('attendance')}
                            disabled={downloading || allocations.length === 0}
                            style={{ padding: '15px', fontSize: '1em' }}
                        >
                            📋 Download Attendance Sheets
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => downloadReport('seatingChart')}
                            disabled={downloading || allocations.length === 0}
                            style={{ padding: '15px', fontSize: '1em' }}
                        >
                            🗺️ Download Seating Charts
                        </button>
                    </div>
                    {allocations.length === 0 && selectedExam && (
                        <p style={{ marginTop: '15px', color: '#999' }}>
                            No allocations found for this exam. Please allocate seats first.
                        </p>
                    )}
                </div>
            )}

            {allocations.length > 0 && (
                <div className="table-container" style={{ marginTop: '30px' }}>
                    <h2>Allocation Preview</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Student Name</th>
                                <th>Department</th>
                                <th>Hall</th>
                                <th>Seat</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocations.slice(0, 50).map((alloc, idx) => (
                                <tr key={idx}>
                                    <td><strong>{alloc.student?.rollNumber || 'N/A'}</strong></td>
                                    <td>{alloc.student?.name || 'N/A'}</td>
                                    <td>
                                        <span className="badge badge-info">
                                            {alloc.department?.code || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{alloc.hall?.name || 'N/A'}</td>
                                    <td>{alloc.seatNumber}</td>
                                    <td>Row {alloc.row}, Col {alloc.column}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allocations.length > 50 && (
                        <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
                            Showing first 50 of {allocations.length} allocations
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
