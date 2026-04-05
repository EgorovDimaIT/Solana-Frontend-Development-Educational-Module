// src/app/quiz/[id]/page.tsx
import { notFound } from 'next/navigation';
import { QuizEngine } from '@/components/QuizEngine';
import { QUIZZES } from '@/lib/quiz-data';
import Link from 'next/link';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const quiz = QUIZZES[params.id as keyof typeof QUIZZES];

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-12">
        <h1 className="text-4xl font-black mb-6 text-white uppercase tracking-tighter">Quiz Not Found</h1>
        <p className="text-slate-500 mb-10 max-w-md">We are currently preparing questions for this module. Try the first module or check back later.</p>
        <Link href="/" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-white">
          BACK TO CURRICULUM
        </Link>
      </div>
    );
  }

  return (
    <div key={params.id} className="min-h-screen text-white selection:bg-indigo-500/30 relative overflow-hidden">
      <div className="fixed inset-0 bg-[#020617] -z-20" />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Quiz Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-8 flex justify-between items-center px-12 relative z-10">
        <Link href={`/lectures/${params.id}`} className="bg-white/5 px-5 py-2 rounded-xl text-indigo-400 font-black text-[10px] tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
          ← Back to lecture
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-black tracking-[4px] text-indigo-500 uppercase block mb-1">MODULE {params.id} QUIZ</span>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{quiz.title}</h2>
        </div>
        <div className="w-40" /> {/* balancing */}
      </div>

      <div className="max-w-5xl mx-auto py-16 px-8 relative z-10">
        <QuizEngine quiz={quiz} lectureId={params.id} />
      </div>
    </div>
  );
}
