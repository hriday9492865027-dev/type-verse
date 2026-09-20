import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    weakKeys: [
      { key: 'p', errorRate: 0.28, avgLatencyMs: 420, recommendation: 'Top pinky extension' },
      { key: 'b', errorRate: 0.22, avgLatencyMs: 380, recommendation: 'Bottom index stretch' },
      { key: 'y', errorRate: 0.18, avgLatencyMs: 350, recommendation: 'Top row cross-reach' }
    ],
    generatedDrillText: "pp bb yy pay boy pub bypass pinpoint dynamic rhythm",
    modelWeights: { alpha: 0.55, beta: 0.25, gamma: 0.20 }
  });
}
