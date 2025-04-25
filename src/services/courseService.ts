import coursesData from '@/data/courses.json';
import { Course } from '@/types/course';

export const getCourses =  (): Course[] => {
  return coursesData;
};

export const getCourseById = (id: number): Course | null => {
  return coursesData.find(course => course.id === id) || null;
};

export const searchCourses =  (query: string): Course[] => {
  
  if (!query) {
    return coursesData;
  }

  const searchTerm = query.toLowerCase();
  return coursesData.filter(course => 
    course.name.toLowerCase().includes(searchTerm)
  );
}; 