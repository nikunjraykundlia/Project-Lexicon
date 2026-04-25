import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TemplateModel from '@/models/Template';
import { SaveTemplateSchema } from '@/types';

export async function GET() {
  try {
    await dbConnect();

    const templates = await TemplateModel.find({ userId: 'anonymous' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ templates, count: templates.length });
  } catch (error) {
    console.error('GET /api/templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = SaveTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid template data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, blocks } = parsed.data;

    const template = await TemplateModel.create({
      name,
      blocks,
      blockCount: blocks.length,
      userId: 'anonymous',
    });

    return NextResponse.json(
      { template, message: 'Saved' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/templates error:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}
