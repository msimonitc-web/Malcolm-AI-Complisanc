import { Course, CourseTranscriptTopic, StaffAssessmentProfile, StaffAssessmentWeakness } from '../types';
import { COURSES_DATA } from './courses';

/**
 * Extracts a complete, accredited course syllabus transcript from a course object.
 */
export function getCourseTranscript(course: Course): {
  totalHours: number;
  totalModules: number;
  totalLessons: number;
  topics: CourseTranscriptTopic[];
  statutoryCompetencies: string[];
} {
  const topics: CourseTranscriptTopic[] = (course.modules || []).map((m) => {
    return {
      moduleTitle: m.title,
      durationMinutes: (m.lessons || []).reduce((acc, l) => acc + (l.durationMinutes || 8), 0),
      topics: (m.lessons || []).map((l) => l.title),
      learningOutcomes: [
        m.description || 'Core competency unit covering operational duties',
        'Practical case application in Seychelles AML/CFT compliance',
      ],
    };
  });

  const statutoryCompetencies: string[] = [
    'Seychelles Anti-Money Laundering and Countering the Financing of Terrorism Framework',
    'FIU Guidance Notes on Beneficial Ownership, CDD Verification & High-Risk Jurisdictions',
    'Financial Services Authority (FSA) AML/CFT Inspection and Training Compliance Standards',
    'Targeted Financial Sanctions (TFS) screening against UN, Sanctions Committee & National Lists',
    'Non-Disclosure Duties and Legal Penalties for Tipping-Off',
    'Record Retention Requirements for Customer Due Diligence Records',
  ];

  return {
    totalHours: course.totalHours || 4,
    totalModules: course.modules?.length || 3,
    totalLessons: course.lessonsCount || 18,
    topics,
    statutoryCompetencies,
  };
}

/**
 * Pre-configured detailed assessment profiles highlighting staff weaknesses
 * for Corporate Administrators and HR teams.
 */
export const INITIAL_STAFF_ASSESSMENT_PROFILES: Record<string, StaffAssessmentProfile> = {
  'mem-1': {
    memberId: 'mem-1',
    memberName: 'Marcus Delpech',
    memberEmail: 'm.delpech@fiduciary-sey.sc',
    role: 'Compliance Analyst',
    overallScore: 92,
    hrRemediationStatus: 'in_progress',
    hrNotes: 'Strong analytical skills on CDD unravelling. Needs refresher on statutory asset freezing deadlines under TFS.',
    domainScores: {
      'Placement, Layering & Integration': 74,
      'Red Flag Recognition & Typologies': 79,
      'Customer Due Diligence (CDD) & UBO': 96,
      'Targeted Financial Sanctions (TFS)': 72,
      'STR Filing & Monitoring': 94,
      'Anti-Tipping-Off & Confidentiality': 88,
      'Proliferation Financing': 82,
      'Record Retention & Auditing': 100,
    },
    completedCertificates: [
      {
        certificateId: 'CERT-ML-2026-081',
        courseId: 'c-1',
        courseTitle: 'Foundations of Money Laundering: Definitions, Typologies & AML Controls',
        issueDate: '2026-08-20',
        gradeScore: '94% (Distinction)',
        verificationCode: 'CS-ML-849201',
        cpdHours: 4.0,
      },
      {
        certificateId: 'CERT-SEY-2026-114',
        courseId: 'c-3',
        courseTitle: 'Seychelles AML/CFT Framework & Statutory Duties',
        issueDate: '2026-09-02',
        gradeScore: '90% (Distinction)',
        verificationCode: 'CS-SEY-924185',
        cpdHours: 4.0,
      },
    ],
    weaknesses: [
      {
        id: 'w-stages',
        topicTitle: 'Placement, Layering & Integration (Stages of ML)',
        category: 'Foundations of Money Laundering',
        score: 68,
        status: 'critical',
        conceptTested: 'Distinguishing between physical cash introduction (Placement), distancing funds through layered shell transactions (Layering), and legitimate re-entry into the economy (Integration).',
        errorIdentified: 'Confused Layering with Placement during the scenario analysis of multi-jurisdictional IBC wire transfers and corporate loan-back schemes.',
        statutoryReference: 'Seychelles AML/CFT Act 2020 Part II & FATF Recommendation 3.',
        recommendedAction: 'Assign 20-minute Unit 1 interactive module on the 3 Stages of Money Laundering and typologies before re-assessment.',
      },
      {
        id: 'w-redflags',
        topicTitle: 'Red Flag Detection & Commercial Rationale',
        category: 'Red Flag Recognition & Indicators',
        score: 72,
        status: 'moderate',
        conceptTested: 'Identifying high-risk behavioral and transactional indicators, including pass-through transactions and unverified commercial counterparties.',
        errorIdentified: 'Tended to treat high-velocity third-party transfers as normal commercial activity without verifying the underlying business contract rationale.',
        statutoryReference: 'FIU Seychelles Guidance Note on Operational Red Flag Indicators for Reporting Entities.',
        recommendedAction: 'Complete the practical Red Flag Case Study simulation in Course 1, Unit 2.',
      },
      {
        id: 'w-1',
        topicTitle: 'TFS Asset Freezing Statutory Deadline',
        category: 'Targeted Financial Sanctions (TFS)',
        score: 65,
        status: 'critical',
        conceptTested: 'Immediate asset-freezing mandate under the Prevention of Terrorism Act & TFS Regulations.',
        errorIdentified: 'Selected a 48-hour delay window for sanctions asset freezing instead of mandatory immediate without-delay freezing upon list matching.',
        statutoryReference: 'Seychelles Prevention of Terrorism (Targeted Financial Sanctions) Regulations 2020, Reg 5.',
        recommendedAction: 'Assign 15-minute Unit 2 refresher module on TFS freezing protocols before next regulatory compliance review.',
      },
      {
        id: 'w-2',
        topicTitle: 'Proliferation Financing Indicators in Trade Finance',
        category: 'Proliferation Financing',
        score: 75,
        status: 'moderate',
        conceptTested: 'Dual-use goods and transshipment hubs used for proliferation financing.',
        errorIdentified: 'Failed to flag inconsistent bills of lading routing through sanctioned transshipment jurisdictions.',
        statutoryReference: 'FIU Seychelles Circular on Counter-Proliferation Financing Red Flags.',
        recommendedAction: 'HR to schedule brief review of the Trade-Based Money Laundering case study with the MLRO.',
      },
    ],
  },
  'mem-2': {
    memberId: 'mem-2',
    memberName: 'Nathalie Hoareau',
    memberEmail: 'n.hoareau@fiduciary-sey.sc',
    role: 'Senior Onboarding Officer',
    overallScore: 88,
    hrRemediationStatus: 'completed',
    hrNotes: 'Demonstrates deep customer interaction fluency. Addressed complex trust structure UBO ambiguity during coaching.',
    domainScores: {
      'Customer Due Diligence (CDD) & UBO': 78,
      'Targeted Financial Sanctions (TFS)': 92,
      'STR Filing & Monitoring': 95,
      'Anti-Tipping-Off & Confidentiality': 90,
      'Proliferation Financing': 86,
      'Record Retention & Auditing': 95,
    },
    completedCertificates: [
      {
        certificateId: 'CERT-CDD-2026-042',
        courseId: 'c-4',
        courseTitle: 'Customer Due Diligence (CDD) & Beneficial Ownership in Practice',
        issueDate: '2026-08-28',
        gradeScore: '86% (Pass)',
        verificationCode: 'CS-CDD-716492',
        cpdHours: 4.5,
      },
      {
        certificateId: 'CERT-ML-2026-095',
        courseId: 'c-1',
        courseTitle: 'Foundations of Money Laundering: Definitions, Typologies & AML Controls',
        issueDate: '2026-09-05',
        gradeScore: '92% (Distinction)',
        verificationCode: 'CS-ML-391054',
        cpdHours: 4.0,
      },
      {
        certificateId: 'CERT-STR-2026-018',
        courseId: 'c-6',
        courseTitle: 'Suspicious Transaction Reporting (STR) & Ongoing Monitoring',
        issueDate: '2026-09-12',
        gradeScore: '88% (Pass)',
        verificationCode: 'CS-STR-552093',
        cpdHours: 4.0,
      },
    ],
    weaknesses: [
      {
        id: 'w-3',
        topicTitle: 'Beneficial Ownership in Discretionary Trusts',
        category: 'Customer Due Diligence (CDD) & UBO',
        score: 70,
        status: 'moderate',
        conceptTested: 'Identification of protector, trustee, settlor, and class of beneficiaries under the Beneficial Ownership Act 2020.',
        errorIdentified: 'Overlooked the requirement to register named protectors who hold veto powers over trust distributions.',
        statutoryReference: 'Seychelles Beneficial Ownership Framework.',
        recommendedAction: 'Completed 1-on-1 trust register session with Head of Corporate Administration on 14 Sept.',
      },
    ],
  },
  'mem-3': {
    memberId: 'mem-3',
    memberName: 'Bernard Morel',
    memberEmail: 'b.morel@fiduciary-sey.sc',
    role: 'Trust Administrator',
    overallScore: 84,
    hrRemediationStatus: 'action_required',
    hrNotes: 'Passed foundational compliance exam but exhibited confusion regarding tipping-off exceptions.',
    domainScores: {
      'Customer Due Diligence (CDD) & UBO': 85,
      'Targeted Financial Sanctions (TFS)': 80,
      'STR Filing & Monitoring': 78,
      'Anti-Tipping-Off & Confidentiality': 64,
      'Proliferation Financing': 82,
      'Record Retention & Auditing': 92,
    },
    completedCertificates: [
      {
        certificateId: 'CERT-ML-2026-103',
        courseId: 'c-1',
        courseTitle: 'Foundations of Money Laundering: Definitions, Typologies & AML Controls',
        issueDate: '2026-09-10',
        gradeScore: '84% (Pass)',
        verificationCode: 'CS-ML-441829',
        cpdHours: 4.0,
      },
    ],
    weaknesses: [
      {
        id: 'w-4',
        topicTitle: 'Tipping-Off Offences & Confidentiality',
        category: 'Anti-Tipping-Off & Confidentiality',
        score: 58,
        status: 'critical',
        conceptTested: 'Strict prohibition against disclosing to the customer or unauthorized third parties that an STR has been lodged.',
        errorIdentified: 'Incorrectly assumed that notifying an external accounting representative or branch colleague was permitted prior to FIU feedback.',
        statutoryReference: 'Seychelles AML/CFT Framework: Anti-Tipping-Off Provisions.',
        recommendedAction: 'Mandatory follow-up: MLRO must conduct a formal sign-off session on internal STR filing escalation protocol.',
      },
      {
        id: 'w-5',
        topicTitle: 'Unusual vs Suspicious Transaction Distinction',
        category: 'STR Filing & Monitoring',
        score: 72,
        status: 'moderate',
        conceptTested: 'Establishing grounds for suspicion vs operational transaction clarification.',
        errorIdentified: 'Hesitated on whether an unexplained change in beneficial ownership jurisdiction triggers an automatic internal escalation.',
        statutoryReference: 'Seychelles AML/CFT Framework: Suspicious Activity Escalation.',
        recommendedAction: 'Review Unit 3 Case Study scenario on rapid corporate restructuring.',
      },
    ],
  },
};

/**
 * Creates a default assessment profile for an invited employee.
 */
export function createDefaultStaffAssessmentProfile(
  memberId: string,
  name: string,
  email: string,
  role: string
): StaffAssessmentProfile {
  return {
    memberId,
    memberName: name,
    memberEmail: email,
    role,
    overallScore: 0,
    hrRemediationStatus: 'in_progress',
    hrNotes: 'Newly enrolled staff member. Assessments pending completion.',
    domainScores: {
      'Customer Due Diligence (CDD) & UBO': 0,
      'Targeted Financial Sanctions (TFS)': 0,
      'STR Filing & Monitoring': 0,
      'Section 48 Anti-Tipping-Off': 0,
      'Proliferation Financing': 0,
      'Statutory Record Retention': 0,
    },
    completedCertificates: [],
    weaknesses: [
      {
        id: `w-init-${Date.now()}`,
        topicTitle: 'Initial Competency Baseline Pending',
        category: 'Onboarding',
        score: 0,
        status: 'moderate',
        conceptTested: 'Baseline AML/CFT statutory examination under Section 34.',
        errorIdentified: 'Staff member has not yet sat the mandatory curriculum examination.',
        statutoryReference: 'Seychelles AML/CFT Act 2020 Section 34.',
        recommendedAction: 'Ensure staff member completes Level 1 modules within 30 days of registration.',
      },
    ],
  };
}
