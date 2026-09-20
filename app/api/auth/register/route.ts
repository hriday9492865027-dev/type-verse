import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: username, email, and password' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Return authenticated user profile object
    return NextResponse.json({
      success: true,
      user: {
        id: 'user-' + Date.now(),
        username,
        email,
        displayName: username,
        level: 1,
        xp: 0,
        streakDays: 1,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
