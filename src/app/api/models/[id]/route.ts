import { query } from '@/lib/db';
import { getUserId } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ============================================================================
  // CHALLENGE TASK 4: Fix the security vulnerability below
  // ============================================================================
  //
  // There is a critical security issue in this query.
  // Find it, fix it, and add a brief comment explaining what was wrong.
  //
  // Also: the current code never returns a 404 even when the model doesn't
  // exist. Fix that too. (Hint: check CONVENTIONS.md for DELETE patterns)
  //
  // DO NOT use AI tools. Your screen recording will be reviewed.
  // ============================================================================

  // Fixed: was using string interpolation, which allows SQL injection.
  // Now uses parameterized placeholders ($1, $2) and RETURNING to detect missing rows.
  const result = await query(
    `DELETE FROM models WHERE id = $1 AND added_by = $2 RETURNING id`,
    [id, userId],
  );

  if (result.length === 0) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
