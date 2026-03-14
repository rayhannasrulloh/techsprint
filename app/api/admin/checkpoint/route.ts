// File: src/app/api/admin/checkpoint/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function PATCH(request: Request) {
  try {
    const { cpId, is_reviewed } = await request.json();

    const { error } = await supabaseAdmin
      .from('checkpoints')
      .update({ is_reviewed: is_reviewed })
      .eq('id', cpId);

    if (error) throw error;
    return NextResponse.json({ message: "Checkpoint reviewed successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}