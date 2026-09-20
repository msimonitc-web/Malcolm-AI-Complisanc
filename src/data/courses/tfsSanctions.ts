import { Course } from '../../types';

export const tfsSanctionsCourse: Course = {
  id: 'c-5',
  title: 'Targeted Financial Sanctions (TFS), Proliferation Financing & Screening Systems',
  slug: 'tfs-sanctions',
  shortDescription: 'Master UN, OFAC, EU & UK sanctions regimes, Proliferation Financing (PF) under UNSCR 1718/2231, fuzzy screening, and asset freezing protocols.',
  description: 'An advanced operational compliance certification on global economic sanctions and proliferation financing defense. Master the United Nations Security Council regimes, US OFAC extraterritorial reach, EU and UK autonomous sanctions, Proliferation Financing risk assessments, sanctions evasion typologies (dark fleets, transshipment hubs), screening engine calibration, and statutory asset freezing protocols.',
  category: 'Sanctions & Proliferation',
  level: 'Advanced',
  rating: 4.97,
  reviewsCount: 153,
  totalHours: 4.5,
  lessonsCount: 17,
  price: 1500,
  originalPrice: 1750,
  currency: 'SCR',
  tags: ['Targeted Financial Sanctions', 'OFAC', 'Proliferation Financing', 'UNSCR 1718', 'Dark Fleets', 'Sanctions Screening', 'Asset Freezing'],
  featured: true,
  thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000',
  instructor: {
    name: 'CompliSey Regulatory Faculty',
    role: 'Seychelles AML/CFT Specialists',
    company: 'CompliSey Academy',
    avatar: '/cankh-logo.svg',
    bio: 'Independent AML/CFT compliance training academy for Seychelles reporting entities.',
    rating: 4.96,
    studentsCount: 2640,
  },
  modules: [
    {
      id: 'tfs-u1',
      title: 'Unit 1: The Global Sanctions Architecture & Regulatory Regimes',
      description: 'Examining UN Security Council, US OFAC, EU CFSP, UK OFSI regimes, and jurisdictional reach.',
      lessons: [
        {
          id: 'tfs-l1',
          title: 'Lesson 1.1: Foundations of Targeted Financial Sanctions (TFS)',
          durationMinutes: 16,
          type: 'video',
          summary: 'Comprehensive vs. targeted (smart) sanctions, statutory asset freeze mechanisms, and prohibitions.',
          notes: 'TFS Fundamentals:\n- Comprehensive sanctions: Broad embargoes on entire countries or regions (e.g. North Korea, Cuba, Crimea/Donetsk).\n- Targeted (smart) sanctions: Focused on specific designated individuals, entities, commercial vessels, or sectors to minimize humanitarian harm to civilian populations.\n- Asset Freeze: Complete prohibition against transferring, moving, altering, or utilizing funds and economic resources.\n- Prohibition of Making Available: Making any funds or economic assets available directly or indirectly to designated parties is an absolute statutory violation.',
          transcript: 'Welcome to Unit 1. Targeted Financial Sanctions have revolutionized geopolitical enforcement. Rather than imposing blunt nationwide trade embargoes that punish ordinary citizens, modern sanctions target the specific individuals, companies, oligarchs, and maritime vessels that fund human rights violations, nuclear proliferation, and aggression.',
          resources: [
            { id: 'tfs-r1', name: 'Global Sanctions Framework Comparative Guide.pdf', size: '1.4 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l2',
          title: 'Lesson 1.2: United Nations Security Council Sanctions Regimes',
          durationMinutes: 18,
          type: 'video',
          summary: 'UN Charter Chapter VII powers, mandatory compliance for all UN Member States, and UN Sanctions Committees.',
          notes: 'UN Sanctions Architecture:\n- Enacted under Chapter VII of the UN Charter—legally binding on all 193 UN member states.\n- Sanctions Committees maintain specific lists (e.g. 1267 Committee for ISIL/Al-Qaida; 1718 Committee for DPRK).\n- Implementation into domestic law: FATF Recommendation 6 & 7 require domestic implementation "without delay" (within hours).',
          transcript: 'When the UN Security Council issues a resolution under Chapter VII, every member state is legally compelled under international law to implement and enforce the designations. However, the speed of domestic transposition varies, which is why FATF mandates automated real-time mechanisms.',
          resources: [
            { id: 'tfs-r2', name: 'UN Sanctions Lists Operations Manual.pdf', size: '1.1 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l3',
          title: 'Lesson 1.3: US OFAC Regimes & Extraterritorial Jurisdiction',
          durationMinutes: 20,
          type: 'video',
          summary: 'Specially Designated Nationals (SDN) list, US nexus triggers (USD clearing, US persons, US goods), and secondary sanctions.',
          notes: 'OFAC Enforcement Powers:\n- Specially Designated Nationals and Blocked Persons List (SDN List).\n- US Nexus triggers: Transactions denominated in US Dollars clearing through US correspondent accounts; involvement of US citizens/green card holders anywhere in the world; US-origin software or goods.\n- Secondary Sanctions: Authorizes the US Treasury to penalize non-US entities (foreign banks) that engage in significant transactions with sanctioned Russian, Iranian, or North Korean parties, cutting them off from the US financial system.',
          transcript: 'The US Office of Foreign Assets Control (OFAC) wields unparalleled extraterritorial power. Even if a transaction occurs entirely between an Asian trading firm and an offshore entity, if the payment settles in US Dollars via a New York correspondent bank, an immediate US legal nexus is created.',
          resources: [
            { id: 'tfs-r3', name: 'OFAC Compliance and Extraterritorial Reach.pdf', size: '1.8 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l4',
          title: 'Lesson 1.4: European Union & UK OFSI Autonomous Sanctions',
          durationMinutes: 16,
          type: 'video',
          summary: 'EU Common Foreign and Security Policy (CFSP) regulations, UK Sanctions and Anti-Money Laundering Act (SAMLA), and post-Brexit divergence.',
          notes: 'Key EU & UK Rules:\n- EU Regulations have direct effect across all 27 EU member states upon publication in the Official Journal.\n- UK Office of Financial Sanctions Implementation (OFSI) enforces UK autonomous sanctions under SAMLA.\n- Strict civil liability standard in the UK for financial sanctions breaches.\n- Divergence between EU, UK, and US lists requires multi-jurisdictional mapping.',
          transcript: 'Post-Brexit, the UK operates an autonomous sanctions framework through OFSI under SAMLA. While closely aligned with the European Union and the United States, subtle differences in designated entities and ownership thresholds require multi-list screening systems.',
          resources: []
        },
        {
          id: 'tfs-l5',
          title: 'Lesson 1.5: The 50% Ownership & Control Rules Across Regimes',
          durationMinutes: 18,
          type: 'article',
          summary: 'Calculating aggregate ownership under OFAC vs. EU/UK, and the independent "Control" test.',
          notes: '50% Ownership Rule Comparison:\n- OFAC 50% Rule: Any entity owned in the aggregate, directly or indirectly, 50% or more by one or more blocked persons is automatically blocked, even if not named on the SDN list.\n- EU/UK Regime: Covers both Ownership (50% or more) AND Control (the ability to direct corporate affairs, appoint board majorities, or exercise dominant influence).\n- Aggregation: OFAC aggregates shareholdings of multiple SDNs; EU historically assessed individual shareholdings unless joint control is proven.',
          transcript: 'A designated person rarely holds assets under their own name. Under OFAC’s 50% rule, if Sanctioned Person A owns 25% and Sanctioned Person B owns 25% of Company Z, Company Z is automatically blocked. In the EU and UK, if a sanctioned person exercises control—even with a 10% shareholding—the entity is subject to asset freezes.',
          resources: [
            { id: 'tfs-r4', name: '50 Percent Rule and Control Test Guidance.pdf', size: '1.2 MB', type: 'pdf', url: '#' }
          ]
        }
      ],
      unitQuiz: [
        {
          id: 'tfs-uq1-1',
          question: 'What constitutes an immediate "US Nexus" for sanctions enforcement by the US Office of Foreign Assets Control (OFAC)?',
          options: [
            'Only transactions that take place physically on US sovereign territory',
            'Any transaction that involves US persons, US-origin goods or software, or settles in US Dollars through a US correspondent clearing bank',
            'Any transaction where the customer speaks English',
            'Only transactions involving US government treasury bonds'
          ],
          correctAnswer: 1,
          explanation: 'OFAC jurisdiction is triggered by any US person involvement, US-origin goods, or foreign transactions clearing through the US financial system (including USD SWIFT wires).'
        },
        {
          id: 'tfs-uq1-2',
          question: 'Under the US OFAC "50% Rule", if Sanctioned Person X owns 30% of Company A, and Sanctioned Person Y owns 25% of Company A, is Company A considered blocked?',
          options: [
            'No, because neither person individually owns more than 50%',
            'Yes, because OFAC aggregates the ownership interests of all blocked persons (30% + 25% = 55%), which equals or exceeds 50%',
            'Only if Company A operates in the oil sector',
            'No, because Company A is not individually named on the SDN list'
          ],
          correctAnswer: 1,
          explanation: 'Under OFAC rules, the property and interests in property of entities owned in the aggregate, directly or indirectly, 50 percent or more by one or more blocked persons are blocked, regardless of whether the entity itself is listed.'
        },
        {
          id: 'tfs-uq1-3',
          question: 'Under FATF Recommendations 6 and 7, what is the mandatory standard for freezing assets subject to UN Targeted Financial Sanctions?',
          options: [
            'Within 90 business days of gazetting',
            'Without delay (ideally within hours) and without prior notice to the designated person',
            'Only after a jury trial in the national supreme court',
            'At the start of the next fiscal quarter'
          ],
          correctAnswer: 1,
          explanation: 'Targeted financial sanctions require asset freezing "without delay"—interpreted as within hours—and without prior notice to prevent dissipation or asset flight.'
        },
        {
          id: 'tfs-uq1-4',
          question: 'What is the primary difference between the UK/EU sanctions "Control" test and the standard 50% ownership calculation?',
          options: [
            'The control test only applies to passenger airlines',
            'An entity may be deemed sanctioned under the control test even if the designated person owns less than 50%, provided they exercise dominant operational influence or the power to appoint directors',
            'The control test permits designated persons to withdraw unlimited cash',
            'The EU and UK have abolished the 50% rule entirely'
          ],
          correctAnswer: 1,
          explanation: 'Under EU and UK regimes, if a designated person exercises de facto control or governance authority over an entity, it is subject to sanctions even if the equity shareholding is well below 50%.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'tfs-sa-1',
          question: 'Explain how "Secondary Sanctions" applied by the United States differ from "Primary Sanctions".',
          sampleAnswer: 'Primary sanctions apply where there is a direct jurisdictional connection (US nexus) to the United States (e.g., US citizens, US companies, US Dollar clearing, or US territory). Secondary sanctions target non-US persons and non-US companies operating completely outside US jurisdiction who engage in significant economic transactions with sanctioned entities (such as targeted Russian or Iranian sectors). The penalty is not a direct domestic fine, but the exclusion of the foreign company from the US financial system and access to US correspondent banking.',
          gradingRubric: 'Candidate must explain that primary sanctions require a US nexus, while secondary sanctions punish foreign actors without a US nexus by cutting them off from US banking/markets.'
        }
      ]
    },
    {
      id: 'tfs-u2',
      title: 'Unit 2: Proliferation Financing (PF) Controls & Dual-Use Evasion',
      description: 'FATF Recommendation 7, UNSCR 1718 (DPRK), UNSCR 2231 (Iran), dual-use goods, and maritime shipping evasion.',
      lessons: [
        {
          id: 'tfs-l6',
          title: 'Lesson 2.1: Foundations of Proliferation Financing (PF) under FATF Recommendation 7',
          durationMinutes: 18,
          type: 'video',
          summary: 'The statutory definition of proliferation financing: weapons of mass destruction (nuclear, chemical, biological) and delivery systems.',
          notes: 'PF Definitions:\n- Act of providing funds or financial services which are used for the manufacture, acquisition, possession, development, export, or transshipment of nuclear, chemical, or biological weapons and their means of delivery.\n- FATF Recommendation 7: Targeted financial sanctions related to proliferation.\n- Strict compliance with UNSCR 1718 (DPRK) and UNSCR 2231 (Iran).',
          transcript: 'Proliferation Financing is the financial lifeblood of weapons of mass destruction. Under FATF Recommendation 7, reporting entities must enforce targeted financial sanctions to freeze assets of designated proliferators and sever funding for illicit nuclear and ballistic missile programs.',
          resources: [
            { id: 'tfs-r5', name: 'FATF Guidance on Counter Proliferation Financing.pdf', size: '2.5 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l7',
          title: 'Lesson 2.2: Dual-Use Goods & Technical Evasion Typologies',
          durationMinutes: 18,
          type: 'video',
          summary: 'Identifying dual-use items (pumps, carbon fiber, CNC machinery), Harmonized System (HS) codes, and false descriptions.',
          notes: 'Dual-Use Goods Challenges:\n- Items having legitimate commercial civilian applications as well as military/nuclear applications (e.g. specialized maraging steel, vacuum pumps, telemetry sensors).\n- Exporters use vague cargo descriptions on bills of lading ("metal tubes", "machine parts") to avoid triggering dual-use export control screens.\n- Compliance teams must cross-reference Harmonized System (HS) customs codes against military/dual-use control lists.',
          transcript: 'Proliferators rarely declare nuclear components. They disguise illicit procurement using dual-use goods—materials like carbon fiber or precision valves that have routine industrial uses but are critical for uranium enrichment centrifuges. Detecting PF requires scrutinizing trade finance documentation and HS codes.',
          resources: [
            { id: 'tfs-r6', name: 'Dual-Use Goods Identification and HS Code Mapping.pdf', size: '1.9 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l8',
          title: 'Lesson 2.3: Maritime Sanctions Evasion: Dark Fleets, AIS Spoofing & Flag Hopping',
          durationMinutes: 20,
          type: 'video',
          summary: 'Shadow maritime logistics: turning off AIS transponders, ship-to-ship (STS) cargo transfers, and fraudulent vessel registries.',
          notes: 'Maritime Sanctions Evasion Typologies:\n- Dark Fleet: Aging tankers operating under obscure corporate ownership to transport sanctioned crude oil.\n- AIS Disablement / Spoofing: Manipulating Automatic Identification System signals to fake vessel locations while loading cargo in prohibited ports.\n- Ship-to-Ship (STS) Transfers: Offloading sanctioned oil or commodities in international waters to mask origin.\n- Flag Hopping: Rapidly switching maritime flag registries to evade enforcement.',
          transcript: 'Over 80% of proliferation evasion occurs on the high seas. Sanctioned states deploy dark fleets of aging tankers that turn off their AIS transponders, conduct covert ship-to-ship oil transfers at midnight, and use complex shell companies to mask vessel ownership.',
          resources: [
            { id: 'tfs-r7', name: 'Maritime Sanctions Red Flags and Vessel Tracking.pdf', size: '2.2 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l9',
          title: 'Lesson 2.4: Transshipment Hubs, Front Companies & Trade Corridors',
          durationMinutes: 16,
          type: 'video',
          summary: 'Exploiting free trade zones, intermediary logistics hubs, and third-party country re-exporters.',
          notes: 'Transshipment Hub Vulnerabilities:\n- Goods shipped from Europe or US to third-party neutral jurisdictions (UAE, Turkey, Central Asian states) with ultimate diversion to sanctioned destinations.\n- Consignee on bill of lading listed as a freight forwarder or logistics company rather than end-user.\n- Omission of end-user certificates (EUCs).',
          transcript: 'Proliferation procurement networks rely on transshipment corridors. A dual-use microchip is legally exported to an electronics distributor in a transit hub, only to be re-packaged and forwarded across the border to a prohibited military research institute.',
          resources: []
        },
        {
          id: 'tfs-l10',
          title: 'Lesson 2.5: Institutional Proliferation Financing Risk Assessments (PFRA)',
          durationMinutes: 15,
          type: 'article',
          summary: 'FATF Recommendation 1 mandatory PF risk assessments, identifying institutional exposure, and mitigating controls.',
          notes: 'PFRA Core Elements:\n- Identifying customer base exposure to trade finance, maritime shipping, aerospace, and advanced manufacturing.\n- Screening trade documents against dual-use lists.\n- Enhanced scrutiny of customers operating in known transshipment jurisdictions.',
          transcript: 'Following updates to FATF Recommendation 1, financial institutions and DNFBPs must conduct an institutional Proliferation Financing Risk Assessment. Entities must identify their inherent exposure to proliferation vectors and implement specialized trade screening controls.',
          resources: [
            { id: 'tfs-r8', name: 'Institutional PFRA Methodology Template.pdf', size: '1.5 MB', type: 'pdf', url: '#' }
          ]
        }
      ],
      unitQuiz: [
        {
          id: 'tfs-uq2-1',
          question: 'What defines a "Dual-Use" good in the context of Proliferation Financing and export controls?',
          options: [
            'Goods that can be paid for in either fiat currency or cryptocurrency',
            'Commercial items, software, and technologies that have civilian industrial uses but can also be adapted for nuclear, chemical, or biological weapons development',
            'Vessels that carry both dry grain and crude oil simultaneously',
            'Consumer goods manufactured in more than two countries'
          ],
          correctAnswer: 1,
          explanation: 'Dual-use items are commercial products (such as precision machine tools, high-grade chemicals, or sensors) that have legitimate commercial uses but can also be used in weapons of mass destruction.'
        },
        {
          id: 'tfs-uq2-2',
          question: 'What is "AIS Spoofing" in maritime sanctions evasion?',
          options: [
            'Painting the vessel a different color while in drydock',
            'Manipulating or broadcasting false Automatic Identification System data to deceive satellite tracking regarding a vessel\'s true coordinates and port calls',
            'Refusing to pay maritime harbor mooring fees',
            'Hiring foreign maritime crew members'
          ],
          correctAnswer: 1,
          explanation: 'AIS spoofing involves intentionally transmitting fraudulent GPS coordinates so satellite monitors believe a vessel is in open water when it is actually docking in a sanctioned port.'
        },
        {
          id: 'tfs-uq2-3',
          question: 'Under FATF Recommendation 7, what specific United Nations Security Council Resolutions (UNSCRs) must financial institutions enforce targeted financial sanctions against?',
          options: [
            'UNSCR 1718 (DPRK) and UNSCR 2231 (Iran)',
            'UNSCR 242 and UNSCR 338',
            'UNSCR 1973 (Libya) and UNSCR 1559 (Lebanon)',
            'UNSCR 1441 (Iraq)'
          ],
          correctAnswer: 0,
          explanation: 'FATF Recommendation 7 strictly mandates targeted financial sanctions compliance relating to the prevention of proliferation financing under UNSCR 1718 (North Korea) and UNSCR 2231 (Iran).'
        },
        {
          id: 'tfs-uq2-4',
          question: 'Why are Ship-to-Ship (STS) cargo transfers in international waters considered a major sanctions evasion red flag?',
          options: [
            'Because maritime law bans all cargo transfers at sea',
            'Because they are frequently used to obscure the origin of sanctioned petroleum or minerals by transferring cargo between dark fleet vessels outside sovereign port surveillance',
            'Because they increase shipping insurance costs',
            'Because they require the payment of double port customs duties'
          ],
          correctAnswer: 1,
          explanation: 'Covert ship-to-ship transfers allow illicit cargo from sanctioned states (such as Iranian or Russian crude oil) to be blended and transferred onto unsanctioned vessels, masking the true origin.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'tfs-sa-2',
          question: 'Name three red flags in international trade finance documentation that indicate potential Proliferation Financing or sanctions evasion.',
          sampleAnswer: '1) Vague or generic descriptions of goods on commercial invoices and bills of lading (e.g., "electronic parts", "industrial machinery") without technical specifications or HS codes; 2) Discrepancies between the declared value of the goods and market prices, or circuitous shipping routes passing through known transshipment hubs; 3) The ultimate consignee or freight forwarder shares an address with previously listed sanctioned entities or appears to have no genuine physical warehouse facilities.',
          gradingRubric: 'Candidate must provide three valid red flags: vague descriptions/missing HS codes, circuitous routing/transshipment hubs, inconsistent pricing, or front company/freight forwarder anomalies.'
        }
      ]
    },
    {
      id: 'tfs-u3',
      title: 'Unit 3: Screening System Tuning, Alert Adjudication & Statutory Freezing Workflows',
      description: 'Screening algorithms, fuzzy matching logic, false positive discount protocols, and emergency freezing.',
      lessons: [
        {
          id: 'tfs-l11',
          title: 'Lesson 3.1: Screening Engine Calibration & Fuzzy Logic Mechanics',
          durationMinutes: 18,
          type: 'video',
          summary: 'Jaro-Winkler, Levenshtein distance, phonetic algorithms (Soundex, Metaphone), and threshold calibration.',
          notes: 'Screening Algorithms:\n- Levenshtein Distance: Counts character additions, deletions, or substitutions required to match strings.\n- Jaro-Winkler: Favors common prefixes; highly effective for name matching.\n- Tuning: Setting match threshold too low (e.g. 70%) generates overwhelming false positives; setting too high (e.g. 95%) risks false negatives (sanctions breaches).',
          transcript: 'Sanctions screening software relies on mathematical string comparison algorithms. Compliance managers must understand algorithm behavior—tuning match thresholds is a delicate balance between drowning analysts in false positive alerts and allowing a terrorist alias to slip through undetected.',
          resources: [
            { id: 'tfs-r9', name: 'Screening Algorithm Calibration Guide.pdf', size: '1.4 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l12',
          title: 'Lesson 3.2: Transaction Screening vs. Customer Database (Batch) Screening',
          durationMinutes: 16,
          type: 'video',
          summary: 'Real-time payment filtering (SWIFT, SEPA, ACH) vs. daily nocturnal batch screening of customer master data.',
          notes: 'Screening Modalities:\n- Real-Time Transaction Screening: Intercepts messages in flight; payment is blocked in millisecond queues before funds leave the institution.\n- Batch Screening: Daily/overnight delta screening of entire customer base against updated watchlists.\n- Sanctions list updates: UN, OFAC, and EU lists update frequently without fixed schedules.',
          transcript: 'Financial institutions must operate dual screening architectures. Real-time screening intercepts wire transfers before execution, while batch screening sweeps customer files, directors, and beneficial owners every evening against newly gazetted designations.',
          resources: []
        },
        {
          id: 'tfs-l13',
          title: 'Lesson 3.3: Systematic Alert Adjudication & False Positive Discounting',
          durationMinutes: 20,
          type: 'video',
          summary: 'Secondary identifier validation (DOB, nationality, passport, address), audit trails, and defensible discounts.',
          notes: 'Alert Resolution Standards:\n- Secondary Identifiers: Match against Date of Birth, Nationality, Place of Birth, Passport Number, and Location.\n- Documenting discounts: Never click "clear" without recording why the alert is discounted.\n- Strict prohibition on assumptions: If secondary data is missing, hold the payment and request information from the sending bank.',
          transcript: 'Alert adjudication is a forensic process. When an alert fires on a common name like "Mohammed Ali", the analyst cannot discount it based on intuition. They must verify secondary identifiers like birth date and nationality, recording a clear audit trail.',
          resources: [
            { id: 'tfs-r10', name: 'Standard Operating Procedure for Alert Adjudication.pdf', size: '1.3 MB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l14',
          title: 'Lesson 3.4: True Match Confirmation & Emergency Freezing Workflows',
          durationMinutes: 18,
          type: 'video',
          summary: 'Step-by-step statutory freezing: blocking debits/credits, segregated frozen accounts, and notifying regulators.',
          notes: 'Statutory Freezing Steps:\n1. Confirmation: MLRO and executive confirm true positive match.\n2. Asset Freeze: Immediately lock account/funds; transfer to a segregated interest-bearing blocked funds ledger.\n3. Zero Communication with Customer: Do not inform customer in advance.\n4. Regulatory Notification: File formal freezing return with FIU and Sanctions Authority within statutory deadline (typically within 24 hours).',
          transcript: 'When a true match is confirmed, immediate administrative freezing takes effect. The funds must be placed in a segregated, frozen ledger account where no debits, fees, or transfers can occur. A formal freezing disclosure must be lodged with the national sanctions authority.',
          resources: [
            { id: 'tfs-r11', name: 'Statutory Freezing Protocol and Return Form.pdf', size: '980 KB', type: 'pdf', url: '#' }
          ]
        },
        {
          id: 'tfs-l15',
          title: 'Lesson 3.5: Handling Delisting Requests, Name Confusion & Unfreezing Orders',
          durationMinutes: 15,
          type: 'video',
          summary: 'UN Ombudsperson procedures, unfreezing assets upon official gazetting, and correcting mistaken identity freezes.',
          notes: 'Unfreezing Protocols:\n- Assets may ONLY be unfrozen upon formal notification by the competent national authority or publication in the official gazette.\n- UN Office of the Ombudsperson handles delisting petitions under UNSCR 1267.\n- Mistaken identity procedures: Expedited verification mechanism for innocent individuals sharing names with terrorists.',
          transcript: 'Freezing an asset without authorization is illegal; unfreezing an asset without an official government order is equally disastrous. Institutions must maintain strict protocols for releasing frozen funds only upon receiving authenticated regulatory directives.',
          resources: []
        },
        {
          id: 'tfs-l16',
          title: 'Lesson 3.6: Sanctions Evasion Techniques: Circumvention, Resellers & Cut-Outs',
          durationMinutes: 16,
          type: 'video',
          summary: 'Corporate layering, escrow accounts, third-party payment processors, and alternative currencies.',
          notes: 'Circumvention Tactics:\n- Using un-sanctioned corporate cut-outs and family members.\n- Splitting payments across non-sanctioned regional banks.\n- Barter and precious metals settlements.',
          transcript: 'Sanctions evasion is an evolving cat-and-mouse game. As soon as a target is listed, networks transfer assets to pre-positioned shell companies, establish accounts in non-aligned jurisdictions, and route funds through unmonitored fintech rails.',
          resources: []
        },
        {
          id: 'tfs-l17',
          title: 'Lesson 3.7: Regulatory Enforcement Case Studies & Multi-Billion Dollar Penalties',
          durationMinutes: 18,
          type: 'article',
          summary: 'Forensic review of major historical sanctions enforcement actions against global banks for wire stripping and evasion.',
          notes: 'Historical Lessons:\n- BNP Paribas ($8.9B penalty for Sudan, Iran, Cuba sanctions violations).\n- Standard Chartered, ING, and HSBC deferred prosecution agreements.\n- Personal liability, regulatory monitorships, and remediation programs.',
          transcript: 'Examining historical regulatory enforcement demonstrates that sanctions failures are among the most catastrophic risks in banking. Multi-billion dollar fines, deferred prosecution agreements, and revoked clearing licenses underscore why zero-tolerance controls are paramount.',
          resources: [
            { id: 'tfs-r12', name: 'Major Sanctions Enforcement Actions Compendium.pdf', size: '2.1 MB', type: 'pdf', url: '#' }
          ]
        }
      ],
      unitQuiz: [
        {
          id: 'tfs-uq3-1',
          question: 'What happens when a compliance team sets its screening algorithm’s fuzzy matching threshold too low (e.g. at 60%)?',
          options: [
            'The software will miss almost all true sanctions matches',
            'The volume of false positive alerts will dramatically increase, overwhelming compliance analysts and risking alert fatigue',
            'The computer server will automatically shut down',
            'The institution will be fined by the central bank for insufficient matches'
          ],
          correctAnswer: 1,
          explanation: 'Setting match thresholds too low creates excessive alert noise and massive false positives, which can cause alert fatigue and operational bottlenecks.'
        },
        {
          id: 'tfs-uq3-2',
          question: 'When an automated transaction screening alert fires on an international wire transfer, what must the compliance analyst do before discounting the alert as a false positive?',
          options: [
            'Delete the wire transfer immediately without documenting anything',
            'Compare secondary identifying information (DOB, address, passport/ID, country) against the official sanctions listing and document the rationale for the discount',
            'Ask the beneficiary to pay a cash processing fee',
            'Forward the alert to the local police department via social media'
          ],
          correctAnswer: 1,
          explanation: 'Analysts must compare secondary identifiers against official listing details and maintain a fully documented audit trail justifying the discount.'
        },
        {
          id: 'tfs-uq3-3',
          question: 'Upon confirming a true match against a mandatory United Nations Security Council sanctions list, what is the mandatory immediate action regarding the client\'s funds?',
          options: [
            'Immediately freeze the funds and assets without delay and without prior notice, prohibiting any debits or disbursements',
            'Notify the client and advise them to withdraw the funds in cash within 24 hours',
            'Convert the funds into government infrastructure bonds',
            'Transfer the funds to an offshore bank account in another continent'
          ],
          correctAnswer: 0,
          explanation: 'Confirmed matches require immediate freezing of all assets without delay and without prior notification.'
        },
        {
          id: 'tfs-uq3-4',
          question: 'When may a financial institution unfreeze assets that were previously frozen pursuant to a targeted financial sanctions order?',
          options: [
            'Whenever the customer provides a letter of good character from their employer',
            'Only upon receiving official written confirmation, unfreezing directives, or delisting notices from the competent national authority or official gazette',
            'After 6 months have passed with no court trial',
            'Whenever the compliance officer leaves the institution'
          ],
          correctAnswer: 1,
          explanation: 'Assets may only be unfrozen pursuant to official instructions, gazetting, or formal authorization from the competent national sanctions authority.'
        }
      ],
      shortAnswerQuestions: [
        {
          id: 'tfs-sa-3',
          question: 'Describe the operational procedure for managing and segregating funds that have been frozen under a statutory Targeted Financial Sanctions order.',
          sampleAnswer: '1) Place an immediate electronic block on the client account preventing debits, withdrawals, wire transfers, and collateral pledges; 2) Transfer or designate the funds into a segregated, blocked interest-bearing account; 3) Ensure no management fees or unauthorized debits are subtracted from the principal; 4) Submit a formal freezing return report to the national sanctions authority / FIU detailing the exact balance and asset inventory.',
          gradingRubric: 'Candidate must mention blocking debits/withdrawals, holding funds in a segregated blocked ledger, prohibiting unauthorized fee deductions, and filing a formal freezing return.'
        }
      ]
    }
  ],
  finalExam: [
    {
      id: 'tfs-fe-1',
      question: 'What is the fundamental difference between comprehensive sanctions and targeted financial sanctions?',
      options: [
        'Comprehensive sanctions target specific corporate individuals; targeted sanctions embargo entire continents',
        'Comprehensive sanctions impose broad economic and trade embargoes against an entire geographic territory, while targeted sanctions focus on designated individuals, entities, sectors, or vessels',
        'Targeted sanctions apply only during wartime, while comprehensive sanctions apply during peace',
        'There is no difference in international law'
      ],
      correctAnswer: 1,
      explanation: 'Comprehensive sanctions target whole countries or regions, whereas targeted sanctions focus on specific designated persons, organizations, or sectors.'
    },
    {
      id: 'tfs-fe-2',
      question: 'Under Chapter VII of the UN Charter, what is the legal effect of United Nations Security Council sanctions resolutions on UN Member States?',
      options: [
        'They are voluntary advisory guidelines with no binding force',
        'They are legally binding upon all UN Member States, who must implement them into national legislation without delay',
        'They only apply to the permanent five members of the Security Council',
        'They expire automatically after 30 days'
      ],
      correctAnswer: 1,
      explanation: 'UN Security Council resolutions enacted under Chapter VII are legally binding on all UN Member States.'
    },
    {
      id: 'tfs-fe-3',
      question: 'What is the primary trigger of US OFAC extraterritorial jurisdiction over non-US banks?',
      options: [
        'Transactions denominated in US Dollars that clear through the US financial system (correspondent clearing)',
        'The use of personal computers running US operating systems',
        'Employing staff who have traveled to the United States on tourist visas',
        'Operating an office in a country that imports US agricultural goods'
      ],
      correctAnswer: 0,
      explanation: 'Clearing transactions in US Dollars through US correspondent banks creates a US jurisdictional nexus, subjecting foreign banks to OFAC enforcement.'
    },
    {
      id: 'tfs-fe-4',
      question: 'Under the US OFAC 50% Rule, if a non-sanctioned foreign company is owned 50% by an individual listed on the OFAC SDN list, what is the status of that company?',
      options: [
        'It is considered fully blocked by operation of law, even if it is not specifically named on the SDN list',
        'It is exempt from sanctions until an administrative hearing takes place',
        'Only 50% of each invoice payment is blocked',
        'It is permitted to conduct transactions if it pays a licensing fee'
      ],
      correctAnswer: 0,
      explanation: 'Under OFAC’s 50% Rule, an entity owned 50% or more by one or more blocked persons is automatically blocked.'
    },
    {
      id: 'tfs-fe-5',
      question: 'Under FATF Recommendation 7, targeted financial sanctions must be implemented without delay to combat which global threat?',
      options: [
        'Maritime piracy in international waters',
        'Proliferation of weapons of mass destruction and their financing',
        'Environmental wildlife trafficking',
        'Cross-border copyright infringement'
      ],
      correctAnswer: 1,
      explanation: 'FATF Recommendation 7 is dedicated to Targeted Financial Sanctions related to Proliferation Financing.'
    },
    {
      id: 'tfs-fe-6',
      question: 'What is "AIS Disablement / Spoofing" when utilized by shadow or dark fleet maritime vessels?',
      options: [
        'Disabling radar to save vessel electrical power',
        'Deactivating or broadcasting false Automatic Identification System signals to mask unauthorized port calls in sanctioned jurisdictions',
        'Refusing to carry maritime distress radio equipment',
        'Painting over the vessel’s registration name'
      ],
      correctAnswer: 1,
      explanation: 'Deactivating or spoofing AIS transponders hides illegal port calls and clandestine cargo operations in sanctioned waters.'
    },
    {
      id: 'tfs-fe-7',
      question: 'What is the primary risk associated with "Dual-Use" goods in international trade finance?',
      options: [
        'They are subject to double customs tariffs at import terminals',
        'They can be used for both legitimate civilian industrial applications and the proliferation of nuclear, chemical, or biological weapons',
        'They can only be transported on electric cargo ships',
        'They expire within 30 days of shipment'
      ],
      correctAnswer: 1,
      explanation: 'Dual-use items possess legitimate commercial utility but can also be adapted for weapons of mass destruction proliferation.'
    },
    {
      id: 'tfs-fe-8',
      question: 'What is the illegal practice known as "Wire Stripping" in sanctions compliance?',
      options: [
        'Removing or altering identifying information (such as names, addresses, or BIC codes) from payment instructions to prevent sanctions screening software from detecting a match',
        'Extracting raw copper wire from telecommunications networks',
        'Canceling a pending wire payment within 10 minutes of entry',
        'Encoding wire messages in foreign languages'
      ],
      correctAnswer: 0,
      explanation: 'Wire stripping is the deliberate removal of transaction data to evade screening filters, which is a major criminal violation.'
    },
    {
      id: 'tfs-fe-9',
      question: 'What is the standard of liability applied in the United Kingdom by OFSI for civil monetary penalties for financial sanctions breaches?',
      options: [
        'Strict liability (proof of knowledge or reasonable cause to suspect is not required to establish a breach for monetary penalties)',
        'Proof beyond a reasonable doubt of criminal intent',
        'Gross negligence only',
        'Liability only if the breach exceeds £100,000,000'
      ],
      correctAnswer: 0,
      explanation: 'The UK Economic Crime (Transparency and Enforcement) Act 2022 established a strict civil liability standard for sanctions breaches.'
    },
    {
      id: 'tfs-fe-10',
      question: 'How must a financial institution respond if an existing account holder is named on a new UN Security Council targeted sanctions list?',
      options: [
        'Inform the customer by registered letter and allow 14 days to transfer assets out',
        'Immediately freeze all funds and economic resources without prior notice and notify the national competent authority and FIU',
        'Deduct an administrative fine of 20% and leave the account open',
        'Wait until the customer visits a branch'
      ],
      correctAnswer: 1,
      explanation: 'The institution must freeze all assets without delay and without prior notice, immediately reporting the action to authorities.'
    }
  ]
};
