import api from './api';

export const adminService = {
    // Exams
    getExams: () => api.get('/admin/exams'),
    createExam: (data) => api.post('/admin/exams', data),
    updateExam: (id, data) => api.put(`/admin/exams/${id}`, data),
    deleteExam: (id) => api.delete(`/admin/exams/${id}`),

    // Halls
    getHalls: () => api.get('/admin/halls'),
    createHall: (data) => api.post('/admin/halls', data),
    updateHall: (id, data) => api.put(`/admin/halls/${id}`, data),
    deleteHall: (id) => api.delete(`/admin/halls/${id}`),

    // Departments
    getDepartments: () => api.get('/admin/departments'),
    createDepartment: (data) => api.post('/admin/departments', data),
    updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
    deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),

    // Students
    getStudents: () => api.get('/admin/students'),
    uploadStudents: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/students/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteStudent: (id) => api.delete(`/admin/students/${id}`),

    // Allocation
    allocateSeats: (examId) => api.post(`/admin/allocate/${examId}`),
    getAllocations: (examId) => api.get(`/admin/allocations/${examId}`),
    getAllocationStats: (examId) => api.get(`/admin/allocations/${examId}/stats`),

    // Invigilators
    assignInvigilator: (data) => api.post('/admin/invigilators', data),
    getInvigilators: (examId) => {
        if (examId) {
            return api.get(`/admin/invigilators/${examId}`);
        }
        return api.get('/admin/invigilators');
    },
    deleteInvigilator: (id) => api.delete(`/admin/invigilators/${id}`),

    // Faculty Management
    getFaculty: () => api.get('/admin/faculty'),
    createFaculty: (data) => api.post('/admin/faculty', data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`)
};
