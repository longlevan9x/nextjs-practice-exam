import React from "react";
import SharedExamCard from "@/components/shareds/ExamCard";
import { Exam } from "@/types/exam";

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  return (
    <SharedExamCard exam={exam} />
  );
};

export default ExamCard;