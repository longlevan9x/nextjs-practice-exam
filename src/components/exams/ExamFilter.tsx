import React from 'react';
import { Course } from '@/types/course';

interface ExamFilterProps {
    courses: Course[];
    selectedCourseId: number;
    onCourseChange: (courseId: string) => void;
}

export default function ExamFilter({ courses, selectedCourseId, onCourseChange }: ExamFilterProps) {
    return (
        <select
            value={selectedCourseId}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
        >
            <option value={0}>Tất cả khóa học</option>
            {courses.map((course) => (
                <option key={course.id} value={course.id}>
                    {course.name}
                </option>
            ))}
        </select>
    );
} 