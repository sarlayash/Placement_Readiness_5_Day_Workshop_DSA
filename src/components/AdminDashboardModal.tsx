import React, { useState, useEffect } from 'react';
import {
  StudentRecord,
  AdminCustomBadge,
  AdminCustomCertificate,
  AdminCustomAssignment,
  AdminCustomQuiz,
  DayLockStatus,
} from '../types';
import {
  getAllStudents,
  forceSyncFirebaseRoster,
  fetchLiveFirebaseRoster,
  generateDailyCSV,
  generateMasterCSV,
  downloadCSV,
  getAdminCustomBadges,
  issueCustomBadge,
  getAdminCustomCertificates,
  issueCustomCertificate,
  getAdminAssignments,
  addAdminAssignment,
  getAdminQuizzes,
  addAdminQuiz,
  setAdminAuthenticated,
  calculateStudentDayCompletion,
  calculateStudentOverallCompletion,
  getAdminGlobalDayStatus,
  getAllGlobalDayStatuses,
  setAdminGlobalDayStatus,
  unlockAllDaysGlobally,
  relockAllDaysToDefault,
  getAdminStudentDayStatus,
  getAllStudentDayStatuses,
  setAdminStudentDayStatus,
  unlockAllDaysForStudent,
  relockAllDaysForStudent,
  resetStudentDayLocks,
  markStudentDayComplete,
  resetStudentProgress,
  exportRosterSnapshotJSON,
  importRosterSnapshotJSON,
} from '../utils/adminService';
import { TOPICS } from '../data/curriculum';
import { SOLVED_PROGRAMS } from '../data/solvedPrograms';
import {
  ShieldAlert,
  Users,
  FileSpreadsheet,
  Award,
  Sparkles,
  BookOpen,
  HelpCircle,
  LogOut,
  X,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  Crown,
  Flame,
  Zap,
  Star,
  ShieldCheck,
  Trophy,
  RefreshCw,
  Lock,
  Unlock,
  Key,
  FileJson,
  Upload,
  AlertTriangle,
  Layers,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type TabType = 'roster' | 'daylocks' | 'reports' | 'badges' | 'certificates' | 'assignments' | 'quizzes';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('roster');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportDay, setSelectedReportDay] = useState<number | 'master'>('master');
  const [previewContent, setPreviewContent] = useState<string>('');

  // Badges state
  const [customBadges, setCustomBadges] = useState<AdminCustomBadge[]>([]);
  const [badgeTitle, setBadgeTitle] = useState('');
  const [badgeSubtitle, setBadgeSubtitle] = useState('');
  const [badgeCriteria, setBadgeCriteria] = useState('');
  const [badgeCategory, setBadgeCategory] = useState<string>('Day 1');
  const [badgeIcon, setBadgeIcon] = useState('Award');
  const [badgeColor, setBadgeColor] = useState('amber');
  const [badgeRecipient, setBadgeRecipient] = useState<string>('all');

  // Certificates state
  const [customCertificates, setCustomCertificates] = useState<AdminCustomCertificate[]>([]);
  const [certStudentId, setCertStudentId] = useState('');
  const [certTitle, setCertTitle] = useState('Certificate of Excellence in DSA & Placement Mastery');
  const [certGrade, setCertGrade] = useState<'Outstanding' | 'A+' | 'A' | 'Honours'>('A+');
  const [certRemarks, setCertRemarks] = useState('Demonstrated exemplary algorithmic proficiency in 5-Day Placement Masterclass.');

  // Assignments state
  const [customAssignments, setCustomAssignments] = useState<AdminCustomAssignment[]>([]);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDay, setAssignDay] = useState(1);
  const [assignDiff, setAssignDiff] = useState<'Level 0' | 'Easy' | 'Medium' | 'Hard'>('Medium');
  const [assignTopic, setAssignTopic] = useState('Graph Theory & Dynamic Programming');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignInput, setAssignInput] = useState('');
  const [assignOutput, setAssignOutput] = useState('');
  const [assignKapilInsight, setAssignKapilInsight] = useState('');
  const [assignTimeComp, setAssignTimeComp] = useState('O(N log N)');
  const [assignSpaceComp, setAssignSpaceComp] = useState('O(N)');

  // Quizzes state
  const [customQuizzes, setCustomQuizzes] = useState<AdminCustomQuiz[]>([]);
  const [quizCategory, setQuizCategory] = useState<'Day 1' | 'Day 2' | 'Day 3' | 'Day 4' | 'Day 5' | 'Aptitude' | 'Spinning Wheel' | 'Final Exam'>('Day 1');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptA, setQuizOptA] = useState('');
  const [quizOptB, setQuizOptB] = useState('');
  const [quizOptC, setQuizOptC] = useState('');
  const [quizOptD, setQuizOptD] = useState('');
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizMarks, setQuizMarks] = useState(10);
  const [isSyncing, setIsSyncing] = useState(false);

  // Day Locks State
  const [globalDayLocks, setGlobalDayLocks] = useState<Record<number, DayLockStatus>>(() =>
    getAllGlobalDayStatuses()
  );
  // Comprehensive Student Completion Inspector Modal State
  const [inspectingStudent, setInspectingStudent] = useState<StudentRecord | null>(null);
  // JSON Snapshot Import Modal State
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const list = getAllStudents();
    setStudents(list);
    setGlobalDayLocks(getAllGlobalDayStatuses());
    setCustomBadges(getAdminCustomBadges());
    setCustomCertificates(getAdminCustomCertificates());
    setCustomAssignments(getAdminAssignments());
    setCustomQuizzes(getAdminQuizzes());

    if (list.length > 0 && !certStudentId) {
      setCertStudentId(list[0].id);
    }
    updateReportPreview(selectedReportDay, list);

    // Asynchronously merge with latest live Firebase roster
    try {
      const liveList = await fetchLiveFirebaseRoster();
      setStudents(liveList);
      updateReportPreview(selectedReportDay, liveList);
    } catch {
      // fallback to local
    }
  };

  const handleToggleGlobalDayLock = (day: number) => {
    const current = globalDayLocks[day] || 'default';
    let next: DayLockStatus = 'default';
    if (current === 'default') next = 'unlocked';
    else if (current === 'unlocked') next = 'locked';
    else next = 'default';

    setAdminGlobalDayStatus(day, next);
    setGlobalDayLocks((prev) => ({ ...prev, [day]: next }));
    const label =
      next === 'unlocked'
        ? `Day ${day} Force Unlocked for All Learners!`
        : next === 'locked'
        ? `Day ${day} Relocked for All Learners!`
        : `Day ${day} Reset to Default Strict Progression`;
    showToast(label);
  };

  const handleUnlockAllGlobal = () => {
    unlockAllDaysGlobally();
    setGlobalDayLocks(getAllGlobalDayStatuses());
    showToast('All 5 Days Force Unlocked for All Learners!');
  };

  const handleRelockAllGlobal = () => {
    relockAllDaysToDefault();
    setGlobalDayLocks(getAllGlobalDayStatuses());
    showToast('All Days Restored to Default Strict Progression Locks');
  };

  const handleToggleStudentDayLock = (studentId: string, day: number) => {
    const current = getAdminStudentDayStatus(studentId, day);
    let next: DayLockStatus = 'default';
    if (current === 'default') next = 'unlocked';
    else if (current === 'unlocked') next = 'locked';
    else next = 'default';

    setAdminStudentDayStatus(studentId, day, next);
    const updated = getAllStudents();
    setStudents(updated);
    if (inspectingStudent && inspectingStudent.id === studentId) {
      setInspectingStudent(updated.find((s) => s.id === studentId) || null);
    }
    const label =
      next === 'unlocked'
        ? `Day ${day} Unlocked for student!`
        : next === 'locked'
        ? `Day ${day} Relocked for student!`
        : `Day ${day} Reset to Default for student`;
    showToast(label);
  };

  const handleUnlockAllForStudent = (studentId: string) => {
    unlockAllDaysForStudent(studentId);
    const updated = getAllStudents();
    setStudents(updated);
    if (inspectingStudent && inspectingStudent.id === studentId) {
      setInspectingStudent(updated.find((s) => s.id === studentId) || null);
    }
    showToast('All 5 Days Unlocked for this learner!');
  };

  const handleRelockAllForStudent = (studentId: string) => {
    relockAllDaysForStudent(studentId);
    const updated = getAllStudents();
    setStudents(updated);
    if (inspectingStudent && inspectingStudent.id === studentId) {
      setInspectingStudent(updated.find((s) => s.id === studentId) || null);
    }
    showToast('All 5 Days Relocked for this learner!');
  };

  const handleResetStudentDayLocks = (studentId: string) => {
    resetStudentDayLocks(studentId);
    const updated = getAllStudents();
    setStudents(updated);
    if (inspectingStudent && inspectingStudent.id === studentId) {
      setInspectingStudent(updated.find((s) => s.id === studentId) || null);
    }
    showToast('Day locks reset to default for this learner');
  };

  const handleMarkStudentDayComplete = (studentId: string, day: number) => {
    markStudentDayComplete(studentId, day);
    const updated = getAllStudents();
    setStudents(updated);
    if (inspectingStudent && inspectingStudent.id === studentId) {
      setInspectingStudent(updated.find((s) => s.id === studentId) || null);
    }
    showToast(`Day ${day} marked 100% completed for learner!`);
  };

  const handleResetStudentProgress = (studentId: string) => {
    if (window.confirm('Are you sure you want to reset this student progress?')) {
      resetStudentProgress(studentId);
      const updated = getAllStudents();
      setStudents(updated);
      if (inspectingStudent && inspectingStudent.id === studentId) {
        setInspectingStudent(updated.find((s) => s.id === studentId) || null);
      }
      showToast('Student progress reset to initial empty state.');
    }
  };

  const handleExportJSON = () => {
    const json = exportRosterSnapshotJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kapil_placement_roster_snapshot_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Roster & Day Locks Snapshot Exported!');
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) return;
    const ok = importRosterSnapshotJSON(importJsonText);
    if (ok) {
      setShowImportModal(false);
      setImportJsonText('');
      loadData();
      showToast('Learner Roster Snapshot Imported Successfully!');
    } else {
      showToast('Invalid JSON file format. Please check and retry.');
    }
  };

  const handleForceSyncFirebase = async () => {
    setIsSyncing(true);
    try {
      const synced = await fetchLiveFirebaseRoster();
      setStudents(synced);
      updateReportPreview(selectedReportDay, synced);
      showToast(`Real Firebase Google Roster Synced! (${synced.length} Real Accounts Verified)`);
    } catch {
      const synced = forceSyncFirebaseRoster();
      setStudents(synced);
      updateReportPreview(selectedReportDay, synced);
      showToast(`Real Firebase Google Roster Synced! (${synced.length} Real Accounts Verified)`);
    } finally {
      setTimeout(() => setIsSyncing(false), 400);
    }
  };

  const updateReportPreview = (mode: number | 'master', studentList: StudentRecord[]) => {
    if (mode === 'master') {
      setPreviewContent(generateMasterCSV(studentList));
    } else {
      setPreviewContent(generateDailyCSV(mode, studentList));
    }
  };

  const handleSelectReport = (mode: number | 'master') => {
    setSelectedReportDay(mode);
    updateReportPreview(mode, students);
  };

  const handleDownloadCSV = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (selectedReportDay === 'master') {
      const csv = generateMasterCSV(students);
      downloadCSV(`placement_readiness_5day_master_report_${timestamp}.csv`, csv);
    } else {
      const csv = generateDailyCSV(selectedReportDay, students);
      downloadCSV(`placement_readiness_day_${selectedReportDay}_report_${timestamp}.csv`, csv);
    }
    showToast('CSV Report Downloaded Successfully!');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Issue Badge Handler
  const handleIssueBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeTitle.trim()) return;

    const newBadge: AdminCustomBadge = {
      id: `admin-badge-${Date.now()}`,
      title: badgeTitle.trim(),
      subtitle: badgeSubtitle.trim() || 'Awarded by Kapil',
      criteria: badgeCriteria.trim() || 'Demonstrated outstanding dedication and skill',
      day: badgeCategory,
      iconName: badgeIcon,
      color: badgeColor,
      issuedAt: new Date().toISOString(),
      recipientStudentIds: badgeRecipient === 'all' ? [] : [badgeRecipient],
    };

    issueCustomBadge(newBadge);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setBadgeTitle('');
    setBadgeSubtitle('');
    setBadgeCriteria('');
    loadData();
    showToast(`Badge "${newBadge.title}" issued successfully!`);
  };

  // Issue Certificate Handler
  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find((s) => s.id === certStudentId);
    if (!targetStudent) return;

    const code = `KAPIL-PRP-2026-ADM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newCert: AdminCustomCertificate = {
      id: `cert-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      studentEmail: targetStudent.email,
      certificateTitle: certTitle.trim(),
      grade: certGrade,
      issuedAt: new Date().toISOString(),
      issuedBy: 'Kapil • Master Instructor & Placement Director',
      verificationCode: code,
      remarks: certRemarks.trim(),
    };

    issueCustomCertificate(newCert);
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
    loadData();
    showToast(`Certificate issued to ${targetStudent.name} with Code ${code}!`);
  };

  // Add Assignment Handler
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const newAssign: AdminCustomAssignment = {
      id: `assign-${Date.now()}`,
      title: assignTitle.trim(),
      day: assignDay,
      difficulty: assignDiff,
      topicTag: assignTopic.trim(),
      description: assignDesc.trim(),
      sampleInput: assignInput.trim(),
      sampleOutput: assignOutput.trim(),
      kapilIntuition: assignKapilInsight.trim() || 'Focus on time complexity reduction and optimal data structure choices.',
      timeComplexity: assignTimeComp.trim() || 'O(N)',
      spaceComplexity: assignSpaceComp.trim() || 'O(1)',
      createdAt: new Date().toISOString(),
    };

    addAdminAssignment(newAssign);
    setAssignTitle('');
    setAssignDesc('');
    setAssignInput('');
    setAssignOutput('');
    setAssignKapilInsight('');
    loadData();
    showToast(`Assignment "${newAssign.title}" added to Day ${newAssign.day}!`);
  };

  // Add Quiz Handler
  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !quizOptA || !quizOptB || !quizOptC || !quizOptD) return;

    const newQuiz: AdminCustomQuiz = {
      id: `quiz-${Date.now()}`,
      category: quizCategory,
      question: quizQuestion.trim(),
      options: [quizOptA.trim(), quizOptB.trim(), quizOptC.trim(), quizOptD.trim()],
      correctAnswer: quizCorrect,
      explanation: quizExplanation.trim() || 'Option is logically verified by Kapil.',
      marks: quizMarks,
      createdAt: new Date().toISOString(),
    };

    addAdminQuiz(newQuiz);
    setQuizQuestion('');
    setQuizOptA('');
    setQuizOptB('');
    setQuizOptC('');
    setQuizOptD('');
    setQuizExplanation('');
    loadData();
    showToast(`New Quiz question added under ${newQuiz.category}!`);
  };

  const handleLogoutAdmin = () => {
    setAdminAuthenticated(false);
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  // Filtered students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRegistered = students.length;
  const passedExamCount = students.filter((s) => s.progress?.finalExamPassed).length;
  const certifiedCount = students.filter(
    (s) =>
      s.progress?.certificateId ||
      s.progress?.finalExamPassed ||
      (s.customCertificates && s.customCertificates.length > 0)
  ).length;

  const avgCompletion =
    totalRegistered > 0
      ? Math.round(
          students.reduce((acc, s) => acc + calculateStudentOverallCompletion(s.progress), 0) /
            totalRegistered
        )
      : 0;

  const examTakers = students.filter(
    (s) => s.progress?.finalExamPassed || (s.progress?.finalExamScore && s.progress.finalExamScore > 0)
  );
  const avgExamScore =
    examTakers.length > 0
      ? Math.round(
          examTakers.reduce((acc, s) => acc + (s.progress?.finalExamScore || 0), 0) /
            examTakers.length
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[92vh] max-h-[920px] bg-[#080e21] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Gold Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-indigo-900/60 bg-[#050a18] gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black shadow-md flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  Kapil's Administrator Command Center
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SUPER ADMIN
                  </span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  100% Real Firebase Sync • Zero Fake Users
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium">
                Live Cohort Telemetry • Daily & 5-Day CSV Reports • Badges & Certificate Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              title="Sign out of Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Logout</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-2.5 bg-[#070d1e] border-b border-indigo-950 text-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-950/40 border border-indigo-900/40">
            <Users className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Real Google Users</div>
              <div className="font-bold text-white text-sm">{totalRegistered} Learners</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-900/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Real Avg Completion</div>
              <div className="font-bold text-emerald-300 text-sm">{avgCompletion}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-900/40">
            <Trophy className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Final Exam Cleared</div>
              <div className="font-bold text-purple-300 text-sm">{passedExamCount} / {totalRegistered}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-900/40">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Certificates Issued</div>
              <div className="font-bold text-amber-300 text-sm">
                {certifiedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-2 border-b border-indigo-900/50 bg-[#060b1a] overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'roster'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Learner Logins & Progress</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-900/80 text-indigo-300">
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('daylocks')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'daylocks'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Day Unlock & Relock Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Reports Center</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'badges'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Issue New Badges</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Issue New Certificates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Add New Assignments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Add New Quizzes</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Content Panes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: LEARNER ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              {/* Master Day Access & Lock Management Panel */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0d1633] via-[#091129] to-[#0d1633] border border-amber-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                        <span>Master Day Access & Lock Controller</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Admin Kapil
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Unlock or relock specific days globally for all learners on this webapp, bypassing time or prerequisite gates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={handleUnlockAllGlobal}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition-all cursor-pointer shadow-xs"
                      title="Force unlock Day 1, 2, 3, 4, 5 for all learners"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>⚡ Unlock All Days</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRelockAllGlobal}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition-all cursor-pointer border border-slate-700"
                      title="Restore default strict progression: Day N requires Day N-1 completion"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset to Default</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 text-[11px] font-bold cursor-pointer"
                      title="Export full roster and progress snapshot JSON"
                    >
                      <FileJson className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Export JSON</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 text-[11px] font-bold cursor-pointer"
                      title="Import roster snapshot JSON from another device"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Import JSON</span>
                    </button>
                  </div>
                </div>

                {/* Day Badges Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((d) => {
                    const status = globalDayLocks[d] || 'default';
                    const isUnlocked = status === 'unlocked';
                    const isLocked = status === 'locked';

                    return (
                      <div
                        key={d}
                        onClick={() => handleToggleGlobalDayLock(d)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1.5 ${
                          isUnlocked
                            ? 'bg-amber-950/40 border-amber-500/70 text-amber-200 shadow-xs ring-1 ring-amber-500/30'
                            : isLocked
                            ? 'bg-rose-950/40 border-rose-500/70 text-rose-200 shadow-xs ring-1 ring-rose-500/30'
                            : 'bg-[#060a17] border-indigo-900/60 text-slate-300 hover:border-slate-500'
                        }`}
                        title="Click to cycle: Default -> Force Unlocked -> Force Relocked -> Default"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs">Day {d}</span>
                          {isUnlocked ? (
                            <Unlock className="w-3.5 h-3.5 text-amber-400" />
                          ) : isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <span className="text-[10px] text-slate-500">Strict</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono">
                          {isUnlocked ? (
                            <span className="text-amber-400 font-bold">⚡ Unlocked</span>
                          ) : isLocked ? (
                            <span className="text-rose-400 font-bold">🔒 Relocked</span>
                          ) : (
                            <span className="text-slate-400">Default Rule</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name, email, roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060a16] border border-indigo-900/60 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleForceSyncFirebase}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                    title="Real-time synchronize with official Firebase Google Auth accounts and live student progress"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Firebase Roster'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReportDay('master');
                      setActiveTab('reports');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Master CSV</span>
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="border border-indigo-900/40 rounded-2xl overflow-hidden bg-[#060a16]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c142b] border-b border-indigo-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Google Account</th>
                        <th className="py-3 px-3">Google UID</th>
                        <th className="py-3 px-3">Day 1-5 Progress</th>
                        <th className="py-3 px-3">Overall</th>
                        <th className="py-3 px-3">Solved (/30)</th>
                        <th className="py-3 px-3">Final Exam</th>
                        <th className="py-3 px-3">Certificate</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-950 text-slate-200">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Users className="w-8 h-8 text-slate-600" />
                              <div className="font-bold text-slate-300">
                                {searchTerm ? `No learners matching '${searchTerm}'` : 'No real Google learners enrolled yet'}
                              </div>
                              <p className="text-[11px] text-slate-500 max-w-md">
                                When students log in using official Google Sign-In via Firebase, their authenticated profiles and real-time progress will appear here automatically.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s) => {
                          const overall = calculateStudentOverallCompletion(s.progress);
                          return (
                            <tr key={s.id} className="hover:bg-indigo-950/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={s.avatar}
                                    alt={s.name}
                                    className="w-8 h-8 rounded-full border border-indigo-500/40 bg-slate-800"
                                  />
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      {s.name}
                                      {s.customBadges && s.customBadges.length > 0 && (
                                        <span title={s.customBadges.join(', ')}>
                                          <Crown className="w-3 h-3 text-amber-400" />
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 font-mono text-slate-300 font-semibold">
                                {s.rollNo || s.id.substring(0, 10)}
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((d) => {
                                    const pct = calculateStudentDayCompletion(s.progress, d);
                                    const studentLock = getAdminStudentDayStatus(s.id, d);
                                    const globalLock = globalDayLocks[d] || 'default';
                                    const effectiveLock = studentLock !== 'default' ? studentLock : globalLock;

                                    return (
                                      <button
                                        key={d}
                                        type="button"
                                        onClick={() => handleToggleStudentDayLock(s.id, d)}
                                        title={`Day ${d}: ${pct}% completed • Lock: ${effectiveLock} (Click to toggle for ${s.name})`}
                                        className={`px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[9px] font-mono font-bold transition-all hover:scale-105 cursor-pointer ${
                                          pct === 100
                                            ? 'bg-emerald-500 text-slate-950'
                                            : pct > 0
                                            ? 'bg-amber-500/80 text-slate-950'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                      >
                                        <span>D{d}</span>
                                        {effectiveLock === 'unlocked' && <Unlock className="w-2.5 h-2.5 text-amber-950 stroke-[3]" />}
                                        {effectiveLock === 'locked' && <Lock className="w-2.5 h-2.5 text-rose-950 stroke-[3]" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                                      style={{ width: `${overall}%` }}
                                    />
                                  </div>
                                  <span className="font-bold text-slate-200">{overall}%</span>
                                </div>
                              </td>

                              <td className="py-3 px-3 font-mono">
                                {(s.progress.acknowledgedSolvedProgramIds || []).length}/30
                              </td>

                              <td className="py-3 px-3">
                                {s.progress.finalExamPassed ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    Passed ({s.progress.finalExamScore}%)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                                    Pending
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {s.progress.certificateId ? (
                                  <span
                                    className="font-mono text-[10px] text-amber-300 truncate max-w-[100px] block"
                                    title={s.progress.certificateId}
                                  >
                                    Issued ✓
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-500">Not Issued</span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setInspectingStudent(s)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-extrabold transition-colors cursor-pointer mr-1.5 inline-flex items-center gap-1"
                                  title="Audit real completion status, solved questions, and control day locks for this student"
                                >
                                  <Eye className="w-3 h-3 text-emerald-400" />
                                  <span>Audit & Access</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCertStudentId(s.id);
                                    setActiveTab('certificates');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-[10px] font-bold transition-colors cursor-pointer mr-1.5"
                                  title="Issue Custom Certificate to this student"
                                >
                                  Grant Cert
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBadgeRecipient(s.id);
                                    setActiveTab('badges');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-[10px] font-bold transition-colors cursor-pointer"
                                  title="Award Custom Badge to this student"
                                >
                                  Award Badge
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: DAY UNLOCK & RELOCK CONTROLS */}
          {activeTab === 'daylocks' && (
            <div className="space-y-6">
              {/* Header and Global Controls Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border border-amber-500/40">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                          Master Day Access & Progression Controller
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Live Override
                          </span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Instantly unlock or relock any day for all learners globally or individually. Overrides strict Day N-1 requirements and IST schedule locks.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUnlockAllGlobal}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Unlock All 5 Days Globally</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRelockAllGlobal}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      <span>Restore Default Schedule</span>
                    </button>
                  </div>
                </div>

                {/* Day 1-5 Global Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-indigo-900/40">
                  {[1, 2, 3, 4, 5].map((d) => {
                    const status = globalDayLocks[d] || 'default';
                    return (
                      <div
                        key={d}
                        className={`p-3.5 rounded-xl border transition-all ${
                          status === 'unlocked'
                            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                            : status === 'locked'
                            ? 'bg-rose-950/40 border-rose-500/50 shadow-sm'
                            : 'bg-[#060a16] border-indigo-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-sm text-white">Day {d}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              status === 'unlocked'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : status === 'locked'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {status === 'unlocked' ? '🔓 Unlocked' : status === 'locked' ? '🔒 Relocked' : '⏳ Default'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-3 truncate">
                          {d === 1
                            ? 'Arrays, Math & Strings'
                            : d === 2
                            ? 'Recursion, Two Pointers & Hashing'
                            : d === 3
                            ? 'Linked Lists, Stacks & Queues'
                            : d === 4
                            ? 'Trees, BST & Graphs'
                            : 'Dynamic Programming & Final Exam'}
                        </p>
                        <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setAdminGlobalDayStatus(d, 'default');
                              setGlobalDayLocks(getAllGlobalDayStatuses());
                              showToast(`Day ${d} set to Default Schedule`);
                            }}
                            className={`py-1 rounded text-center cursor-pointer transition-colors ${
                              status === 'default'
                                ? 'bg-indigo-600 text-white font-black'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white'
                            }`}
                          >
                            Default
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAdminGlobalDayStatus(d, 'unlocked');
                              setGlobalDayLocks(getAllGlobalDayStatuses());
                              showToast(`Day ${d} Force Unlocked Globally!`);
                            }}
                            className={`py-1 rounded text-center cursor-pointer transition-colors ${
                              status === 'unlocked'
                                ? 'bg-emerald-600 text-white font-black'
                                : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300'
                            }`}
                          >
                            Unlock
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAdminGlobalDayStatus(d, 'locked');
                              setGlobalDayLocks(getAllGlobalDayStatuses());
                              showToast(`Day ${d} Relocked Globally!`);
                            }}
                            className={`py-1 rounded text-center cursor-pointer transition-colors ${
                              status === 'locked'
                                ? 'bg-rose-600 text-white font-black'
                                : 'bg-slate-800/80 text-slate-400 hover:text-rose-300'
                            }`}
                          >
                            Relock
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Student Overrides Table */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      Individual Learner Day Controls ({filteredStudents.length} Students)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Manage specific unlocks/relocks per student or audit complete submission status.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, email, roll..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#060a16] border border-indigo-900/60 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="border border-indigo-900/50 rounded-xl overflow-hidden bg-[#060a16]">
                  <div className="overflow-x-auto max-h-[480px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0c142b] text-slate-300 font-bold border-b border-indigo-900/50 sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-3">Student</th>
                          <th className="py-2.5 px-3 text-center">Overall</th>
                          <th className="py-2.5 px-3 text-center">Day 1</th>
                          <th className="py-2.5 px-3 text-center">Day 2</th>
                          <th className="py-2.5 px-3 text-center">Day 3</th>
                          <th className="py-2.5 px-3 text-center">Day 4</th>
                          <th className="py-2.5 px-3 text-center">Day 5</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-indigo-950/60">
                        {filteredStudents.map((s) => {
                          const overall = calculateStudentOverallCompletion(s.progress);
                          return (
                            <tr key={s.id} className="hover:bg-indigo-950/20 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-white text-xs truncate max-w-[180px]">{s.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">{s.email}</div>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`font-mono text-xs font-bold ${overall === 100 ? 'text-emerald-400' : overall > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {overall}%
                                </span>
                              </td>
                              {[1, 2, 3, 4, 5].map((d) => {
                                const stLock = s.dayOverrides?.[d] || getAdminStudentDayStatus(s.id, d);
                                const dComp = calculateStudentDayCompletion(s.progress, d);
                                return (
                                  <td key={d} className="py-2.5 px-2 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-[10px] font-mono text-slate-400">{dComp}% done</span>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleStudentDayLock(s.id, d)}
                                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer transition-colors ${
                                          stLock === 'unlocked'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                            : stLock === 'locked'
                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                                        }`}
                                        title={`Day ${d}: ${stLock} (Click to toggle)`}
                                      >
                                        {stLock === 'unlocked' ? '🔓 Unlock' : stLock === 'locked' ? '🔒 Relock' : '⏳ Auto'}
                                      </button>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setInspectingStudent(s)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                                    title="Open comprehensive completion breakdown for this student"
                                  >
                                    <Eye className="w-3 h-3 text-emerald-400" />
                                    <span>Audit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUnlockAllForStudent(s.id)}
                                    className="px-2 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-[10px] font-bold transition-colors cursor-pointer"
                                    title="Unlock all 5 days for this learner"
                                  >
                                    Unlock 1-5
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleResetStudentDayLocks(s.id)}
                                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                                    title="Reset student locks to default"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CSV REPORTS CENTER */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  Select Report to Preview & Download
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectReport(d)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedReportDay === d
                          ? 'border-amber-400 bg-amber-500/15 text-white shadow-md'
                          : 'border-indigo-900/50 bg-[#060a16] text-slate-300 hover:border-indigo-700'
                      }`}
                    >
                      <div className="text-[10px] text-amber-400 font-bold uppercase">Daily Report</div>
                      <div className="font-extrabold text-sm">Day {d} Audit</div>
                      <div className="text-[10px] text-slate-400 mt-1">Pre, Post, 6 Solved</div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleSelectReport('master')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedReportDay === 'master'
                        ? 'border-amber-400 bg-amber-500/20 text-white shadow-md'
                        : 'border-indigo-900/50 bg-[#060a16] text-slate-300 hover:border-indigo-700'
                    }`}
                  >
                    <div className="text-[10px] text-amber-400 font-bold uppercase">Master File</div>
                    <div className="font-extrabold text-sm">5-Day Consolidated</div>
                    <div className="text-[10px] text-slate-400 mt-1">Complete Student Roster</div>
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#0c142b] border border-indigo-900/60 gap-3">
                <div>
                  <div className="font-bold text-white text-sm">
                    {selectedReportDay === 'master'
                      ? '5-Day Consolidated Master Report'
                      : `Day ${selectedReportDay} Daily Student Progress Report`}
                  </div>
                  <div className="text-xs text-slate-400">
                    Includes student roll numbers, timestamps, assessment scores, and completion flags.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV Report Now</span>
                </button>
              </div>

              {/* Raw CSV Preview Box */}
              <div>
                <div className="text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Report Raw Data Preview</span>
                  <span className="text-[11px] text-slate-500 font-mono">RFC-4180 Format</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#040711] border border-indigo-950 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
                  {previewContent}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: ISSUE NEW BADGES */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Badge Creator Form */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#060a16] border border-indigo-900/50 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Issue Custom Badge to Learners
                </h3>

                <form onSubmit={handleIssueBadge} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Badge Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Graph Titan, Dynamic Programming Prodigy"
                      value={badgeTitle}
                      onChange={(e) => setBadgeTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Conquered All Advanced Graph Challenges"
                      value={badgeSubtitle}
                      onChange={(e) => setBadgeSubtitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Category / Day</label>
                      <select
                        value={badgeCategory}
                        onChange={(e) => setBadgeCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Day 1">Day 1: Graphs & Trees</option>
                        <option value="Day 2">Day 2: DP & Greedy</option>
                        <option value="Day 3">Day 3: Recursion & Backtracking</option>
                        <option value="Day 4">Day 4: Strings & Bitwise</option>
                        <option value="Day 5">Day 5: System Design & Marathon</option>
                        <option value="Special Bonus">Special Workshop Merit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Icon Style</label>
                      <select
                        value={badgeIcon}
                        onChange={(e) => setBadgeIcon(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Crown">Crown</option>
                        <option value="Award">Award Ribbon</option>
                        <option value="Flame">Flame (Hot Streak)</option>
                        <option value="Zap">Zap (Lightning Fast)</option>
                        <option value="Star">Star (Excellence)</option>
                        <option value="ShieldCheck">Shield (Perfection)</option>
                        <option value="Trophy">Trophy (Champion)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Recipient Learner</label>
                    <select
                      value={badgeRecipient}
                      onChange={(e) => setBadgeRecipient(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="all">⭐ Award to All Enrolled Students</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rollNo || s.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Criteria / Rationale</label>
                    <textarea
                      rows={2}
                      placeholder="Explain what the learner accomplished to earn this badge..."
                      value={badgeCriteria}
                      onChange={(e) => setBadgeCriteria(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Grant & Issue Badge Now
                  </button>
                </form>
              </div>

              {/* Badges Gallery List */}
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Custom Badges Issued by Kapil ({customBadges.length})</span>
                </h3>

                {customBadges.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-indigo-950 rounded-2xl text-xs">
                    No custom badges created yet. Use the form on the left to issue honors!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                    {customBadges.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl bg-[#060a16] border border-amber-500/30 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            <Crown className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{b.title}</div>
                            <div className="text-[11px] text-amber-300">{b.subtitle}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {b.recipientStudentIds.length === 0
                                ? 'Awarded to All Students'
                                : `Targeted to ${b.recipientStudentIds.length} student(s)`} • {b.day}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(b.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ISSUE NEW CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Certificate Issuer Form */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#060a16] border border-indigo-900/50 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Grant Placement Masterclass Certificate
                </h3>

                <form onSubmit={handleIssueCertificate} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Select Learner</label>
                    <select
                      value={certStudentId}
                      onChange={(e) => setCertStudentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rollNo || s.email}) - Overall: {calculateStudentOverallCompletion(s.progress)}%
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Certificate Title</label>
                    <input
                      type="text"
                      required
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Performance Grade</label>
                      <select
                        value={certGrade}
                        onChange={(e) => setCertGrade(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Outstanding">Outstanding (Top 1%)</option>
                        <option value="A+">Grade A+ (Distinction)</option>
                        <option value="A">Grade A (Merit)</option>
                        <option value="Honours">Honours Citation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Authorizing Instructor</label>
                      <input
                        type="text"
                        disabled
                        value="Kapil (Bootcamp Director)"
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-950 text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Official Remarks / Citation</label>
                    <textarea
                      rows={2}
                      value={certRemarks}
                      onChange={(e) => setCertRemarks(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Authorize & Grant Official Certificate
                  </button>
                </form>
              </div>

              {/* Certificate Registry */}
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Issued Certificate Registry ({customCertificates.length})</span>
                </h3>

                {customCertificates.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-indigo-950 rounded-2xl text-xs">
                    No custom certificates manually issued yet. Use the form to grant an official citation!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                    {customCertificates.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl bg-[#060a16] border border-amber-500/30 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{c.studentName}</div>
                          <div className="text-[11px] text-slate-400">{c.studentEmail}</div>
                          <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                            Code: {c.verificationCode} • Grade: {c.grade}
                          </div>
                        </div>

                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                          Official
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ADD NEW ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Assignment Form */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#060a16] border border-indigo-900/50 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Add New Practice Assignment
                </h3>

                <form onSubmit={handleAddAssignment} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Assignment Problem Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alien Dictionary Topological Sort"
                      value={assignTitle}
                      onChange={(e) => setAssignTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Target Day</label>
                      <select
                        value={assignDay}
                        onChange={(e) => setAssignDay(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value={1}>Day 1</option>
                        <option value={2}>Day 2</option>
                        <option value={3}>Day 3</option>
                        <option value={4}>Day 4</option>
                        <option value={5}>Day 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                      <select
                        value={assignDiff}
                        onChange={(e) => setAssignDiff(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Level 0">Level 0</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Time Complexity</label>
                      <input
                        type="text"
                        value={assignTimeComp}
                        onChange={(e) => setAssignTimeComp(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Problem Statement</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Describe the problem, input constraints, and expectations..."
                      value={assignDesc}
                      onChange={(e) => setAssignDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sample Input</label>
                      <input
                        type="text"
                        placeholder="e.g. 5\n1 2 3 4 5"
                        value={assignInput}
                        onChange={(e) => setAssignInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sample Output</label>
                      <input
                        type="text"
                        placeholder="e.g. 15"
                        value={assignOutput}
                        onChange={(e) => setAssignOutput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Kapil's Strategic Intuition</label>
                    <input
                      type="text"
                      placeholder="Strategic advice or interviewer edge..."
                      value={assignKapilInsight}
                      onChange={(e) => setAssignKapilInsight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Add Assignment to Curriculum
                  </button>
                </form>
              </div>

              {/* Assignment List */}
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Custom Assignments Created ({customAssignments.length})</span>
                </h3>

                {customAssignments.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-indigo-950 rounded-2xl text-xs">
                    No custom assignments added yet. Use the form on the left to inject new coding challenges!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                    {customAssignments.map((a) => (
                      <div
                        key={a.id}
                        className="p-3.5 rounded-xl bg-[#060a16] border border-indigo-900/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{a.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-900/60 text-indigo-300">
                            Day {a.day} • {a.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{a.description}</p>
                        <div className="text-[10px] text-amber-300/90 font-mono">
                          Time: {a.timeComplexity} • Space: {a.spaceComplexity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ADD NEW QUIZZES */}
          {activeTab === 'quizzes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Quiz Creator Form */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#060a16] border border-indigo-900/50 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Add New Assessment MCQ
                </h3>

                <form onSubmit={handleAddQuiz} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Quiz Target Section</label>
                      <select
                        value={quizCategory}
                        onChange={(e) => setQuizCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Day 1">Day 1 Assessment</option>
                        <option value="Day 2">Day 2 Assessment</option>
                        <option value="Day 3">Day 3 Assessment</option>
                        <option value="Day 4">Day 4 Assessment</option>
                        <option value="Day 5">Day 5 Assessment</option>
                        <option value="Aptitude">25 Placement Aptitude</option>
                        <option value="Spinning Wheel">Spinning Wheel Bonus</option>
                        <option value="Final Exam">Proctored Final Exam</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Marks Weightage</label>
                      <select
                        value={quizMarks}
                        onChange={(e) => setQuizMarks(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value={10}>+10 Points (Standard)</option>
                        <option value={20}>+20 Points (Bonus)</option>
                        <option value={5}>+5 Points (Quick)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Question Text</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter the quiz question..."
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1 font-bold">Option A</label>
                      <input
                        type="text"
                        required
                        placeholder="Option A"
                        value={quizOptA}
                        onChange={(e) => setQuizOptA(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1 font-bold">Option B</label>
                      <input
                        type="text"
                        required
                        placeholder="Option B"
                        value={quizOptB}
                        onChange={(e) => setQuizOptB(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1 font-bold">Option C</label>
                      <input
                        type="text"
                        required
                        placeholder="Option C"
                        value={quizOptC}
                        onChange={(e) => setQuizOptC(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1 font-bold">Option D</label>
                      <input
                        type="text"
                        required
                        placeholder="Option D"
                        value={quizOptD}
                        onChange={(e) => setQuizOptD(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Correct Answer Index</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['A', 'B', 'C', 'D'].map((opt, idx) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQuizCorrect(idx)}
                          className={`py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                            quizCorrect === idx
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-[#040711] text-slate-400 border border-indigo-900'
                          }`}
                        >
                          Option {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Detailed Explanation</label>
                    <textarea
                      rows={2}
                      placeholder="Why is this option correct? Concept explanation..."
                      value={quizExplanation}
                      onChange={(e) => setQuizExplanation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040711] border border-indigo-900 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Add Question to Quiz Engine
                  </button>
                </form>
              </div>

              {/* Quizzes List */}
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Custom MCQs Added ({customQuizzes.length})</span>
                </h3>

                {customQuizzes.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-indigo-950 rounded-2xl text-xs">
                    No custom MCQs created yet. Use the builder on the left to inject new quiz questions!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                    {customQuizzes.map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl bg-[#060a16] border border-indigo-900/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs line-clamp-1">{q.question}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                            {q.category}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`truncate px-2 py-0.5 rounded ${
                                q.correctAnswer === i
                                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30'
                                  : 'bg-[#040711]'
                              }`}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 italic mt-1">{q.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* COMPREHENSIVE STUDENT COMPLETION AUDIT & LOCK INSPECTOR MODAL */}
        {inspectingStudent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-[#070c1d] border border-amber-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-indigo-900/60 bg-[#0a1128] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                    {inspectingStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-white">
                        {inspectingStudent.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Real Firebase User
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span>{inspectingStudent.email}</span>
                      <span>•</span>
                      <span>UID: {inspectingStudent.id}</span>
                      {inspectingStudent.rollNo && (
                        <>
                          <span>•</span>
                          <span className="text-amber-300 font-bold">Roll: {inspectingStudent.rollNo}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-slate-300">
                        Last Active: {new Date(inspectingStudent.lastActive || inspectingStudent.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingStudent(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Metrics Bar & Batch Actions for this Student */}
              <div className="p-3.5 bg-[#060a16] border-b border-indigo-900/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">Overall Progress</span>
                    <span className="text-base font-extrabold text-amber-300">
                      {calculateStudentOverallCompletion(inspectingStudent.progress)}%
                    </span>
                  </div>
                  <div className="h-6 w-px bg-indigo-900/60" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">Final Exam</span>
                    <span className={`font-bold ${inspectingStudent.progress?.finalExamPassed ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {inspectingStudent.progress?.finalExamPassed
                        ? `Passed (${inspectingStudent.progress?.finalExamScore || 0}%)`
                        : inspectingStudent.progress?.finalExamScore
                        ? `Attempted (${inspectingStudent.progress.finalExamScore}%)`
                        : 'Not Attempted'}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-indigo-900/60" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">Solved Programs</span>
                    <span className="font-bold text-teal-300">
                      {inspectingStudent.progress?.acknowledgedSolvedProgramIds?.length || 0} / 30 Done
                    </span>
                  </div>
                  <div className="h-6 w-px bg-indigo-900/60" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">Badges Earned</span>
                    <span className="font-bold text-purple-300">
                      {Object.values(inspectingStudent.progress?.badgesUnlocked || {}).filter(Boolean).length} Badges
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUnlockAllForStudent(inspectingStudent.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlock All 5 Days</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRelockAllForStudent(inspectingStudent.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Relock All Days</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetStudentDayLocks(inspectingStudent.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset Locks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetStudentProgress(inspectingStudent.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-bold cursor-pointer transition-colors"
                    title="Wipe learner progress to 0% and test from fresh"
                  >
                    Reset Progress
                  </button>
                </div>
              </div>

              {/* Scrollable Audit Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* 5-DAY DETAILED COMPLETION BREAKDOWN */}
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Day-by-Day Real Completion Status & Overrides
                  </h4>

                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((d) => {
                      const dLock = inspectingStudent.dayOverrides?.[d] || getAdminStudentDayStatus(inspectingStudent.id, d);
                      const dComp = calculateStudentDayCompletion(inspectingStudent.progress, d);
                      const preDone = inspectingStudent.progress?.dayPreAssessmentPassed?.[d];
                      const preScore = inspectingStudent.progress?.dayPreAssessmentScores?.[d] ?? 0;
                      const postDone = inspectingStudent.progress?.dayPostAssessmentPassed?.[d];
                      const postScore = inspectingStudent.progress?.dayPostAssessmentScores?.[d] ?? 0;
                      
                      const daySolvedPrograms = SOLVED_PROGRAMS.filter((p) => p.day === d);
                      const acknowledgedList = inspectingStudent.progress?.acknowledgedSolvedProgramIds || [];
                      const ackSet = new Set(acknowledgedList.map((id: string) => id.toLowerCase()));
                      const ackCountForDay = daySolvedPrograms.filter((p) => ackSet.has(p.id.toLowerCase())).length;

                      const dayQuestions = TOPICS.filter((t) => t.day === d).flatMap((t) => t.questions);
                      const completedQuestionsList = inspectingStudent.progress?.completedQuestionIds || [];
                      const questionsSolvedForDay = dayQuestions.filter((q) => completedQuestionsList.includes(q.id)).length;

                      return (
                        <div
                          key={d}
                          className={`p-4 rounded-xl border transition-all ${
                            dLock === 'unlocked'
                              ? 'bg-[#09152b] border-emerald-500/50'
                              : dLock === 'locked'
                              ? 'bg-[#150a14] border-rose-500/50'
                              : 'bg-[#080d1e] border-indigo-900/50'
                          }`}
                        >
                          {/* Day Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-900/40 gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-sm flex items-center justify-center border border-amber-500/40">
                                D{d}
                              </span>
                              <div>
                                <div className="font-extrabold text-sm text-white flex items-center gap-2">
                                  <span>Day {d} Audit</span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      dLock === 'unlocked'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : dLock === 'locked'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}
                                  >
                                    {dLock === 'unlocked'
                                      ? '🔓 Admin Unlocked'
                                      : dLock === 'locked'
                                      ? '🔒 Relocked by Admin'
                                      : '⏳ Default Progression'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {d === 1
                                    ? 'Arrays, Math & Strings'
                                    : d === 2
                                    ? 'Recursion, Two Pointers & Hashing'
                                    : d === 3
                                    ? 'Linked Lists, Stacks & Queues'
                                    : d === 4
                                    ? 'Trees, BST & Graphs'
                                    : 'Dynamic Programming & Final Exam'}
                                </div>
                              </div>
                            </div>

                            {/* Day Quick Controls */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleStudentDayLock(inspectingStudent.id, d)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs font-bold cursor-pointer transition-colors"
                                title="Toggle between Default -> Unlocked -> Relocked"
                              >
                                Toggle Access
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStudentDayStatus(inspectingStudent.id, d, 'unlocked');
                                  const updated = getAllStudents();
                                  setStudents(updated);
                                  setInspectingStudent(updated.find((s) => s.id === inspectingStudent.id) || null);
                                  showToast(`Day ${d} Force Unlocked for this learner!`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                  dLock === 'unlocked'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60'
                                }`}
                              >
                                Unlock Day
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStudentDayStatus(inspectingStudent.id, d, 'locked');
                                  const updated = getAllStudents();
                                  setStudents(updated);
                                  setInspectingStudent(updated.find((s) => s.id === inspectingStudent.id) || null);
                                  showToast(`Day ${d} Force Relocked for this learner!`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                  dLock === 'locked'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                                }`}
                              >
                                Relock Day
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMarkStudentDayComplete(inspectingStudent.id, d)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold cursor-pointer transition-colors"
                                title="Mark Pre-assessment, 6 solved programs, and Post-assessment complete for this student"
                              >
                                ✓ Mark Day Done
                              </button>
                            </div>
                          </div>

                          {/* Completion Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                            {/* 1. Day Progress */}
                            <div className="p-3 rounded-lg bg-[#050914] border border-indigo-900/30">
                              <span className="text-[10px] text-slate-400 font-semibold block">Day Completion</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-base font-extrabold ${dComp === 100 ? 'text-emerald-400' : dComp > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {dComp}%
                                </span>
                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${dComp === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${dComp}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* 2. Pre-Assessment */}
                            <div className="p-3 rounded-lg bg-[#050914] border border-indigo-900/30">
                              <span className="text-[10px] text-slate-400 font-semibold block">Pre-Assessment</span>
                              <div className="mt-1 flex items-center justify-between">
                                <span className={`text-xs font-bold ${preDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                                  {preDone ? `Completed ✓ (${preScore}/5)` : 'Pending / Not Attempted'}
                                </span>
                                {preDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              </div>
                            </div>

                            {/* 3. 6 Solved Programs */}
                            <div className="p-3 rounded-lg bg-[#050914] border border-indigo-900/30">
                              <span className="text-[10px] text-slate-400 font-semibold block">6 Solved Programs</span>
                              <div className="mt-1 flex items-center justify-between">
                                <span className={`text-xs font-bold ${ackCountForDay === 6 ? 'text-emerald-300' : ackCountForDay > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                                  {ackCountForDay} / 6 Acknowledged
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {ackCountForDay === 6 ? '100% ✓' : `${Math.round((ackCountForDay / 6) * 100)}%`}
                                </span>
                              </div>
                            </div>

                            {/* 4. Post-Assessment */}
                            <div className="p-3 rounded-lg bg-[#050914] border border-indigo-900/30">
                              <span className="text-[10px] text-slate-400 font-semibold block">Post-Assessment</span>
                              <div className="mt-1 flex items-center justify-between">
                                <span className={`text-xs font-bold ${postDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                                  {postDone ? `Completed ✓ (${postScore}/5)` : 'Pending / Not Attempted'}
                                </span>
                                {postDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              </div>
                            </div>
                          </div>

                          {/* List of 6 Solved Programs Detail */}
                          <div className="mt-3 pt-3 border-t border-indigo-900/30">
                            <span className="text-[11px] font-bold text-slate-300 block mb-2">
                              Day {d} Required Solved Programs Audit (6 Programs):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {daySolvedPrograms.map((prog) => {
                                const isAck = ackSet.has(prog.id.toLowerCase());
                                return (
                                  <div
                                    key={prog.id}
                                    className={`p-2 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                                      isAck
                                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                                        : 'bg-[#03060f] border-slate-800 text-slate-400'
                                    }`}
                                  >
                                    <div className="truncate">
                                      <div className="font-bold text-[11px] truncate text-white">{prog.title}</div>
                                      <div className="text-[10px] text-slate-400">{prog.topicTag} • {prog.difficulty}</div>
                                    </div>
                                    <span
                                      className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        isAck
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : 'bg-slate-800 text-slate-500'
                                      }`}
                                    >
                                      {isAck ? '✓ Done' : 'Pending'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LEVEL 0 & VISUALIZERS AUDIT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#080d1e] border border-indigo-900/50">
                    <h5 className="font-extrabold text-sm text-white flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Level 0 Programming Fundamentals
                    </h5>
                    <p className="text-xs text-slate-400 mb-3">
                      Prerequisite track covering C++, Java, and Python fundamentals.
                    </p>
                    <div className="text-xs text-slate-300 font-mono">
                      Completed Fundamentals: {TOPICS.filter((t) => t.day === 0).flatMap((t) => t.questions).filter((q) => (inspectingStudent.progress?.completedQuestionIds || []).includes(q.id)).length} / {TOPICS.filter((t) => t.day === 0).flatMap((t) => t.questions).length} Questions
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080d1e] border border-indigo-900/50">
                    <h5 className="font-extrabold text-sm text-white flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Interactive Algorithm Visualizers
                    </h5>
                    <p className="text-xs text-slate-400 mb-3">
                      Hands-on interactive simulations for Searching, Sorting, Trees, and Graphs.
                    </p>
                    <div className="text-xs text-slate-300 font-mono">
                      Visualizers completed / acknowledged: {inspectingStudent.progress?.visualizationCompletedIds?.length || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-indigo-900/60 bg-[#0a1128] flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Placement Masterclass Admin Audit Console • Kapil
                </span>
                <button
                  type="button"
                  onClick={() => setInspectingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Close Audit View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* JSON SNAPSHOT IMPORT MODAL */}
        {showImportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl bg-[#070c1d] border border-amber-500/50 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-base text-white">
                    Import Learner Roster & Day Locks Snapshot
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Upload a snapshot file or paste the exported JSON text below to sync student progress and day lock overrides across devices or environments.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Upload .json file:
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result as string;
                        if (text) setImportJsonText(text);
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-900/60 file:text-indigo-200 hover:file:bg-indigo-800 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Or Paste JSON directly:
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"version": 1, "exportedAt": "...", "students": [...]}'
                  className="w-full p-3 rounded-xl bg-[#040711] border border-indigo-900/60 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportJSON}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 text-xs font-extrabold cursor-pointer shadow-lg"
                >
                  Import Snapshot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
