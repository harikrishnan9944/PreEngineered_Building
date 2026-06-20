import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import { JobApplication } from '@/models/schemas';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim() || 'Not provided';
    const position = formData.get('position')?.toString().trim();
    const coverLetter = formData.get('coverLetter')?.toString().trim();
    const resumeFile = formData.get('resume') as File | null;

    // 1. Validations
    if (!name || !email || !position || !coverLetter) {
      return NextResponse.json(
        { error: 'Full Name, Email, Position, and Cover Letter are required fields.' },
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

    // 2. Load SMTP Credentials
    const { SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_USER || !SMTP_PASS) {
      console.error('SMTP credentials missing in environment variables.');
      return NextResponse.json(
        { error: 'Mail server is not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    // 3. Process resume file & Save locally to public/uploads for CMS download
    let attachment = null;
    let resumeUrl = '';
    if (resumeFile && resumeFile.size > 0) {
      try {
        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Save file locally
        const ext = resumeFile.name.split('.').pop() || 'pdf';
        const filename = `resume-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        resumeUrl = `/uploads/${filename}`;

        attachment = {
          filename: resumeFile.name,
          content: buffer,
          contentType: resumeFile.type || 'application/octet-stream',
        };
      } catch (fileErr) {
        console.error('Error processing resume file attachment:', fileErr);
        return NextResponse.json(
          { error: 'Failed to process the uploaded resume file.' },
          { status: 400 }
        );
      }
    }

    // Save application to MongoDB
    try {
      await connectToDatabase();
      await JobApplication.create({
        jobId: position ? position.toLowerCase().replace(/\s+/g, '-') : 'general',
        jobTitle: position || 'General Application',
        name,
        email,
        phone,
        coverLetter,
        resumeUrl,
        status: 'unread',
        timestamp: new Date()
      });
    } catch (dbErr) {
      console.error('Failed to save job application to MongoDB:', dbErr);
      // We continue to send the email even if DB save fails
    }

    // 4. Setup Nodemailer Transporter using Gmail SMTP (smtp.gmail.com, port 465)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // True for port 465 SSL connection
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        // Essential to avoid local certificate verification issues (e.g. self-signed cert in chain errors)
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      socketTimeout: 20000,
    });

    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const fixedAdminEmail = 'inquiry@shreenivibuildtech.com';

    // 5. Compose HTML body for Admin Email
    const adminMailOptions = {
      from: `"Shree Nivi Careers" <${SMTP_USER}>`,
      to: fixedAdminEmail,
      replyTo: email,
      subject: `New Job Application - ${position}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
          <h2 style="color: #ff5a00; border-bottom: 2px solid #ff5a00; padding-bottom: 12px; margin-top: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            New Candidate Application
          </h2>
          <p style="font-size: 14px; margin-bottom: 25px; color: #64748b;">
            A candidate has submitted a new job application via the Shree Nivi Careers Portal. Application details are listed below:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 25px;">
            <tr style="background-color: #f8fafc;">
              <td style="padding: 12px; font-weight: bold; width: 180px; border-bottom: 1px solid #e2e8f0; color: #475569;">Candidate Name:</td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Email Address:</td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #ff5a00; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Phone Number:</td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Position Applied:</td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #ff5a00; font-weight: 700; text-transform: uppercase; font-size: 13px;">${position}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Submitted On:</td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 12px;">${submissionTime} (IST)</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Resume:</td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: ${attachment ? '#16a34a' : '#dc2626'}">
                ${attachment ? `✓ Attached (${resumeFile?.name})` : '✕ Not provided'}
              </td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 20px; background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; font-size: 14px;">
            <strong style="color: #0f172a; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Cover Letter / Message:</strong>
            <p style="margin: 0; white-space: pre-wrap; color: #334155; font-size: 13px; line-height: 1.6;">${coverLetter}</p>
          </div>
          
          <footer style="margin-top: 35px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; font-family: monospace;">
            Shree Nivi Buildtech Human Resources System
          </footer>
        </div>
      `,
      attachments: attachment ? [attachment] : [],
    };

    // 6. Transmit email
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.' },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('Careers Application Route Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to transmit application email.' },
      { status: 500 }
    );
  }
}
