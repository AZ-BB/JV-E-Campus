export const userRole = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF'
} as const;

export const trainingStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS', 
  COMPLETED: 'COMPLETED'
} as const;

export const lessonType = {
  VIDEO: 'VIDEO',
  TEXT: 'TEXT',
  QUIZ: 'QUIZ'
} as const;

export const staffCategory = {
  FOH: 'FOH',
  BOH: 'BOH',
  MANAGER: 'MANAGER'
} as const;

export const lessonLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  EXPERT: 'EXPERT'
} as const;

export const progressEntityType = {
  MODULE: 'MODULE',
  SECTION: 'SECTION',
  LESSON: 'LESSON'
} as const;

export type UserRole = typeof userRole[keyof typeof userRole];
export type TrainingStatus = typeof trainingStatus[keyof typeof trainingStatus];
export type LessonType = typeof lessonType[keyof typeof lessonType];
export type StaffCategory = typeof staffCategory[keyof typeof staffCategory];
export type LessonLevel = typeof lessonLevel[keyof typeof lessonLevel];
export type ProgressEntityType = typeof progressEntityType[keyof typeof progressEntityType];
