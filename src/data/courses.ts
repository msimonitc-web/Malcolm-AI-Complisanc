import { Course, StudentProfile, Transaction } from '../types';
import { mlFoundationsCourse } from './courses/mlFoundations';
import { cftFoundationsCourse } from './courses/cftFoundations';
import { seychellesFrameworkCourse } from './courses/seychellesFramework';
import { cddPracticeCourse } from './courses/cddPractice';
import { tfsSanctionsCourse } from './courses/tfsSanctions';
import { strMonitoringCourse } from './courses/strMonitoring';

export const INITIAL_STUDENT: StudentProfile = {
  name: 'Marcus Delpech',
  email: 'm.delpech@fiduciary-sey.sc',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  title: 'Compliance Officer · Victoria Fiduciary Services Ltd',
  weeklyGoalHours: 5,
  loggedHoursThisWeek: 3.5,
  streakDays: 8,
};

export const COURSES_DATA: Course[] = [
  mlFoundationsCourse,
  cftFoundationsCourse,
  seychellesFrameworkCourse,
  cddPracticeCourse,
  tfsSanctionsCourse,
  strMonitoringCourse
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
