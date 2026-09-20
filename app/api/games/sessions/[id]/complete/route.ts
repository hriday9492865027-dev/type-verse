import { NextResponse } from 'next/server';
import { validateTypingSessionPayload } from '@/lib/api/validation';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { score, accuracy, durationSeconds } = body;

    const validation = validateTypingSessionPayload({
      durationSeconds: durationSeconds || 30,
      wpm: Math.round((score || 0) / 10),
      accuracy: accuracy || 100,
      totalChars: score || 100,
      correctChars: score || 100,
      incorrectChars: 0,
    });

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      sessionId: id,
      verified: true,
      rewardXp: Math.round((score || 100) * 0.5),
      completedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to complete game session' }, { status: 500 });
  }
}
