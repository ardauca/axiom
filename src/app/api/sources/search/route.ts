import { NextRequest, NextResponse } from 'next/server';
import { searchAcademicSources } from '@/lib/sources/sourceSearch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ success: false, error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const result = await searchAcademicSources(query);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
