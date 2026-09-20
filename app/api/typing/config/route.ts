import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    modes: ['time', 'words', 'quote', 'code', 'custom'],
    timeOptions: [15, 30, 60, 120],
    wordOptions: [10, 25, 50, 100],
    codeLanguages: ['javascript', 'python', 'html'],
    defaultDuration: 30,
    scoringConvention: {
      formula: '(correct_characters / 5) / time_in_minutes',
      unadjustedCharsDiscarded: true,
      minWeakKeyThreshold: 3
    }
  });
}
