import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsData, deptsData] = await Promise.all([
                adminService.getStudents(),
                adminService.getDepartments()
            ]);
            setStudents(studentsData.data || studentsData || []);
            setDepartments(deptsData.data || deptsData || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadResult(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a CSV file');
            return;
        }

        setUploading(true);
        try {
            const response = await adminService.uploadStudents(selectedFile);
            const result = response.data || response; // Unwrap data if needed

            // Map backend response format to frontend expectation
            const processedResult = {
                successCount: result.imported || 0,
                errors: result.details?.failed?.map(f => `Row ${JSON.stringify(f.data)}: ${f.error}`) || []
            };

            setUploadResult(processedResult);
            alert(`Successfully uploaded! ${processedResult.successCount} students added/updated.`);
            setSelectedFile(null);
            fetchData();
        } catch (error) {
            console.error('Error uploading students:', error);
            alert(error.response?.data?.message || 'Failed to upload students');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await adminService.deleteStudent(id);
                alert('Student deleted successfully!');
                fetchData();
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student');
            }
        }
    };

    const getDepartmentName = (deptId) => {
        const dept = departments.find(d => d._id === deptId);
        return dept ? dept.code : 'N/A';
    };

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <div className="page-header">
                <h1>Student Management</h1>
                <div>
                    <span style={{ marginRight: '10px', color: '#666' }}>
                        Total Students: <strong>{students.length}</strong>
                    </span>
                </div>
            </div>

            {/* CSV Upload Section */}
            <div className="form-card">
                <h2>📤 Upload Students (CSV)</h2>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                    Upload a CSV file with columns: rollNumber, name, email, departmentCode, year
                </p>

                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ marginBottom: '10px' }}
                        />
                        {selectedFile && (
                            <p style={{ color: '#4CAF50', marginTop: '5px' }}>
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </form>

                {uploadResult && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                        <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>Upload Results:</h3>
                        <p>✅ Success: {uploadResult.successCount} students</p>
                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                            <div>
                                <p style={{ color: '#d32f2f' }}>❌ Errors: {uploadResult.errors.length}</p>
                                <ul style={{ maxHeight: '150px', overflow: 'auto', fontSize: '0.9em' }}>
                                    {uploadResult.errors.slice(0, 5).map((err, idx) => (
                                        <li key={idx} style={{ color: '#d32f2f' }}>{err}</li>
                                    ))}
                                    {uploadResult.errors.length > 5 && (
                                        <li>... and {uploadResult.errors.length - 5} more errors</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                    <strong>CSV Format Example:</strong>
                    <pre style={{ fontSize: '0.85em', marginTop: '5px' }}>
                        {`rollNumber,name,email,departmentCode,year
CS001,John Doe,john@college.edu,CSE,2
EC001,Jane Smith,jane@college.edu,ECE,2`}
                    </pre>
                </div>
            </div>

            {/* Students Table */}
            <div className="table-container">
                <h2>All Students</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No students found. Upload a CSV file to add students!
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student._id}>
                                    <td><strong>{student.rollNumber}</strong></td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <span className="badge badge-info">
                                            {getDepartmentName(student.department)}
                                        </span>
                                    </td>
                                    <td>{student.year}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(student._id)}
                                        >
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

export default StudentManagement;
