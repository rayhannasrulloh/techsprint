// File: src/app/api/admin/team/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Menggunakan SERVICE ROLE KEY untuk hak akses Super Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function PATCH(request: Request) {
  try {
    const { teamId, status } = await request.json();

    // Update status di tabel teams
    const { error } = await supabaseAdmin
      .from('teams')
      .update({ status: status })
      .eq('id', teamId);

    if (error) throw error;
    return NextResponse.json({ message: `Team status updated to ${status}` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { teamId } = await request.json();

    // 1. Hapus dari tabel teams (cascade akan menghapus checkpoint/submission terkait)
    const { error: dbError } = await supabaseAdmin
      .from('teams')
      .delete()
      .eq('id', teamId);
    
    if (dbError) throw dbError;

    // 2. Hapus permanen dari Supabase Authentication (User Accounts)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(teamId);
    if (authError) throw authError;

    return NextResponse.json({ message: "Team deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}