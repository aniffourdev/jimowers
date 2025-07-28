import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify SMTP connection
    await transporter.verify();
    console.log('SMTP connection verified');

    // Send email to admin
    const adminEmail = await transporter.sendMail({
      from: SMTP_SERVER_USERNAME,
      to: SITE_MAIL_RECIEVER,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">New Contact Form Submission</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #0f766e; margin: 20px 0;">
            <h3 style="color: #0f766e; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This message was sent from the contact form on your lawn care blog.
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmail = await transporter.sendMail({
      from: SMTP_SERVER_USERNAME,
      to: email,
      subject: 'Thank you for contacting us!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">Thank you for reaching out!</h2>
          <p>Dear ${firstName},</p>
          <p>Thank you for contacting us. We have received your message and will get back to you within 24 hours.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0f766e; margin-top: 0;">Your Message:</h3>
            <p style="line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>In the meantime, feel free to explore our blog for helpful lawn care tips and mower reviews.</p>
          <p>Best regards,<br>The Lawn Care Team</p>
        </div>
      `,
    });

    console.log('Contact form emails sent successfully');
    console.log('Admin notification email ID:', adminEmail.messageId);
    console.log('User confirmation email ID:', userEmail.messageId);

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
} 