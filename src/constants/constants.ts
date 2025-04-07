export const TIMER_INITIAL_VALUE = 60 * 130; // 130 phút
export const FILTER_OPTION_VALUE = {
    ALL: "all",
    ANSWERED: "answered",
    UNANSWERED: "unanswered",
    BOOKMARKED: "bookmarked",
    CORRECT: "correct",
    INCORRECT: "incorrect",
};

export const FILTER_OPTIONS = [
    { value: FILTER_OPTION_VALUE.ALL, label: "Tất cả" },
    { value: FILTER_OPTION_VALUE.ANSWERED, label: "Đã trả lời" },
    { value: FILTER_OPTION_VALUE.UNANSWERED, label: "Chưa trả lời" },
    { value: FILTER_OPTION_VALUE.BOOKMARKED, label: "Đã đánh dấu" },
    { value: FILTER_OPTION_VALUE.CORRECT, label: "Trả lời đúng" },
    { value: FILTER_OPTION_VALUE.INCORRECT, label: "Trả lời sai" },
];
export const DEFAULT_DOMAIN = "General";

export const EXAM_MODE = {
    PRACTICE: "practice",
    EXAM: "exam",
};

export const EXAM_DEFAULT_MODE = "exam";
export const DEFAULT_TEST_ENDED = false;

export const EXPLANATION_SECTION_TITLE = "Giải thích tổng thể";
export const HEADER_TITLE_PREFIX = "Câu hỏi";