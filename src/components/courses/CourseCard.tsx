import React from 'react';
import Link from 'next/link';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Course } from '@/types/course';
import Image from 'next/image';
interface CourseCardProps {
    course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({
    course
}) => {
    return (
        <Link href={`/exams?courseId=${course.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center items-center">
                    <Image
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-48 h-48 object-cover"
                        width={400}
                        height={300}
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2 line-clamp-2 h-14">
                        {course.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>{course.duration} phút</span>
                        </div>
                        {
                            (course.author) &&
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-4 h-4" />
                                <span>{course.author}</span>
                            </div>
                        }

                        <div className="flex items-center space-x-2">
                            <span>{course.questionCount} câu hỏi</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard; 