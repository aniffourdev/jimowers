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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify SMTP connection
    await transporter.verify();
    console.log('SMTP connection verified');

    // Send confirmation email to subscriber
    const subscriberEmail = await transporter.sendMail({
      from: SMTP_SERVER_USERNAME,
      to: email,
      subject: 'Welcome to Our Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">Welcome to Our Newsletter!</h2>
          <p>Thank you for subscribing to our newsletter. You'll now receive the latest lawn care tips, mower reviews, and eco-friendly gardening advice.</p>
          <p>Stay tuned for valuable content delivered straight to your inbox!</p>
          <br>
          <p>Best regards,<br>The Lawn Care Team</p>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmail = await transporter.sendMail({
      from: SMTP_SERVER_USERNAME,
      to: SITE_MAIL_RECIEVER,
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">New Newsletter Subscription</h2>
          <p>A new user has subscribed to your newsletter:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log('Newsletter subscription emails sent successfully');
    console.log('Subscriber email ID:', subscriberEmail.messageId);
    console.log('Admin notification email ID:', adminEmail.messageId);

    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return NextResponse.json(
      { message: 'Failed to process subscription' },
      { status: 500 }
    );
  }
} 