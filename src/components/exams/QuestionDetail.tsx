import React from "react";
import { Question } from "@/types/question";
import BookmarkButton from "./BookmarkButton";
import AnswerOptions from "./AnswerOptions";
import CorrectOptions from "./CorrectOptions";
import IncorrectOptions from "./IncorrectOptions";
import References from "./References";
import ActionButtons from "./ActionButtons";
import {
  DEFAULT_TEST_ENDED,
  EXPLANATION_SECTION_TITLE,
  HEADER_TITLE_PREFIX,
} from "@/constants/constants";
import { DISPLAY_MODES, DisplayMode, ExamType } from "@/constants/exam";
import { BookmarkIcon } from "@heroicons/react/24/solid";

interface QuestionDetailProps {
  question: Question;
  isBookmarked: boolean;
  onToggleBookmark?: () => void;
  onAnswerSelect?: (answerId: number) => void;
  onCheckAnswer?: () => void;
  onNextQuestion?: () => void;
  onPreviousQuestion?: () => void;
  onSkipQuestion?: () => void;
  testEnded?: boolean;
  isFirstQuestion?: boolean;
  displayMode: DisplayMode;
  examType: ExamType;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  isBookmarked,
  onToggleBookmark,
  onAnswerSelect,
  onCheckAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onSkipQuestion,
  testEnded = DEFAULT_TEST_ENDED,
  isFirstQuestion,
  displayMode,
  examType,
}) => {
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-1">
            <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark ?? (() => {})} />
            <h2 className="text-lg font-normal">
              {HEADER_TITLE_PREFIX} {question.id}
            </h2>
          </div>
          <p className="text-base mt-1">{question.question}</p>
        </div>
      </div>

      {/* Answer Options */}
      <AnswerOptions
        answers={question.answers}
        selectedAnswer={question.selectedAnswer ?? null}
        showExplanation={question.showExplanation ?? false}
        correctAnswer={question.answers.find((a) => a.correct)?.id}
        onAnswerSelect={onAnswerSelect ?? (() => {})}
        multiple={question.multiple ?? false}
      />

      {displayMode === DISPLAY_MODES.EXECUTE && (
        <ActionButtons
          showExplanation={question.showExplanation ?? false}
          onCheckAnswer={onCheckAnswer ?? (() => {})}
          onNextQuestion={onNextQuestion ?? (() => {})}
          onPreviousQuestion={onPreviousQuestion ?? (() => {})}
          onSkipQuestion={onSkipQuestion ?? (() => {})}
          selectedAnswer={question.selectedAnswer ?? null}
          testEnded={testEnded}
          isFirstQuestion={isFirstQuestion ?? false}
          examType={examType}
        />
      )}

      {/* Explanation Section */}
      {question.showExplanation && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{EXPLANATION_SECTION_TITLE}</h3>

          {question.correctAnswerExplanation && (
            <CorrectOptions
              answer={question.correctAnswerExplanation.answer}
              explanation={question.correctAnswerExplanation.explanation}
            />
          )}

          {question.incorrectAnswerExplanations && question.incorrectAnswerExplanations.length > 0 && (
            <IncorrectOptions incorrectAnswerExplanations={question.incorrectAnswerExplanations} />
          )}

          {question.references && question.references.length > 0 && (
            <References references={question.references} />
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;