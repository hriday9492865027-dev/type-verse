import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      token: 'typeverse_session_jwt_mock',
      user: {
        id: 'user-default-1',
        username: 'TypistPrime',
        email,
        displayName: 'Star Typist',
        level: 3,
        xp: 480,
        streakDays: 7,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
