import { EXPLANATION_SECTION_TITLE } from "@/constants/constants";
import { Question } from "@/types/question";
import AnswerExplanation from "@/components/examDetail/AnswerExplanation";
import References from "@/components/examDetail/References";

interface AnswerExplanationGroupProps {
    question: Question;
    isExpanded: boolean;
}

const AnswerExplanationGroup: React.FC<AnswerExplanationGroupProps> = ({ question, isExpanded }) => {
    const showExplanationRaw = (question?.correctAnswerExplanations?.length === 0) && (question?.incorrectAnswerExplanations?.length === 0) && (question?.explanation !== "");

    if (!question.showExplanation) {
        return <></>
    }
    return (
        <div className={`mt-6 p-4 leading-7 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-xs transition-all duration-300 delay-100 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-300">{EXPLANATION_SECTION_TITLE}</h3>

            {(question.correctAnswerExplanations && question.correctAnswerExplanations.length > 0) && (
                <AnswerExplanation
                    answerExplanations={question.correctAnswerExplanations}
                    type="correct"
                />
            )}

            {question.incorrectAnswerExplanations && question.incorrectAnswerExplanations.length > 0 && (
                <AnswerExplanation
                    answerExplanations={question.incorrectAnswerExplanations}
                    type="incorrect"
                />
            )}

            {showExplanationRaw && (
                <div dangerouslySetInnerHTML={{ __html: question.explanation }}></div>
            )}

            {question.references && question.references.length > 0 && (
                <References references={question.references} />
            )}
        </div>
    );
}

export default AnswerExplanationGroup;