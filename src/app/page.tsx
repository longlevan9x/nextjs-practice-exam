import CourseList from "@/components/courses/CourseList";
import InProgressList from "@/components/courses/InProgressList";

export default function HomePage() {
  return (
    <>
      <InProgressList />
      <CourseList />
    </>
  );
}