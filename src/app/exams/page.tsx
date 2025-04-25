import ExamList from "@/components/exams/ExamList";
import { Suspense } from "react";

export default function ExamsPage() {
    return (
        <div>
            <Suspense>
                <ExamList />
            </Suspense>
        </div>
    )
}
