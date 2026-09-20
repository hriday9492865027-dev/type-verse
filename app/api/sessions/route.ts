import { NextResponse } from 'next/server';
import { validateTypingSessionPayload } from '@/lib/api/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation matching PRD Page 15 & 16
    const validation = validateTypingSessionPayload(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason }, { status: 422 });
    }

    const { mode, durationSeconds, wpm, accuracy, totalChars, correctChars, incorrectChars } = body;

    const sessionRecord = {
      id: 'srv-' + Date.now(),
      mode,
      durationSeconds,
      wpm,
      accuracy,
      totalChars,
      correctChars,
      incorrectChars,
      receivedAt: new Date().toISOString(),
      validated: true
    };

    return NextResponse.json({ success: true, session: sessionRecord });
  } catch {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    sessions: [
      { id: 's1', mode: 'time', durationSeconds: 60, wpm: 68, accuracy: 97.2, createdAt: '2026-09-18T10:00:00Z' },
      { id: 's2', mode: 'time', durationSeconds: 30, wpm: 65, accuracy: 96.0, createdAt: '2026-09-17T15:30:00Z' }
    ]
  });
}
