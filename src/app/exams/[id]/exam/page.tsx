import ExamPracticeLayout from "@/components/examDetail/ExamPracticeLayout";
import { EXAM_TYPES, DISPLAY_MODES } from "@/constants/exam";

export default function ExamModePage() {
  return <ExamPracticeLayout examType={EXAM_TYPES.EXAM} displayMode={DISPLAY_MODES.EXECUTE} />;
}