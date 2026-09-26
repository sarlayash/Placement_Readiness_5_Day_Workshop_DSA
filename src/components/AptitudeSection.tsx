import React, { useState } from 'react';
import { APTITUDE_MCQS } from '../data/aptitudeMCQs';
import { AptitudeMCQ, Question } from '../types';
import { TOPICS } from '../data/curriculum';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Code2,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface AptitudeSectionProps {
  onOpenIDEForQuestion: (question: Question) => void;
  onNavigateToDay: (day: number) => void;
}

export const AptitudeSection: React.FC<AptitudeSectionProps> = ({
  onOpenIDEForQuestion,
  onNavigateToDay,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [isSectionCollapsed, setIsSectionCollapsed] = useState<boolean>(false);

  const categories = [
    'All',
    'Quantitative',
    'Logical',
    'Number Theory',
    'Combinatorics',
    'Algorithmic',
  ];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const filteredQuestions = APTITUDE_MCQS.filter((q) => {
    const matchesCategory =
      selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.linkedDsaProblem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.linkedDsaProblem.conceptTieIn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const attemptedCount = Object.keys(userAnswers).length;
  const correctCount = APTITUDE_MCQS.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;

  const handleLaunchIDEForLinkedDSA = (linkedId: string, fallbackDay: number) => {
    // Search TOPICS for this question id
    let foundQuestion: Question | null = null;
    for (const t of TOPICS) {
      for (const q of t.questions) {
        if (q.id === linkedId) {
          foundQuestion = q;
          break;
        }
      }
      if (foundQuestion) break;
    }

    if (!foundQuestion) {
      // Find first question of that day as fallback
      const dayTopic = TOPICS.find((t) => t.day === fallbackDay);
      foundQuestion = dayTopic?.questions[0] || TOPICS[0].questions[0];
    }

    onOpenIDEForQuestion(foundQuestion);
  };

  return (
    <section className="my-8 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-5 md:p-7 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-indigo-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                <Brain className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-extrabold">
                Placement Aptitude Foundation
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {attemptedCount} of 25 Answered ({correctCount} Correct)
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black mt-2 rainbow-text">
              25 Placement Aptitude MCQs • Linked with DSA Problems
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Every major placement screening round (Google, Amazon, TCS, Infosys) pairs quantitative & logical aptitude with DSA. Click any problem to see how its mathematical principle powers coding challenges in the syllabus & In-Browser IDE.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsSectionCollapsed((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {isSectionCollapsed ? (
                <>
                  <span>Expand 25 MCQs</span>
                  <ChevronDown className="w-4 h-4 text-indigo-600" />
                </>
              ) : (
                <>
                  <span>Collapse Section</span>
                  <ChevronUp className="w-4 h-4 text-indigo-600" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter bar (Category pills & search) */}
        {!isSectionCollapsed && (
          <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aptitude or DSA..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Questions Grid */}
      {!isSectionCollapsed && (
        <div className="p-4 md:p-7 space-y-5 bg-slate-50/50">
          <div className="grid grid-cols-1 gap-5">
            {filteredQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const selectedOpt = userAnswers[q.id];
              const isCorrect = isAnswered && selectedOpt === q.correctAnswer;
              const isExpanded = expandedExplanations[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs hover:border-indigo-200 transition-all space-y-4"
                >
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800">
                        Aptitude #{idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {q.category}
                      </span>
                    </div>

                    {isAnswered && (
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question Prompt */}
                  <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-relaxed">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptSelected = selectedOpt === optIdx;
                      const isThisCorrect = optIdx === q.correctAnswer;

                      let optClass =
                        'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-indigo-300';

                      if (isAnswered) {
                        if (isThisCorrect) {
                          optClass =
                            'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                        } else if (isOptSelected && !isThisCorrect) {
                          optClass =
                            'border-red-400 bg-red-50 text-red-900';
                        }
                      } else if (isOptSelected) {
                        optClass = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-2xl border text-xs md:text-sm text-left transition-all flex items-start gap-2.5 cursor-pointer ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-md border border-slate-300 bg-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="pt-0.5 leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Explanation */}
                  {isAnswered && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-slate-900">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Mathematical Derivation & Proof:</span>
                      </div>
                      <p className="leading-relaxed pl-5 text-slate-600">{q.explanation}</p>
                    </div>
                  )}

                  {/* LINKED WITH DSA PROBLEM BOX */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white border border-indigo-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>LINKED WITH DSA PROBLEM:</span>
                        <span className="text-purple-700 underline decoration-indigo-300">
                          Day {q.linkedDsaProblem.day} • {q.linkedDsaProblem.topic}
                        </span>
                      </div>
                      <div className="text-xs md:text-sm font-black text-slate-900">
                        {q.linkedDsaProblem.title}
                      </div>
                      <p className="text-[11px] text-slate-600 italic">
                        <strong>Concept Bridge:</strong> {q.linkedDsaProblem.conceptTieIn}
                      </p>
                    </div>

                    {/* Action buttons to jump to IDE or Syllabus */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleLaunchIDEForLinkedDSA(
                            q.linkedDsaProblem.id,
                            q.linkedDsaProblem.day
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Open in In-Browser Multi-Language IDE with Hidden Test Cases"
                      >
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Solve in IDE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToDay(q.linkedDsaProblem.day)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-900 text-xs font-bold transition-all cursor-pointer"
                        title="View within 5-Day Curriculum breakdown"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View Day {q.linkedDsaProblem.day}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset or Explore Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
            <span>
              Showing {filteredQuestions.length} of {APTITUDE_MCQS.length} placement aptitude challenges.
            </span>
            <button
              type="button"
              onClick={() => {
                setUserAnswers({});
                setExpandedExplanations({});
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Aptitude Answers</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
