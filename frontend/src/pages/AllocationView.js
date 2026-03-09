import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';

const AllocationView = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [allocations, setAllocations] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allocating, setAllocating] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await adminService.getExams();
            setExams(res.data || res || []);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const handleAllocate = async () => {
        if (!selectedExam) {
            alert('Please select an exam');
            return;
        }

        if (!window.confirm('This will allocate seats for the selected exam. Continue?')) {
            return;
        }

        setAllocating(true);
        try {
            const result = await adminService.allocateSeats(selectedExam);
            alert((result.message || 'Allocation successful') + '\n\nDuration: ' + (result.statistics?.duration || 'N/A'));
            fetchAllocations();
        } catch (error) {
            alert('Allocation failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setAllocating(false);
        }
    };

    const fetchAllocations = useCallback(async () => {
        if (!selectedExam) return;

        setLoading(true);
        try {
            const [allocRes, statsRes] = await Promise.all([
                adminService.getAllocations(selectedExam),
                adminService.getAllocationStats(selectedExam)
            ]);
            setAllocations(allocRes.data || allocRes || []);
            setStats(statsRes.data || statsRes || null);
        } catch (error) {
            console.error('Error fetching allocations:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedExam]);

    useEffect(() => {
        if (selectedExam) {
            fetchAllocations();
        }
    }, [selectedExam, fetchAllocations]);

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <h1>Seat Allocation</h1>

            <div className="card mt-3">
                <h3>Select Exam</h3>
                <div className="grid grid-2">
                    <div className="form-group">
                        <label className="form-label">Exam</label>
                        <select
                            className="form-select"
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
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
                        <label className="form-label">&nbsp;</label>
                        <button
                            className="btn btn-primary"
                            onClick={handleAllocate}
                            disabled={!selectedExam || allocating}
                        >
                            {allocating ? 'Allocating...' : 'Allocate Seats'}
                        </button>
                    </div>
                </div>
            </div>

            {stats && (
                <div className="card mt-3">
                    <h3>Allocation Statistics</h3>
                    <div className="grid grid-3">
                        <div>
                            <strong>Total Students:</strong> {stats.totalAllocations}
                        </div>
                        <div>
                            <strong>Halls Used:</strong> {Object.keys(stats.hallWise).length}
                        </div>
                        <div>
                            <strong>Departments:</strong> {Object.keys(stats.departmentWise).length}
                        </div>
                    </div>

                    <div className="mt-3">
                        <h4>Hall-wise Distribution</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Hall</th>
                                    <th>Students</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(stats.hallWise).map(([hall, count]) => (
                                    <tr key={hall}>
                                        <td>{hall}</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="spinner"></div>
            ) : allocations.length > 0 && (
                <div className="card mt-3">
                    <h3>Seat Allocations ({allocations.length})</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Student Name</th>
                                <th>Department</th>
                                <th>Hall</th>
                                <th>Seat Number</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocations.slice(0, 100).map(allocation => (
                                <tr key={allocation._id}>
                                    <td>{allocation.rollNumber}</td>
                                    <td>{allocation.student.name}</td>
                                    <td>{allocation.department.code}</td>
                                    <td>{allocation.hall.name}</td>
                                    <td>{allocation.seatNumber}</td>
                                    <td>Row {allocation.row}, Col {allocation.column}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allocations.length > 100 && (
                        <p className="text-center mt-2">Showing first 100 of {allocations.length} allocations</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllocationView;
