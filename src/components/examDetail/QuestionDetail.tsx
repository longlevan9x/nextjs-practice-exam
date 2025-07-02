import React, { useEffect, useState } from "react";
import { Question } from "@/types/question";
import BookmarkButton from "@/components/examDetail/BookmarkButton";
import AnswerOptions from "@/components/examDetail/AnswerOptions";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useModal } from '@/components/contexts/ModalContext';

import {
  HEADER_TITLE_PREFIX,
} from "@/constants/constants";
import { DisplayMode, ExamType } from "@/constants/exam";
import AnswerExplanationGroup from "@/components/examDetail/AnswerExplanationGroup";
import ChatGPTIcon from "@/components/base/icons/ChatGPTIcon";
import AskAIChatGPTModal from "@/components/askAI/AskAIChatGPTModal";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { checkExtInstalled } from "@/services/localStorageService";
import Link from "next/link";
import { EXT_RELEASE_LINK } from "@/configs/config";
import { EXT_VERSION } from "@/constants/extension";
import SelectionPopup from "@/components/common/SelectionPopup";
import { AI_PROMPT_TYPE } from "@/constants/ai";

const AI_SEND_OPT = {
  EXPLAIN_QA: "explain_qa",
  TRAN_QA: "tran_qa",
  EXPLAIN_EXPLAIN: "explain_explain",
  TRAN_EXPLAN: "tran_explan",
  TRAN_ALL: "tran_all"
}

interface QuestionDetailProps {
  question: Question;
  onToggleBookmark?: () => void;
  onAnswerSelect?: (answerId: number) => void;
  onCheckAnswer?: () => void;
  onNextQuestion?: () => void;
  onPreviousQuestion?: () => void;
  onSkipQuestion?: () => void;
  testEnded?: boolean;
  isFirstQuestion?: boolean;
  displayMode: DisplayMode;
  examType?: ExamType;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  onToggleBookmark,
  onAnswerSelect,
}) => {
  const [isExtInstalled, setIsExtInstalled] = useState<boolean>();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { showModal } = useModal();
  const requireVersion = EXT_VERSION;

  const aiOptions = [
    {
      value: "Giải thích câu hỏi và đáp án",
      key: AI_SEND_OPT.EXPLAIN_QA
    },
    {
      value: "Dịch câu hỏi và đáp án",
      key: AI_SEND_OPT.TRAN_QA
    },
    {
      value: "Phân tích nội dung giải thích",
      key: AI_SEND_OPT.EXPLAIN_EXPLAIN
    },
    {
      value: "Dịch nội dung giải thích",
      key: AI_SEND_OPT.TRAN_EXPLAN
    },
    {
      value: "Dịch tất cả",
      key: AI_SEND_OPT.TRAN_ALL
    }
  ];

  const getQuestionStatus = () => {
    if (!question.selectedAnswer) {
      return "Chưa trả lời";
    }
    if (question.showExplanation) {
      return question.isCorrect ? "Chính xác" : "Không chính xác";
    }
    return "Đã trả lời";
  };

  const getStatusColor = () => {
    if (!question.selectedAnswer) {
      return "text-gray-500";
    }
    if (question.showExplanation) {
      return question.isCorrect ? "text-green-600" : "text-red-600";
    }
    return "text-blue-600";
  };

  useEffect(() => {
    setIsExtInstalled(checkExtInstalled());
  }, []);

  const handleToggle = () => {
    setIsTransitioning(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
  };

  const handleShowChatGptModal = (sendOption: string) => {
    let toolType = "";
    switch (sendOption) {
      case AI_SEND_OPT.EXPLAIN_EXPLAIN:
      case AI_SEND_OPT.EXPLAIN_QA:
        toolType = AI_PROMPT_TYPE.EXPLAIN;
        break;
      case AI_SEND_OPT.TRAN_ALL:
      case AI_SEND_OPT.TRAN_EXPLAN:
      case AI_SEND_OPT.TRAN_QA:
        toolType = AI_PROMPT_TYPE.TRAN;
        break;
      default:
        break;
    }
    let content = "";

    const answer = question.answers.map((a) => a.id + ". " + a.answer).sort().join("\n\n");
    if (sendOption === AI_SEND_OPT.TRAN_QA || sendOption === AI_SEND_OPT.EXPLAIN_QA) {
      content = question.question + "\n\n" + answer;
      if (sendOption === AI_SEND_OPT.EXPLAIN_QA) {
        content += "\n\n" + "Các đáp án đúng: \n\n" + question.answers.filter(a => a.correct).map(a => a.id + ". " + a.answer).sort().join("\n\n");
      }
    }
    else if (sendOption === AI_SEND_OPT.TRAN_EXPLAN || sendOption === AI_SEND_OPT.EXPLAIN_EXPLAIN) {
      content = question.explanation;
    }
    else if (sendOption === AI_SEND_OPT.TRAN_ALL) {
      content = question + "\n\n" + answer + "\n\n" + question.explanation;
    }

    if (!content) return;

    showModal(<AskAIChatGPTModal toolType={toolType} content={content} />);
  }

  return (
    <div className="flex flex-col w-full relative">
      <SelectionPopup />

      {/* Question Section */}
      <div className="flex flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <BookmarkButton isBookmarked={question.isBookmarked || false} onToggle={onToggleBookmark ?? (() => { })} />
            <h2 className="text-lg font-normal">
              {HEADER_TITLE_PREFIX} {(question.questionIndex !== undefined) && question.questionIndex + 1}
            </h2>
          </div>
          {
            question.showExplanation && (
              <span className={`text-base font-bold ${getStatusColor()}`}>
                {getQuestionStatus()}
              </span>
            )
          }
        </div>
        {question.showExplanation && (
          <div className="flex gap-2">
            <Popover>
              <PopoverButton className="block focus:outline-none cursor-pointer active:outline-none">
                <ChatGPTIcon className="w-5 h-5  hover:fill-amber-500" />
              </PopoverButton>

              <PopoverPanel
                transition
                anchor="bottom"
                className="rounded-xs bg-white border border-gray-100 dark:border-none dark:bg-neutral-800 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
              >
                {isExtInstalled &&
                  <div className="p-3">
                    {aiOptions.map((item) => (
                      <div key={item.key} className="block w-full cursor-pointer rounded-xs px-3 py-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                        onClick={() => handleShowChatGptModal(item.key)}>
                        <p className="font-normal dark:text-gray-200">{item.value}</p>
                      </div>
                    ))}
                  </div>
                }
                {
                  !isExtInstalled &&
                  <div className="block cursor-pointer w-full rounded-xs px-3 py-2 transition hover:bg-gray-100 dark:hover:bg-white/5">
                    <p className="font-normal dark:text-gray-200">Tải extension tại <Link className="text-blue-400 hover:underline hover:text-blue-500" href={EXT_RELEASE_LINK + requireVersion} target="_blank">link.</Link></p>
                  </div>
                }
              </PopoverPanel>
            </Popover>

            <button
              onClick={handleToggle}
              className={`relative z-10 cursor-pointer flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-800  dark:hover:text-gray-200 transition-colors duration-200 ${isTransitioning ? 'opacity-50' : ''}`}
              disabled={isTransitioning}
            >
              <span className="text-sm">{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              <ChevronUpIcon className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-1 mb-4 [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-700 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-sm [&_code]:bg-gray-100 dark:[&_code]:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_img]:max-w-full [&_img]:h-auto">
        <p className="text-base leading-7" dangerouslySetInnerHTML={{ __html: question.question }} />
      </div>

      <div className={`transition-all duration-300 ease-in-out relative z-0 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0'}`}>
        {/* Answer Options */}
        <div className={`transition-all duration-300 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <AnswerOptions
            questionId={question.id}
            answers={question.answers}
            selectedAnswer={question.selectedAnswer ?? null}
            showExplanation={question.showExplanation ?? false}
            onAnswerSelect={onAnswerSelect ?? (() => { })}
            multiple={question.multiple ?? false}
          />
        </div>

        {/* Explanation Section */}
        <AnswerExplanationGroup question={question} isExpanded={isExpanded} />

        {/* Domain Section */}
        {(question.showExplanation && question.domain) && (
          <div className={`mt-4 p-3 border border-gray-300 dark:border-gray-500 rounded-xs bg-white dark:bg-neutral-900 transition-all duration-300 delay-200 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="flex flex-col space-y-2">
              <span className="font-bold text-lg">
                Lĩnh vực
              </span>
              <span className="font-medium">
                {question.domain}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;