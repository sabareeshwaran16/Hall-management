import api from './api';

export const facultyService = {
    // Get assigned halls
    getAssignedHalls: () => api.get('/faculty/assigned-halls'),

    // Get seating layout
    getSeatingLayout: (examId, hallId) => api.get(`/faculty/seating/${examId}/${hallId}`),

    // Download attendance sheet
    downloadAttendanceSheet: (examId, hallId) => {
        return api.get(`/faculty/attendance/${examId}/${hallId}`, {
            responseType: 'blob'
        });
    },

    // Download seating chart
    downloadSeatingChart: (examId, hallId) => {
        return api.get(`/faculty/seating-chart/${examId}/${hallId}`, {
            responseType: 'blob'
        });
    }
};
