// File: src/app/api/webhooks/resend/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Verifikasi bahwa ini adalah event email masuk dari Resend
    if (payload.type === 'email.received') {
      const emailData = payload.data;

      const { error } = await supabaseAdmin
        .from('received_emails')
        .insert([
          {
            sender: emailData.from,
            subject: emailData.subject,
            text_body: emailData.text,
            html_body: emailData.html,
          }
        ]);

      if (error) throw error;
      
      console.log(`New email received from: ${emailData.from}`);
      return NextResponse.json({ message: "Email processed successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Output: Exposes a POST endpoint at /api/webhooks/resend to receive and store Resend payloads.