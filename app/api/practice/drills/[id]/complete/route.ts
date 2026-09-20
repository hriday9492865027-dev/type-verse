import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { accuracy, wpm } = body;

    if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
      return NextResponse.json({ error: 'Invalid accuracy percentage' }, { status: 422 });
    }

    const passed = accuracy >= 95;

    return NextResponse.json({
      success: true,
      drillId: id,
      passed,
      accuracy,
      wpm,
      rewardXp: passed ? 150 : 50,
      completedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to record drill completion' }, { status: 500 });
  }
}
