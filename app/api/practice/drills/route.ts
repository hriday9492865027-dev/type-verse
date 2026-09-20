import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetKeys } = body;

    return NextResponse.json({
      drillId: 'drill-' + Date.now(),
      targetKeys: targetKeys || ['p', 'b', 'y'],
      exerciseText: 'people build beautiful yellow backyards with precise keystrokes',
      minAccuracy: 95,
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create drill' }, { status: 500 });
  }
}
