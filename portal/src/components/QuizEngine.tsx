// portal/components/QuizEngine.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, ChevronRight, Trophy, BookOpen, RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { QuizQuestion, Quiz } from '@/lib/quiz-data';

interface QuizEngineProps {
  quiz: Quiz;
  lectureId: string;
}

type QuizState = 'intro' | 'question' | 'answer' | 'result';

export function QuizEngine({ quiz, lectureId }: QuizEngineProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  const calculateScore = useCallback(() => {
    const correct = answers.filter(
      (ans, i) => ans === quiz.questions[i].correct
    ).length;
    return Math.round((correct / quiz.questions.length) * 100);
  }, [answers, quiz.questions]);

  const finishQuiz = useCallback(() => {
    setTimerActive(false);
    setState('result');

    const score = calculateScore();
    if (score >= quiz.passingScore) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#4ade80'],
      });

      // Saving progress to localStorage
      if (typeof window !== 'undefined') {
        const progress = JSON.parse(localStorage.getItem('quiz-progress') || '{}');
        progress[quiz.id] = {
          score,
          passed: true,
          date: new Date().toISOString(),
          lectureId
        };
        localStorage.setItem('quiz-progress', JSON.stringify(progress));

        // Update main progress store
        const mainProgress = JSON.parse(localStorage.getItem('solana-bootcamp-progress') || '{}');
        if (!mainProgress.quizzes) mainProgress.quizzes = {};
        mainProgress.quizzes[quiz.id] = { passed: true, bestScore: score, attempts: (mainProgress.quizzes[quiz.id]?.attempts || 0) + 1 };
        localStorage.setItem('solana-bootcamp-progress', JSON.stringify(mainProgress));
      }
    }
  }, [calculateScore, quiz.id, quiz.passingScore, lectureId]);

  // Timer
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, finishQuiz]);

  const startQuiz = () => {
    setState('question');
    setTimerActive(true);
  };

  const selectAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setState('answer');

    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setState('question');
    } else {
      finishQuiz();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQuestion = quiz.questions[currentIndex];
  const score = calculateScore();
  const passed = score >= quiz.passingScore;

  // ══════════════════════════════════════════════
  // INTRO
  // ══════════════════════════════════════════════
  if (state === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 font-sans relative">
        <div className="fixed inset-0 bg-[#0c111d] -z-10" />
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] -z-10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="max-w-2xl w-full bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="text-center mb-12 relative z-10">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-indigo-500/30">
                <BookOpen className="w-10 h-10 text-indigo-400" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-4 leading-none inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{quiz.title}</h1>
              <p className="text-slate-300 font-medium text-lg leading-relaxed">{quiz.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-12 relative z-10">
              <div className="bg-white/[0.05] border border-white/10 py-6 rounded-[32px] text-center">
                <div className="text-2xl font-black text-indigo-400">
                  {quiz.questions.length}
                </div>
                <div className="text-slate-300 text-[9px] font-black uppercase tracking-widest mt-1">Questions</div>
              </div>
              <div className="bg-white/[0.05] border border-white/10 py-6 rounded-[32px] text-center">
                <div className="text-2xl font-black text-emerald-400">
                  {formatTime(quiz.timeLimit)}
                </div>
                <div className="text-slate-300 text-[9px] font-black uppercase tracking-widest mt-1">Time Limit</div>
              </div>
              <div className="bg-white/[0.05] border border-white/10 py-6 rounded-[32px] text-center">
                <div className="text-2xl font-black text-amber-500">
                  {quiz.passingScore}%
                </div>
                <div className="text-slate-300 text-[9px] font-black uppercase tracking-widest mt-1">Pass Score</div>
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[32px] p-8 mb-12 relative z-10">
              <h3 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Instructions
              </h3>
              <ul className="text-slate-300 text-sm font-bold space-y-3">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />Read code snippets carefully</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />Explanation shown after each answer</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />Timer starts when you click Begin</li>
              </ul>
            </div>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => router.push(`/lectures/${lectureId}`)}
                className="flex-1 bg-white/5 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[3px] hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> REVIEW TRAINING
              </button>
              <button
                onClick={startQuiz}
                className="flex-[1.5] bg-indigo-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[3px] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                BEGIN MISSION <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // RESULT
  // ══════════════════════════════════════════════
  if (state === 'result') {
    const correctCount = answers.filter(
      (ans, i) => ans === quiz.questions[i].correct
    ).length;

    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative">
        <div className="fixed inset-0 bg-[#0c111d] -z-10" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-2xl w-full bg-white/[0.04] backdrop-blur-3xl rounded-[56px] p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                <Trophy className={`w-12 h-12 ${passed ? 'text-amber-400' : 'text-slate-600'}`} />
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                {passed ? (
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">Excellent!</span>
                ) : (
                  <span className="text-slate-500">Keep Learning</span>
                )}
              </h1>
              <div className="text-8xl font-black my-8 tracking-tighter">
                <span className={passed ? 'text-emerald-400' : 'text-rose-500'}>
                  {score}%
                </span>
              </div>
              <p className="text-indigo-300 font-black text-xs uppercase tracking-[5px]">
                {correctCount} / {quiz.questions.length} CORRECT SOLUTIONS
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setAnswers(new Array(quiz.questions.length).fill(null));
                  setTimeLeft(quiz.timeLimit);
                  setState('intro');
                }}
                className="bg-white/5 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition flex items-center justify-center gap-3 border border-white/5"
              >
                <RotateCcw className="w-4 h-4" /> RETRY MISSION
              </button>
              <button
                onClick={() => router.push(`/lectures/${lectureId}`)}
                className="bg-white/10 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-white/20 transition flex items-center justify-center gap-3 border border-white/10"
              >
                <BookOpen className="w-4 h-4" /> RETURN TO TRAINING
              </button>

              <div className="md:col-span-2 mt-2">
                <button
                  onClick={() => router.push(passed ? `/lectures/${Number(lectureId) + 1}` : '/')}
                  className="w-full bg-indigo-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-4"
                >
                  {passed ? 'PROCEED TO NEXT MODULE' : 'BACK TO CURRICULUM'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Link href="/" className="mt-8 block text-center text-slate-700 hover:text-white font-black text-[10px] uppercase tracking-[5px] transition">
              Back to Base
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // QUESTION & ANSWER
  // ══════════════════════════════════════════════
  return (
    <div className="min-h-screen text-slate-100 p-8 font-sans relative">
      <div className="fixed inset-0 bg-[#0b0e14] -z-10" />
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-purple-500/[0.02] -z-10 pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[5px] mb-1">Target Mission</span>
            <div className="text-4xl font-black tracking-tighter text-white">
              {currentIndex + 1} <span className="text-white/30 text-lg">/ {quiz.questions.length}</span>
            </div>
          </div>
          <div className="bg-white/[0.05] border border-white/10 px-8 py-4 rounded-[24px] flex items-center gap-4 backdrop-blur-md">
            <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-indigo-300'}`} />
            <span className={`font-black text-2xl tracking-tighter tabular-nums ${timeLeft < 60 ? 'text-rose-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3 mb-16 p-0.5 border border-white/5">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-lg shadow-indigo-500/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[48px] p-12 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] mb-8">
              <div className="flex gap-4 mb-4">
                {currentQuestion.difficulty === 'hard' && (
                  <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">Hard Difficulty</span>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-10 leading-[0.95]">
                {currentQuestion.question}
              </h2>

              {/* Code Block */}
              {currentQuestion.code && (
                <div className="bg-black/40 border border-white/5 rounded-3xl p-8 mb-10 text-sm font-mono text-indigo-300 overflow-x-auto leading-relaxed">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                  </div>
                  {currentQuestion.code}
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQuestion.correct;
                  const showResult = selectedOption !== null;

                  let style = "text-left p-8 rounded-[36px] border-2 transition-all group relative overflow-hidden flex items-center gap-6 ";

                  if (!showResult) {
                    style += "bg-white/[0.05] border-white/10 hover:border-indigo-500 hover:bg-white/[0.08] cursor-pointer shadow-xl";
                  } else if (isCorrect) {
                    style += "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                  } else if (isSelected) {
                    style += "bg-rose-500/20 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]";
                  } else {
                    style += "bg-black/40 border-white/5 opacity-40 grayscale";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => selectAnswer(i)}
                      disabled={showResult}
                      className={style}
                    >
                      <div className="relative z-10 flex items-center gap-6 w-full">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shrink-0 transition-transform group-hover:scale-110 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white'
                          }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-black text-xl leading-tight flex-1 tracking-tight text-white">{option}</span>

                        {showResult && isCorrect && <CheckCircle className="w-8 h-8 text-emerald-400 drop-shadow-glow shrink-0" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-8 h-8 text-rose-500 drop-shadow-glow shrink-0" />}
                      </div>

                      {/* Interactive glow effect on hover */}
                      {!showResult && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/[0.02] to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {state === 'answer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`p-10 rounded-[40px] border mb-10 ${selectedOption === currentQuestion.correct
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-amber-500/5 border-amber-500/20'
                  }`}
              >
                <h3 className="text-xs font-black uppercase tracking-[4px] mb-4 flex items-center gap-2">
                  {selectedOption === currentQuestion.correct
                    ? <><CheckCircle className="w-4 h-4 text-emerald-400" /> Intelligence Confirmed</>
                    : <><AlertTriangle className="w-4 h-4 text-amber-500" /> Correction Matrix</>}
                </h3>
                <p className="text-slate-300 font-medium leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {state === 'answer' && (
          <button
            onClick={nextQuestion}
            className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[4px] shadow-xl shadow-indigo-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
          >
            {currentIndex < quiz.questions.length - 1
              ? <>CONTINUE <ChevronRight className="w-4 h-4" /></>
              : <>COMPUTE RESULTS <Trophy className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}
