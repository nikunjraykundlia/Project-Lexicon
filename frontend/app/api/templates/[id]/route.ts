import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TemplateModel from '@/models/Template';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await TemplateModel.findOneAndDelete({
      _id: id,
      userId: 'anonymous',
    });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Deleted', id });
  } catch (error) {
    console.error('DELETE /api/templates/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updated = await TemplateModel.findOneAndUpdate(
      { _id: id, userId: 'anonymous' },
      {
        name: body.name,
        blocks: body.blocks,
        blockCount: body.blocks?.length,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ template: updated, message: 'Updated' });
  } catch (error) {
    console.error('PUT /api/templates/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}
