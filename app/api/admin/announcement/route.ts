// File: src/app/api/admin/announcement/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const { title, content, is_pinned, author } = await request.json();

    const { error } = await supabaseAdmin
      .from('announcements')
      .insert([{ 
        title, 
        content, 
        is_pinned, 
        author 
      }]);

    if (error) throw error;
    return NextResponse.json({ message: "Broadcast sent successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}