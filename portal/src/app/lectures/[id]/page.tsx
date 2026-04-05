// src/app/lectures/[id]/page.tsx
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

interface LecturePageProps {
  params: {
    id: string;
  };
}

const LECTURES = {
  '1': {
    title: 'Solana Fundamentals for Frontend Developers',
    file: 'lecture-1.md',
    duration: '2 hours',
    quiz: '/quiz/1',
  },
  '2': {
    title: 'Wallet Integration & Transaction Signing',
    file: 'lecture-2.md',
    duration: '2 hours',
    quiz: '/quiz/2',
  },
  '3': {
    title: 'Reading & Writing On-Chain Data',
    file: 'lecture-3.md',
    duration: '2 hours',
    quiz: '/quiz/3',
  },
  '4': {
    title: 'Production-Ready dApp Patterns',
    file: 'lecture-4.md',
    duration: '2 hours',
    quiz: '/quiz/4',
  },
};

export default async function LecturePage({ params }: LecturePageProps) {
  const lecture = LECTURES[params.id as keyof typeof LECTURES];

  if (!lecture) {
    notFound();
  }

  // Reading MD file
  const filePath = path.join(process.cwd(), 'public', 'lectures', lecture.file);
  let content = '';

  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    content = `# Lecture ${params.id}\n\nLoading content...`;
  }

  return (
    <div key={params.id} className="min-h-screen text-slate-100 relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#020617] -z-20" />
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] -z-10 pointer-events-none" />
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-4"
          >
            ← Back to curriculum
          </Link>
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter text-white drop-shadow-lg">Lecture {params.id}</h1>
          <p className="text-xl text-indigo-100 font-bold drop-shadow-sm">{lecture.title}</p>
          <div className="flex gap-4 mt-8 text-sm font-black uppercase tracking-[2px]">
            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
              ⏱️ {lecture.duration}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-blue-200">
              📚 INTERACTIVE CONTENT
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-8 py-20 relative z-10">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 shadow-2xl">
          <MarkdownRenderer content={content} />
        </div>

        {/* Next Steps Footer */}
        <div className="mt-20 p-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-indigo-400">
            🎯 Ready for the test?
          </h3>
          <p className="mb-12 text-slate-200 font-medium text-lg leading-relaxed">
            Test your knowledge after Lecture {params.id}. After passing the test, you will earn progress points.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={lecture.quiz}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 uppercase"
            >
              📝 Take the quiz
            </Link>
            <Link
              href={`/games/wallet-simulator`}
              className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition uppercase"
            >
              🎮 Play Simulator
            </Link>
            {Number(params.id) < 4 && (
              <Link
                href={`/lectures/${Number(params.id) + 1}`}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 uppercase"
                prefetch={false}
              >
                Next Lecture →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
}
