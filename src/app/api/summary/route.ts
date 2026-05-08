import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'AI Spend Audit API',
    version: '0.1.0'
  });
}
