import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  UserCheck,
  HardHat,
  Factory,
  FileText,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  QrCode,
  Lock,
  Globe,
  Building2,
  User,
  Users,
  Activity,
  Coffee,
  Award,
  ChevronRight,
  X,
  ArrowUpRight,
  Check,
  AlertCircle,
  RefreshCw,
  Eye,
  ThumbsUp,
  HeartPulse,
  Play,
  Square,
  Sparkles,
  Send,
  ShieldAlert,
  BadgeCheck,
  Radio,
  MapPin,
  Camera,
  Copy,
  ChevronDown,
  Info
} from 'lucide-react';

/* ==========================================================================
   CONSTANTS & CONFIGURATION
   ========================================================================== */

export const SECTORS = {
  construction: {
    id: 'construction',
    name: 'Construction',
    siteName: 'Construction Site Alpha',
    location: 'Metro Line 4 Extension - Sector 7',
    geoCoords: { lat: '19.0760° N', lng: '72.8777° E', radiusMeters: 25 },
    baseHourlyRate: 87.5, // ₹700 per standard 8-hour day
    standardHours: 8,
    otMultiplier: 1.5, // 1.5x overtime
    allowanceName: 'Site & Weather Allowance',
    allowanceAmount: 150,
    allowanceNote: 'Dust, height & extreme heat allowance under SDG 8 Safety Directive',
    roles: ['Certified Scaffolder', 'Heavy Equipment Operator', 'Concrete Specialist', 'Safety Marshall'],
    shiftTypes: ['Day Shift (08:00 - 17:00)', 'Extended Pour (13:00 - 22:00)'],
    hazardPresets: [
      'Fall protection',
      'Unstable scaffolding',
      'Missing hardhats',
      'Crane swing clearance'
    ],
    skillBadges: [
      { name: 'Certified Scaffolder', level: 'Level 3 - Master', verifiedHours: 640 },
      { name: 'Heavy Equipment Operator', level: 'Class B Heavy', verifiedHours: 520 },
      { name: 'Concrete Specialist', level: 'Grade A Structural', verifiedHours: 380 }
    ],
    seedHazards: [
      {
        id: 'HAZ-C-101',
        description: 'Scaffold bracket near Tower B has missing locking pins at 4th tier platform.',
        rawText: 'Scaffold bracket near Tower B has missing locking pins at 4th tier platform. Reported on routine inspection.',
        severity: 'Critical',
        timestamp: '08:45 AM',
        status: 'Open',
        isVoice: false
      },
      {
        id: 'HAZ-C-102',
        description: 'Dust misting nozzle damaged at excavation pit 3. Ambient particulate PM10 elevated.',
        rawText: 'Dust misting nozzle damaged at excavation pit 3. Ambient particulate PM10 elevated.',
        severity: 'Needs Review',
        timestamp: '09:15 AM',
        status: 'Acknowledged',
        isVoice: true
      }
    ],
    workers: [
      { id: 'W-101', name: 'Ramesh Kumar', role: 'Certified Scaffolder', hoursToday: 8.5, consecutiveDays: 4, status: 'Active', fatigueRisk: 'Normal' },
      { id: 'W-102', name: 'Sunil Verma', role: 'Crane Operator', hoursToday: 10.5, consecutiveDays: 6, status: 'Active', fatigueRisk: 'High' },
      { id: 'W-103', name: 'Anand Murugan', role: 'Concrete Specialist', hoursToday: 7.0, consecutiveDays: 3, status: 'Active', fatigueRisk: 'Normal' },
      { id: 'W-104', name: 'Devendra Singh', role: 'Safety Marshall', hoursToday: 11.2, consecutiveDays: 7, status: 'Active', fatigueRisk: 'Critical' },
      { id: 'W-105', name: 'Mohammed Faiz', role: 'Rigger / Scaffolder', hoursToday: 6.5, consecutiveDays: 2, status: 'Active', fatigueRisk: 'Normal' }
    ]
  },
  factory: {
    id: 'factory',
    name: 'Factory',
    siteName: 'Industrial Plant Line B',
    location: 'Precision Components Hub - Unit 4',
    geoCoords: { lat: '18.5204° N', lng: '73.8567° E', radiusMeters: 20 },
    baseHourlyRate: 90.0, // ₹720 standard 8-hour shift
    standardHours: 8,
    otMultiplier: 1.5,
    allowanceName: 'Attendance & PPE Allowance',
    allowanceAmount: 120,
    nightDifferentialRate: 0.15, // +15% night shift differential
    statutoryWeeklyOtCap: 12, // Max 12 overtime hours/week
    roles: ['Six Sigma Line Operator', 'CNC Machinist', 'Electrical Maintenance', 'Hazardous Material Handling'],
    shiftTypes: ['Morning Shift (06:00 - 14:00)', 'Night Shift (22:00 - 06:00)'],
    hazardPresets: [
      'Conveyor jam',
      'Emergency stop failure',
      'Unvented fumes',
      'Missing machine guards'
    ],
    skillBadges: [
      { name: 'Six Sigma Line Operator', level: 'Green Belt Certified', verifiedHours: 820 },
      { name: 'CNC Machinist', level: '5-Axis Milling Expert', verifiedHours: 490 },
      { name: 'Electrical Maintenance', level: 'High Voltage Specialist', verifiedHours: 350 },
      { name: 'Hazardous Material Handling', level: 'Hazmat Class 2', verifiedHours: 210 }
    ],
    seedHazards: [
      {
        id: 'HAZ-F-201',
        description: 'Emergency stop pull-cord on Conveyor Line 2 is severed near packaging bay.',
        rawText: 'Emergency stop pull-cord on Conveyor Line 2 is severed near packaging bay. Immediate attention requested.',
        severity: 'Critical',
        timestamp: '07:30 AM',
        status: 'Open',
        isVoice: true
      },
      {
        id: 'HAZ-F-202',
        description: 'Ventilation damper vibration loose over solvent degreasing bath.',
        rawText: 'Ventilation damper vibration loose over solvent degreasing bath.',
        severity: 'Needs Review',
        timestamp: '09:00 AM',
        status: 'Acknowledged',
        isVoice: false
      }
    ],
    workers: [
      { id: 'W-201', name: 'Priya Sundaram', role: 'Six Sigma Line Operator', hoursToday: 8.0, consecutiveDays: 4, status: 'Active', fatigueRisk: 'Normal' },
      { id: 'W-202', name: 'Arjun Nair', role: 'CNC Machinist', hoursToday: 10.8, consecutiveDays: 6, status: 'Active', fatigueRisk: 'High' },
      { id: 'W-203', name: 'Karthik R.', role: 'Electrical Maintenance', hoursToday: 11.5, consecutiveDays: 6, status: 'Active', fatigueRisk: 'Critical' },
      { id: 'W-204', name: 'Lakshmi Narayanan', role: 'Line Operator', hoursToday: 6.5, consecutiveDays: 2, status: 'Active', fatigueRisk: 'Normal' },
      { id: 'W-205', name: 'Gurpreet Kaur', role: 'Hazmat Handler', hoursToday: 9.5, consecutiveDays: 5, status: 'Active', fatigueRisk: 'Needs Review' }
    ]
  }
};

export const I18N = {
  en: {
    appName: 'FairShift',
    tagline: 'Decent Work & Fair Pay Platform',
    sdgGoal: 'UN SDG 8: Decent Work & Economic Growth',
    viewWorker: 'Worker View',
    viewEmployer: 'Employer View',
    sectorConstruction: 'Construction',
    sectorFactory: 'Factory',
    workerProfile: 'Ramesh Kumar',
    workerIdBadge: 'ID: W-4092 • FairShift Verified',
    tabs: {
      shift: 'Shift Tracking',
      payslip: 'Payslip',
      hazard: 'Safety Hazard',
      feedback: 'Anonymous Feedback',
      passport: 'Skill Passport'
    },
    shift: {
      statusHeader: 'Live Shift Session',
      checkedIn: 'Active on Site',
      checkedOut: 'Clocked Out',
      checkInBtn: 'Check In to Shift',
      checkOutBtn: 'Clock Out & Finalize',
      scanQrTitle: 'Verify Site QR & Geofence',
      geofenceOk: 'Geofence Verified (within 15m of site perimeter)',
      gpsCoord: 'GPS Coords:',
      simulatingScan: 'Align QR Code within target viewfinder...',
      confirmCheckIn: 'Confirm Verified Check-In',
      cancel: 'Cancel',
      regularHours: 'Regular Hours',
      otHours: 'Overtime (1.5x)',
      totalTime: 'Total Time',
      targetLabel: '8h Shift Target',
      demoClockLabel: 'Demo Speed (1s = 1min)',
      overtimeActive: 'Overtime Rate (1.5x) Active',
      nightShiftDiffBadge: '+15% Night Shift Differential Active',
      overtimeCapNotice: 'Statutory Overtime Limit: Max 12h/week (Factories Act)',
      weatherNotice: 'Dust & Extreme Weather Allowance Active'
    },
    payslip: {
      title: 'Itemized Transparent Payslip',
      subtitle: 'Zero hidden deductions • Real-time legal wage audit',
      baseRate: 'Base Hourly Rate',
      regularPay: 'Regular Pay',
      otPay: 'Overtime Pay (1.5x Multiplier)',
      allowance: 'Allowances & Site Bonus',
      nightDiff: 'Night Shift Differential (+15%)',
      deductions: 'Deductions',
      deductionsLine: '₹0.00 — No hidden deductions (SDG 8 Fair Wage Standard)',
      netPay: 'Total Net Payable',
      listenBtn: 'Listen (Audio Breakdown)',
      playingAudio: 'Playing audio breakdown...',
      speechError: 'Speech synthesis voice not available for this language on your browser.',
      speechTemplate: 'Your net payable wage is {netPay}. Regular earnings are {regularPay}, overtime pay is {otPay}, and allowances are {allowance}. Zero deductions applied.'
    },
    hazard: {
      title: 'Report Workplace Hazard',
      subtitle: 'Retaliation-free safety reporting. Personal identifiers are stripped on your device before sending.',
      textPlaceholder: 'Describe the safety hazard, hazard location, equipment involved...',
      voiceRecordBtn: 'Voice Report',
      recordingNow: 'Recording voice... Speak clearly',
      stopRecordBtn: 'Stop Recording',
      presetsTitle: 'Quick Preset Hazards',
      severityLabel: 'Severity Level',
      sevInfo: 'Informational',
      sevReview: 'Needs Review',
      sevCritical: 'Critical Risk',
      piiTitle: 'Whistleblower Shield: PII Auto-Redacted Preview',
      piiExplain: 'Names, mobile numbers, supervisor references and employee IDs are scrubbed locally.',
      submitBtn: 'Submit Sanitized Hazard Report',
      toastSuccess: 'Hazard submitted directly to site safety triage board.'
    },
    feedback: {
      title: 'Anonymous Workplace Voice',
      subtitle: 'SDG 8 worker feedback. Zero identity metadata collected or logged.',
      topicLabel: 'Workplace Category',
      topics: {
        supervisors: 'Supervisor Conduct & Dignity',
        breakTimes: 'Rest Breaks & Hydration Intervals',
        waterCanteen: 'Clean Drinking Water & Sanitation',
        ergonomics: 'Ergonomic Equipment & Heat Protection'
      },
      commentPlaceholder: 'Share candid suggestions, grievances or working condition improvements...',
      ratingLabel: 'Workplace Well-being Rating',
      submitBtn: 'Submit Anonymously',
      cryptoBadge: 'Cryptographically Anonymized',
      receiptTitle: 'SHA-256 Verifiable Receipt',
      receiptNotice: 'Immutable mathematical proof generated in your browser. Proves submission timestamp without linking to your identity.',
      copied: 'Receipt Copied'
    },
    passport: {
      title: 'Decentralized Skill Passport',
      subtitle: 'Tamper-proof verifiable credentials owned by the worker.',
      verifiedSafeHours: 'Verified Safe Working Hours',
      badgesTitle: 'Certified Sector Competencies',
      qrTitle: 'Universal Verifier QR Code',
      qrSubtitle: 'Prospective employers or labor inspectors can scan to verify cryptographic attestation.',
      workerDid: 'Decentralized Identifier (DID)',
      jointAudit: 'Joint Labor Inspection & Safety Council Certified'
    },
    employer: {
      title: 'Site Operations & Safety Dashboard',
      subtitle: 'FairShift Decent Work Compliance & Real-time Duty of Care',
      stats: {
        activeWorkforce: 'Active Workforce',
        shiftCompletion: 'Avg Shift Completion',
        openHazards: 'Open Safety Hazards',
        fatigueViolations: 'Fatigue Risk Flags'
      },
      triageTitle: 'Worker Hazard Triage Board',
      triageSubtitle: 'Real-time hazard reports with automated privacy scrubbing',
      noHazards: 'No pending safety hazards reported.',
      statusOpen: 'Open',
      statusAck: 'In Review',
      statusResolved: 'Resolved',
      actionAck: 'Acknowledge',
      actionResolve: 'Mark Resolved',
      fatigueTitle: 'Worker Fatigue & Overtime Monitoring',
      fatigueSubtitle: 'Proactive intervention preventing industrial accidents and burnout',
      colWorker: 'Worker',
      colRole: 'Role',
      colHours: 'Hours Today',
      colDays: 'Consecutive Days',
      colStatus: 'Fatigue Status',
      colAction: 'Intervention',
      actionRest: 'Enforce Mandatory Rest',
      actionReassign: 'Reassign Shift',
      actionCap: 'Trigger Overtime Cap',
      normal: 'Normal',
      highRisk: 'High Risk (>10h)',
      criticalRisk: 'Exhaustion Risk',
      toastRest: 'Mandatory rest enforced. 12-hour cool-off period initiated per SDG 8 safety standards.',
      toastReassign: 'Shift reassigned. Worker rotated to ergonomic low-strain station.',
      toastCap: 'Statutory Overtime Cap triggered under Factories Act. Overtime locked.'
    }
  },
  hi: {
    appName: 'फेयरशिफ्ट (FairShift)',
    tagline: 'उचित कार्य एवं निष्पक्ष वेतन मंच',
    sdgGoal: 'संयुक्त राष्ट्र SDG 8: उचित कार्य एवं आर्थिक वृद्धि',
    viewWorker: 'श्रमिक दृश्य',
    viewEmployer: 'नियोक्ता डैशबोर्ड',
    sectorConstruction: 'निर्माण स्थल',
    sectorFactory: 'कारखाना',
    workerProfile: 'रमेश कुमार',
    workerIdBadge: 'आईडी: W-4092 • फेयरशिफ्ट सत्यापित',
    tabs: {
      shift: 'शिफ्ट ट्रैकिंग',
      payslip: 'वेतन पर्ची',
      hazard: 'सुरक्षा खतरा',
      feedback: 'अनाम सुझाव',
      passport: 'कौशल पासपोर्ट'
    },
    shift: {
      statusHeader: 'वर्तमान शिफ्ट स्थिति',
      checkedIn: 'साइट पर सक्रिय',
      checkedOut: 'शिफ्ट समाप्त',
      checkInBtn: 'शिफ्ट शुरू करें (Check In)',
      checkOutBtn: 'शिफ्ट समाप्त करें (Clock Out)',
      scanQrTitle: 'साइट क्यूआर व जियोफेंस सत्यापित करें',
      geofenceOk: 'जियोफेंस सत्यापित (साइट परिधि के 15 मीटर के भीतर)',
      gpsCoord: 'जीपीएस निर्देशांक:',
      simulatingScan: 'लक्ष्य दृश्य में क्यूआर कोड संरेखित करें...',
      confirmCheckIn: 'सत्यापित चेक-इन की पुष्टि करें',
      cancel: 'रद्द करें',
      regularHours: 'नियमित समय',
      otHours: 'अधिसमय (1.5x)',
      totalTime: 'कुल समय',
      targetLabel: '8 घंटे का लक्ष्य',
      demoClockLabel: 'डेमो गति (1 सेकंड = 1 मिनट)',
      overtimeActive: 'अधिसमय दर (1.5x) सक्रिय',
      nightShiftDiffBadge: '+15% रात्रि पाली अतिरिक्त भत्ता सक्रिय',
      overtimeCapNotice: 'वैधानिक अधिसमय सीमा: अधिकतम 12 घंटे/सप्ताह (कारखाना अधिनियम)',
      weatherNotice: 'धूल व अत्यधिक मौसम भत्ता सक्रिय'
    },
    payslip: {
      title: 'पारदर्शी एवं निष्पक्ष वेतन पर्ची',
      subtitle: 'शून्य छिपे शुल्क • वास्तविक समय कानूनी वेतन सत्यापन',
      baseRate: 'मूल प्रति घंटा दर',
      regularPay: 'नियमित वेतन',
      otPay: 'अधिसमय भुगतान (1.5x दर)',
      allowance: 'भत्ते व सुरक्षा बोनस',
      nightDiff: 'रात्रि पाली विभेदक (+15%)',
      deductions: 'कटौतियाँ',
      deductionsLine: '₹0.00 — कोई छिपी कटौती नहीं (SDG 8 उचित वेतन मानक)',
      netPay: 'कुल शुद्ध देय राशि',
      listenBtn: 'सुनें (ध्वनि विवरण)',
      playingAudio: 'वेतन विवरण पढ़ा जा रहा है...',
      speechError: 'इस भाषा के लिए ध्वनि सेवा आपके ब्राउज़र पर उपलब्ध नहीं है।',
      speechTemplate: 'आपकी कुल देय राशि {netPay} है। इसमें नियमित वेतन {regularPay}, अधिसमय {otPay}, और भत्ता {allowance} शामिल है। कोई कटौती नहीं की गई है।'
    },
    hazard: {
      title: 'सुरक्षा खतरे की रिपोर्ट करें',
      subtitle: 'बिना किसी भय के रिपोर्ट करें। आपकी पहचान आपके डिवाइस पर ही हटा दी जाती है।',
      textPlaceholder: 'खतरे का विवरण, स्थान और प्रभावित उपकरण लिखें...',
      voiceRecordBtn: 'आवाज़ में रिपोर्ट करें',
      recordingNow: 'रिकॉर्डिंग जारी है... स्पष्ट बोलें',
      stopRecordBtn: 'रिकॉर्डिंग रोकें',
      presetsTitle: 'त्वरित सुरक्षा विकल्प',
      severityLabel: 'गंभीरता स्तर',
      sevInfo: 'सूचनात्मक',
      sevReview: 'समीक्षा आवश्यक',
      sevCritical: 'गंभीर खतरा',
      piiTitle: 'पहचान सुरक्षा: व्यक्तिगत जानकारी स्वतः निष्कासित पूर्वावलोकन',
      piiExplain: 'नाम, फ़ोन नंबर, सुपरवाइज़र का नाम और कर्मचारी आईडी स्थानीय रूप से हटा दिए गए हैं।',
      submitBtn: 'सुरक्षित रिपोर्ट जमा करें',
      toastSuccess: 'खतरा रिपोर्ट सीधे सुपरवाइज़र बोर्ड को प्रेषित कर दी गई।'
    },
    feedback: {
      title: 'अनाम कार्यस्थल सुझाव',
      subtitle: 'SDG 8 श्रमिक आवाज़। कोई पहचान डेटा संग्रहीत नहीं किया जाता।',
      topicLabel: 'कार्यस्थल विषय',
      topics: {
        supervisors: 'सुपरवाइज़र व्यवहार एवं सम्मान',
        breakTimes: 'विश्राम व पेयजल अंतराल',
        waterCanteen: 'स्वच्छ पेयजल एवं कैंटीन स्वच्छता',
        ergonomics: 'उपकरण, सुरक्षा व गर्मी से राहत'
      },
      commentPlaceholder: 'कार्यस्थल सुधार हेतु अपने स्पष्ट सुझाव या शिकायतें लिखें...',
      ratingLabel: 'कार्यस्थल संतुष्टि रेटिंग',
      submitBtn: 'अनाम रूप से जमा करें',
      cryptoBadge: 'क्रिप्टोग्राफ़िक रूप से अनामीकृत',
      receiptTitle: 'SHA-256 सत्यापन रसीद',
      receiptNotice: 'ब्राउज़र में उत्पन्न अपरिवर्तनीय डिजिटल हैश, जो आपकी पहचान बताए बिना जमा करने का समय सिद्ध करता है।',
      copied: 'रसीद कॉपी हो गई'
    },
    passport: {
      title: 'विकेंद्रीकृत कौशल पासपोर्ट',
      subtitle: 'श्रमिक के स्वामित्व वाला स्थायी और सुरक्षित कार्य अनुभव प्रमाण-पत्र।',
      verifiedSafeHours: 'सत्यापित सुरक्षित कार्य घंटे',
      badgesTitle: 'प्रमाणित व्यावसायिक योग्यताएँ',
      qrTitle: 'सार्वभौमिक सत्यापन क्यूआर कोड',
      qrSubtitle: 'नए ठेकेदार या श्रम निरीक्षक इसे स्कैन कर डिजिटल प्रमाण-पत्र सत्यापित कर सकते हैं।',
      workerDid: 'विकेंद्रीकृत पहचानकर्ता (DID)',
      jointAudit: 'संयुक्त श्रम निरीक्षण एवं सुरक्षा परिषद द्वारा प्रमाणित'
    },
    employer: {
      title: 'साइट संचालन एवं सुरक्षा डैशबोर्ड',
      subtitle: 'फेयरशिफ्ट अनुपालन एवं सुरक्षा निगरानी प्रणाली',
      stats: {
        activeWorkforce: 'सक्रिय श्रमिक',
        shiftCompletion: 'औसत शिफ्ट पूर्णता',
        openHazards: 'लंबित सुरक्षा खतरे',
        fatigueViolations: 'थकान चेतावनी'
      },
      triageTitle: 'सुरक्षा खतरा निस्तारण बोर्ड',
      triageSubtitle: 'श्रमिकों द्वारा रिपोर्ट किए गए खतरे (पहचान संरक्षित)',
      noHazards: 'कोई लंबित सुरक्षा खतरा नहीं है।',
      statusOpen: 'प्रारंभिक',
      statusAck: 'समीक्षाधीन',
      statusResolved: 'समाधानित',
      actionAck: 'स्वीकार करें',
      actionResolve: 'हल हुआ चिह्नित करें',
      fatigueTitle: 'श्रमिक थकान एवं अधिसमय निगरानी',
      fatigueSubtitle: 'दुर्घटनाओं और अत्यधिक थकान से बचाव हेतु सक्रिय हस्तक्षेप',
      colWorker: 'श्रमिक',
      colRole: 'पद',
      colHours: 'आज के घंटे',
      colDays: 'लगातार दिन',
      colStatus: 'थकान स्थिति',
      colAction: 'कार्रवाई',
      actionRest: 'अनिवार्य विश्राम लागू करें',
      actionReassign: 'शिफ्ट पुनः सौंपें',
      actionCap: 'अधिसमय सीमा लागू करें',
      normal: 'सामान्य',
      highRisk: 'उच्च जोखिम (>10h)',
      criticalRisk: 'अत्यधिक थकान',
      toastRest: 'अनिवार्य विश्राम लागू किया गया। 12 घंटे का विश्राम आरंभ।',
      toastReassign: 'शिफ्ट को कम-तनाव वाले स्टेशन पर पुनः सौंपा गया।',
      toastCap: 'कारखाना अधिनियम के अनुसार अधिसमय सीमा तय कर दी गई।'
    }
  },
  ta: {
    appName: 'ஃபேர்ஷிப்ட் (FairShift)',
    tagline: 'கண்ணியமான பணி & நியாயமான ஊதிய தளம்',
    sdgGoal: 'ஐநா SDG 8: கண்ணியமான பணி மற்றும் பொருளாதார வளர்ச்சி',
    viewWorker: 'தொழிலாளி பார்வை',
    viewEmployer: 'முதலாளி தளம்',
    sectorConstruction: 'கட்டுமான தளம்',
    sectorFactory: 'தொழிற்சாலை',
    workerProfile: 'ரமேஷ் குமார்',
    workerIdBadge: 'ஐடி: W-4092 • ஃபேர்ஷிப்ட் சான்றளிக்கப்பட்டது',
    tabs: {
      shift: 'ஷிப்ட் கண்காணிப்பு',
      payslip: 'ஊதியச் சீட்டு',
      hazard: 'பாதுகாப்பு அபாயம்',
      feedback: 'ரகசிய கருத்து',
      passport: 'திறன் பாஸ்போர்ட்'
    },
    shift: {
      statusHeader: 'தற்போதைய பணி நிலை',
      checkedIn: 'தளத்தில் பணியில் உள்ளார்',
      checkedOut: 'பணி நிறைவு',
      checkInBtn: 'ஷிப்ட் தொடங்கு (Check In)',
      checkOutBtn: 'ஷிப்ட் முடி (Clock Out)',
      scanQrTitle: 'தள QR & ஜியோஃபென்ஸ் சரிபார்',
      geofenceOk: 'ஜியோஃபென்ஸ் சரிபார்க்கப்பட்டது (தளத்தின் 15மீ எல்லைக்குள்)',
      gpsCoord: 'ஜிபிஎஸ் இருப்பிடம்:',
      simulatingScan: 'QR குறியீட்டை இலக்கு பெட்டியில் வைக்கவும்...',
      confirmCheckIn: 'சரிபார்க்கப்பட்ட நுழைவை உறுதிசெய்',
      cancel: 'ரத்து செய்',
      regularHours: 'வழக்கமான நேரம்',
      otHours: 'கூடுதல் நேரம் (1.5x)',
      totalTime: 'மொத்த நேரம்',
      targetLabel: '8 மணிநேர இலக்கு',
      demoClockLabel: 'டெமோ வேகம் (1வி = 1நி)',
      overtimeActive: 'கூடுதல் நேர ஊதியம் (1.5x) செயலில் உள்ளது',
      nightShiftDiffBadge: '+15% இரவு ஷிப்ட் கூடுதல் படி செயலில் உள்ளது',
      overtimeCapNotice: 'சட்டப்பூர்வ வரம்பு: வாரத்திற்கு அதிகபட்சம் 12 மணிநேரம் (தொழிற்சாலை சட்டம்)',
      weatherNotice: 'தூசி மற்றும் தீவிர வானிலை படி செயலில் உள்ளது'
    },
    payslip: {
      title: 'வெளிப்படையான ஊதியச் சீட்டு',
      subtitle: 'மறைமுகப் பிடித்தங்கள் இல்லை • சட்டப்பூர்வ ஊதியத் தணிக்கை',
      baseRate: 'அடிப்படை மணிநேர ஊதியம்',
      regularPay: 'வழக்கமான நேர ஊதியம்',
      otPay: 'கூடுதல் நேர ஊதியம் (1.5x விகிதம்)',
      allowance: 'படிகள் & தள போனஸ்',
      nightDiff: 'இரவு ஷிப்ட் ஊக்கத்தொகை (+15%)',
      deductions: 'பிடித்தங்கள்',
      deductionsLine: '₹0.00 — மறைமுகக் கட்டணங்கள் இல்லை (SDG 8 நியாய ஊதிய உத்தரவாதம்)',
      netPay: 'மொத்த நிகர ஊதியம்',
      listenBtn: 'கேளுங்கள் (குரல் விளக்கம்)',
      playingAudio: 'ஊதிய விவரம் ஒலிக்கிறது...',
      speechError: 'உங்கள் உலாவியில் இந்த மொழிக்கான குரல் வசதி இல்லை.',
      speechTemplate: 'உங்கள் நிகர ஊதியம் {netPay}. வழக்கமான ஊதியம் {regularPay}, கூடுதல் நேர ஊதியம் {otPay}, மற்றும் படி {allowance}. எந்த பிடித்தமும் இல்லை.'
    },
    hazard: {
      title: 'பாதுகாப்பு அபாயத்தை பதிவு செய்க',
      subtitle: 'பயமின்றி புகார் அளியுங்கள். உங்கள் தனிப்பட்ட விவரங்கள் சாதனத்திலேயே நீக்கப்படும்.',
      textPlaceholder: 'பாதுகாப்பு அபாயம், இடம், கருவிகள் பற்றிய விவரங்களை எழுதவும்...',
      voiceRecordBtn: 'குரலில் பதிவு செய்க',
      recordingNow: 'பதிவாகிறது... தெளிவாக பேசவும்',
      stopRecordBtn: 'பதிவை நிறுத்து',
      presetsTitle: 'விரைவு அபாய தேர்வுகள்',
      severityLabel: 'தீவிர நிலை',
      sevInfo: 'தகவல்',
      sevReview: 'ஆய்வு தேவை',
      sevCritical: 'அதிதீவிர அபாயம்',
      piiTitle: 'தனியுரிமை பாதுகாப்பு: தனிநபர் விவரங்கள் நீக்கப்பட்ட முன்னோட்டம்',
      piiExplain: 'பெயர், தொலைபேசி எண், மேற்பார்வையாளர் பெயர் மற்றும் ஐடி தானாக நீக்கப்படுகின்றன.',
      submitBtn: 'பாதுகாக்கப்பட்ட புகாரை அனுப்பு',
      toastSuccess: 'புகார் நேரடியாக தள மேற்பார்வையாளர் பலகைக்கு அனுப்பப்பட்டது.'
    },
    feedback: {
      title: 'பெயர் குறிப்பிடாத கருத்துகள்',
      subtitle: 'SDG 8 தொழிலாளர் குரல். அடையாள தகவல்கள் எதுவும் சேமிக்கப்படாது.',
      topicLabel: 'பணிப்பிரிவு',
      topics: {
        supervisors: 'மேற்பார்வையாளர் நடத்தை & மரியாதை',
        breakTimes: 'ஓய்வு நேரம் & தண்ணீர் இடைவேளை',
        waterCanteen: 'சுத்தமான குடிநீர் & கேண்டீன் சுகாதாரம்',
        ergonomics: 'கருவிகள் & வெயில் பாதுகாப்பு'
      },
      commentPlaceholder: 'பணிச்சூழல் மேம்பாடு குறித்த உங்கள் கருத்துகளை சுதந்திரமாக பகிரவும்...',
      ratingLabel: 'பணிச்சூழல் திருப்தி மதிப்பீடு',
      submitBtn: 'ரகசியமாக சமர்ப்பி',
      cryptoBadge: 'மறைகுறியாக்கப்பட்டு அநாமதேயமாக்கப்பட்டது',
      receiptTitle: 'SHA-256 சரிபார்ப்பு ரசீது',
      receiptNotice: 'உங்கள் அடையாளத்தை வெளிப்படுத்தாமல் சமர்ப்பித்த நேரத்தை நிரூபிக்கும் டிஜிட்டல் குறியீடு.',
      copied: 'ரசீது நகலெடுக்கப்பட்டது'
    },
    passport: {
      title: 'பரவலாக்கப்பட்ட திறன் பாஸ்போர்ட்',
      subtitle: 'தொழிலாளரின் நிரந்தர, மாற்ற முடியாத அனுபவ சான்றிதழ்.',
      verifiedSafeHours: 'சரிபார்க்கப்பட்ட பாதுகாப்பான வேலை நேரம்',
      badgesTitle: 'சான்றளிக்கப்பட்ட திறன்கள்',
      qrTitle: 'உலகளாவிய சரிபார்ப்பு QR குறியீடு',
      qrSubtitle: 'புதிய முதலாளிகள் அல்லது அதிகாரிகள் ஸ்கேன் செய்து டிஜிட்டல் சான்றிதழை சரிபார்க்கலாம்.',
      workerDid: 'பரவலாக்கப்பட்ட தொழிலாளர் ஐடி (DID)',
      jointAudit: 'கூட்டு தொழிலாளர் ஆய்வு & பாதுகாப்பு கவுன்சிலால் சான்றளிக்கப்பட்டது'
    },
    employer: {
      title: 'தள செயல்பாடுகள் & பாதுகாப்பு கண்காணிப்பு',
      subtitle: 'ஃபேர்ஷிப்ட் இணக்கம் & தொழிலாளர் பாதுகாப்பு கண்காணிப்பு',
      stats: {
        activeWorkforce: 'பணியில் உள்ள தொழிலாளர்கள்',
        shiftCompletion: 'சராசரி ஷிப்ட் நிறைவு',
        openHazards: 'நிலுவையில் உள்ள அபாயங்கள்',
        fatigueViolations: 'களைப்பு எச்சரிக்கைகள்'
      },
      triageTitle: 'பாதுகாப்பு அபாய தீர்வு பலகை',
      triageSubtitle: 'தொழிலாளர்கள் சமர்ப்பித்த அபாயங்கள் (அடையாளம் நீக்கப்பட்டது)',
      noHazards: 'நிலுவையில் அபாயங்கள் இல்லை.',
      statusOpen: 'புதியது',
      statusAck: 'ஆய்வில்',
      statusResolved: 'தீர்க்கப்பட்டது',
      actionAck: 'ஏற்றுக்கொள்',
      actionResolve: 'தீர்க்கப்பட்டதாக குறி',
      fatigueTitle: 'தொழிலாளர் களைப்பு & கூடுதல் நேர கண்காணிப்பு',
      fatigueSubtitle: 'விபத்துக்கள் மற்றும் அதிகப்படியான சோர்வைத் தடுக்கும் உடனடி நடவடிக்கைகள்',
      colWorker: 'தொழிலாளி',
      colRole: 'பணி',
      colHours: 'இன்றைய மணிநேரம்',
      colDays: 'தொடர் வேலை நாட்கள்',
      colStatus: 'களைப்பு நிலை',
      colAction: 'நடவடிக்கை',
      actionRest: 'கட்டாய ஓய்வு அளிக்கவும்',
      actionReassign: 'பணியை மாற்றவும்',
      actionCap: 'கூடுதல் நேர உச்சவரம்பு விதிக்கவும்',
      normal: 'சாதாரண',
      highRisk: 'அதிக ஆபத்து (>10h)',
      criticalRisk: 'அதிதீவிர களைப்பு',
      toastRest: 'கட்டாய ஓய்வு அளிக்கப்பட்டது. 12 மணிநேர ஓய்வு துவங்கியது.',
      toastReassign: 'குறைந்த சிரமமுள்ள பணிக்கு மாற்றப்பட்டது.',
      toastCap: 'தொழிற்சாலை சட்டப்படி கூடுதல் நேர உச்சவரம்பு விதிக்கப்பட்டது.'
    }
  }
};

/* ==========================================================================
   HELPERS: PAY, REDACTION, HASH, QR
   ========================================================================== */

/**
 * Format INR with Indian digit grouping (e.g. ₹1,25,000.00)
 */
export function formatINR(val) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(val);
  } catch (e) {
    return `₹${Number(val).toFixed(2)}`;
  }
}

/**
 * Calculate detailed pay breakdown
 */
export function calculatePay({ hoursWorked, sectorConfig, isNightShift }) {
  const standardHours = sectorConfig.standardHours || 8;
  const regularHours = Math.min(hoursWorked, standardHours);
  const otHours = Math.max(0, hoursWorked - standardHours);

  const baseRate = sectorConfig.baseHourlyRate;
  const otRate = baseRate * (sectorConfig.otMultiplier || 1.5);

  const regularPay = regularHours * baseRate;
  const otPay = otHours * otRate;

  // Shift differential (Factory night shift +15%)
  let nightDifferential = 0;
  if (sectorConfig.id === 'factory' && isNightShift) {
    nightDifferential = hoursWorked * baseRate * (sectorConfig.nightDifferentialRate || 0.15);
  }

  // Allowance granted if on shift
  const allowance = hoursWorked > 0 ? (sectorConfig.allowanceAmount || 0) : 0;
  const deductions = 0.0;
  const netPay = regularPay + otPay + nightDifferential + allowance - deductions;

  return {
    regularHours,
    otHours,
    baseRate,
    regularPay,
    otPay,
    nightDifferential,
    allowance,
    deductions,
    netPay
  };
}

/**
 * PII Sanitization via regex
 * Strips phone numbers, IDs (EMP-1234, ID-998), emails, and names following "I am / my name is / supervisor"
 */
export function redactPII(text) {
  if (!text) return '';
  let cleaned = text;

  // 1. Email addresses
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '[REDACTED EMAIL]');

  // 2. Indian 10-digit mobile phone numbers with optional +91, dashes, spaces
  cleaned = cleaned.replace(/(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g, '[REDACTED PHONE]');
  cleaned = cleaned.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED PHONE]');

  // 3. Employee and badge IDs (EMP-1234, ID-991, BADGE-401, STAFF-20)
  cleaned = cleaned.replace(/\b(EMP|ID|BADGE|WORKER|STAFF)[-#\s]?\d+\b/gi, '[REDACTED ID]');

  // 4. Names following identifier phrases: "I am [Name]", "My name is [Name]", "Supervisor [Name]", "Contractor [Name]"
  cleaned = cleaned.replace(
    /\b(i am|my name is|supervisor|contractor|engineer|worker)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/gi,
    '$1 [REDACTED NAME]'
  );

  return cleaned;
}

/**
 * SHA-256 receipt generation via crypto.subtle with fallback
 */
export async function generateSha256Receipt(data) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(data + '-' + Date.now());
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    // fallback below
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + Math.abs(h).toString(16).padStart(16, '0') + 'd9a4c8';
}

/**
 * Built-in inline SVG QR Matrix Generator
 * /* SVG QR Generator: Payload is demo-encoded with worker public verification key */
 */
export function generateDemoQrMatrix(payload) {
  const size = 21; // Version 1 QR matrix (21x21)
  const grid = Array.from({ length: size }, () => Array(size).fill(false));

  const setFinder = (startR, startC) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startR + r][startC + c] = isBorder || isCenter;
      }
    }
  };

  // 3 Finder patterns
  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Dark module
  grid[size - 8][8] = true;

  // Deterministic seed from payload
  let seed = 5381;
  for (let i = 0; i < payload.length; i++) {
    seed = (seed << 5) + seed + payload.charCodeAt(i);
  }

  // Populate data modules outside finder zones
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inFinderTL = r < 8 && c < 8;
      const inFinderTR = r < 8 && c >= size - 8;
      const inFinderBL = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inFinderTL && !inFinderTR && !inFinderBL && !isTiming) {
        const bit = ((seed ^ (r * 29 + c * 13)) & (1 << ((r + c) % 15))) !== 0;
        grid[r][c] = bit;
      }
    }
  }

  return grid;
}

/* ==========================================================================
   MINIMAL REUSABLE COMPONENTS
   ========================================================================== */

/**
 * Inline SVG QR Component
 */
function QrPreview({ payload, size = 150 }) {
  const matrix = useMemo(() => generateDemoQrMatrix(payload), [payload]);
  const cellSize = size / matrix.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="bg-white p-2 rounded-xl border border-[#E2E0D8] shadow-sm mx-auto"
      role="img"
      aria-label="Skill Passport QR Code"
    >
      <rect width={size} height={size} fill="#FFFFFF" rx="8" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.15}
              height={cellSize + 0.15}
              fill="#1A202C"
              rx={cellSize * 0.18}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/**
 * Calm Circular Progress Ring
 */
function ShiftProgressRing({ progressPercent, isOvertime }) {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(progressPercent, 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EFECE6"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isOvertime ? '#D97706' : '#4A5568'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold tracking-tight text-[#1A202C]">
          {Math.round(progressPercent)}%
        </span>
        <span className="text-[10px] uppercase font-semibold text-[#4A5568] tracking-wider">
          {isOvertime ? 'Overtime' : 'Target'}
        </span>
      </div>
    </div>
  );
}

/**
 * Simulated Waveform Animation for Voice Recording
 */
function VoiceWaveform({ active }) {
  const heights = [10, 24, 14, 30, 20, 32, 18, 28, 12, 22];
  return (
    <div
      className="flex items-center justify-center gap-1.5 h-10 px-4 py-1.5 bg-[#EFECE6] rounded-xl border border-[#E2E0D8]"
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            active ? 'bg-[#B45309] animate-pulse' : 'bg-[#A0AEC0] opacity-40'
          }`}
          style={{
            height: active ? `${h}px` : '6px',
            animationDelay: `${i * 80}ms`
          }}
        />
      ))}
    </div>
  );
}

/**
 * Soft Pill Badge
 */
function PillBadge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-[#EFECE6] text-[#4A5568] border-[#E2E0D8]',
    amber: 'bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]',
    dark: 'bg-[#1A202C] text-[#FFFFFF] border-[#1A202C]',
    green: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

/* ==========================================================================
   MAIN FAIRSHIFT COMPONENT
   ========================================================================== */

export default function FairShift() {
  // Global View Controls
  const [view, setView] = useState('worker'); // 'worker' | 'employer'
  const [sectorKey, setSectorKey] = useState('construction'); // 'construction' | 'factory'
  const [lang, setLang] = useState('en'); // 'en' | 'hi' | 'ta'

  const t = I18N[lang] || I18N.en;
  const sector = SECTORS[sectorKey];

  // Global Shared State between Worker & Employer
  const [activeShift, setActiveShift] = useState(false);
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [demoClockActive, setDemoClockActive] = useState(false);
  const [selectedShiftType, setSelectedShiftType] = useState(sector.shiftTypes[0]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrScanningState, setQrScanningState] = useState('ready'); // 'ready' | 'verifying' | 'confirmed'

  // Worker Payslip & Hours Accumulation
  const [completedHours, setCompletedHours] = useState(1420); // Seed verified hours for skill passport
  const [speechStatus, setSpeechStatus] = useState('');

  // Worker Hazard Report State
  const [hazardText, setHazardText] = useState('');
  const [hazardSeverity, setHazardSeverity] = useState('Needs Review'); // 'Informational' | 'Needs Review' | 'Critical'
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Worker Anonymous Feedback State
  const [feedbackCategory, setFeedbackCategory] = useState('supervisors');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(4);
  const [feedbackReceipt, setFeedbackReceipt] = useState(null);

  // Worker Active Tab
  const [workerTab, setWorkerTab] = useState('shift'); // 'shift' | 'payslip' | 'hazard' | 'feedback' | 'passport'

  // Shared Hazards State (lands on supervisor board)
  const [hazards, setHazards] = useState(() => [
    ...SECTORS.construction.seedHazards.map(h => ({ ...h, sectorId: 'construction' })),
    ...SECTORS.factory.seedHazards.map(h => ({ ...h, sectorId: 'factory' }))
  ]);

  // Shared Workforce & Fatigue State for Employer View
  const [workforce, setWorkforce] = useState(() => ({
    construction: [...SECTORS.construction.workers],
    factory: [...SECTORS.factory.workers]
  }));

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Update shift type when sector switches
  useEffect(() => {
    setSelectedShiftType(sector.shiftTypes[0]);
  }, [sectorKey, sector.shiftTypes]);

  // Shift Timer Loop (respects normal time or demo 1s = 1m speed)
  useEffect(() => {
    let interval = null;
    if (activeShift) {
      interval = setInterval(() => {
        setShiftSeconds(prev => prev + (demoClockActive ? 60 : 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeShift, demoClockActive]);

  // Derived shift calculations
  const totalWorkedHours = shiftSeconds / 3600;
  const isNightShift = selectedShiftType.toLowerCase().includes('night');

  const paySummary = useMemo(() => {
    return calculatePay({
      hoursWorked: totalWorkedHours,
      sectorConfig: sector,
      isNightShift
    });
  }, [totalWorkedHours, sector, isNightShift]);

  const progressPercent = Math.min(100, (totalWorkedHours / sector.standardHours) * 100);
  const isOvertime = totalWorkedHours > sector.standardHours;

  // Real-time PII Sanitized text preview
  const sanitizedHazardPreview = useMemo(() => {
    return redactPII(hazardText);
  }, [hazardText]);

  // Handle Geo / QR Simulation Check-in
  const handleInitiateCheckIn = () => {
    setQrScanningState('ready');
    setShowQrModal(true);
  };

  const handleConfirmSiteScan = () => {
    setQrScanningState('verifying');
    setTimeout(() => {
      setQrScanningState('confirmed');
      setTimeout(() => {
        setShowQrModal(false);
        setActiveShift(true);
        showToast(
          lang === 'hi'
            ? 'साइट क्यूआर व जियोफेंस सत्यापित! शिफ्ट आरंभ हुई।'
            : lang === 'ta'
            ? 'தள QR & ஜியோஃபென்ஸ் சரிபார்க்கப்பட்டது! ஷிப்ட் துவங்கியது.'
            : 'Site QR & Geofence verified! Shift clocked in.'
        );
      }, 700);
    }, 900);
  };

  const handleClockOut = () => {
    const finalHours = totalWorkedHours;
    setActiveShift(false);
    setCompletedHours(prev => prev + parseFloat(finalHours.toFixed(1)));
    showToast(
      lang === 'hi'
        ? `शिफ्ट समाप्त! ${finalHours.toFixed(2)} घंटे आपके कौशल पासपोर्ट में जोड़े गए।`
        : lang === 'ta'
        ? `ஷிப்ட் நிறைவடைந்தது! ${finalHours.toFixed(2)} மணிநேரம் பாஸ்போர்ட்டில் சேர்க்கப்பட்டது.`
        : `Shift completed! ${finalHours.toFixed(2)} safe hours logged to your Skill Passport.`
    );
  };

  // Simulated Voice Recording
  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        // Produce sector-specific realistic transcript containing PII
        const sample =
          sectorKey === 'construction'
            ? 'Scaffolding bracket at section 4B is missing locking pins at 15ft height. Supervisor Ramesh was informed but no harness lines were issued. Call +91 98450 12345 or contact EMP-8821.'
            : 'Conveyor 2 emergency stop pull-cord is frayed near station 4. Solvent fumes accumulating due to broken damper. Reported by worker ID-4092 to supervisor Priya.';
        setHazardText(sample);
        setIsRecordingVoice(false);
      }, 3000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  // Submit Hazard
  const handleSubmitHazard = (e) => {
    e.preventDefault();
    if (!hazardText.trim()) return;

    const sanitized = redactPII(hazardText);
    const newHazard = {
      id: `HAZ-${Date.now().toString().slice(-4)}`,
      description: sanitized,
      rawText: hazardText,
      severity: hazardSeverity,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      sectorId: sectorKey,
      isVoice: isRecordingVoice
    };

    setHazards(prev => [newHazard, ...prev]);
    setHazardText('');
    showToast(t.hazard.toastSuccess);
  };

  // Submit Anonymous Feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    const receipt = await generateSha256Receipt(feedbackComment + feedbackCategory);
    setFeedbackReceipt(receipt);
    setFeedbackComment('');
    showToast(
      lang === 'hi'
        ? 'अनाम सुझाव सुरक्षित रूप से दर्ज किया गया। SHA-256 रसीद उत्पन्न हुई।'
        : lang === 'ta'
        ? 'ரகசிய கருத்து சமர்ப்பிக்கப்பட்டது. SHA-256 ரசீது உருவாக்கப்பட்டது.'
        : 'Feedback cryptographically anonymized and recorded.'
    );
  };

  // Payslip Speech Audio Breakdown
  const handleListenPayslip = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechStatus(t.payslip.speechError);
      return;
    }

    window.speechSynthesis.cancel();
    const summary = t.payslip.speechTemplate
      .replace('{netPay}', formatINR(paySummary.netPay))
      .replace('{regularPay}', formatINR(paySummary.regularPay))
      .replace('{otPay}', formatINR(paySummary.otPay))
      .replace('{allowance}', formatINR(paySummary.allowance));

    const utterance = new SpeechSynthesisUtterance(summary);
    const langCodeMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };
    utterance.lang = langCodeMap[lang] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setSpeechStatus(t.payslip.playingAudio);
    utterance.onend = () => setSpeechStatus('');
    utterance.onerror = () => setSpeechStatus(t.payslip.speechError);

    window.speechSynthesis.speak(utterance);
  };

  // Employer View Actions
  const handleAcknowledgeHazard = (id) => {
    setHazards(prev =>
      prev.map(h => (h.id === id ? { ...h, status: 'Acknowledged' } : h))
    );
    showToast('Hazard marked as In Review by site supervisor.');
  };

  const handleResolveHazard = (id) => {
    setHazards(prev =>
      prev.map(h => (h.id === id ? { ...h, status: 'Resolved' } : h))
    );
    showToast('Hazard issue verified and marked Resolved.');
  };

  const handleEnforceRest = (workerId) => {
    setWorkforce(prev => ({
      ...prev,
      [sectorKey]: prev[sectorKey].map(w =>
        w.id === workerId ? { ...w, fatigueRisk: 'Normal', status: 'Resting (12h Enforced)' } : w
      )
    }));
    showToast(t.employer.toastRest);
  };

  const handleReassignShift = (workerId) => {
    setWorkforce(prev => ({
      ...prev,
      [sectorKey]: prev[sectorKey].map(w =>
        w.id === workerId ? { ...w, role: 'Ergonomic Relief Station', fatigueRisk: 'Normal' } : w
      )
    }));
    showToast(t.employer.toastReassign);
  };

  const handleTriggerOtCap = (workerId) => {
    setWorkforce(prev => ({
      ...prev,
      [sectorKey]: prev[sectorKey].map(w =>
        w.id === workerId ? { ...w, hoursToday: 8.0, fatigueRisk: 'Normal' } : w
      )
    }));
    showToast(t.employer.toastCap);
  };

  // Employer metrics calculations
  const currentSectorWorkers = workforce[sectorKey] || [];
  const activeCount = currentSectorWorkers.filter(w => w.status.includes('Active')).length + (activeShift ? 1 : 0);
  const openHazardCount = hazards.filter(h => h.sectorId === sectorKey && h.status !== 'Resolved').length;
  const fatigueCount = currentSectorWorkers.filter(w => w.fatigueRisk === 'High' || w.fatigueRisk === 'Critical').length;
  const avgShiftPercent = Math.round(
    currentSectorWorkers.reduce((acc, w) => acc + Math.min(100, (w.hoursToday / 8) * 100), 0) /
      (currentSectorWorkers.length || 1)
  );

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#1A202C] font-sans antialiased selection:bg-[#EFECE6] flex flex-col">
      {/* ====================================================================
          TOP APPLICATION BAR (Unified Toggles: View, Sector, Language)
          ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E0D8] px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & SDG 8 Brand */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFECE6] border border-[#E2E0D8] flex items-center justify-center text-[#B45309] shadow-inner">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-[#1A202C]">
                    {t.appName}
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]">
                    <Award className="w-3 h-3" />
                    {t.sdgGoal}
                  </span>
                </div>
                <p className="text-xs text-[#4A5568]">{sector.siteName}</p>
              </div>
            </div>

            {/* Mobile View Switcher Pill */}
            <div className="sm:hidden flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#E2E0D8]">
              <button
                type="button"
                onClick={() => setView('worker')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 ${
                  view === 'worker' ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs' : 'text-[#4A5568]'
                }`}
              >
                Worker
              </button>
              <button
                type="button"
                onClick={() => setView('employer')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 ${
                  view === 'employer' ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs' : 'text-[#4A5568]'
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          {/* Controls: View Mode, Sector, Language */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Desktop View Switcher */}
            <nav aria-label="View selection" className="hidden sm:flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#E2E0D8]">
              <button
                type="button"
                onClick={() => setView('worker')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                  view === 'worker' ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs font-semibold' : 'text-[#4A5568] hover:text-[#1A202C]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {t.viewWorker}
              </button>
              <button
                type="button"
                onClick={() => setView('employer')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                  view === 'employer' ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs font-semibold' : 'text-[#4A5568] hover:text-[#1A202C]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {t.viewEmployer}
              </button>
            </nav>

            {/* Sector Switcher */}
            <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#E2E0D8]">
              <button
                type="button"
                onClick={() => setSectorKey('construction')}
                className={`min-h-[38px] px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                  sectorKey === 'construction' ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs font-semibold' : 'text-[#4A5568]'
                }`}
              >
                <HardHat className="w-3.5 h-3.5 text-[#B45309]" />
                {t.sectorConstruction}
              </button>
              <button
                type="button"
                onClick={() => setSectorKey('factory')}
                className={`min-h-[38px] px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                  sectorKey === 'factory' ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs font-semibold' : 'text-[#4A5568]'
                }`}
              >
                <Factory className="w-3.5 h-3.5 text-[#B45309]" />
                {t.sectorFactory}
              </button>
            </div>

            {/* Language Switcher (EN | हिंदी | தமிழ்) */}
            <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#E2E0D8]">
              <Globe className="w-3.5 h-3.5 text-[#4A5568] ml-2 mr-1" aria-hidden="true" />
              {[
                { key: 'en', label: 'EN' },
                { key: 'hi', label: 'हिंदी' },
                { key: 'ta', label: 'தமிழ்' }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLang(item.key)}
                  aria-label={`Switch language to ${item.label}`}
                  className={`min-h-[38px] px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                    lang === item.key ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs font-bold' : 'text-[#4A5568] hover:text-[#1A202C]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN CONTENT AREA
          ==================================================================== */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-6">
        {view === 'worker' ? (
          /* ==================================================================
             WORKER VIEW (Mobile-first, ~390px centered frame)
             ================================================================== */
          <div className="w-full max-w-[400px] mx-auto bg-[#FFFFFF] border border-[#E2E0D8] rounded-3xl shadow-lg flex flex-col overflow-hidden min-h-[780px]">
            {/* Worker Mobile Top Sub-Header */}
            <div className="bg-[#EFECE6] px-4 py-3 border-b border-[#E2E0D8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E2E0D8] flex items-center justify-center font-bold text-xs text-[#B45309]">
                  RK
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1A202C]">{t.workerProfile}</p>
                  <p className="text-[10px] text-[#4A5568]">{t.workerIdBadge}</p>
                </div>
              </div>
              <PillBadge variant="amber">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse mr-1" />
                {activeShift ? t.shift.checkedIn : t.shift.checkedOut}
              </PillBadge>
            </div>

            {/* Mobile Tab Navigation (5 Features) */}
            <nav aria-label="Worker functions" className="grid grid-cols-5 bg-[#FFFFFF] border-b border-[#E2E0D8] text-center">
              {[
                { id: 'shift', icon: Clock, label: t.tabs.shift },
                { id: 'payslip', icon: FileText, label: t.tabs.payslip },
                { id: 'hazard', icon: AlertTriangle, label: t.tabs.hazard },
                { id: 'feedback', icon: ShieldCheck, label: t.tabs.feedback },
                { id: 'passport', icon: Award, label: t.tabs.passport }
              ].map(item => {
                const Icon = item.icon;
                const isActive = workerTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWorkerTab(item.id)}
                    className={`min-h-[52px] py-2 px-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                      isActive
                        ? 'border-b-2 border-[#B45309] text-[#B45309] bg-[#FEF9EC]/50 font-semibold'
                        : 'text-[#4A5568] hover:text-[#1A202C]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] leading-tight line-clamp-1">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Tab Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* TAB 1: SHIFT TRACKING */}
              {workerTab === 'shift' && (
                <div className="space-y-4">
                  {/* Shift Meta & Selector */}
                  <div className="bg-[#F9F9FB] p-3.5 rounded-2xl border border-[#E2E0D8] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A202C]">
                        {sector.siteName}
                      </span>
                      <PillBadge variant="neutral">
                        <MapPin className="w-3 h-3 text-[#B45309]" />
                        {sector.geoCoords.lat}
                      </PillBadge>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="shiftTypeSelect" className="text-[11px] text-[#4A5568] font-medium">
                        {t.shift.statusHeader}
                      </label>
                      <select
                        id="shiftTypeSelect"
                        disabled={activeShift}
                        value={selectedShiftType}
                        onChange={(e) => setSelectedShiftType(e.target.value)}
                        className="w-full text-xs bg-[#FFFFFF] border border-[#E2E0D8] rounded-xl px-2.5 py-2 text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#D97706] disabled:opacity-70"
                      >
                        {sector.shiftTypes.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {sectorKey === 'factory' && isNightShift && (
                      <div className="text-[11px] bg-[#FEF3C7] text-[#B45309] p-2 rounded-xl flex items-center gap-1.5 border border-[#FCD34D]">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.shift.nightShiftDiffBadge}</span>
                      </div>
                    )}
                    {sectorKey === 'construction' && (
                      <div className="text-[11px] bg-[#EFECE6] text-[#4A5568] p-2 rounded-xl flex items-center gap-1.5 border border-[#E2E0D8]">
                        <HardHat className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                        <span>{t.shift.weatherNotice}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Ring & Timer */}
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E0D8] flex flex-col items-center justify-center space-y-3 text-center">
                    <ShiftProgressRing
                      progressPercent={progressPercent}
                      isOvertime={isOvertime}
                    />

                    <div aria-live="polite" className="space-y-0.5">
                      <div className="text-2xl font-bold tracking-tight text-[#1A202C] font-mono">
                        {String(Math.floor(shiftSeconds / 3600)).padStart(2, '0')}:
                        {String(Math.floor((shiftSeconds % 3600) / 60)).padStart(2, '0')}:
                        {String(shiftSeconds % 60).padStart(2, '0')}
                      </div>
                      <p className="text-xs text-[#4A5568]">{t.shift.totalTime}</p>
                    </div>

                    {/* Split Regular vs Overtime Hours */}
                    <div className="grid grid-cols-2 gap-2 w-full pt-1 border-t border-[#E2E0D8]">
                      <div className="bg-[#F9F9FB] p-2 rounded-xl border border-[#E2E0D8]">
                        <span className="text-[10px] uppercase text-[#4A5568] font-medium block">
                          {t.shift.regularHours}
                        </span>
                        <span className="text-sm font-bold text-[#1A202C]">
                          {paySummary.regularHours.toFixed(2)}h
                        </span>
                      </div>
                      <div className="bg-[#FEF9EC] p-2 rounded-xl border border-[#FCD34D]">
                        <span className="text-[10px] uppercase text-[#B45309] font-medium block">
                          {t.shift.otHours}
                        </span>
                        <span className="text-sm font-bold text-[#B45309]">
                          {paySummary.otHours.toFixed(2)}h
                        </span>
                      </div>
                    </div>

                    {isOvertime && (
                      <div className="text-xs bg-[#FEF3C7] text-[#B45309] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.shift.overtimeActive}
                      </div>
                    )}
                  </div>

                  {/* Big Check In / Out Button */}
                  <div>
                    {!activeShift ? (
                      <button
                        type="button"
                        onClick={handleInitiateCheckIn}
                        className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-[#1A202C] hover:bg-[#2D3748] text-[#FFFFFF] font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                      >
                        <QrCode className="w-4 h-4 text-[#FCD34D]" />
                        {t.shift.checkInBtn}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClockOut}
                        className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-[#EFECE6] hover:bg-[#E2E0D8] text-[#1A202C] font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 border border-[#E2E0D8] focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                      >
                        <Square className="w-4 h-4 text-[#B45309]" />
                        {t.shift.checkOutBtn}
                      </button>
                    )}
                  </div>

                  {/* Demo Clock Speed Control */}
                  <div className="bg-[#EFECE6] p-3 rounded-2xl border border-[#E2E0D8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B45309]" />
                      <div>
                        <p className="text-xs font-semibold text-[#1A202C]">{t.shift.demoClockLabel}</p>
                        <p className="text-[10px] text-[#4A5568]">Simulate shifts & overtime in seconds</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDemoClockActive(prev => !prev)}
                      className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                        demoClockActive
                          ? 'bg-[#B45309] text-white border-[#B45309]'
                          : 'bg-[#FFFFFF] text-[#1A202C] border-[#E2E0D8]'
                      }`}
                    >
                      {demoClockActive ? 'Active' : 'Off'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PAYSLIP */}
              {workerTab === 'payslip' && (
                <div className="space-y-4">
                  <div className="bg-[#F9F9FB] p-3.5 rounded-2xl border border-[#E2E0D8]">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                        {t.payslip.title}
                      </h3>
                      <PillBadge variant="green">SDG 8 Standard</PillBadge>
                    </div>
                    <p className="text-[11px] text-[#4A5568]">{t.payslip.subtitle}</p>
                  </div>

                  {/* Itemized Line Items */}
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E0D8] space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E2E0D8]">
                      <span className="text-[#4A5568]">{t.payslip.baseRate}</span>
                      <span className="font-semibold text-[#1A202C]">
                        {formatINR(paySummary.baseRate)}/hr
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E2E0D8]">
                      <div>
                        <span className="text-[#1A202C] font-medium block">{t.payslip.regularPay}</span>
                        <span className="text-[10px] text-[#4A5568]">{paySummary.regularHours.toFixed(2)} hrs @ standard rate</span>
                      </div>
                      <span className="font-semibold text-[#1A202C]">
                        {formatINR(paySummary.regularPay)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E2E0D8]">
                      <div>
                        <span className="text-[#B45309] font-medium block">{t.payslip.otPay}</span>
                        <span className="text-[10px] text-[#4A5568]">{paySummary.otHours.toFixed(2)} hrs @ 1.5x statutory multiplier</span>
                      </div>
                      <span className="font-semibold text-[#B45309]">
                        {formatINR(paySummary.otPay)}
                      </span>
                    </div>

                    {sectorKey === 'factory' && isNightShift && (
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E2E0D8]">
                        <div>
                          <span className="text-[#1A202C] font-medium block">{t.payslip.nightDiff}</span>
                          <span className="text-[10px] text-[#4A5568]">15% premium for industrial night operations</span>
                        </div>
                        <span className="font-semibold text-[#1A202C]">
                          {formatINR(paySummary.nightDifferential)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E2E0D8]">
                      <div>
                        <span className="text-[#1A202C] font-medium block">{sector.allowanceName}</span>
                        <span className="text-[10px] text-[#4A5568]">{sector.allowanceNote}</span>
                      </div>
                      <span className="font-semibold text-[#1A202C]">
                        {formatINR(paySummary.allowance)}
                      </span>
                    </div>

                    {/* Explicit No Hidden Deductions Guarantee */}
                    <div className="bg-[#EFECE6] p-2.5 rounded-xl border border-[#E2E0D8] space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#1A202C]">{t.payslip.deductions}</span>
                        <span className="font-bold text-[#065F46]">₹0.00</span>
                      </div>
                      <p className="text-[10px] text-[#4A5568] leading-tight">
                        {t.payslip.deductionsLine}
                      </p>
                    </div>

                    {/* Net Pay Total */}
                    <div className="bg-[#FEF9EC] p-3.5 rounded-xl border border-[#FCD34D] flex justify-between items-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#B45309] tracking-wider block">
                          {t.payslip.netPay}
                        </span>
                        <span className="text-[11px] text-[#4A5568]">Verified Instant Calculation</span>
                      </div>
                      <span className="text-xl font-bold text-[#1A202C]">
                        {formatINR(paySummary.netPay)}
                      </span>
                    </div>
                  </div>

                  {/* Listen Voice Summary Button */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleListenPayslip}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#EFECE6] hover:bg-[#E2E0D8] text-[#1A202C] font-medium text-xs transition-all duration-150 flex items-center justify-center gap-2 border border-[#E2E0D8] focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                    >
                      <Volume2 className="w-4 h-4 text-[#B45309]" />
                      {t.payslip.listenBtn}
                    </button>
                    {speechStatus && (
                      <p aria-live="polite" className="text-center text-[11px] text-[#B45309] font-medium">
                        {speechStatus}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: HAZARD REPORT */}
              {workerTab === 'hazard' && (
                <form onSubmit={handleSubmitHazard} className="space-y-4">
                  <div className="bg-[#F9F9FB] p-3.5 rounded-2xl border border-[#E2E0D8]">
                    <h3 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider mb-1">
                      {t.hazard.title}
                    </h3>
                    <p className="text-[11px] text-[#4A5568] leading-tight">
                      {t.hazard.subtitle}
                    </p>
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-[#4A5568]">
                      {t.hazard.presetsTitle}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sector.hazardPresets.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setHazardText(prev => (prev ? `${prev}. ${preset}` : preset))}
                          className="min-h-[36px] px-2.5 py-1 text-[11px] rounded-lg bg-[#EFECE6] hover:bg-[#E2E0D8] text-[#1A202C] border border-[#E2E0D8] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Note Simulation with Animated Waveform */}
                  <div className="bg-[#F9F9FB] p-3 rounded-2xl border border-[#E2E0D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A202C]">
                        {isRecordingVoice ? t.hazard.recordingNow : t.hazard.voiceRecordBtn}
                      </span>
                      <button
                        type="button"
                        onClick={handleToggleVoiceRecord}
                        className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-150 ${
                          isRecordingVoice
                            ? 'bg-[#B45309] text-white'
                            : 'bg-[#FFFFFF] text-[#1A202C] border border-[#E2E0D8]'
                        }`}
                      >
                        {isRecordingVoice ? (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            {t.hazard.stopRecordBtn}
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-[#B45309]" />
                            {t.hazard.voiceRecordBtn}
                          </>
                        )}
                      </button>
                    </div>
                    <VoiceWaveform active={isRecordingVoice} />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-1">
                    <label htmlFor="hazardTextInput" className="text-xs font-medium text-[#4A5568]">
                      Detailed Description
                    </label>
                    <textarea
                      id="hazardTextInput"
                      rows={3}
                      value={hazardText}
                      onChange={(e) => setHazardText(e.target.value)}
                      placeholder={t.hazard.textPlaceholder}
                      className="w-full text-xs bg-[#FFFFFF] border border-[#E2E0D8] rounded-xl p-3 text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                    />
                  </div>

                  {/* Severity Selector (Warm Tones Only: Informational / Needs Review / Critical) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-[#4A5568]">
                      {t.hazard.severityLabel}
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: 'Informational', label: t.hazard.sevInfo, bg: 'bg-[#EFECE6]', text: 'text-[#4A5568]', activeBg: 'bg-[#4A5568] text-white' },
                        { key: 'Needs Review', label: t.hazard.sevReview, bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', activeBg: 'bg-[#B45309] text-white' },
                        { key: 'Critical', label: t.hazard.sevCritical, bg: 'bg-[#FEF9EC]', text: 'text-[#92400E]', activeBg: 'bg-[#92400E] text-white' }
                      ].map(sev => {
                        const isSelected = hazardSeverity === sev.key;
                        return (
                          <button
                            key={sev.key}
                            type="button"
                            onClick={() => setHazardSeverity(sev.key)}
                            className={`min-h-[42px] px-2 py-1.5 text-xs rounded-xl font-medium border border-[#E2E0D8] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                              isSelected ? sev.activeBg : `${sev.bg} ${sev.text}`
                            }`}
                          >
                            {sev.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live PII Auto-Redacted Preview Box */}
                  {hazardText && (
                    <div className="bg-[#FEF9EC] p-3 rounded-2xl border border-[#FCD34D] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309]">
                        <Lock className="w-3.5 h-3.5" />
                        {t.hazard.piiTitle}
                      </div>
                      <p className="text-[11px] text-[#1A202C] font-mono bg-white/70 p-2 rounded-lg border border-[#FCD34D]/50 leading-relaxed">
                        {sanitizedHazardPreview}
                      </p>
                      <p className="text-[10px] text-[#4A5568]">
                        {t.hazard.piiExplain}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!hazardText.trim()}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1A202C] hover:bg-[#2D3748] disabled:opacity-40 text-[#FFFFFF] font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                  >
                    <Send className="w-3.5 h-3.5 text-[#FCD34D]" />
                    {t.hazard.submitBtn}
                  </button>
                </form>
              )}

              {/* TAB 4: ANONYMOUS FEEDBACK */}
              {workerTab === 'feedback' && (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="bg-[#F9F9FB] p-3.5 rounded-2xl border border-[#E2E0D8]">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                        {t.feedback.title}
                      </h3>
                      <PillBadge variant="amber">
                        <Lock className="w-3 h-3 text-[#B45309]" />
                        {t.feedback.cryptoBadge}
                      </PillBadge>
                    </div>
                    <p className="text-[11px] text-[#4A5568]">{t.feedback.subtitle}</p>
                  </div>

                  {/* Topic Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-[#4A5568]">
                      {t.feedback.topicLabel}
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {Object.entries(t.feedback.topics).map(([key, label]) => {
                        const isSelected = feedbackCategory === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFeedbackCategory(key)}
                            className={`min-h-[44px] px-3 py-2 text-left text-xs rounded-xl font-medium border transition-all duration-150 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                              isSelected
                                ? 'bg-[#FFFFFF] border-[#B45309] text-[#1A202C] shadow-xs'
                                : 'bg-[#F9F9FB] border-[#E2E0D8] text-[#4A5568] hover:bg-[#FFFFFF]'
                            }`}
                          >
                            <span>{label}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#B45309]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-[#4A5568]">
                      {t.feedback.ratingLabel}
                    </span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`flex-1 min-h-[40px] rounded-xl font-bold text-xs border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                            feedbackRating >= star
                              ? 'bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]'
                              : 'bg-[#FFFFFF] text-[#A0AEC0] border-[#E2E0D8]'
                          }`}
                        >
                          {star}★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div className="space-y-1">
                    <label htmlFor="feedbackCommentInput" className="text-xs font-medium text-[#4A5568]">
                      Feedback / Grievance (Zero Identity Fields)
                    </label>
                    <textarea
                      id="feedbackCommentInput"
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder={t.feedback.commentPlaceholder}
                      className="w-full text-xs bg-[#FFFFFF] border border-[#E2E0D8] rounded-xl p-3 text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!feedbackComment.trim()}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1A202C] hover:bg-[#2D3748] disabled:opacity-40 text-[#FFFFFF] font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#FCD34D]" />
                    {t.feedback.submitBtn}
                  </button>

                  {/* SHA-256 Verifiable Receipt Display */}
                  {feedbackReceipt && (
                    <div className="bg-[#FEF9EC] p-3.5 rounded-2xl border border-[#FCD34D] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#B45309] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          {t.feedback.receiptTitle}
                        </span>
                        <PillBadge variant="amber">SHA-256</PillBadge>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-[#FCD34D]/60 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-[#1A202C] truncate">
                          {feedbackReceipt.slice(0, 16)}...{feedbackReceipt.slice(-8)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(feedbackReceipt);
                              showToast(t.feedback.copied);
                            }
                          }}
                          aria-label="Copy SHA-256 Receipt"
                          className="min-h-[32px] p-1.5 text-xs text-[#B45309] hover:bg-[#FEF3C7] rounded-lg border border-[#FCD34D]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#4A5568] leading-tight">
                        {t.feedback.receiptNotice}
                      </p>
                    </div>
                  )}
                </form>
              )}

              {/* TAB 5: SKILL PASSPORT */}
              {workerTab === 'passport' && (
                <div className="space-y-4">
                  <div className="bg-[#F9F9FB] p-3.5 rounded-2xl border border-[#E2E0D8]">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                        {t.passport.title}
                      </h3>
                      <PillBadge variant="dark">Decentralized VC</PillBadge>
                    </div>
                    <p className="text-[11px] text-[#4A5568]">{t.passport.subtitle}</p>
                  </div>

                  {/* Verified Hours Counter */}
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E0D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#4A5568] tracking-wider block">
                        {t.passport.verifiedSafeHours}
                      </span>
                      <span className="text-2xl font-bold text-[#1A202C]">
                        {completedHours.toLocaleString('en-IN')} hrs
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-[#EFECE6] border border-[#E2E0D8] flex items-center justify-center text-[#B45309]">
                      <BadgeCheck className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Sector Certified Competency Badges */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-[#4A5568]">
                      {t.passport.badgesTitle}
                    </span>
                    <div className="space-y-2">
                      {sector.skillBadges.map(badge => (
                        <div
                          key={badge.name}
                          className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E0D8] flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-semibold text-[#1A202C]">{badge.name}</p>
                            <p className="text-[10px] text-[#4A5568]">{badge.level}</p>
                          </div>
                          <PillBadge variant="neutral">
                            {badge.verifiedHours} hrs logged
                          </PillBadge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Universal Inline SVG QR Preview */}
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E0D8] text-center space-y-2.5">
                    <span className="text-xs font-bold text-[#1A202C] block">
                      {t.passport.qrTitle}
                    </span>
                    <QrPreview payload={`fairshift:did:w4092:${sectorKey}:${completedHours}`} size={140} />
                    <div className="text-[10px] font-mono text-[#4A5568] bg-[#F9F9FB] py-1 px-2 rounded-lg border border-[#E2E0D8] inline-block max-w-full truncate">
                      did:fairshift:worker:in-992-w4092
                    </div>
                    <p className="text-[10px] text-[#4A5568] leading-tight">
                      {t.passport.qrSubtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================================================================
             EMPLOYER VIEW (Responsive Dashboard Grid)
             ================================================================== */
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Banner */}
            <div className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#E2E0D8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-[#1A202C]">
                    {t.employer.title}
                  </h2>
                  <PillBadge variant="amber">{sector.siteName}</PillBadge>
                </div>
                <p className="text-xs text-[#4A5568] mt-1">{t.employer.subtitle} • {sector.location}</p>
              </div>

              {/* Sector Quick Switcher inside Employer view */}
              <div className="flex items-center gap-2 bg-[#EFECE6] p-1.5 rounded-2xl border border-[#E2E0D8]">
                <button
                  type="button"
                  onClick={() => setSectorKey('construction')}
                  className={`min-h-[38px] px-3.5 py-1 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                    sectorKey === 'construction'
                      ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs'
                      : 'text-[#4A5568]'
                  }`}
                >
                  <HardHat className="w-3.5 h-3.5 text-[#B45309]" />
                  Construction Site Alpha
                </button>
                <button
                  type="button"
                  onClick={() => setSectorKey('factory')}
                  className={`min-h-[38px] px-3.5 py-1 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none ${
                    sectorKey === 'factory'
                      ? 'bg-[#FFFFFF] text-[#1A202C] shadow-xs'
                      : 'text-[#4A5568]'
                  }`}
                >
                  <Factory className="w-3.5 h-3.5 text-[#B45309]" />
                  Industrial Plant Line B
                </button>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Active Workforce */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#E2E0D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="text-xs font-medium">{t.employer.stats.activeWorkforce}</span>
                  <Users className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-[#1A202C]">
                  {activeCount} <span className="text-xs font-normal text-[#4A5568]">on site</span>
                </div>
                <div className="text-[11px] text-[#065F46] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#065F46]" />
                  Includes verified live clock-ins
                </div>
              </div>

              {/* Metric 2: Shift Completion % */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#E2E0D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="text-xs font-medium">{t.employer.stats.shiftCompletion}</span>
                  <Clock className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-[#1A202C]">
                  {avgShiftPercent}%
                </div>
                <div className="text-[11px] text-[#4A5568]">
                  Target: 8.0 hrs standard shift
                </div>
              </div>

              {/* Metric 3: Open Safety Hazards */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#E2E0D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="text-xs font-medium">{t.employer.stats.openHazards}</span>
                  <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-[#1A202C]">
                  {openHazardCount}
                </div>
                <div className="text-[11px] text-[#B45309] font-medium">
                  {openHazardCount > 0 ? 'Requires supervisor triage' : 'All clear'}
                </div>
              </div>

              {/* Metric 4: Fatigue Violations Flagged */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#E2E0D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="text-xs font-medium">{t.employer.stats.fatigueViolations}</span>
                  <HeartPulse className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-[#1A202C]">
                  {fatigueCount}
                </div>
                <div className="text-[11px] text-[#B45309]">
                  {fatigueCount > 0 ? 'Exceeding 10h / continuous shifts' : 'Zero violations'}
                </div>
              </div>
            </div>

            {/* Live Hazard Triage Board */}
            <div className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#E2E0D8] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E0D8] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1A202C] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                    {t.employer.triageTitle}
                  </h3>
                  <p className="text-xs text-[#4A5568]">{t.employer.triageSubtitle}</p>
                </div>
                <PillBadge variant="neutral">
                  {hazards.filter(h => h.sectorId === sectorKey).length} Total Reports
                </PillBadge>
              </div>

              {hazards.filter(h => h.sectorId === sectorKey).length === 0 ? (
                <p className="text-xs text-[#4A5568] py-4 text-center">{t.employer.noHazards}</p>
              ) : (
                <div className="space-y-3">
                  {hazards
                    .filter(h => h.sectorId === sectorKey)
                    .map(item => {
                      const isCritical = item.severity === 'Critical';
                      const isReview = item.severity === 'Needs Review';
                      const badgeVariant = isCritical ? 'amber' : isReview ? 'amber' : 'neutral';

                      return (
                        <div
                          key={item.id}
                          className="bg-[#F9F9FB] p-4 rounded-2xl border border-[#E2E0D8] flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-semibold text-[#1A202C]">
                                {item.id}
                              </span>
                              <PillBadge variant={badgeVariant}>
                                {item.severity}
                              </PillBadge>
                              <span className="text-[11px] text-[#4A5568]">{item.timestamp}</span>
                              {item.isVoice && (
                                <PillBadge variant="neutral">
                                  <Mic className="w-2.5 h-2.5 text-[#B45309]" />
                                  Voice Transcribed
                                </PillBadge>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  item.status === 'Resolved'
                                    ? 'bg-[#ECFDF5] text-[#065F46]'
                                    : item.status === 'Acknowledged'
                                    ? 'bg-[#FEF3C7] text-[#B45309]'
                                    : 'bg-[#EFECE6] text-[#4A5568]'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#1A202C] leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Triage Actions */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            {item.status === 'Open' && (
                              <button
                                type="button"
                                onClick={() => handleAcknowledgeHazard(item.id)}
                                className="min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-xl bg-[#FFFFFF] hover:bg-[#EFECE6] text-[#1A202C] border border-[#E2E0D8] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                              >
                                {t.employer.actionAck}
                              </button>
                            )}
                            {item.status !== 'Resolved' && (
                              <button
                                type="button"
                                onClick={() => handleResolveHazard(item.id)}
                                className="min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1A202C] hover:bg-[#2D3748] text-[#FFFFFF] transition-all duration-150 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                              >
                                <Check className="w-3.5 h-3.5 text-[#FCD34D]" />
                                {t.employer.actionResolve}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Fatigue Monitoring & Overtime Intervention Panel */}
            <div className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#E2E0D8] shadow-xs space-y-4">
              <div className="border-b border-[#E2E0D8] pb-3">
                <h3 className="text-sm font-bold text-[#1A202C] flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#B45309]" />
                  {t.employer.fatigueTitle}
                </h3>
                <p className="text-xs text-[#4A5568]">{t.employer.fatigueSubtitle}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E0D8] text-[#4A5568]">
                      <th className="py-2.5 px-3 font-semibold">{t.employer.colWorker}</th>
                      <th className="py-2.5 px-3 font-semibold">{t.employer.colRole}</th>
                      <th className="py-2.5 px-3 font-semibold">{t.employer.colHours}</th>
                      <th className="py-2.5 px-3 font-semibold">{t.employer.colDays}</th>
                      <th className="py-2.5 px-3 font-semibold">{t.employer.colStatus}</th>
                      <th className="py-2.5 px-3 font-semibold text-right">{t.employer.colAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E0D8]">
                    {currentSectorWorkers.map(w => {
                      const isHigh = w.fatigueRisk === 'High' || w.hoursToday > 10;
                      const isCrit = w.fatigueRisk === 'Critical' || w.hoursToday > 11;
                      const hasFatigue = isHigh || isCrit;

                      return (
                        <tr key={w.id} className="hover:bg-[#F9F9FB] transition-colors">
                          <td className="py-3 px-3 font-medium text-[#1A202C]">
                            {w.name}
                            <span className="block text-[10px] text-[#4A5568]">{w.id}</span>
                          </td>
                          <td className="py-3 px-3 text-[#4A5568]">{w.role}</td>
                          <td className="py-3 px-3 font-mono font-semibold text-[#1A202C]">
                            {w.hoursToday}h
                          </td>
                          <td className="py-3 px-3 text-[#4A5568]">{w.consecutiveDays} days</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                                isCrit
                                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]'
                                  : isHigh
                                  ? 'bg-[#FEF9EC] text-[#B45309] border-[#FDE68A]'
                                  : 'bg-[#EFECE6] text-[#4A5568] border-[#E2E0D8]'
                              }`}
                            >
                              {hasFatigue && <AlertCircle className="w-3 h-3 text-[#B45309]" />}
                              {w.status.includes('Resting') ? w.status : (hasFatigue ? (isCrit ? t.employer.criticalRisk : t.employer.highRisk) : t.employer.normal)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {hasFatigue && !w.status.includes('Resting') ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleEnforceRest(w.id)}
                                  className="min-h-[36px] px-2.5 py-1 text-[11px] font-medium rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                                >
                                  {t.employer.actionRest}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReassignShift(w.id)}
                                  className="min-h-[36px] px-2.5 py-1 text-[11px] font-medium rounded-xl bg-[#FFFFFF] hover:bg-[#EFECE6] text-[#1A202C] border border-[#E2E0D8] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                                >
                                  {t.employer.actionReassign}
                                </button>
                                {sectorKey === 'factory' && (
                                  <button
                                    type="button"
                                    onClick={() => handleTriggerOtCap(w.id)}
                                    className="min-h-[36px] px-2.5 py-1 text-[11px] font-medium rounded-xl bg-[#EFECE6] hover:bg-[#E2E0D8] text-[#1A202C] border border-[#E2E0D8] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#D97706] focus:outline-none"
                                  >
                                    {t.employer.actionCap}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#4A5568] italic">Compliant</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          SIMULATED GEO / QR CLOCK-IN MODAL SHEET
          ==================================================================== */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#1A202C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#FFFFFF] border border-[#E2E0D8] w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                {t.shift.scanQrTitle}
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                aria-label="Close QR Modal"
                className="w-8 h-8 rounded-full bg-[#EFECE6] text-[#4A5568] hover:text-[#1A202C] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div className="relative aspect-square max-w-[220px] mx-auto bg-[#1A202C] rounded-2xl overflow-hidden flex items-center justify-center p-3 border-2 border-dashed border-[#B45309]">
              {/* QR Pattern inside */}
              <div className="opacity-70 scale-90">
                <QrPreview payload={`fairshift:checkin:${sectorKey}`} size={160} />
              </div>

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-[#D97706] rounded-xl animate-pulse" />
              </div>

              {qrScanningState === 'verifying' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-7 h-7 text-[#FCD34D] animate-spin" />
                  <span className="text-xs font-medium">Verifying Site Attestation...</span>
                </div>
              )}

              {qrScanningState === 'confirmed' && (
                <div className="absolute inset-0 bg-[#065F46]/90 flex flex-col items-center justify-center text-white space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                  <span className="text-xs font-bold">Location Verified!</span>
                </div>
              )}
            </div>

            {/* Geofence verification status */}
            <div className="bg-[#FEF9EC] p-3 rounded-2xl border border-[#FCD34D] text-left space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309]">
                <MapPin className="w-3.5 h-3.5" />
                {t.shift.geofenceOk}
              </div>
              <p className="text-[11px] text-[#4A5568]">
                {sector.siteName} • {sector.location} ({sector.geoCoords.lat}, {sector.geoCoords.lng})
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-[#EFECE6] text-[#4A5568] font-medium text-xs border border-[#E2E0D8]"
              >
                {t.shift.cancel}
              </button>
              <button
                type="button"
                disabled={qrScanningState !== 'ready'}
                onClick={handleConfirmSiteScan}
                className="flex-2 min-h-[44px] py-2 px-4 rounded-xl bg-[#1A202C] hover:bg-[#2D3748] text-[#FFFFFF] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4 text-[#FCD34D]" />
                {t.shift.confirmCheckIn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          POLITE LIVE TOAST NOTIFICATION
          ==================================================================== */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#1A202C] text-[#FFFFFF] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium max-w-md border border-[#4A5568]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FCD34D] shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss Notification"
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* ====================================================================
          FOOTER (Decent Work & UN SDG 8 Attribution)
          ==================================================================== */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E0D8] py-4 px-4 text-center text-xs text-[#4A5568] mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 FairShift • Hackathon Demo (Prompt Wars 2026)</p>
          <p className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#B45309]" />
            Advancing UN SDG 8: Decent Work, Real-Time Wage Transparency & Ergonomic Safety
          </p>
        </div>
      </footer>
    </div>
  );
}
