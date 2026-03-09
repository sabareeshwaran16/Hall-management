const Student = require('../models/Student');
const Hall = require('../models/Hall');
const Allocation = require('../models/Allocation');
const Exam = require('../models/Exam');

/**
 * Core Hall Allocation Engine
 * Implements rule-based allocation with department mixing
 */
class AllocationEngine {

    /**
     * Main allocation function
     * @param {String} examId - Exam ID
     * @returns {Object} Allocation result with statistics
     */
    async allocateSeats(examId) {
        const startTime = Date.now();

        try {
            // Get exam details
            const exam = await Exam.findById(examId).populate('departments');
            if (!exam) {
                throw new Error('Exam not found');
            }

            // Get all students for the exam departments
            const students = await Student.find({
                department: { $in: exam.departments },
                isActive: true
            }).populate('department');

            if (students.length === 0) {
                throw new Error('No students found for this exam');
            }

            // Get available halls
            const halls = await Hall.find({ isAvailable: true }).sort({ capacity: -1 });

            if (halls.length === 0) {
                throw new Error('No halls available');
            }

            // Calculate total capacity
            const totalCapacity = halls.reduce((sum, hall) => sum + hall.capacity, 0);

            if (totalCapacity < students.length) {
                throw new Error(`Insufficient capacity. Required: ${students.length}, Available: ${totalCapacity}`);
            }

            // Clear existing allocations for this exam
            await Allocation.deleteMany({ exam: examId });

            // Shuffle students to randomize roll numbers
            const shuffledStudents = this.shuffleArray([...students]);

            // Group students by department
            const departmentGroups = this.groupByDepartment(shuffledStudents);

            // Allocate seats with department mixing
            const allocations = await this.allocateWithMixing(
                examId,
                departmentGroups,
                halls
            );

            // Update exam status
            exam.status = 'allocated';
            await exam.save();

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            return {
                success: true,
                message: 'Seats allocated successfully',
                statistics: {
                    totalStudents: students.length,
                    totalHalls: halls.length,
                    allocations: allocations.length,
                    duration: `${duration.toFixed(2)} seconds`
                }
            };

        } catch (error) {
            throw error;
        }
    }

    /**
     * Allocate seats with department mixing logic
     */
    async allocateWithMixing(examId, departmentGroups, halls) {
        const allocations = [];
        const departmentKeys = Object.keys(departmentGroups);
        const departmentIndexes = {};

        // Initialize indexes for each department
        departmentKeys.forEach(key => {
            departmentIndexes[key] = 0;
        });

        let currentDeptIndex = 0;
        let hallIndex = 0;
        let currentHall = halls[hallIndex];
        let seatNumber = 1;
        let row = 1;
        let column = 1;

        // Allocate seats in round-robin fashion across departments
        let totalAllocated = 0;
        const totalStudents = departmentKeys.reduce(
            (sum, key) => sum + departmentGroups[key].length,
            0
        );

        while (totalAllocated < totalStudents) {
            // Get current department
            const currentDept = departmentKeys[currentDeptIndex];
            const students = departmentGroups[currentDept];
            const studentIndex = departmentIndexes[currentDept];

            // If current department has students left
            if (studentIndex < students.length) {
                const student = students[studentIndex];

                // Create allocation
                const allocation = new Allocation({
                    exam: examId,
                    student: student._id,
                    hall: currentHall._id,
                    seatNumber,
                    row,
                    column,
                    department: student.department._id,
                    rollNumber: student.rollNumber
                });

                allocations.push(allocation);
                departmentIndexes[currentDept]++;
                totalAllocated++;

                // Move to next seat
                column++;
                if (column > currentHall.columns) {
                    column = 1;
                    row++;
                }
                seatNumber++;

                // Check if current hall is full
                if (seatNumber > currentHall.capacity) {
                    hallIndex++;
                    if (hallIndex >= halls.length) {
                        throw new Error('Ran out of hall capacity');
                    }
                    currentHall = halls[hallIndex];
                    seatNumber = 1;
                    row = 1;
                    column = 1;
                }
            }

            // Move to next department (round-robin)
            currentDeptIndex = (currentDeptIndex + 1) % departmentKeys.length;
        }

        // Save all allocations
        await Allocation.insertMany(allocations);

        return allocations;
    }

    /**
     * Group students by department
     */
    groupByDepartment(students) {
        const groups = {};

        students.forEach(student => {
            const deptId = student.department._id.toString();
            if (!groups[deptId]) {
                groups[deptId] = [];
            }
            groups[deptId].push(student);
        });

        return groups;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Get allocation statistics for an exam
     */
    async getAllocationStats(examId) {
        const allocations = await Allocation.find({ exam: examId })
            .populate('hall')
            .populate('department');

        const hallStats = {};
        const deptStats = {};

        allocations.forEach(allocation => {
            // Hall statistics
            const hallName = allocation.hall.name;
            if (!hallStats[hallName]) {
                hallStats[hallName] = 0;
            }
            hallStats[hallName]++;

            // Department statistics
            const deptName = allocation.department.name;
            if (!deptStats[deptName]) {
                deptStats[deptName] = 0;
            }
            deptStats[deptName]++;
        });

        return {
            totalAllocations: allocations.length,
            hallWise: hallStats,
            departmentWise: deptStats
        };
    }
}

module.exports = new AllocationEngine();
