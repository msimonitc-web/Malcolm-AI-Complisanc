import { Course } from '../../types';

export const cddPracticeCourse: Course = {
  id: 'c-4',
  title: 'Customer Due Diligence (CDD) in Practice: KYC, UBO Identification & Risk Scoring',
  slug: 'cdd-practice',
  shortDescription: 'Master Simplified, Standard & Enhanced Due Diligence, PEP screening, multi-tiered UBO unravelling, and hands-on CSP onboarding case studies.',
  description: 'The definitive hands-on compliance certification for operational Due Diligence. Learn step-by-step KYC verification for natural persons and complex corporate structures, calculate institutional customer risk scores, unravel multi-jurisdictional nominee and trust chains, verify Source of Wealth vs. Source of Funds, and solve realistic offshore CSP onboarding case scenarios.',
  category: 'Operational Compliance',
  level: 'Intermediate',
  rating: 4.95,
  reviewsCount: 189,
  totalHours: 4.5,
  lessonsCount: 19,
  price: 1500,
  originalPrice: 1750,
  currency: 'SCR',
  tags: ['CDD', 'KYC', 'UBO Unraveling', 'PEP Screening', 'Source of Wealth', 'Enhanced Due Diligence', 'Case Study'],
  featured: true,
  thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1000',
  instructor: {
    name: 'CompliSey Regulatory Faculty',
    role: 'Seychelles AML/CFT Specialists',
    company: 'CompliSey Academy',
    avatar: '/cankh-logo.svg',
    bio: 'Independent AML/CFT compliance training academy for Seychelles reporting entities.',
    rating: 4.97,
    studentsCount: 2950,
  },
  caseStudy: {
    id: 'cdd-cs-1',
    title: 'CSP Onboarding Case Study: Solaria Holdings Ltd & The Horizon Trust',
    scenario: 'You are the Senior Compliance Officer at a licensed Seychelles Corporate Service Provider. An application is received to incorporate "Solaria Holdings Ltd" to hold luxury maritime assets and commercial real estate. The applicant entity is owned 100% by "Horizon Global Trust" (registered in Guernsey). The trustee is a corporate trustee in Jersey. The protector of the trust is Mr. Viktor Vance, former Deputy Minister of Transport in an Eastern European state (retired 18 months ago). The named discretionary beneficiaries are his adult daughters, Elena (resident in Geneva) and Sophie (resident in London). The source of wealth is declared as "family investments and technology consulting". Initial capitalization is requested as USD 1,800,000 via a bank in Cyprus.',
    tasks: [
      '1. Identify all natural persons who must be identified and verified under the Beneficial Ownership Act 2020 and Act 5 of 2020 (Settlor, Trustee directors, Protector, Beneficiaries).',
      '2. Classify Mr. Viktor Vance and his daughters under PEP / RCA statutory criteria.',
      '3. Determine the mandatory approvals and documentary requirements for Source of Wealth (SOW) vs. Source of Funds (SOF).',
      '4. Formulate the final onboarding decision: Approve with EDD, Reject, or Request Specific Corroborating Evidence.'
    ]
  },
  modules: [
    {
      id: 'cdd-u1',
      title: 'Unit 1: The Three Tiers of Customer Due Diligence & KYC Onboarding',
      description: 'Simplified Due Diligence (SDD), Standard CDD, and Enhanced Due Diligence (EDD) triggers and verification.',
      lessons: [
        {
          id: 'cdd-l1',
          title: 'Lesson 1.1: Core Principles of Know Your Customer (KYC) & Statutory Verification',
          durationMinutes: 16,
          type: 'video',
          summary: 'The difference between identification and verification, independent reliable source data, and non-face-to-face risk.',
          notes: 'KYC Foundations:\n- Identification: Obtaining customer data (full legal name, DOB, residential address, nationality, government ID number).\n- Verification: Corroborating that data using independent and reliable documentation or digital identity verification systems (electronic KYC / eKYC).\n- Address Verification: Utility bill, government tax statement, or bank statement issued within the last 3 months.\n- Certified true copies and apostilles for foreign documents.',
          transcript: 'Welcome to Unit 1. Customer Due Diligence is the foundation of institutional safety. Identification is merely collecting what the customer claims to be; verification is the rigorous process of proving it through independent, reliable documentation, government registries, or cryptographic eKYC channels.',
          resources: [
            { id: 'cdd-r1', name: 'KYC Document Verification Standards.pdf', size: '1.4 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l2',
          title: 'Lesson 1.2: Simplified Due Diligence (SDD) Criteria & Restrictions',
          durationMinutes: 14,
          type: 'video',
          summary: 'When SDD is permissible, low-risk thresholds, state-owned entities, and public listed companies.',
          notes: 'SDD Applicability:\n- Permissible ONLY when a comprehensive risk assessment demonstrates proven low risk.\n- Public companies listed on recognized stock exchanges with rigorous disclosure rules.\n- Regulated domestic financial institutions.\n- Crucial caveat: SDD is NEVER permissible when there is suspicion of ML/TF or high-risk factors present.',
          transcript: 'Simplified Due Diligence allows proportionate measures for demonstrably low-risk relationships. However, SDD is never a total exemption from KYC; you must still identify the customer and verify that they meet the statutory low-risk criteria.',
          resources: []
        },
        {
          id: 'cdd-l3',
          title: 'Lesson 1.3: Standard CDD for Natural Persons vs. Legal Entities',
          durationMinutes: 18,
          type: 'video',
          summary: 'Individual KYC requirements, certificates of incorporation, memorandum & articles of association, registers of directors.',
          notes: 'Legal Entity CDD Checklist:\n- Certificate of Incorporation and Good Standing / Incumbency.\n- Memorandum & Articles of Association.\n- Register of Directors and Register of Members (Shareholders).\n- Resolution of the Board authorizing account opening and designated signatories.',
          transcript: 'Onboarding a legal entity requires validating its legal existence, operational status, and constitutional authority. You must verify who is authorized to bind the company, understand its stated commercial purpose, and obtain the full register of members.',
          resources: [
            { id: 'cdd-r2', name: 'Corporate Entity Onboarding Checklist.pdf', size: '920 KB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l4',
          title: 'Lesson 1.4: Enhanced Due Diligence (EDD) Mandatory Statutory Triggers',
          durationMinutes: 18,
          type: 'video',
          summary: 'PEPs, high-risk third countries (FATF grey/black lists), non-face-to-face onboarding, and complex/unusual transactions.',
          notes: 'Mandatory EDD Scenarios:\n- Politically Exposed Persons (PEPs) and their family/associates.\n- Customers originating from or transactions involving FATF-listed high-risk jurisdictions.\n- Correspondent banking relationships.\n- High-risk sectors (arms, private banking, extractive industries, high-value art/gems).',
          transcript: 'Enhanced Due Diligence is legally mandated whenever the customer, jurisdiction, or delivery channel presents elevated risk. EDD requires deeper investigation into wealth accumulation, senior executive sign-off, and accelerated transaction monitoring intervals.',
          resources: [
            { id: 'cdd-r3', name: 'Statutory EDD Triggers Reference.pdf', size: '1.1 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l5',
          title: 'Lesson 1.5: Establishing Source of Wealth (SOW) vs. Source of Funds (SOF)',
          durationMinutes: 20,
          type: 'video',
          summary: 'Documenting the origin of total net worth (SOW) vs. the specific transaction origin (SOF), corroborating evidence.',
          notes: 'Evidentiary Standards:\n- Source of Funds (SOF): Bank statement showing the debiting account, copy of commercial contract, or property closing statement.\n- Source of Wealth (SOW): Audited financial statements, dividend vouchers, inheritance probate documents, sale of business contracts spanning years.\n- Red flag: Uncorroborated customer self-declarations without third-party proof.',
          transcript: 'In EDD, distinguishing between Source of Funds and Source of Wealth is vital. A client can easily provide a bank statement showing $2,000,000 in an account—that is the Source of Funds. But how did the client accumulate that $2,000,000 over their lifetime? That is Source of Wealth, and it must be proven with independent documentary evidence.',
          resources: [
            { id: 'cdd-r4', name: 'SOW Corroboration Framework.pdf', size: '1.6 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l6',
          title: 'Lesson 1.6: Non-Face-to-Face Onboarding & Digital Identity (eKYC)',
          durationMinutes: 15,
          type: 'article',
          summary: 'Biometric liveness detection, NFC passport chip reading, synthetic identity fraud, and FATF digital identity guidelines.',
          notes: 'Digital Identity Best Practices:\n- Passive and active liveness verification to combat deepfakes and printed masks.\n- Cryptographic verification of MRZ and biometric passport chips via NFC.\n- IP address and geolocation anomaly detection.',
          transcript: 'Digital onboarding is now the industry standard. However, non-face-to-face verification carries inherent impersonation risks. Institutions must employ certified biometric liveness detection and cross-verify with government databases to prevent synthetic identity onboarding.',
          resources: []
        }
      ],
      unitQuiz: [
        {
          id: 'cdd-uq1-1',
          question: 'What is the fundamental difference between Customer Identification and Customer Verification?',
          options: [
            'Identification is for companies, verification is only for individuals',
            'Identification is recording the customer’s claimed identifying information; verification is corroborating that information using independent and reliable documentation or data',
            'Verification is done only after an account has been active for five years',
            'Identification requires a court order, verification does not'
          ],
          correctAnswer: 1,
          explanation: 'Customer identification is collecting the identity details; verification is the independent validation of those details using reliable source documents, data, or electronic channels.'
        },
        {
          id: 'cdd-uq1-2',
          question: 'Under what circumstance is Simplified Due Diligence (SDD) strictly prohibited from being applied?',
          options: [
            'Whenever the customer is a domestic public school',
            'Whenever there is suspicion of money laundering or terrorist financing, or when specific higher-risk scenarios apply',
            'Whenever the customer opens a checking account rather than a savings account',
            'Whenever the transaction value is under $100'
          ],
          correctAnswer: 1,
          explanation: 'SDD is strictly barred whenever there is a suspicion of ML/TF, or whenever high-risk indicators are present.'
        },
        {
          id: 'cdd-uq1-3',
          question: 'A client deposits $500,000 into a new account, presenting a wire receipt showing the funds were transferred from their bank in Zurich. Does this wire receipt satisfy the requirement for Source of Wealth (SOW)?',
          options: [
            'Yes, because Swiss banks are always fully compliant',
            'No; the wire receipt only demonstrates the Source of Funds (where the money came from immediately), not the Source of Wealth (how the client generated their cumulative net worth over time)',
            'Yes, any bank transfer over $100,000 automatically confirms Source of Wealth',
            'Only if the receipt is signed by the Swiss ambassador'
          ],
          correctAnswer: 1,
          explanation: 'A wire transfer receipt verifies Source of Funds for that specific transaction, but fails to establish Source of Wealth, which requires documentation showing how the client accumulated their total fortune.'
        },
        {
          id: 'cdd-uq1-4',
          question: 'Which of the following is a mandatory requirement when conducting Enhanced Due Diligence on a Politically Exposed Person (PEP)?',
          options: [
            'Mandatory senior management approval prior to establishing or continuing the business relationship',
            'Automatic reporting of the client to Interpol within 24 hours',
            'Confiscating 10% of the initial deposit as a regulatory surety bond',
            'Requiring the customer to renounce their political party affiliation'
          ],
          correctAnswer: 0,
          explanation: 'FATF standards and national statutes mandate obtaining senior management sign-off before establishing or continuing a business relationship with a PEP.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'cdd-sa-1',
          question: 'List three types of documentary evidence that can serve to corroborate a customer’s declared Source of Wealth (SOW).',
          sampleAnswer: '1) Audited corporate financial statements or dividend vouchers proving business ownership earnings; 2) A certified copy of a contract of sale for real estate, equity, or commercial business assets; 3) A certified grant of probate or will evidencing an inheritance, or court-certified divorce settlement documentation.',
          gradingRubric: 'Award full marks if the candidate provides three distinct, credible third-party documents (e.g. audited financials/dividends, asset sale contracts, inheritance/probate records, investment portfolio statements).'
        }
      ]
    },
    {
      id: 'cdd-u2',
      title: 'Unit 2: Ultimate Beneficial Ownership (UBO) Unravelling & Complex Legal Structures',
      description: 'Piercing corporate veils, multi-tiered shareholdings, trusts, foundations, and nominee arrangements.',
      lessons: [
        {
          id: 'cdd-l7',
          title: 'Lesson 2.1: The Three-Step Beneficial Ownership Identification Test',
          durationMinutes: 18,
          type: 'video',
          summary: 'Test 1: Ownership interest / voting rights; Test 2: Ultimate effective control; Test 3: Senior Managing Official (SMO) fallback.',
          notes: 'The FATF / Statutory 3-Tier Test:\n- Step 1: Identify natural persons with controlling ownership interest (e.g. 10% or 25% threshold).\n- Step 2: If ownership is dispersed or doubtful, identify natural persons exercising control through other means (veto power, contractual rights, family ties).\n- Step 3: Fallback only — if no natural person is identified under Steps 1 and 2, identify the natural person holding the position of Senior Managing Official (CEO, Managing Director).',
          transcript: 'Unravelling beneficial ownership follows a strict hierarchy. Step 1 is ownership equity or voting shares. If that does not reveal a natural person, Step 2 examines control through voting pacts, debt covenants, or informal influence. Only when both fail may an institution fall back to Step 3, identifying the Senior Managing Official.',
          resources: [
            { id: 'cdd-r5', name: 'Three-Step UBO Identification Methodology.pdf', size: '1.2 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l8',
          title: 'Lesson 2.2: Multi-Tiered Holding Chains & Circular Ownership Structures',
          durationMinutes: 20,
          type: 'video',
          summary: 'Mathematical calculation of indirect ownership percentage through cascading corporate holding entities.',
          notes: 'Calculating Indirect Ownership:\n- Multiply percentages across the holding chain: Entity A owns 60% of Entity B; Entity B owns 30% of Customer C. Natural Person X owns 100% of Entity A.\n- Person X indirect ownership = 60% × 30% = 18%.\n- Under a 10% threshold (e.g. Seychelles), Person X is a UBO! Under a 25% threshold, Person X would not meet Step 1.\n- Circular ownership: Company X owns 50% of Company Y, which owns 50% of Company X—requires investigating controlling directors.',
          transcript: 'When dealing with multi-layered corporate structures across Panama, BVI, and Seychelles, you must multiply ownership percentages down the tree to determine the natural person’s net effective interest.',
          resources: [
            { id: 'cdd-r6', name: 'Indirect Ownership Calculation Exercises.pdf', size: '850 KB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l9',
          title: 'Lesson 2.3: Express Trusts: Settlors, Trustees, Protectors & Beneficiaries',
          durationMinutes: 18,
          type: 'video',
          summary: 'FATF Recommendation 25, identifying all parties to a trust, discretionary vs. named beneficiaries.',
          notes: 'Parties to a Trust who MUST be identified:\n1. The Settlor (person who created and funded the trust).\n2. The Trustee(s) (natural persons or corporate trustee directors).\n3. The Protector (if appointed, holds power to remove trustees or veto distributions).\n4. The Beneficiaries (or class of beneficiaries if discretionary).\n5. Any other natural person exercising ultimate effective control.',
          transcript: 'Unlike corporations, a trust has no shares. Under international AML standards, every key party to a trust is legally deemed a beneficial owner. You cannot merely verify the trustee; you must identify and verify the settlor, protector, and all beneficiaries.',
          resources: [
            { id: 'cdd-r7', name: 'Trust Due Diligence Flowchart.pdf', size: '1.3 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l10',
          title: 'Lesson 2.4: Private Foundations: Founders, Council Members & Guardian Due Diligence',
          durationMinutes: 15,
          type: 'article',
          summary: 'Civil law foundations, charter documents, foundation council, supervisory guardians, and beneficiaries.',
          notes: 'Foundations Due Diligence Checklist:\n- Verification of the Founder(s).\n- Verification of all Foundation Council Members (analogous to board of directors).\n- Verification of the Guardian or Supervisory Board.\n- Verification of designated Beneficiaries.',
          transcript: 'Foundations combine features of trusts and corporations. Compliance teams must examine the Foundation Charter and Regulations to identify the founder, council members, guardian, and beneficiaries.',
          resources: []
        },
        {
          id: 'cdd-l11',
          title: 'Lesson 2.5: Nominee Arrangements & Power of Attorney Red Flags',
          durationMinutes: 16,
          type: 'video',
          summary: 'Nominee directors, nominee shareholders, declaration of trust agreements, and undisclosed principals.',
          notes: 'Nominee Risk Controls:\n- Nominee directors must disclose their status and provide full identity of their nominator / principal.\n- Nominee shareholders must produce the Declaration of Trust or Nominee Agreement.\n- Power of Attorney (POA): Granting general POA to a third party is a primary red flag for beneficial ownership concealment.',
          transcript: 'Nominees are frequently used in international business for administrative convenience, but launderers abuse them to hide behind professional figureheads. Regulators require licensed service providers to identify the undisclosed nominator behind every nominee agreement.',
          resources: [
            { id: 'cdd-r8', name: 'Nominee Screening and Verification Guide.pdf', size: '940 KB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l12',
          title: 'Lesson 2.6: Uncovering Disguised Beneficial Ownership Case Studies',
          durationMinutes: 16,
          type: 'video',
          summary: 'Analyzing real-world forensic corporate unravelling and regulatory enforcement actions.',
          notes: 'Key forensic takeaways:\n- Follow the bank signatories and instruction givers.\n- Correlate corporate incorporation dates with geopolitical sanctions announcements.\n- Scrutinize loans provided by undisclosed offshore lenders.',
          transcript: 'In this lesson, we dissect how investigators unraveled a complex maritime shipping network where vessels were owned by separate single-ship companies, revealing a single sanctioned oligarch directing operations through bearer proxies.',
          resources: []
        }
      ],
      unitQuiz: [
        {
          id: 'cdd-uq2-1',
          question: 'Entity A owns 50% of the shares in Target Co. Mr. Smith owns 30% of Entity A. What is Mr. Smith’s indirect ownership percentage in Target Co?',
          options: ['30%', '50%', '15%', '80%'],
          correctAnswer: 2,
          explanation: 'Indirect ownership is calculated by multiplying the ownership percentages along the chain: 50% × 30% = 15% indirect ownership.'
        },
        {
          id: 'cdd-uq2-2',
          question: 'Under international AML standards for an express trust, which of the following parties MUST be identified and verified as a beneficial owner?',
          options: [
            'The Settlor and the Trustee only',
            'The Settlor, Trustee(s), Protector (if any), Beneficiaries (or class of beneficiaries), and any person exercising ultimate effective control',
            'Only the beneficiaries who have already received a cash disbursement',
            'Only the lawyer who drafted the trust deed'
          ],
          correctAnswer: 1,
          explanation: 'Under FATF Recommendation 25, all key roles in a trust—settlor, trustee, protector, beneficiaries/class, and any controlling person—must be identified and verified.'
        },
        {
          id: 'cdd-uq2-3',
          question: 'When is a reporting entity permitted to identify the "Senior Managing Official" (SMO) as the beneficial owner of a legal entity?',
          options: [
            'Whenever the customer is in a hurry to open the account',
            'As the default first step for all private limited companies',
            'Only as a last resort, after having exhausted all means to identify natural persons via ownership interest or effective control, or where doubt remains',
            'Whenever the company has more than 5 shareholders'
          ],
          correctAnswer: 2,
          explanation: 'Identifying the Senior Managing Official is strictly a fallback measure of last resort when no natural person meets the ownership threshold or exercises effective control, provided there are no grounds for suspicion.'
        },
        {
          id: 'cdd-uq2-4',
          question: 'A nominee director agreement is presented during corporate onboarding. What document must the compliance analyst demand to verify the true controlling party?',
          options: [
            'A character reference from the nominee\'s local bank',
            'The nominee agreement, declaration of trust, and the verified identity and source of wealth of the underlying nominator/principal',
            'The nominee’s personal university graduation certificate',
            'An insurance policy covering corporate liability'
          ],
          correctAnswer: 1,
          explanation: 'A nominee arrangement requires full disclosure and verification of the underlying nominator/principal, including the formal nominee agreement/declaration of trust and full KYC on the nominator.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'cdd-sa-2',
          question: 'Explain why the appointment of an attorney-in-fact via a broad Power of Attorney (POA) by a corporate client warrants heightened scrutiny by compliance.',
          sampleAnswer: 'A broad Power of Attorney allows an individual who is not listed on the official Register of Directors or Shareholders to execute banking transactions, enter contracts, and bind the company. This mechanism is frequently used by money launderers or sanctioned persons to exercise hidden control over corporate assets while keeping their name off official company registries.',
          gradingRubric: 'Candidate must explain that a broad POA grants effective control without appearing on public registers, creating high risk of hidden beneficial ownership or sanctions evasion.'
        }
      ]
    },
    {
      id: 'cdd-u3',
      title: 'Unit 3: Customer Risk Scoring, PEP Screening & Ongoing Monitoring',
      description: 'Building multi-factor risk scoring matrices, dynamic risk review cycles, and trigger-event monitoring.',
      lessons: [
        {
          id: 'cdd-l13',
          title: 'Lesson 3.1: Constructing a Multi-Factor Customer Risk Scoring Model',
          durationMinutes: 18,
          type: 'video',
          summary: 'Weighting customer type, jurisdiction, product, transaction volume, and delivery channel.',
          notes: 'Customer Risk Scoring Parameters:\n- Category 1: Customer Type (Individual, Corporate, Trust, DNFBP, Financial Institution).\n- Category 2: Geographic Risk (FATF lists, Basel AML Index, Transparency International CPI).\n- Category 3: Products/Services (Cash-intensive, private banking, international wires, crypto).\n- Category 4: Delivery Channel (Face-to-face, intermediary, direct digital).\n- Scoring output: Low, Medium, High / Extreme Risk.',
          transcript: 'A robust customer risk scoring matrix combines quantitative scores across geography, entity type, products, and channels. The aggregate score determines whether onboarding requires standard approval or EDD with executive committee sign-off.',
          resources: [
            { id: 'cdd-r9', name: 'Customer Risk Scoring Matrix Template.xlsx', size: '2.4 MB', type: 'code', url: '#' }
          ]
        },
        {
          id: 'cdd-l14',
          title: 'Lesson 3.2: PEP Screening, Foreign vs. Domestic PEPs & Adverse Media',
          durationMinutes: 16,
          type: 'video',
          summary: 'Screening lists (Dow Jones, World-Check), handling former PEPs ("once a PEP, always a PEP" debates), and negative news.',
          notes: 'PEP Compliance Rules:\n- Foreign PEPs: Mandatory EDD and senior management approval under FATF standards.\n- Domestic PEPs: Risk-based approach; EDD required if higher risk factors exist.\n- Relatives and Close Associates (RCAs): Subject to equivalent EDD.\n- De-pepping: Assessing whether a former official retains lingering influence.',
          transcript: 'Screening for Politically Exposed Persons requires looking beyond the official themselves. Spouses, children, business partners, and close associates (RCAs) carry significant risk because corrupt officials routinely transfer assets into family accounts.',
          resources: [
            { id: 'cdd-r10', name: 'PEP and RCA Screening Standard Operating Procedure.pdf', size: '1.2 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l15',
          title: 'Lesson 3.3: Periodic Review Cycles: Low, Medium & High Risk Timelines',
          durationMinutes: 15,
          type: 'video',
          summary: 'Statutory refresh cycles: High-risk (annual), Medium-risk (2-3 years), Low-risk (3-5 years).',
          notes: 'Periodic Review Standards:\n- High Risk: Full KYC refresh and transaction re-assessment every 12 months (or continuous).\n- Medium Risk: Review every 24 to 36 months.\n- Low Risk: Review every 36 to 60 months.\n- Expired passport and address document updates.',
          transcript: 'Due diligence is not a one-time onboarding checkpoint. Customer profiles evolve. Regulators mandate periodic review cycles calibrated to risk rating—high-risk clients must undergo comprehensive file reviews annually.',
          resources: []
        },
        {
          id: 'cdd-l16',
          title: 'Lesson 3.4: Event-Driven (Trigger-Based) Reviews',
          durationMinutes: 15,
          type: 'video',
          summary: 'Trigger events: Change in UBO, change in directors, unusual transaction spikes, adverse news, sanctions listing.',
          notes: 'Event-Driven Triggers:\n- Notification of change in ownership, share transfer, or restructuring.\n- Appointment of new directors, authorized signatories, or powers of attorney.\n- Customer attempts transaction inconsistent with stated profile.\n- Negative media report connecting customer to corruption, fraud, or tax litigation.',
          transcript: 'Event-driven reviews take precedence over calendar-based periodic cycles. If a low-risk client suddenly transfers 40% of their shares to a foreign holding company, a trigger review must be initiated immediately.',
          resources: []
        },
        {
          id: 'cdd-l17',
          title: 'Lesson 3.5: Handling Incomplete CDD & Defensive Exits',
          durationMinutes: 16,
          type: 'video',
          summary: 'Section 21 procedures, relationship termination workflows, freezing funds vs. releasing to originating account.',
          notes: 'Defensive Exit Protocols:\n- Formally notify customer of missing requirements with strict deadline.\n- Restrict account operations (block debits/outgoing transfers).\n- If unfulfilled, terminate relationship and evaluate whether circumstances warrant filing an STR.\n- Do NOT tip off customer if termination is linked to suspicious activity report.',
          transcript: 'When a customer refuses or fails to provide requested CDD updates, the institution must execute a defensive exit. Operations must be restricted, the account closed according to regulatory guidelines, and the MLRO notified for potential STR submission.',
          resources: [
            { id: 'cdd-r11', name: 'Defensive Exit and De-Risking Protocol.pdf', size: '1.0 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'cdd-l18',
          title: 'Lesson 3.6: Audit Readiness & Regulatory Inspection Defensibility',
          durationMinutes: 15,
          type: 'article',
          summary: 'Sampling methodologies by regulators, assembling KYC audit files, demonstrating compliance controls to examiners.',
          notes: 'Regulatory Exam Preparation:\n- File completeness: Clear audit trail documenting when verification was obtained and who approved it.\n- Documenting rationale for discounting sanctions/PEP alerts and risk rating overrides.\n- Maintaining logs of MLRO internal escalations.',
          transcript: 'If it isn’t documented, it didn’t happen. During regulatory inspections, examiners pull random samples of high-risk customer files. Compliance teams must demonstrate contemporaneous documentation of all verifications, risk scoring decisions, and management approvals.',
          resources: []
        },
        {
          id: 'cdd-l19',
          title: 'Lesson 3.7: Capstone Review — Solving the Solaria Holdings Case Study',
          durationMinutes: 20,
          type: 'video',
          summary: 'Walkthrough of the offshore trust onboarding case study, applying UBO, PEP, RCA, and SOW analysis.',
          notes: 'Case Study Solutions:\n- Viktor Vance: Foreign PEP requiring senior management approval and verified SOW.\n- Elena & Sophie: RCAs requiring enhanced due diligence.\n- Trust: Identify Settlor, Trustee, Protector (Viktor), Beneficiaries.\n- Funding: Verify commercial contracts explaining $1.8M transfer from Cyprus.',
          transcript: 'In this capstone lesson, we solve the Solaria Holdings case study step-by-step, applying every tool learned across the three units to produce an unassailable onboarding compliance pack.',
          resources: [
            { id: 'cdd-r12', name: 'Solaria Holdings Complete Case Study Pack.pdf', size: '2.8 MB', type: 'pdf', url: '#' }
          ]
        }
      ],
      unitQuiz: [
        {
          id: 'cdd-uq3-1',
          question: 'What is the standard recommended periodic review frequency for a customer classified as High Risk (e.g. an offshore corporate entity with foreign PEP ownership)?',
          options: [
            'Every 10 years',
            'Every 12 months (annually)',
            'Only when the client requests a credit card',
            'Never, once onboarded they are permanently approved'
          ],
          correctAnswer: 1,
          explanation: 'Industry standard best practice and statutory regulations mandate that High-Risk customer files undergo a full KYC and transaction review at least annually (every 12 months).'
        },
        {
          id: 'cdd-uq3-2',
          question: 'Which of the following events constitutes an "Event-Driven Review" trigger requiring immediate KYC re-assessment before the scheduled periodic review date?',
          options: [
            'A change in the company\'s ultimate beneficial ownership or appointment of new bank signatories',
            'The client celebrating a birthday',
            'The central bank lowering national interest rates by 0.25%',
            'The client upgrading their office telephone system'
          ],
          correctAnswer: 0,
          explanation: 'A material change in beneficial ownership, shareholding, directors, or bank signatories is a classic trigger event requiring immediate out-of-cycle due diligence.'
        },
        {
          id: 'cdd-uq3-3',
          question: 'Why must close family members (such as spouses, children, and parents) of a Politically Exposed Person be subjected to Enhanced Due Diligence?',
          options: [
            'Because they are automatically guilty of tax evasion',
            'Because corrupt public officials frequently divert state assets or disguise illicit wealth by placing accounts, real estate, and companies in the names of family members',
            'Because family members are not permitted to own property in foreign countries',
            'Because they do not possess valid national identity cards'
          ],
          correctAnswer: 1,
          explanation: 'Family members and close associates (RCAs) of PEPs are prime vectors for holding diverted or corrupt assets on behalf of the public official.'
        },
        {
          id: 'cdd-uq3-4',
          question: 'If an existing client categorically refuses to provide updated beneficial ownership confirmation upon request during a periodic review, what action must the compliance officer initiate?',
          options: [
            'Offer the client a discount on banking fees to encourage compliance',
            'Commence a defensive exit process: restrict account debits, terminate the relationship, and evaluate filing an STR with the FIU',
            'Mark the file as complete and assume nothing has changed',
            'Transfer the customer\'s balance to another private bank without client consent'
          ],
          correctAnswer: 1,
          explanation: 'Failure to furnish required CDD documentation mandates account restriction, relationship termination, and consideration of an STR for defensive exit compliance.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'cdd-sa-3',
          question: 'In the Solaria Holdings case study, why must the daughters (Elena and Sophie) be treated with Enhanced Due Diligence even though they have never held any public office?',
          sampleAnswer: 'Elena and Sophie are the adult children of Mr. Viktor Vance, a retired senior government minister (Foreign PEP). Under FATF and statutory definitions, immediate family members of PEPs are classified as Relatives and Close Associates (RCAs). They present elevated money laundering risk because PEPs often divert illicit or corrupt wealth to their children as trust beneficiaries; therefore, EDD and source of wealth verification are mandatory.',
          gradingRubric: 'Candidate must identify them as Relatives and Close Associates (RCAs) of a PEP, note the risk of assets being held for/transferred by the PEP, and state that EDD is mandatory.'
        }
      ]
    }
  ],
  finalExam: [
    {
      id: 'cdd-fe-1',
      question: 'Which element is mandatory for verifying the identity of a natural person under international CDD standards?',
      options: [
        'An unverified business card',
        'Independent, reliable source document (such as a valid government-issued passport or national ID) and reliable proof of residential address',
        'A social media profile with at least 500 followers',
        'A verbal character reference from a neighbor'
      ],
      correctAnswer: 1,
      explanation: 'Customer verification requires independent and reliable source data, including government photographic identity documents and reliable address corroboration.'
    },
    {
      id: 'cdd-fe-2',
      question: 'Under FATF Recommendation 10, when must beneficial ownership be verified for legal persons?',
      options: [
        'Only after the company has generated $10M in profits',
        'Before or during the establishment of the business relationship',
        'At the discretion of the sales manager',
        'Only if requested by a foreign embassy'
      ],
      correctAnswer: 1,
      explanation: 'Beneficial ownership must be verified before or during the establishment of the business relationship.'
    },
    {
      id: 'cdd-fe-3',
      question: 'In a corporate hierarchy, Company X owns 80% of Company Y. Company Y owns 20% of Target Ltd. What is the indirect ownership percentage of Company X in Target Ltd?',
      options: ['100%', '80%', '16%', '20%'],
      correctAnswer: 2,
      explanation: '80% × 20% = 16% indirect ownership.'
    },
    {
      id: 'cdd-fe-4',
      question: 'What is the statutory threshold for defining a Beneficial Owner under the Seychelles Beneficial Ownership Act 2020?',
      options: ['25% or more', '10% or more', '50% plus one share', '5% or more'],
      correctAnswer: 1,
      explanation: 'The Seychelles Beneficial Ownership Act sets the threshold at 10% or more.'
    },
    {
      id: 'cdd-fe-5',
      question: 'When onboarding an Express Trust, which of the following individuals does NOT need to be identified and verified as a beneficial owner?',
      options: [
        'The Settlor who funded the trust',
        'The Protector who holds veto powers over distributions',
        'The courier service driver who delivered the physical trust documents to the office',
        'The named beneficiaries entitled to trust assets'
      ],
      correctAnswer: 2,
      explanation: 'A third-party postal courier has no beneficial interest, legal control, or fiduciary role in the trust, unlike settlors, protectors, trustees, and beneficiaries.'
    },
    {
      id: 'cdd-fe-6',
      question: 'What is the primary requirement for Source of Wealth (SOW) verification during Enhanced Due Diligence?',
      options: [
        'A signed statement from the customer stating they worked hard all their life',
        'Documentary evidence from independent sources demonstrating how the customer accumulated their total net worth (e.g. audited financials, business sale contracts, inheritance grants)',
        'A credit card statement showing available credit',
        'A screenshot of a cryptocurrency portfolio balance'
      ],
      correctAnswer: 1,
      explanation: 'SOW verification requires independent, documentary evidence substantiating how the customer accumulated their cumulative wealth.'
    },
    {
      id: 'cdd-fe-7',
      question: 'How does an "Event-Driven Review" differ from a "Periodic Review"?',
      options: [
        'Periodic reviews occur on set calendar intervals (e.g., annually); event-driven reviews are triggered immediately by material changes in risk profile, ownership, or suspicious transactions',
        'Event-driven reviews only apply to bankrupt companies',
        'Periodic reviews are conducted by police, event-driven by tax authorities',
        'There is no difference between the two terms'
      ],
      correctAnswer: 0,
      explanation: 'Periodic reviews are scheduled on predetermined intervals, while event-driven reviews are initiated out-of-cycle whenever significant trigger events occur.'
    },
    {
      id: 'cdd-fe-8',
      question: 'Why is non-face-to-face (digital) customer onboarding treated as having elevated inherent risk?',
      options: [
        'Because mobile phones do not connect to the internet in offshore centers',
        'Because of the heightened risk of impersonation, synthetic identity fraud, and deepfakes manipulating digital identity channels',
        'Because international law bans electronic signatures',
        'Because digital onboarding does not generate transaction fees'
      ],
      correctAnswer: 1,
      explanation: 'Non-face-to-face onboarding carries inherent identity fraud, impersonation, and presentation attack risks, requiring biometric liveness and cryptographic validation.'
    },
    {
      id: 'cdd-fe-9',
      question: 'If a bank cannot complete Customer Due Diligence because the customer refuses to provide proof of beneficial ownership, what must the bank do?',
      options: [
        'Open the account under a temporary anonymous number',
        'Refuse to open the account or terminate the relationship, and evaluate whether to file a Suspicious Transaction Report',
        'Accept a $5,000 compliance waiver fee',
        'Refer the customer to the central bank governor'
      ],
      correctAnswer: 1,
      explanation: 'Failure to complete CDD requires non-commencement or termination of the relationship and evaluation of an STR filing.'
    },
    {
      id: 'cdd-fe-10',
      question: 'What is the term used to describe individuals who are immediate family members or close business associates of a Politically Exposed Person?',
      options: [
        'Corporate Nominees',
        'Relatives and Close Associates (RCAs)',
        'Junior Public Servants',
        'Designated Non-Financial Agents'
      ],
      correctAnswer: 1,
      explanation: 'FATF designates family members and close business associates of PEPs as Relatives and Close Associates (RCAs).'
    }
  ]
};
