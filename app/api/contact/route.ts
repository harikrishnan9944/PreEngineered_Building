import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, serviceInterest, message } = body;

    // 1. Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 2. Minimal SMTP Environment Variables check (Strictly only SMTP_USER and SMTP_PASS)
    const { SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_USER || !SMTP_PASS) {
      console.error('SMTP credentials (SMTP_USER or SMTP_PASS) are missing in environment variables.');
      return NextResponse.json(
        { error: 'Mail server credentials not configured. Please contact administration.' },
        { status: 500 }
      );
    }

    // 3. Auto-detect service from SMTP_USER domain or default to Gmail
    const userDomain = SMTP_USER.split('@')[1] || '';
    let emailService = 'gmail'; // default
    if (userDomain.includes('outlook') || userDomain.includes('hotmail') || userDomain.includes('live')) {
      emailService = 'outlook';
    } else if (userDomain.includes('yahoo')) {
      emailService = 'yahoo';
    } else if (userDomain.includes('icloud')) {
      emailService = 'icloud';
    }

    // 4. Create SMTP transporter using service preset (no host or port)
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid/self-signed certs (common with antivirus/firewalls/proxies intercepting traffic)
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });

    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const fixedAdminEmail = 'inquiry@shreenivibuildtech.com';

    // 5. Compose Admin Email Notification with subject "New Lead from SHREE NIVI BUILDTECH"
    const adminMailOptions = {
      from: `"Shree Nivi Web Portal" <${SMTP_USER}>`,
      to: fixedAdminEmail,
      replyTo: email,
      subject: 'New Lead from SHREE NIVI BUILDTECH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <h2 style="color: #ff5a00; border-bottom: 2px solid #ff5a00; padding-bottom: 10px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">
            New Lead Inquiry Alert
          </h2>
          <p style="font-size: 14px; margin-bottom: 20px; color: #475569;">
            A visitor has submitted a new inquiry form on the Shree Nivi Buildtech homepage contact portal. Details are outlined below:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; width: 180px; border-bottom: 1px solid #e2e8f0;">Full Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email Address:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #ff5a00; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Phone Number:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone ? `<a href="tel:${phone}" style="color: #1e293b; text-decoration: none;">${phone}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Service Interest:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${serviceInterest || 'General Inquiry'}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Subject:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${subject || 'No subject'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Submission Time:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${submissionTime} (IST)</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 14px; line-height: 1.6;">
            <strong style="color: #0f172a; display: block; margin-bottom: 5px;">Project Specifications / Message:</strong>
            <p style="margin: 0; white-space: pre-wrap; color: #334155;">${message}</p>
          </div>
          
          <footer style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            This email was auto-generated by the Shree Nivi Web Portal Server.
          </footer>
        </div>
      `,
    };

    // 6. Transmit email to fixed admin
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { success: true, message: 'Lead recorded and notification email sent successfully.' },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('Nodemailer API route error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to transmit email notification.' },
      { status: 500 }
    );
  }
}
