import { NextResponse } from 'next/server';
import { runAudit } from '@/lib/auditEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = runAudit(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process audit' }, { status: 400 });
  }
}
