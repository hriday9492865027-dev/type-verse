import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    games: [
      { id: 'falling-words', name: 'Falling Words', mode: 'arcade' },
      { id: 'survival', name: 'Survival Rush', mode: 'time_attack' },
      { id: 'typequest', name: 'TypeQuest Campaign', mode: 'rpg_boss' }
    ]
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    return NextResponse.json({
      sessionId: 'game-sess-' + Date.now(),
      gameId,
      status: 'active',
      startedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create game session' }, { status: 500 });
  }
}
