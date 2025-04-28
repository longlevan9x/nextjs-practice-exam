import React from 'react';
import CourseList from '@/components/courses/CourseList';
import InProgressList from '@/components/courses/InProgressList';

export default async function CoursesPage() {
  return (
    <>
      <InProgressList />
      <CourseList />
    </>
  );
} 