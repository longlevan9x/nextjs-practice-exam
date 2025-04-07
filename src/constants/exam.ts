export const EXAM_TYPES = {
  EXAM: "exam",
  PRACTICE: "practice",
} as const;

export const DISPLAY_MODES = {
  EXECUTE: "execute",
  REVIEW: "review",
} as const;

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES];
export type DisplayMode = typeof DISPLAY_MODES[keyof typeof DISPLAY_MODES]; 