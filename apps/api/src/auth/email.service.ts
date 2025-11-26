import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // TODO: Configure with your email provider (SendGrid, Mailgun, etc.)
    // For development, you can use Ethereal Email (fake SMTP)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // TODO: Replace with your SMTP host
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@example.com', // TODO: Replace with EMAIL_API_KEY or credentials
        pass: 'your-password', // TODO: Replace with your email password
      },
    });
  }

  async sendVerificationEmail(to: string, verificationUrl: string) {
    const emailFrom = this.configService.get('EMAIL_FROM') || 'noreply@fitquest.com';
    const emailFromName = this.configService.get('EMAIL_FROM_NAME') || 'FitQuest';

    try {
      await this.transporter.sendMail({
        from: `"${emailFromName}" <${emailFrom}>`,
        to,
        subject: 'Verify Your FitQuest Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #00E676;">Welcome to FitQuest! 🎮</h1>
            <p>Thanks for signing up! Click the button below to verify your email and start your fitness adventure.</p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #00E676; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              Verify Email
            </a>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">If you didn't create a FitQuest account, you can safely ignore this email.</p>
          </div>
        `,
      });

      console.log(`✅ Verification email sent to ${to}`);
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      // TODO: Log error to monitoring service
    }
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const emailFrom = this.configService.get('EMAIL_FROM') || 'noreply@fitquest.com';
    const emailFromName = this.configService.get('EMAIL_FROM_NAME') || 'FitQuest';

    try {
      await this.transporter.sendMail({
        from: `"${emailFromName}" <${emailFrom}>`,
        to,
        subject: 'Reset Your FitQuest Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #00E676;">Password Reset Request</h1>
            <p>We received a request to reset your FitQuest password. Click the button below to create a new password.</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #00E676; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
        `,
      });

      console.log(`✅ Password reset email sent to ${to}`);
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      // TODO: Log error to monitoring service
    }
  }
}
