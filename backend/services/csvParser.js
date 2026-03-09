const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/Student');
const Department = require('../models/Department');

class CSVParser {

    /**
     * Parse and import students from CSV file
     * Expected CSV format: rollNumber,name,email,departmentCode,year
     */
    async parseStudentCSV(filePath) {
        const results = [];
        const errors = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({
                    mapHeaders: ({ header, index }) => {
                        return header.trim().replace(/^\ufeff/, ''); // Remove BOM and trim
                    }
                }))
                .on('data', (data) => {
                    // Normalize keys to handle case sensitivity issues if strictly needed, 
                    // but for now relying on correct headers from mapHeaders.
                    // Logging first row keys for debug
                    if (results.length === 0) {
                        console.log('CSV Headers/First Row Keys:', Object.keys(data));
                    }
                    results.push(data);
                })
                .on('end', async () => {
                    try {
                        const importResults = await this.importStudents(results);

                        // Clean up uploaded file
                        fs.unlinkSync(filePath);

                        resolve(importResults);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    /**
     * Import students into database
     */
    async importStudents(studentData) {
        const imported = [];
        const failed = [];

        for (const data of studentData) {
            try {
                // Validate required fields
                if (!data.rollNumber || !data.name || !data.email || !data.departmentCode || !data.year) {
                    failed.push({
                        data,
                        error: 'Missing required fields'
                    });
                    continue;
                }

                // Find department
                const deptCode = data.departmentCode ? data.departmentCode.trim().toUpperCase() : '';
                const department = await Department.findOne({
                    code: deptCode
                });

                if (!department) {
                    failed.push({
                        data,
                        error: `Department not found: ${data.departmentCode}`
                    });
                    continue;
                }

                // Check if student already exists
                const existingStudent = await Student.findOne({
                    rollNumber: data.rollNumber.toUpperCase()
                });

                if (existingStudent) {
                    // Update existing student
                    existingStudent.name = data.name;
                    existingStudent.email = data.email.toLowerCase();
                    existingStudent.department = department._id;
                    existingStudent.year = parseInt(data.year);
                    await existingStudent.save();

                    imported.push({
                        rollNumber: existingStudent.rollNumber,
                        status: 'updated'
                    });
                } else {
                    // Create new student
                    const student = new Student({
                        rollNumber: data.rollNumber.trim().toUpperCase(),
                        name: data.name.trim(),
                        email: data.email.trim().toLowerCase(),
                        department: department._id,
                        year: parseInt(data.year)
                    });

                    await student.save();

                    imported.push({
                        rollNumber: student.rollNumber,
                        status: 'created'
                    });
                }

            } catch (error) {
                failed.push({
                    data,
                    error: error.message
                });
            }
        }

        return {
            success: true,
            imported: imported.length,
            failed: failed.length,
            details: {
                imported,
                failed
            }
        };
    }

    /**
     * Validate CSV format
     */
    validateCSVFormat(headers) {
        const requiredHeaders = ['rollNumber', 'name', 'email', 'departmentCode', 'year'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

        return {
            valid: missingHeaders.length === 0,
            missingHeaders
        };
    }
}

module.exports = new CSVParser();
