import coursesData from "@/data/courses.json";
import { Course } from "@/types/course";

export const getCourses = async (): Promise<Course[]> => {
    try {
        return coursesData;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}   