import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // `to` can be a string or an array of strings. Resend allows an array of strings up to 50 recipients.
    // However, if we're broadcasting, we might want to send them individually or use bcc if it's many.
    // For simplicity, we can pass `to` as an array or a single string.
    
    // To avoid exposing other people's emails, if it's a broadcast (array with multiple), we might send them one by one
    // or use bcc. Actually, Resend supports `bcc` for this purpose, but it's safer to just iterate and send or use `bcc`.
    // Let's just use `to` for single recipients, and if it's an array, we can use `bcc` or send multiple requests.
    // Resend Batch API is best for this, but standard send works too. Let's just use simple send.
    
    // Convert `to` to array if it's not
    const toList = Array.isArray(to) ? to : [to];

    // If it's a broadcast to multiple people, it's better to BCC them so they don't see each other's emails
    // Or we can just send multiple individual emails.
    const BATCH_SIZE = 50; // Resend allows up to 50 recipients in a single email's to/bcc/cc fields
    
    if (toList.length === 1) {
      const { data, error } = await resend.emails.send({
        from: '3IN1 Tech Sprint <academic@techsprint.web.id>',
        to: toList[0],
        subject,
        html: html || text,
        text: text || "",
      });

      if (error) {
        console.error("Resend Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    } else {
      // Send multiple individually to avoid BCC spam filters or expose emails
      const promises = toList.map(email => 
        resend.emails.send({
          from: '3IN1 Tech Sprint <academic@techsprint.web.id>',
          to: email,
          subject,
          html: html || text,
          text: text || "",
        })
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        console.error("Some emails failed to send:", errors);
        return NextResponse.json({ success: true, message: `Sent with ${errors.length} errors`, errors }, { status: 207 });
      }

      return NextResponse.json({ success: true, message: `Successfully sent ${toList.length} emails` }, { status: 200 });
    }

  } catch (error: any) {
    console.error("Send Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
