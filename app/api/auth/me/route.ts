import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'user-default-1',
      username: 'TypistPrime',
      displayName: 'Star Typist',
      avatarUrl: '⚡',
      level: 3,
      xp: 480,
      streakDays: 7,
      preferences: {
        theme: 'cosmic',
        soundEnabled: true,
        fontFamily: 'geist-mono',
      },
    },
  });
}
