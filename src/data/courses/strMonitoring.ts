import { Course } from '../../types';

export const strMonitoringCourse: Course = {
  id: 'c-6',
  title: 'Transaction Monitoring, SAR/STR Filing & Investigation Techniques',
  slug: 'str-monitoring',
  shortDescription: 'Master AML rules engines, velocity anomalies, STR investigative analysis, drafting defensible narratives, and tipping-off safeguards.',
  description: 'An expert operational certification on transaction monitoring architectures and Suspicious Transaction Report (STR/SAR) investigations. Learn rule-based and machine-learning threshold tuning, investigate complex transactional anomalies across retail and corporate banking, draft regulatory-grade narrative disclosures, interface with the Financial Intelligence Unit, and uphold strict anti-tipping-off protocols.',
  category: 'Investigations & Reporting',
  level: 'Advanced',
  rating: 4.98,
  reviewsCount: 204,
  totalHours: 4.5,
  lessonsCount: 19,
  price: 1500,
  originalPrice: 1750,
  currency: 'SCR',
  tags: ['Transaction Monitoring', 'STR Filing', 'SAR', 'MLRO Escalation', 'Tipping-Off', 'Financial Intelligence', 'Case Investigation'],
  featured: true,
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
  instructor: {
    name: 'CompliSey Regulatory Faculty',
    role: 'Seychelles AML/CFT Specialists',
    company: 'CompliSey Academy',
    avatar: '/cankh-logo.svg',
    bio: 'Independent AML/CFT compliance training academy for Seychelles reporting entities.',
    rating: 4.99,
    studentsCount: 3410,
  },
  caseStudy: {
    id: 'str-cs-1',
    title: 'Forensic Transaction Investigation: Le Petit Bureau Cash Spike',
    scenario: 'You are the Lead AML Monitoring Investigator at a commercial bank in Victoria, Seychelles. Account #40912 is registered to "Le Petit Bureau Ltd", an authorized foreign currency bureau de change operating near the port. Historically, the account receives cash deposits averaging SCR 250,000 to SCR 400,000 per week, with corresponding foreign currency drafts purchased to meet legitimate tourist exchange demand. Over the past 14 days, the account experienced a sudden dramatic shift: three separate cash deposits of SCR 950,000 each were deposited by three different individuals within 48 hours. Immediately following each deposit, identical international wire transfers totaling USD 180,000 were remitted to a logistics company in Dubai with no prior business history, with the payment reference listed simply as "consultancy fees". When the branch manager contacted the bureau\'s director, the director was evasive, claiming the transactions were on behalf of a "private VIP client" whose identity could not be revealed due to commercial privacy.',
    tasks: [
      '1. Identify all transaction monitoring red flags present in this scenario (smurfing/structuring, deviation from historical turnover profile, rapid pass-through / velocity, third-party depositors, lack of economic rationale).',
      '2. Evaluate whether the director\'s refusal to disclose the underlying VIP client constitutes reasonable grounds for suspicion under Act 5 of 2020.',
      '3. Formulate an Internal Suspicious Activity Report escalation to the MLRO.',
      '4. Draft the narrative section of the formal statutory STR to be submitted to the Seychelles FIU, incorporating the 5 Ws and 1 H (Who, What, When, Where, Why, How).'
    ]
  },
  modules: [
    {
      id: 'str-u1',
      title: 'Unit 1: Transaction Monitoring Architecture, Rules Engines & Typologies',
      description: 'Rule-based vs. behavioral detection, threshold calibration, and behavioral anomaly recognition.',
      lessons: [
        {
          id: 'str-l1',
          title: 'Lesson 1.1: Foundations of Automated Transaction Monitoring Systems (TMS)',
          durationMinutes: 18,
          type: 'video',
          summary: 'TMS core architecture, data ingestion (batch vs. real-time), rule engines, and historical baseline profiles.',
          notes: 'TMS Fundamentals:\n- Automated surveillance scanning internal core banking feeds.\n- Compares transaction parameters (amount, frequency, counterparty, corridor) against predefined baseline rules.\n- Essential data attributes: Originator, beneficiary, account balance velocity, transaction channels (ATM, branch, wire, pos).',
          transcript: 'Welcome to Unit 1. Transaction monitoring is the sensory nervous system of an AML program. It analyzes millions of transactions in real-time, benchmarking customer activity against their expected financial profile to detect sudden behavioral shifts and criminal exploitation.',
          resources: [
            { id: 'str-r1', name: 'Transaction Monitoring System Architecture Guide.pdf', size: '1.5 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l2',
          title: 'Lesson 1.2: Rule-Based Logic vs. Machine Learning & Behavioral Analytics',
          durationMinutes: 16,
          type: 'video',
          summary: 'Deterministic thresholds vs. machine-learning clustering, peer group profiling, and anomaly detection.',
          notes: 'Rule Types:\n- Deterministic Rules: Fixed if-then logic (e.g., cash deposit > $10,000 within 24h).\n- Behavioral / Peer Group Profiling: Compares customer behavior against peers in the same industry/occupation.\n- Machine Learning: Unsupervised anomaly detection identifying multi-dimensional patterns missed by rigid rules.',
          transcript: 'Traditional monitoring relied on rigid threshold rules. Today, hybrid systems combine deterministic rules with machine-learning peer group analytics, allowing investigators to detect subtle deviation patterns that skirt traditional hard caps.',
          resources: [
            { id: 'str-r2', name: 'Rule Engine Configuration Principles.pdf', size: '1.2 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l3',
          title: 'Lesson 1.3: Core Transaction Monitoring Typologies & Scenarios',
          durationMinutes: 20,
          type: 'video',
          summary: 'Structuring/smurfing, rapid movement of funds (pass-through / funnel accounts), sudden account reactivation, circular wires.',
          notes: 'Core Typology Rules:\n- Structuring / Smurfing: Multiple sub-threshold transactions across accounts/branches.\n- Pass-Through / In-and-Out Velocity: Large credits immediately followed by equal debits with minimal retained balance.\n- Dormant Account Reactivation: Dormant accounts suddenly receiving high-value wires.\n- High-Risk Corridor Transfers: Outgoing payments to jurisdictions with weak AML or high TF risk.',
          transcript: 'Recognizing typologies is essential for rule tuning. The most pervasive typology is the pass-through or funnel account, where dirty money enters in numerous small deposits and is wired out immediately in lump sums, leaving near-zero daily balances.',
          resources: [
            { id: 'str-r3', name: 'TMS Typology Library and Detection Scenarios.pdf', size: '2.1 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l4',
          title: 'Lesson 1.4: Below-the-Line (BTL) and Above-the-Line (ATL) Threshold Tuning',
          durationMinutes: 18,
          type: 'video',
          summary: 'Optimizing alert yield, statistical sampling, and avoiding false positives without creating regulatory gaps.',
          notes: 'Tuning Methodology:\n- Above-The-Line (ATL) Testing: Analyzing alert generation and productive alert yield above existing thresholds.\n- Below-The-Line (BTL) Testing: Statistically testing transactions just below the threshold to verify no suspicious activity is escaping.\n- Regulatory expectation: Annual model validation and documented tuning rationale.',
          transcript: 'Regulators demand evidence of threshold tuning. If your cash structuring rule is set at $9,500, you must conduct Below-The-Line testing on transactions between $8,000 and $9,499 to prove to examiners that launderers are not systematically evading your detection filter.',
          resources: [
            { id: 'str-r4', name: 'Threshold Tuning and BTL Testing SOP.pdf', size: '1.4 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l5',
          title: 'Lesson 1.5: Currency Transaction Reporting (CTR) vs. Suspicious Activity',
          durationMinutes: 14,
          type: 'article',
          summary: 'Mandatory objective cash reporting thresholds vs. subjective suspicious transaction reporting.',
          notes: 'Key Distinctions:\n- CTR: Purely objective, mandatory filing triggered automatically by cash transactions exceeding statutory limit (e.g. SCR 100,000 or USD 10,000), regardless of suspicion.\n- STR: Subjective report filed whenever there are reasonable grounds to suspect money laundering or terrorist financing, regardless of transaction amount.',
          transcript: 'Never confuse a CTR with an STR. A CTR is an automatic objective regulatory filing triggered purely by cash volume. An STR requires human forensic analysis and the presence of suspicious or unexplained activity.',
          resources: []
        },
        {
          id: 'str-l6',
          title: 'Lesson 1.6: Alert Triage & Investigator Workflow Management',
          durationMinutes: 15,
          type: 'video',
          summary: 'Alert generation, Level 1 triage, Level 2 deep-dive investigation, and escalation to the MLRO.',
          notes: 'Alert Lifecycle:\n- Level 1 Analyst: Initial review within 48-72 hours. Discounts obvious false positives with standard documentation.\n- Level 2 Investigator: Conducts deep-dive transaction analysis, requests KYC files, contacts relationship managers.\n- MLRO: Final authority to decide whether to submit formal STR to the FIU.',
          transcript: 'Effective compliance teams utilize structured multi-tiered investigation workflows. Level 1 analysts filter routine operational noise, ensuring that complex, high-risk cases receive focused deep-dive analysis by seasoned forensic investigators.',
          resources: []
        }
      ],
      unitQuiz: [
        {
          id: 'str-uq1-1',
          question: 'What defines a "Pass-Through Account" (or Funnel Account) typology in transaction monitoring?',
          options: [
            'An account used exclusively for paying monthly electricity utility bills',
            'An account where large deposits are received and almost immediately transferred out in full via wire or withdrawal, leaving minimal lingering balance',
            'An escrow account managed by the Supreme Court',
            'An account that has had zero transactions for seven consecutive years'
          ],
          correctAnswer: 1,
          explanation: 'Pass-through or funnel accounts are characterized by high-velocity turnover where funds are received and immediately disbursed, maintaining a near-zero average balance.'
        },
        {
          id: 'str-uq1-2',
          question: 'Why do regulatory authorities require financial institutions to conduct "Below-The-Line" (BTL) testing during transaction monitoring model tuning?',
          options: [
            'To reduce the electricity consumption of banking servers',
            'To verify whether transactions occurring just below current rule thresholds contain suspicious patterns that are escaping detection',
            'To eliminate all compliance staff members',
            'To calculate corporate income tax deductions'
          ],
          correctAnswer: 1,
          explanation: 'BTL testing examines transactions just below detection thresholds to prove that the thresholds are not missing suspicious structuring activity.'
        },
        {
          id: 'str-uq1-3',
          question: 'How does a Currency Transaction Report (CTR) differ from a Suspicious Transaction Report (STR)?',
          options: [
            'CTRs are only filed by police officers; STRs are filed by customs agents',
            'A CTR is an objective report triggered automatically by cash transactions exceeding statutory thresholds regardless of suspicion, whereas an STR is based on subjective suspicion of financial crime regardless of amount',
            'An STR can only be filed if the transaction is under $1,000',
            'There is no difference; they are interchangeable terms'
          ],
          correctAnswer: 1,
          explanation: 'CTRs are objective cash-volume reports, while STRs are subjective reports generated when reasonable grounds for suspicion exist.'
        },
        {
          id: 'str-uq1-4',
          question: 'What is the primary role of a Level 1 Transaction Monitoring Analyst?',
          options: [
            'Directly arrest suspects at their homes',
            'Review system-generated alerts, discount obvious false positives with documented rationale, and escalate potentially suspicious cases to Level 2 investigators',
            'Issue dividend checks to bank shareholders',
            'Sign loan agreements on behalf of the Board of Directors'
          ],
          correctAnswer: 1,
          explanation: 'Level 1 analysts conduct initial triage, eliminating documented false positives and escalating genuine anomalies for deeper forensic review.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'str-sa-1',
          question: 'Explain why a sudden reactivation of a dormant account followed by rapid international wire transfers is considered a primary money laundering red flag.',
          sampleAnswer: 'Dormant accounts are frequently targeted or bought by money launderers (or corrupt insiders) because they have already cleared historical onboarding KYC. Reactivating them with sudden high-value velocity allows criminals to quickly move illicit proceeds through established banking rails before the institution\'s periodic review catches the anomaly.',
          gradingRubric: 'Candidate must explain that dormant accounts have preexisting KYC credibility and are abused to rapidly pass illicit funds before automated controls trigger refreshed reviews.'
        }
      ]
    },
    {
      id: 'str-u2',
      title: 'Unit 2: Conducting the Forensic AML Investigation',
      description: 'Information gathering, open-source intelligence (OSINT), building transaction timelines, and commercial plausibility.',
      lessons: [
        {
          id: 'str-l7',
          title: 'Lesson 2.1: Assembling the Case File & KYC Profile Review',
          durationMinutes: 18,
          type: 'video',
          summary: 'Comparing transaction reality against expected turnover, declared business activity, and historical counterparty profiles.',
          notes: 'Case Assembly Steps:\n- Retrieve initial KYC profile: Stated turnover, occupation, nature of business, declared beneficiaries.\n- Calculate percentage deviation: Is current turnover 500% higher than declared?\n- Review previous alerts and SAR/STR filings on the customer or connected counterparties.',
          transcript: 'Every investigation begins by contrasting what the customer promised to do versus what they actually did. If a retail boutique declared an annual turnover of $100,000 but receives $1.5 million in international wires within three months, the commercial plausibility is broken.',
          resources: [
            { id: 'str-r5', name: 'Forensic Investigation File Checklist.pdf', size: '1.1 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l8',
          title: 'Lesson 2.2: Reconstructing Transaction Flows & Flow of Funds Visualizations',
          durationMinutes: 20,
          type: 'video',
          summary: 'Mapping debit/credit flows, counterparty relationship link analysis, and identifying circular funds routing.',
          notes: 'Link Analysis Techniques:\n- Tracing funds from origin account through intermediaries to ultimate beneficiary.\n- Detecting circular transfers (funds returning to originating entity via related shell companies).\n- Timeline reconstruction: Correlating deposit dates with immediate outgoing wire timestamps.',
          transcript: 'Visualizing transaction flows reveals criminal schemes that tables of numbers obscure. Mapping counterparties often shows that three seemingly independent companies all share the same authorized signatory or route funds through the same offshore hub.',
          resources: [
            { id: 'str-r6', name: 'Flow of Funds Link Analysis Template.pdf', size: '1.6 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l9',
          title: 'Lesson 2.3: Open Source Intelligence (OSINT) & Corporate Registry Investigations',
          durationMinutes: 18,
          type: 'video',
          summary: 'Investigating corporate registries, adverse media databases, social media footprints, and satellite imagery.',
          notes: 'OSINT Tools for AML:\n- Corporate Registries: Verifying registered office, active status, director filings, and dissolved entities.\n- Adverse Media: News archives, court judgments, insolvency registers.\n- Street View / Satellite Imagery: Verifying physical existence of declared commercial premises (detecting shell addresses).',
          transcript: 'OSINT is an indispensable tool. When a company claims to operate a major import warehouse, an investigator checking satellite mapping and local commercial registries can quickly discover whether the address is a genuine industrial facility or a vacant residential lot.',
          resources: [
            { id: 'str-r7', name: 'OSINT for AML Investigators Manual.pdf', size: '2.4 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l10',
          title: 'Lesson 2.4: Requesting Information (RFI) from Relationship Managers & Clients',
          durationMinutes: 16,
          type: 'video',
          summary: 'Formulating non-tipping-off questions, requesting commercial invoices, contracts, and shipping documents.',
          notes: 'RFI Guidelines:\n- Frame inquiries purely as standard operational or regulatory documentation updates.\n- Demand verifiable third-party documentation: Signed contracts, commercial invoices, customs single administrative documents (SAD).\n- Document evasive, contradictory, or delayed responses from the client.',
          transcript: 'When requesting information, compliance officers must tread carefully. Inquiries must be framed professionally as standard regulatory updates, asking for supporting contracts and invoices without ever hinting that a suspicious report is being prepared.',
          resources: []
        },
        {
          id: 'str-l11',
          title: 'Lesson 2.5: Establishing Economic Rationale & Commercial Plausibility',
          durationMinutes: 16,
          type: 'article',
          summary: 'Evaluating whether transactions make legitimate business sense for the customer’s stated line of commerce.',
          notes: 'Commercial Plausibility Test:\n- Does it make economic sense for a bakery in Victoria to import high-end mining equipment from Eastern Europe?\n- Are pricing and profit margins consistent with industry norms?\n- Is the payment method logical (e.g. why pay large commercial bills via cash deposits across multiple branches)?',
          transcript: 'The ultimate question in any forensic inquiry is economic rationale. Even if documents look pristine, if the transaction makes no commercial sense for that entity in that industry, reasonable grounds for suspicion exist.',
          resources: []
        },
        {
          id: 'str-l12',
          title: 'Lesson 2.6: The Internal Suspicious Activity Report (ISAR) Escalation Package',
          durationMinutes: 15,
          type: 'video',
          summary: 'Structuring the internal escalation memo to the MLRO with executive summary, evidence exhibits, and clear recommendations.',
          notes: 'ISAR Report Components:\n- Executive Summary: Brief synopsis of customer and core anomaly.\n- Background / KYC: Entity profile and stated activity.\n- Transaction Analysis: Timeline, total values, counterparties.\n- Investigative Findings: Inconsistencies, missing documents, OSINT red flags.\n- Recommendation: Formal recommendation to file an STR with the FIU.',
          transcript: 'The investigator presents their findings to the MLRO through an Internal Suspicious Activity Report. This document must be concise, objective, and supported by documentary exhibits, enabling the MLRO to make an informed statutory filing decision.',
          resources: [
            { id: 'str-r8', name: 'Internal SAR Escalation Template.docx', size: '1.2 MB', type: 'doc', url: '#' }
          ]
        }
      ],
      unitQuiz: [
        {
          id: 'str-uq2-1',
          question: 'What is the primary risk an investigator must avoid when issuing a Request for Information (RFI) to a customer whose account is under suspicious investigation?',
          options: [
            'Using overly polite language in the email',
            'Tipping off the customer that an AML investigation or potential STR is underway',
            'Sending the email outside normal business hours',
            'Requesting PDF files instead of paper copies'
          ],
          correctAnswer: 1,
          explanation: 'Investigators must frame RFIs as routine administrative updates to prevent tipping off the customer, which is a criminal offence.'
        },
        {
          id: 'str-uq2-2',
          question: 'How can Open Source Intelligence (OSINT) such as corporate registry searches and satellite mapping assist an AML investigation?',
          options: [
            'By automatically issuing arrest warrants',
            'By verifying whether the customer’s declared business premises physically exist and whether corporate directors and legal filings match KYC declarations',
            'By modifying bank database passwords',
            'By eliminating the need to conduct any KYC verification'
          ],
          correctAnswer: 1,
          explanation: 'OSINT allows investigators to independently corroborate commercial plausibility, physical premises, and corporate filings without alerting the customer.'
        },
        {
          id: 'str-uq2-3',
          question: 'What does the "Commercial Plausibility" test assess during a forensic financial investigation?',
          options: [
            'Whether the bank made a profit on the foreign exchange spread',
            'Whether the transaction makes legitimate economic and commercial sense in light of the customer\'s declared business profile, industry, and normal trade practices',
            'Whether the customer’s website is visually attractive',
            'Whether the transaction occurred on a national holiday'
          ],
          correctAnswer: 1,
          explanation: 'Commercial plausibility evaluates whether transactions represent sensible, economically rational commercial behavior consistent with the client\'s line of business.'
        },
        {
          id: 'str-uq2-4',
          question: 'Who holds the ultimate statutory legal authority within a reporting entity to decide whether to submit a formal STR to the Financial Intelligence Unit?',
          options: [
            'The junior branch cashier who took the cash deposit',
            'The designated Money Laundering Reporting Officer (MLRO)',
            'The client’s personal wealth manager',
            'The IT system administrator'
          ],
          correctAnswer: 1,
          explanation: 'Statutory AML legislation vests the final decision to file an external STR with the designated Money Laundering Reporting Officer (MLRO).'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'str-sa-2',
          question: 'What are the essential components that should be included in an Internal Suspicious Activity Report (ISAR) submitted to the MLRO?',
          sampleAnswer: '1) Customer identification and historical profile baseline; 2) Detailed transactional analysis and chronological timeline showing how activity deviated from normal profile; 3) Investigative findings (OSINT results, counterparty details, outcome of RFI); 4) Specific red flags identified; 5) Clear, objective recommendation on whether an external STR should be filed with the FIU.',
          gradingRubric: 'Candidate must mention customer profile, transaction analysis/timeline, investigative findings/red flags, and a clear filing recommendation to the MLRO.'
        }
      ]
    },
    {
      id: 'str-u3',
      title: 'Unit 3: Drafting Defensible STRs, Interfacing with the FIU & Tipping-Off Protocols',
      description: 'Mastering the 5 Ws and 1 H, drafting pristine regulatory narratives, statutory protections, and anti-tipping-off enforcement.',
      lessons: [
        {
          id: 'str-l13',
          title: 'Lesson 3.1: The Statutory Standard of Suspicion',
          durationMinutes: 16,
          type: 'video',
          summary: 'Subjective suspicion vs. reasonable grounds to suspect, legal precedents, and the threshold for filing.',
          notes: 'Standard of Suspicion:\n- Suspicion requires more than mere speculation, but substantially less than judicial proof.\n- "Reasonable grounds to suspect": An objective assessment that an ordinary, prudent compliance professional would suspect illicit origin.\n- An MLRO does not need to prove the specific predicate crime (e.g. drug trafficking vs. bribery).',
          transcript: 'Under statutory law, you do not need proof beyond a reasonable doubt to file an STR. The standard is "suspicion"—a state of mind where an honest, reasonable professional observes facts that lead them to question the legitimacy of the funds.',
          resources: [
            { id: 'str-r9', name: 'Legal Standards of Suspicion and Jurisprudence.pdf', size: '1.2 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l14',
          title: 'Lesson 3.2: Drafting Defensible STR Narratives — The 5 Ws and 1 H',
          durationMinutes: 22,
          type: 'video',
          summary: 'Mastering Who, What, When, Where, Why, and How in drafting narrative reports for law enforcement intelligence.',
          notes: 'The 5 Ws and 1 H Framework:\n- WHO: Full identification of all transacting parties and beneficiaries.\n- WHAT: Specific monetary instruments, currencies, and transaction volumes.\n- WHEN: Chronological timeline of events.\n- WHERE: Origin and destination accounts, branches, IP addresses, jurisdictions.\n- WHY: Why the activity is suspicious (the explicit red flags and lack of commercial logic).\n- HOW: The method or typology used (structuring, pass-through wires, trade over-invoicing).',
          transcript: 'The narrative is the most vital part of an STR. Law enforcement analysts rely on your narrative to understand the scheme. Applying the 5 Ws and 1 H ensures that your report tells a clear, chronological, and compelling forensic story.',
          resources: [
            { id: 'str-r10', name: 'STR Narrative Drafting Masterclass Guide.pdf', size: '1.8 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l15',
          title: 'Lesson 3.3: Electronic Filing Portals (goAML) & Attachment Formats',
          durationMinutes: 16,
          type: 'video',
          summary: 'Navigating UNODC goAML portals, schema XML structures, attaching bank statements, and file nomenclature.',
          notes: 'goAML Platform Standards:\n- UNODC goAML system adopted by financial intelligence units globally, including Seychelles.\n- Formatting XML data payloads, uploading bank statements, contracts, and KYC files.\n- Maintaining secure audit copies of all submissions.',
          transcript: 'The goAML platform developed by the UNODC is the global standard for electronic STR filing. Compliance teams must know how to properly structure goAML data fields and format evidentiary attachments for seamless FIU ingestion.',
          resources: [
            { id: 'str-r11', name: 'goAML Filing Guide and Technical Specifications.pdf', size: '2.5 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l16',
          title: 'Lesson 3.4: Post-Filing Management: Account Monitoring, Restrictions & Defensive Exits',
          durationMinutes: 18,
          type: 'video',
          summary: 'Operating an account post-STR, FIU non-intervention orders, defensive exit timelines, and closing protocols.',
          notes: 'Post-Filing Obligations:\n- Filing an STR does NOT automatically authorize or require closing the account immediately.\n- Consult with the FIU: Immediate closure might tip off the subject or disrupt an active covert police operation.\n- If continuing the relationship is untenable, execute a carefully planned defensive exit after consultation.',
          transcript: 'What happens after you file an STR? You do not immediately close the account! Doing so could tip off the subject and ruin an active international police surveillance operation. You must place the account on heightened monitoring and coordinate with the FIU.',
          resources: []
        },
        {
          id: 'str-l17',
          title: 'Lesson 3.5: Absolute Prohibition of Tipping Off & Whistleblower Protections',
          durationMinutes: 18,
          type: 'video',
          summary: 'Statutory criminal liabilities, internal code-words, handling court production orders, and statutory safe harbor.',
          notes: 'Tipping-Off Safeguards:\n- Strict criminal offence to inform the customer or unauthorized colleagues that an STR was filed.\n- Internal communications must be strictly restricted to need-to-know staff.\n- Safe Harbor: Full legal immunity protects reporting entities and staff from civil breach-of-confidentiality lawsuits when filing in good faith.',
          transcript: 'Tipping off is one of the most severely punished offences in financial crime law. Telling a client that their wire is delayed because compliance filed an STR can land you in prison. Furthermore, the law grants absolute safe harbor immunity to employees reporting in good faith.',
          resources: [
            { id: 'str-r12', name: 'Anti-Tipping-Off Compliance Handbook.pdf', size: '1.3 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'str-l18',
          title: 'Lesson 3.6: Interfacing with Law Enforcement & Responding to FIU Directives',
          durationMinutes: 16,
          type: 'article',
          summary: 'Section 28 information requests, court restraint orders, witness statements, and trial testimony.',
          notes: 'Law Enforcement Collaboration:\n- FIU Section 28 requests carry statutory compel powers.\n- Preserving original physical evidence and authenticated digital logs.\n- Testifying as a compliance witness in financial crime trials.',
          transcript: 'When the FIU analyzes your STR and forwards it to law enforcement, compliance officers may receive statutory production directives or court restraint orders. Compliance officers must maintain meticulous records to provide credible, defensible court testimony.',
          resources: []
        },
        {
          id: 'str-l19',
          title: 'Lesson 3.7: Capstone Review — Solving the Le Petit Bureau Case Study',
          durationMinutes: 20,
          type: 'video',
          summary: 'Comprehensive analysis of the bureau de change scenario, drafting the complete STR narrative to the FIU.',
          notes: 'Case Study Key Takeaways:\n- Cash smurfing red flags: 3 × SCR 950,000 deposits within 48 hours.\n- Inconsistent turnover: 500% jump over baseline.\n- Immediate wire velocity to Dubai logistics firm.\n- Evasive refusal to identify VIP client: Classic grounds for immediate STR.',
          transcript: 'In this capstone lesson, we bring all forensic concepts together to analyze Le Petit Bureau and draft a regulatory-grade STR narrative that demonstrates peak professional competence.',
          resources: [
            { id: 'str-r13', name: 'Le Petit Bureau Complete Case Solution & STR Sample.pdf', size: '2.2 MB', type: 'pdf', url: '#' }
          ]
        }
      ],
      unitQuiz: [
        {
          id: 'str-uq3-1',
          question: 'What is the primary function of the "Narrative" section in a formal Suspicious Transaction Report (STR)?',
          options: [
            'To list the company\'s marketing slogans',
            'To tell a clear, chronological, and forensic story incorporating the 5 Ws and 1 H, explaining why the activity is anomalous and suspicious',
            'To explain the bank’s profit margin on the account',
            'To request a tax refund from the Ministry of Finance'
          ],
          correctAnswer: 1,
          explanation: 'The narrative explains the context, chronology, participants, and explicit reasons for suspicion, giving intelligence analysts the full investigative picture.'
        },
        {
          id: 'str-uq3-2',
          question: 'Does an MLRO need to know or prove the specific underlying predicate offence (e.g., whether it was drug trafficking, tax fraud, or bribery) before filing an STR?',
          options: [
            'Yes, without a formal criminal indictment the MLRO cannot file',
            'No, the law requires only "suspicion" or "reasonable grounds to suspect" that the funds represent proceeds of crime, without requiring proof of the exact predicate crime',
            'Only if the amount is over $1,000,000',
            'Yes, the customer must first sign a confession'
          ],
          correctAnswer: 1,
          explanation: 'The statutory standard of suspicion does not require establishing the exact predicate crime; reasonable grounds to suspect illicit proceeds suffice.'
        },
        {
          id: 'str-uq3-3',
          question: 'Immediately after submitting an STR to the FIU, what should the financial institution generally do regarding the customer’s account?',
          options: [
            'Immediately close the account and return all funds in cash to the client at the counter',
            'Place the account on heightened internal monitoring, avoid tipping off the customer, and consult with the FIU before taking precipitous exit actions that could disrupt ongoing police operations',
            'Call the local media to announce the investigation',
            'Email the customer a copy of the completed STR form'
          ],
          correctAnswer: 1,
          explanation: 'Institutions should monitor the account and liaise with the FIU to avoid precipitous closures that could tip off the client or disrupt law enforcement operations.'
        },
        {
          id: 'str-uq3-4',
          question: 'What legal protection do compliance officers and reporting entities enjoy under statutory "Safe Harbor" provisions when submitting an STR in good faith?',
          options: [
            'Protection against criminal and civil liability for breach of banking secrecy or client confidentiality',
            'Free maritime insurance on commercial cargo',
            'A 100% tax credit on executive bonuses',
            'Immunity from paying employee social security taxes'
          ],
          correctAnswer: 0,
          explanation: 'Safe harbor clauses protect reporting entities and employees from civil or criminal liability for disclosing confidential client information in good faith to the FIU.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'str-sa-3',
          question: 'In the Le Petit Bureau case study, identify the key facts that should be highlighted in the "WHY" section of the STR narrative to the Seychelles FIU.',
          sampleAnswer: '1) Sudden 500% surge in cash volume far exceeding historical turnover; 2) Cash deposits structured in three installments of SCR 950,000 within 48 hours by different third parties; 3) Immediate pass-through velocity with funds wired to an unrelated Dubai entity with vague "consultancy" references; 4) The director\'s refusal to provide the identity of the underlying beneficial transactor.',
          gradingRubric: 'Candidate must highlight: turnover spike, structured deposits by third parties, immediate pass-through wire velocity, and director\'s refusal to reveal the underlying transactor.'
        }
      ]
    }
  ],
  finalExam: [
    {
      id: 'str-fe-1',
      question: 'What is the primary purpose of an automated Transaction Monitoring System (TMS)?',
      options: [
        'To process payroll checks faster for commercial clients',
        'To continuously analyze transactional behavior against historical profiles and typologies to identify potentially anomalous or suspicious financial activity',
        'To automatically file personal income tax returns',
        'To replace all human bank tellers with automated machines'
      ],
      correctAnswer: 1,
      explanation: 'A TMS automatically detects transactional anomalies, behavioral deviations, and typologies indicating potential financial crime.'
    },
    {
      id: 'str-fe-2',
      question: 'What is "Structuring" (or smurfing) in the context of transaction monitoring?',
      options: [
        'Designing architectural blueprints for bank branch offices',
        'Conducting multiple transactions deliberately kept below statutory cash reporting thresholds to avoid triggering regulatory reporting',
        'Investing in structured corporate debt securities',
        'Consolidating small loans into a single commercial mortgage'
      ],
      correctAnswer: 1,
      explanation: 'Structuring is breaking large financial transactions into smaller amounts below mandatory reporting thresholds to evade detection.'
    },
    {
      id: 'str-fe-3',
      question: 'Which of the following is a classic indicator of a "Pass-Through" or "Funnel" account?',
      options: [
        'A retirement savings account with scheduled monthly interest accumulation',
        'Substantial credits from varied sources immediately followed by rapid, matching outgoing wires or withdrawals, maintaining near-zero retained balance',
        'A fixed-term 5-year deposit with no withdrawal permissions',
        'An account used solely for local municipal property tax payments'
      ],
      correctAnswer: 1,
      explanation: 'Pass-through accounts exhibit rapid in-and-out velocity with minimal retained balances, serving purely as layering conduits.'
    },
    {
      id: 'str-fe-4',
      question: 'What is the legal standard of suspicion required for filing a Suspicious Transaction Report under international AML conventions?',
      options: [
        'Proof beyond all reasonable doubt',
        'A formal confession signed by the suspect',
        'Reasonable grounds to suspect or actual suspicion that the transaction involves proceeds of criminal activity',
        'A civil court judgment in favor of the plaintiff'
      ],
      correctAnswer: 2,
      explanation: 'The standard for filing an STR is reasonable grounds to suspect—it does not require judicial proof.'
    },
    {
      id: 'str-fe-5',
      question: 'When drafting the narrative of an STR, which six fundamental questions must be answered?',
      options: [
        'Who, What, When, Where, Why, and How',
        'Assets, Liabilities, Equity, Revenue, Expense, and Net Income',
        'Price, Quantity, Delivery, Tariff, Insurance, and Freight',
        'Plaintiff, Defendant, Judge, Jury, Bailiff, and Clerk'
      ],
      correctAnswer: 0,
      explanation: 'Effective STR narratives are structured around the 5 Ws and 1 H: Who, What, When, Where, Why, and How.'
    },
    {
      id: 'str-fe-6',
      question: 'Under anti-money laundering legislation, what constitutes the serious criminal offence of "Tipping Off"?',
      options: [
        'Leaving a 15% gratuity for a restaurant server',
        'Disclosing to the customer or any unauthorized third party that an internal suspicious disclosure or external STR has been filed or an investigation is underway',
        'Failing to balance a cash drawer at the end of the day',
        'Recommending a commercial stock to an investment client'
      ],
      correctAnswer: 1,
      explanation: 'Tipping off is unlawfully informing the customer or unauthorized parties about an internal disclosure, STR filing, or investigation.'
    },
    {
      id: 'str-fe-7',
      question: 'What protection is granted to reporting entities and their staff by statutory "Safe Harbor" provisions?',
      options: [
        'Free maritime docking at national commercial ports',
        'Immunity from civil and criminal liability for breach of confidentiality when reporting suspicious matters in good faith to the FIU',
        'Exemption from paying corporate profit taxes',
        'Automatic approval of all international bank mergers'
      ],
      correctAnswer: 1,
      explanation: 'Safe harbor provisions protect financial institutions and employees from legal liability when submitting good-faith disclosures to the FIU.'
    },
    {
      id: 'str-fe-8',
      question: 'How does an automated Currency Transaction Report (CTR) differ from an STR?',
      options: [
        'CTRs are only filed for foreign tourists, while STRs are for domestic residents',
        'A CTR is an objective report mandated automatically for all cash transactions exceeding a statutory monetary threshold, regardless of suspicion',
        'An STR is an optional survey with no legal force',
        'CTRs are filed with Interpol, while STRs are filed with the World Bank'
      ],
      correctAnswer: 1,
      explanation: 'CTRs are mandatory objective filings based purely on cash transaction thresholds, whereas STRs are based on suspicion of financial crime.'
    },
    {
      id: 'str-fe-9',
      question: 'Why should a financial institution generally NOT close an account immediately upon submitting an STR to the FIU?',
      options: [
        'Because closing the account might tip off the subject and compromise ongoing covert law enforcement surveillance or asset tracking',
        'Because the bank is legally required to keep all accounts open for a minimum of 50 years',
        'Because the bank would lose the monthly account maintenance fee',
        'Because customers have a constitutional right to unlimited banking services'
      ],
      correctAnswer: 0,
      explanation: 'Immediate account closures can alert the suspect to law enforcement interest and undermine active investigations.'
    },
    {
      id: 'str-fe-10',
      question: 'Who within a regulated reporting entity is legally responsible for evaluating internal suspicious activity disclosures and deciding whether to file an external STR with the FIU?',
      options: [
        'The external public relations spokesperson',
        'The designated Money Laundering Reporting Officer (MLRO)',
        'The head of commercial lending',
        'The newest probationary customer service teller'
      ],
      correctAnswer: 1,
      explanation: 'The designated Money Laundering Reporting Officer (MLRO) has ultimate statutory authority to evaluate internal disclosures and submit STRs.'
    }
  ]
};
