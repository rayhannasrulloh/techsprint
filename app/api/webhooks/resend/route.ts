// File: src/app/api/webhooks/resend/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Setup Supabase (Super Admin)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Setup Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Verifikasi bahwa ini adalah event email masuk
    if (payload.type === 'email.received') {
      const emailId = payload.data.email_id;
      
      // 1. Tarik konten email full (HTML & Text) dari server Resend
      const { data: fullEmail, error: fetchError } = await resend.emails.receiving.get(emailId);
      
      if (fetchError || !fullEmail) {
         console.error("Error fetching full email:", fetchError);
         return NextResponse.json({ error: "Failed to fetch email body" }, { status: 500 });
      }

      // 2. Simpan konten yang sudah LENGKAP ke Supabase
      const { error: dbError } = await supabaseAdmin
        .from('received_emails')
        .insert([
          {
            sender: fullEmail.from,
            subject: fullEmail.subject,
            text_body: fullEmail.text || null, // Mengambil plain text
            html_body: fullEmail.html || null, // Mengambil format HTML
          }
        ]);

      if (dbError) throw dbError;
      
      return NextResponse.json({ message: "Email processed successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}