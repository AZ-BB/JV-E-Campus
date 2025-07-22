export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum TrainingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS', 
  COMPLETED = 'COMPLETED'
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ'
}

export enum StaffCategory {
  FOH = 'FOH',
  BOH = 'BOH',
  MANAGER = 'MANAGER'
}

export enum LessonLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT'
}

export enum ProgressEntityType {
  MODULE = 'MODULE',
  SECTION = 'SECTION',
  LESSON = 'LESSON'
}
