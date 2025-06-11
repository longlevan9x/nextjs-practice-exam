'use client';

import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getCourses, searchCourses } from '@/services/courseService';
import { Course } from '@/types/course';

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourseCategory, setSelectedCourseCategory] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const courseCategories = [
    {
      name: "Tất cả khóa học",
      value: ""
    },
    {
      name: "AWS Certified Solutions Architect Associate",
      value: "AWS Certified Solutions Architect Associate"
    },
    {
      name: "AWS Certified Solutions Architect Professional",
      value: "AWS Certified Solutions Architect Professional"
    },
    {
      name: "AWS Certified DevOps Engineer Professional",
      value: "AWS Certified DevOps Engineer Professional"
    },
    {
      name: "AWS Certified Developer Associate",
      value: "AWS Certified Developer Associate"
    },
    {
      name: "AWS Certified SysOps Administrator Associate",
      value: "AWS Certified SysOps Administrator Associate"
    },
    {
      name: "AWS Certified Security Specialty",
      value: "AWS Certified Security Specialty"
    },
    {
      name: "AWS Certified Machine Learning Engineer Associate",
      value: "AWS Certified Machine Learning Engineer Associate"
    },
    {
      name: "AWS Certified Data Engineer Associate",
      value: "AWS Certified Data Engineer Associate"
    },
    {
      name: "PMP",
      value: "PMP"
    }
  ];

  useEffect(() => {
    const fetchCourses = () => {
      try {
        setIsLoading(true);
        const data = getCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const search = () => {
      try {
        setIsLoading(true);
        const results = searchCourses(searchQuery);
        setFilteredCourses(results);
      } catch (error) {
        console.error('Error searching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const onCourseCategoryChange = (courseCategory: string) => {
    setSelectedCourseCategory(courseCategory);
    if (courseCategory === "") {
      setFilteredCourses(courses);      
    } else {
      const filterCourses = courses.filter((course) => course.name.replace(/\-\s+/g, '').includes(courseCategory.replace(/\-\s+/g, '')));
      setFilteredCourses(filterCourses);
    }
  };

  return (
    <div className="xl:container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Danh sách khóa học</h1>
        <div className="flex justify-between w-full gap-4 md:flex-row flex-col">
          <div className="w-full">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <div className="w-full">
            <select
              value={selectedCourseCategory}
              onChange={(e) => onCourseCategoryChange(e.target.value)}
              className="w-full px-4 py-2 h-full border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courseCategories.map((course) => (
                <option key={course.value} value={course.value}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy khóa học nào phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      )}
    </div>
  );
}

