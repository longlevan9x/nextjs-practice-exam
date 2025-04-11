import ExamPracticeLayout from "@/components/examDetail/ExamPracticeLayout";
import { EXAM_TYPES, DISPLAY_MODES } from "@/constants/exam";

export default function PracticeModePage() {
  return <ExamPracticeLayout examType={EXAM_TYPES.PRACTICE} displayMode={DISPLAY_MODES.EXECUTE} />;
}