import { NextResponse } from 'next/server';
import { CompareRequestSchema } from '@/types';
import { getMockAnalysis } from '@/lib/mockResponses';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CompareRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // If no n8n webhook URL configured, return mock analysis
    if (!process.env.N8N_WEBHOOK_URL) {
      const fingerprint = parsed.data.blocksA.sort().join('-') || 'empty';
      return NextResponse.json({
        fallback: true,
        ...getMockAnalysis(fingerprint),
      });
    }

    // Server-side proxy to n8n webhook
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const text = await n8nRes.text();

      // Strip markdown fences if present
      const clean = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);

      return NextResponse.json(result);
    } catch (fetchError) {
      clearTimeout(timeout);
      const fingerprint = parsed.data.blocksA.sort().join('-') || 'empty';

      return NextResponse.json({
        fallback: true,
        error: String(fetchError),
        ...getMockAnalysis(fingerprint),
      });
    }
  } catch (error) {
    console.error('POST /api/compare error:', error);
    return NextResponse.json(
      { error: 'Failed to process comparison', fallback: true, ...getMockAnalysis('empty') },
      { status: 500 }
    );
  }
}
