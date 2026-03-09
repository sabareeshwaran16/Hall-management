import api from './api';

export const studentService = {
    // Get exam timetable
    getTimetable: () => api.get('/student/timetable'),

    // Get seat allocation for specific exam
    getSeatAllocation: (examId) => api.get(`/student/allocation/${examId}`),

    // Get all allocations
    getMyAllocations: () => api.get('/student/my-allocations'),

    // Download hall ticket
    downloadHallTicket: (examId) => {
        return api.get(`/student/hall-ticket/${examId}`, {
            responseType: 'blob'
        });
    }
};
