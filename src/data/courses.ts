import { Course, StudentProfile, Transaction } from '../types';

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
  {
    id: 'course-aml-fundamentals',
    title: 'AML/CFT Essentials for Seychelles Reporting Entities (2026)',
    slug: 'aml-cft-essentials-seychelles-reporting-entities',
    shortDescription: 'Core statutory AML/CFT compliance training for reporting entities under the Anti-Money Laundering and Countering the Financing of Terrorism Act 2020.',
    description: 'Mandatory annual staff training fulfilling statutory obligations for Seychelles reporting entities. Covers customer due diligence, Politically Exposed Persons (PEPs), red flags, and filing Suspicious Transaction Reports (STRs) with the Financial Intelligence Unit (FIU). Includes an official CompliSey completion certificate for your regulatory training audit file.',
    category: 'AML/CFT Compliance',
    level: 'All Levels',
    instructor: {
      name: 'Complisey Regulatory Faculty',
      role: 'Senior AML/CFT Regulatory Specialist & Ex-FIU Advisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Complisanc Consulting Services (SEY) trading as Complisey. Specializing in prudential compliance, FIU examination readiness, and institutional risk management across corporate service providers, fiduciary firms, and financial institutions.',
      company: 'Complisanc Consulting Services (SEY)',
      rating: 4.96,
      studentsCount: 4200,
    },
    rating: 4.96,
    reviewsCount: 318,
    totalHours: 4,
    lessonsCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    price: 1000,
    originalPrice: 1000,
    currency: 'SCR',
    tags: ['AML/CFT Act 2020', 'FIU Reporting', 'CDD / KYC', 'Fiduciary', 'Seychelles Entities'],
    featured: true,
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Seychelles Regulatory Framework & Reporting Entity Obligations',
        description: 'Understand the legal architecture: AML/CFT Act 2020, FIU Guidelines, and statutory duties for compliance staff.',
        lessons: [
          {
            id: 'les-1-1',
            title: '1. Legislative Scope & Role of the Financial Intelligence Unit (FIU)',
            durationMinutes: 25,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            previewAllowed: true,
            summary: 'Orientation to the AML/CFT Act 2020, identifying designated non-financial businesses and professions (DNFBPs), financial institutions, and statutory obligations.',
            notes: `### Statutory Foundations (AML/CFT Act 2020)
1. **Reporting Entities**: All licensed fiduciaries, corporate service providers, international business companies administrators, banks, insurance brokers, and securities dealers must maintain an institutional compliance programme.
2. **Mandatory Staff Training**: Under Section 34 of the Act, reporting entities must provide regular, documented AML/CFT training to all relevant employees.
3. **Training Records**: Proof of training (including syllabus, attendance, and certificates) must be retained on the firm's compliance file for inspection by the regulatory authorities (FSA / FIU).`,
            resources: [
              { id: 'res-1', name: 'CompliSey-AML-CFT-Act-2020-Summary.pdf', size: '1.2 MB', type: 'pdf', url: '#' },
              { id: 'res-2', name: 'Reporting-Entity-Statutory-Checklist.pdf', size: '420 KB', type: 'pdf', url: '#' },
            ],
            quiz: [
              {
                id: 'q-aml-1',
                question: 'Under the AML/CFT Act 2020, which authority is the national center for receiving and analyzing STRs in Seychelles?',
                options: [
                  'Seychelles Revenue Commission (SRC)',
                  'Financial Intelligence Unit (FIU)',
                  'Registrar of Companies',
                  'Central Bank of Seychelles only'
                ],
                correctAnswer: 1,
                explanation: 'The Financial Intelligence Unit (FIU) is the statutory national operational agency responsible for receipt, analysis, and dissemination of suspicious transaction reports.'
              },
              {
                id: 'q-aml-2',
                question: 'How often must reporting entities train staff on AML/CFT typologies and internal procedures?',
                options: [
                  'Once upon initial hire only',
                  'At least annually, with records kept on the compliance file',
                  'Only if a regulatory audit is scheduled',
                  'Every five years'
                ],
                correctAnswer: 1,
                explanation: 'Annual ongoing training is mandatory for all relevant compliance, administrative, and frontline staff under statutory guidelines.'
              }
            ],
            comments: [
              {
                id: 'c-sey-1',
                author: 'Jean-Luc Payet',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
                timestamp: '3 days ago',
                content: 'Clear breakdown of Section 34 training duties. Keeping this certificate on our CSP annual audit file.',
                upvotes: 8,
                replies: [
                  {
                    id: 'r-sey-1',
                    author: 'CompliSey Regulatory Faculty',
                    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
                    timestamp: '2 days ago',
                    content: 'Exactly Jean-Luc. The completion certificate you download upon finishing Module 4 is formatted specifically for FSA and FIU inspection files.',
                    isInstructor: true,
                  }
                ]
              }
            ]
          },
          {
            id: 'les-1-2',
            title: '2. The Three Stages of Money Laundering: Placement, Layering & Integration',
            durationMinutes: 20,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Examine typologies in international corporate structuring, nominee arrangements, offshore accounts, and trade-based laundering.',
            notes: `### The Laundering Cycle
- **Placement**: Introducing illicit funds into the financial system (e.g. structuring cash or complex digital transfers).
- **Layering**: Concealing the audit trail through multi-jurisdictional transfers, trust entities, and shell corporations.
- **Integration**: Reintroducing laundered capital into legitimate commercial acquisitions and luxury assets.`,
            resources: [
              { id: 'res-3', name: 'Offshore-Typology-Matrix.pdf', size: '850 KB', type: 'pdf', url: '#' }
            ]
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Customer Due Diligence (CDD), UBOs & PEP Risk Assessment',
        description: 'Verification standards, identifying Ultimate Beneficial Owners, and handling Politically Exposed Persons.',
        lessons: [
          {
            id: 'les-2-1',
            title: '3. Identifying Ultimate Beneficial Owners (UBOs) & Control Thresholds',
            durationMinutes: 30,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            summary: 'Master the 10% / 25% ownership threshold tests, complex multi-layered shareholding structures, and nominee director identification.',
            notes: `### Beneficial Ownership Verification
Always look through legal ownership to identify the natural person who ultimately owns or controls the legal person.
- Minimum 10% threshold in higher-risk corporate vehicles.
- Obtain certified passport/ID, proof of residential address (<3 months), and source of wealth documentation.`,
            resources: [
              { id: 'res-4', name: 'UBO-Identification-Workflow.pdf', size: '640 KB', type: 'pdf', url: '#' }
            ]
          },
          {
            id: 'les-2-2',
            title: '4. Politically Exposed Persons (PEPs) & Enhanced Due Diligence (EDD)',
            durationMinutes: 28,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            summary: 'Managing foreign, domestic, and international organisation PEPs, their family members, and close associates. Senior management approval protocols.',
            notes: `### Enhanced Due Diligence for PEPs
- Senior Compliance Officer approval is mandatory prior to onboarding or continuing a business relationship.
- Rigorous verification of Source of Wealth (SoW) and Source of Funds (SoF).
- Enhanced ongoing monitoring of transaction patterns.`,
            resources: []
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Red Flags & Filing Suspicious Transaction Reports (STRs)',
        description: 'Detecting red flags, avoiding the tipping-off criminal offense, and submitting STRs securely to the FIU.',
        lessons: [
          {
            id: 'les-3-1',
            title: '5. Identifying Red Flags & Suspicious Activity Indicators',
            durationMinutes: 32,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            summary: 'Practical case studies on transaction anomalies, reluctant clients, illogical transaction paths, and third-party payments.',
            notes: `### Common Fiduciary & Corporate Red Flags
1. Client is evasive about true beneficial ownership or source of capital.
2. Transactions with no apparent commercial rationale.
3. Sudden requests for round-amount wire transfers to sanctioned or high-risk jurisdictions.`,
            resources: [
              { id: 'res-5', name: 'FIU-Red-Flags-Catalogue.pdf', size: '510 KB', type: 'pdf', url: '#' }
            ]
          },
          {
            id: 'les-3-2',
            title: '6. Completing the Final Exam & Generating Your CompliSey Certificate',
            durationMinutes: 20,
            type: 'quiz',
            summary: 'Official competency exam. Score 80% or above to unlock your CompliSey AML/CFT Certificate for your firm training file.',
            notes: `Answer all 3 questions below. Once submitted with 80%+, your verifiable CompliSey credential will be issued immediately.`,
            resources: [],
            quiz: [
              {
                id: 'exam-q1',
                question: 'What constitutes the criminal offense of "Tipping-Off" under the AML/CFT Act?',
                options: [
                  'Discussing general AML regulations at an industry seminar',
                  'Disclosing to the customer or an unauthorized third party that an STR has been or will be submitted to the FIU',
                  'Requesting updated proof of address from a client during periodic review',
                  'Consulting the internal compliance officer regarding a transaction'
                ],
                correctAnswer: 1,
                explanation: 'Tipping-off is a severe criminal offense under the AML/CFT Act, carrying significant fines and imprisonment for warning a customer that they are subject to an investigation or STR.'
              },
              {
                id: 'exam-q2',
                question: 'When must a reporting entity apply Enhanced Due Diligence (EDD)?',
                options: [
                  'Only when the transaction exceeds $1,000,000',
                  'Whenever higher risk factors are identified, including foreign PEPs, high-risk jurisdictions, or complex corporate structures',
                  'Never, standard CDD is always sufficient',
                  'Only upon express written instruction from the police'
                ],
                correctAnswer: 1,
                explanation: 'EDD is legally required when higher risks are present, including PEP relationships, non-face-to-face onboarding without mitigation, or connections to FATF high-risk jurisdictions.'
              },
              {
                id: 'exam-q3',
                question: 'What is the statutory record-retention period for CDD and transaction records following termination of a business relationship in Seychelles?',
                options: [
                  '1 year',
                  'At least 7 years from the date the business relationship ends',
                  '6 months',
                  'Indefinitely without archiving'
                ],
                correctAnswer: 1,
                explanation: 'Reporting entities must retain all customer identification records, account files, and transaction correspondence for a minimum of 7 years following cessation of the relationship.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-cdd-pep',
    title: 'Customer Due Diligence (CDD), Beneficial Ownership & PEPs',
    slug: 'cdd-beneficial-ownership-peps',
    shortDescription: 'Advanced operational masterclass on corporate transparency, complex multi-jurisdictional trusts, and high-risk client onboarding.',
    description: 'Detailed analysis for MLROs, Compliance Officers, and Onboarding Managers. Step-by-step guidance through multi-tiered company registers, international sanctions verification, and source of wealth investigation.',
    category: 'AML/CFT Compliance',
    level: 'Intermediate',
    instructor: {
      name: 'Complisey Regulatory Faculty',
      role: 'Head of Fiduciary Compliance Audits',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'Complisanc Consulting Services (SEY) trading as Complisey. Over two decades of advisory expertise across international financial centers and regional compliance authorities.',
      company: 'Complisanc Consulting Services (SEY)',
      rating: 4.98,
      studentsCount: 2800,
    },
    rating: 4.94,
    reviewsCount: 194,
    totalHours: 3.5,
    lessonsCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    price: 1000,
    originalPrice: 1000,
    currency: 'SCR',
    tags: ['CDD / EDD', 'UBO Registers', 'Beneficial Ownership', 'PEP Screening'],
    modules: [
      {
        id: 'cdd-mod-1',
        title: 'Module 1: Corporate Transparency & Trust Registers',
        description: 'Unraveling multi-jurisdictional holding companies and discretionary trusts.',
        lessons: [
          {
            id: 'cdd-les-1',
            title: '1. Unpacking Offshore Structures & Nominee Shareholder Verification',
            durationMinutes: 30,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            previewAllowed: true,
            summary: 'How to penetrate complex corporate veils and identify the natural persons exerting ultimate effective control.',
            notes: 'Nominee arrangements must always be accompanied by a formal nominee agreement identifying the nominator.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-tfs-sanctions',
    title: 'Targeted Financial Sanctions (TFS) & Counter-Proliferation Financing',
    slug: 'targeted-financial-sanctions-tfs-screening',
    shortDescription: 'Operational compliance with UN Security Council resolutions, asset freeze mandates, and automated sanctions screening.',
    description: 'Targeted Financial Sanctions (TFS) require immediate, zero-delay execution. Learn how to screen clients against the United Nations Consolidated List and domestic freezing orders without tipping off, and how to submit Section 44 asset freeze notifications to the authorities.',
    category: 'Sanctions & Enforcement',
    level: 'Advanced',
    instructor: {
      name: 'Complisey Regulatory Faculty',
      role: 'Sanctions & Sanctions Screening Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Complisanc Consulting Services (SEY) trading as Complisey. Specializing in automated fuzzy-name screening architectures and sanctions risk mitigation for international firms.',
      company: 'Complisanc Consulting Services (SEY)',
      rating: 4.92,
      studentsCount: 1650,
    },
    rating: 4.91,
    reviewsCount: 142,
    totalHours: 3,
    lessonsCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    price: 1000,
    originalPrice: 1000,
    currency: 'SCR',
    tags: ['Sanctions', 'TFS', 'UN Security Council', 'Asset Freeze', 'Screening'],
    modules: [
      {
        id: 'tfs-mod-1',
        title: 'Module 1: Sanctions Lists & Immediate Freezing Obligations',
        description: 'Implementing instantaneous freezing mechanisms upon notice from the FIU or national committee.',
        lessons: [
          {
            id: 'tfs-les-1',
            title: '1. UN Consolidated List & National Sanctions Committee Protocols',
            durationMinutes: 28,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            previewAllowed: true,
            summary: 'Understanding legal requirements for immediate asset freezing without prior notice to the designated entity.',
            notes: 'Under TFS regulations, an asset freeze must be implemented immediately without delay and reported to the FIU.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-fatf-global-standards',
    title: 'Global AML/CFT Standards (FATF 40 Recommendations) for Cross-Border Financial Centres',
    slug: 'fatf-global-aml-standards-cross-border-entities',
    shortDescription: 'Comprehensive international AML/CFT/CPF compliance for regulated entities operating across offshore, midshore, and international financial hubs.',
    description: 'Developed for international compliance professionals, fiduciaries, multi-jurisdiction fund managers, and fintechs. Covers the Financial Action Task Force (FATF) 40 Recommendations, high-risk third countries, VASP travel rules, cross-border correspondent banking risks, and global supervisory expectations.',
    category: 'International Standards',
    level: 'All Levels',
    instructor: {
      name: 'Complisey International Faculty',
      role: 'Global Financial Crime Policy Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Complisanc Consulting Services (SEY) trading as Complisey. Advising financial institutions and supervisory bodies across London, Geneva, Dubai (ADGM/DIFC), and international financial centres.',
      company: 'Complisanc Consulting Services (SEY)',
      rating: 4.97,
      studentsCount: 3950,
    },
    rating: 4.97,
    reviewsCount: 228,
    totalHours: 5,
    lessonsCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    price: 1000,
    originalPrice: 1000,
    currency: 'SCR',
    tags: ['FATF 40 Recommendations', 'Cross-Border AML', 'Crypto / VASP Travel Rule', 'International Hubs', 'Sanctions'],
    featured: true,
    modules: [
      {
        id: 'fatf-mod-1',
        title: 'Module 1: Global Risk-Based Approach (FATF Recommendations 1–3)',
        description: 'Implementing the Risk-Based Approach across multiple jurisdictions and offshore centers.',
        lessons: [
          {
            id: 'fatf-les-1',
            title: '1. National & Institutional Risk Assessments (NRA & SIRA)',
            durationMinutes: 35,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            previewAllowed: true,
            summary: 'How to benchmark your firm’s AML program against national risk assessments and international mutual evaluations.',
            notes: 'FATF Recommendation 1 requires reporting entities to identify, assess, and understand their ML/TF risks.',
            resources: [
              {
                id: 'fatf-res-1',
                name: 'FATF-40-Recommendations-Reference-Matrix.pdf',
                size: '2.4 MB',
                type: 'pdf',
                url: '#',
              },
            ],
          },
          {
            id: 'fatf-les-2',
            title: '2. Cross-Border CDD & Beneficial Ownership Transparency (Rec. 10 & 24/25)',
            durationMinutes: 30,
            type: 'video',
            summary: 'Verifying legal persons, trusts, and complex international holding structures.',
            notes: 'Thresholds for ultimate beneficial ownership must look through multiple tiers of intermediate ownership.',
            resources: [],
          },
          {
            id: 'fatf-les-3',
            title: '3. Virtual Assets & Recommendation 16 Crypto Travel Rule',
            durationMinutes: 40,
            type: 'video',
            summary: 'Compliance requirements for Virtual Asset Service Providers (VASPs), counterparty VASP due diligence, and originator/beneficiary data transmission.',
            notes: 'The Travel Rule mandates that VASPs obtain and transmit required originator and beneficiary information with virtual asset transfers.',
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 'course-str-red-flags',
    title: 'Suspicious Transaction Reporting (STR) & FIU Typologies (Seychelles)',
    slug: 'suspicious-transaction-reporting-fiu-typologies',
    shortDescription: 'Practical identification of ML/TF red flags, internal escalation paths, and submitting defensible STRs to the FIU without tipping off.',
    description: 'A critical operational course for frontline staff, compliance analysts, and MLROs. Teaches how to recognize subtle transaction structuring, evasive UBO behavior, third-party wire anomalies, and how to compile comprehensive, legally compliant STR filings for the Seychelles Financial Intelligence Unit.',
    category: 'AML/CFT Compliance',
    level: 'Intermediate',
    instructor: {
      name: 'Complisey Regulatory Faculty',
      role: 'Head of Financial Crime Intelligence & Typologies',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
      bio: 'Complisanc Consulting Services (SEY) trading as Complisey. Senior former regulatory intelligence analysts specializing in suspicious activity detection and FIU liaison.',
      company: 'Complisanc Consulting Services (SEY)',
      rating: 4.95,
      studentsCount: 2400,
    },
    rating: 4.95,
    reviewsCount: 168,
    totalHours: 3.5,
    lessonsCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    price: 1000,
    originalPrice: 1000,
    currency: 'SCR',
    tags: ['STR Filing', 'FIU Typologies', 'Tipping-Off', 'Red Flags', 'Seychelles FIU'],
    modules: [
      {
        id: 'str-mod-1',
        title: 'Module 1: Recognizing Red Flags & The Threshold of Suspicion',
        description: 'Distinguishing between unusual activity and reportable suspicion under Section 48.',
        lessons: [
          {
            id: 'str-les-1',
            title: '1. Red Flags in Corporate Service Providers & Offshore Entities',
            durationMinutes: 30,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            previewAllowed: true,
            summary: 'Examining rapid movement of funds, pass-through company accounts, and mismatch between declared business purpose and transactional velocity.',
            notes: 'Suspicion is an objective test based on facts and anomalies that would cause an experienced compliance officer to question the transaction legitimacy.',
            resources: [],
          },
          {
            id: 'str-les-2',
            title: '2. Internal Escalation & Drafting the STR to the FIU',
            durationMinutes: 25,
            type: 'video',
            summary: 'Structuring the report narrative, supporting documents required by the FIU, and strict anti-tipping-off protocols.',
            notes: 'Under Section 49, reporting entities and their staff enjoy statutory civil and criminal immunity for disclosures made in good faith to the FIU.',
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 'course-mlro-governance',
    title: 'MLRO Governance, Risk-Based Audits & Internal Controls',
    slug: 'mlro-governance-risk-based-audits-internal-controls',
    shortDescription: 'Mastering the Money Laundering Reporting Officer mandate, institutional risk assessments (SIRA), and audit-ready compliance governance.',
    description: 'Designed for MLROs, Compliance Officers, Directors, and senior executives of Seychelles reporting entities. Covers governance structures, independent compliance testing, board reporting, managing FSA/FIU examinations, and remediation of regulatory inspection findings.',
    category: 'Governance & Audits',
    level: 'Advanced',
    instructor: {
      name: 'Complisey Regulatory Faculty',
      role: 'Principal Governance & Regulatory Audit Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Complisanc Consulting Services (SEY) trading as Complisey. Advisor to boards of directors and senior management across regulated institutions.',
      company: 'Complisanc Consulting Services (SEY)',
      rating: 4.99,
      studentsCount: 3100,
    },
    rating: 4.98,
    reviewsCount: 204,
    totalHours: 4,
    lessonsCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    price: 1000,
    originalPrice: 1000,
    currency: 'SCR',
    tags: ['MLRO Duties', 'SIRA', 'Internal Controls', 'FSA Inspections', 'Board Reporting'],
    modules: [
      {
        id: 'mlro-mod-1',
        title: 'Module 1: The Statutory Role & Personal Liability of the MLRO',
        description: 'Navigating regulatory duties, independence of function, and statutory reporting obligations.',
        lessons: [
          {
            id: 'mlro-les-1',
            title: '1. MLRO Authority, Independence & Direct Board Reporting Lines',
            durationMinutes: 30,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            previewAllowed: true,
            summary: 'The regulatory requirement for an unhindered access line to the board of directors and timely resource allocation for the compliance team.',
            notes: 'The MLRO must possess sufficient seniority, resources, and independence to carry out statutory compliance functions without executive interference.',
            resources: [],
          },
          {
            id: 'mlro-les-2',
            title: '2. Conducting the Sectoral & Institutional Risk Assessment (SIRA)',
            durationMinutes: 35,
            type: 'video',
            summary: 'Documenting your customer risk, geographical risk, product risk, and distribution channel risk matrices.',
            notes: 'A current, documented institutional risk assessment is the foundation of an effective risk-based AML/CFT programme.',
            resources: [],
          },
        ],
      },
    ],
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_cs_98412039',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Access)',
    amount: 1000,
    currency: 'SCR',
    gateway: 'bank_transfer',
    status: 'succeeded',
    createdAt: '2026-09-01T10:15:00Z',
    invoiceNumber: 'INV-CS-2026-00389',
    paymentMethodDetails: {
      brand: 'Seychelles Bank Transfer (Nouvobanq)',
      payerEmail: 'm.delpech@fiduciary-sey.sc',
    },
    discountAmount: 0,
  }
];
