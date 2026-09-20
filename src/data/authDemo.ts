import { CorporateTeamMember, UserAccount } from '../types';

export const DEMO_ACCOUNTS: Record<string, { account: UserAccount; passwordHash: string }> = {
  malcolm: {
    account: {
      id: 'usr-admin-malcolm',
      email: 'malcolm@complisanc.com',
      name: 'Malcolm Simon',
      role: 'admin',
      title: 'Administration & Support | Managing Director',
      companyName: 'Complisanc Consulting Services (SEY)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'Complisey2026!',
  },
  eric: {
    account: {
      id: 'usr-admin-eric',
      email: 'eric@complisanc.com',
      name: "Eric D'Souza",
      role: 'admin',
      title: 'Training Related Inquiries & Director',
      companyName: 'Complisanc Consulting Services (SEY)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'Complisey2026!',
  },
  corporate: {
    account: {
      id: 'usr-corp-mlro',
      email: 'corp@demo.local',
      name: 'Jean-Luc Confait',
      role: 'corporate',
      title: 'Money Laundering Reporting Officer (MLRO)',
      companyName: 'Victoria Fiduciary Services Ltd',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      joinCode: 'DEMO2026',
    },
    passwordHash: 'DemoCorp2026!',
  },
  learner: {
    account: {
      id: 'usr-learner-marcus',
      email: 'm.delpech@fiduciary-sey.sc',
      name: 'Marcus Delpech',
      role: 'learner',
      title: 'Compliance Officer',
      companyName: 'Victoria Fiduciary Services Ltd',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'Learner2026!',
  },
};

export const INITIAL_CORPORATE_MEMBERS: CorporateTeamMember[] = [
  {
    id: 'mem-1',
    name: 'Marcus Delpech',
    email: 'm.delpech@fiduciary-sey.sc',
    role: 'Compliance Analyst',
    joinedDate: '2026-08-10',
    completedCourses: 2,
    totalCourses: 6,
    overallScore: 92,
    lastActive: '2026-09-14',
    certificatesCount: 2,
  },
  {
    id: 'mem-2',
    name: 'Nathalie Hoareau',
    email: 'n.hoareau@fiduciary-sey.sc',
    role: 'Senior Onboarding Officer',
    joinedDate: '2026-08-12',
    completedCourses: 3,
    totalCourses: 6,
    overallScore: 88,
    lastActive: '2026-09-15',
    certificatesCount: 3,
  },
  {
    id: 'mem-3',
    name: 'Bernard Morel',
    email: 'b.morel@fiduciary-sey.sc',
    role: 'Trust Administrator',
    joinedDate: '2026-08-15',
    completedCourses: 1,
    totalCourses: 6,
    overallScore: 84,
    lastActive: '2026-09-11',
    certificatesCount: 1,
  },
];
