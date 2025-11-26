import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  // ========================================
  // REGISTER
  // ========================================
  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        isVerified: false,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Save hashed token
    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    const frontendUrl = this.configService.get('NEXT_PUBLIC_FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/verify?token=${verificationToken}&email=${user.email}`;

    await this.emailService.sendVerificationEmail(user.email, verificationUrl);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id,
    };
  }

  // ========================================
  // VERIFY EMAIL
  // ========================================
  async verifyEmail(token: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Hash the provided token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find verification token
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        tokenHash,
        expiresAt: { gte: new Date() },
      },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Update user
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete verification token
    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Initialize gamification data
    await this.initializeUserGamification(user.id);

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  // ========================================
  // RESEND VERIFICATION
  // ========================================
  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Delete old tokens
    await this.prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send email
    const frontendUrl = this.configService.get('NEXT_PUBLIC_FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/verify?token=${verificationToken}&email=${user.email}`;

    await this.emailService.sendVerificationEmail(user.email, verificationUrl);

    return {
      message: 'Verification email sent. Please check your inbox.',
    };
  }

  // ========================================
  // LOGIN
  // ========================================
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.generateRefreshToken(user.id);

    // Check if user completed quiz
    const quizResponse = await this.prisma.quizResponse.findUnique({
      where: { userId: user.id },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      needsQuiz: !quizResponse,
    };
  }

  // ========================================
  // REFRESH TOKEN
  // ========================================
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Hash the refresh token
      const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      // Verify token exists in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { tokenHash },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user.id, user.email, user.role);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ========================================
  // LOGOUT
  // ========================================
  async logout(refreshToken: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });

    return { message: 'Logged out successfully' };
  }

  // ========================================
  // FORGOT PASSWORD
  // ========================================
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Don't reveal if user exists
    if (!user) {
      return {
        message: 'If an account exists with this email, you will receive a password reset link.',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Delete old reset tokens
    await this.prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Save new reset token
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset email
    const frontendUrl = this.configService.get('NEXT_PUBLIC_FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${user.email}`;

    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    return {
      message: 'If an account exists with this email, you will receive a password reset link.',
    };
  }

  // ========================================
  // RESET PASSWORD
  // ========================================
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    // Hash the provided token
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    // Find reset token
    const resetToken = await this.prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        tokenHash,
        used: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordReset.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    // Delete all refresh tokens (force re-login)
    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    return {
      message: 'Password reset successfully. Please log in with your new password.',
    };
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private generateAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
      },
    );
  }

  private async generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    );

    // Hash and store refresh token
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return refreshToken;
  }

  private async initializeUserGamification(userId: string) {
    // Create avatar
    await this.prisma.avatar.create({
      data: {
        userId,
        appearance: {},
        unlockedItems: [],
      },
    });

    // Create progress
    await this.prisma.progress.create({
      data: {
        userId,
        xpTotal: 0,
        level: 1,
        points: 0,
        streakDays: 0,
      },
    });
  }
}
