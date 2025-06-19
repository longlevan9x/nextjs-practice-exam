import ExamList from "@/components/exams/ExamList";
import { Suspense } from "react";

export default function ExamsPage() {
    return (
        <div className="p-2 lg:p-4">
            <Suspense>
                <ExamList />
            </Suspense>
        </div>
    )
}
