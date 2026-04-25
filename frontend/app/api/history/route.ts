import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HistoryModel from '@/models/History';

export async function GET() {
  try {
    await dbConnect();

    const history = await HistoryModel.find({ userId: 'anonymous' })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ history, count: history.length });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const entry = await HistoryModel.create({
      promptA: body.promptA,
      promptB: body.promptB,
      blocks: body.blocks,
      blockCount: body.blocks?.length || 0,
      compositionFingerprint: body.compositionFingerprint,
      userId: 'anonymous',
    });

    return NextResponse.json({ entry, message: 'Saved' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 500 }
    );
  }
}
