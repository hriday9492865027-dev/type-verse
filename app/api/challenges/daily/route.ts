import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    challengeId: 'daily-142',
    date: new Date().toISOString().split('T')[0],
    title: 'The Matrix of Speed & Discipline',
    targetDuration: 60,
    minAccuracy: 95,
    rewardXp: 250,
    text: "The future belongs to people who practice with purpose and refuse to settle for mediocrity in their daily craft."
  });
}
