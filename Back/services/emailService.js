const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.OTP_RESEND_KEY);
const emailResend = new Resend(process.env.EMAIL_RESEND_KEY);
const passwordResend = new Resend(process.env.PWD_RESEND_KEY);
const banResend = new Resend(process.env.BAN_RESEND_KEY);

const sendOTPEmail = async (email, otpCode, username) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'AuthManager <noreply@authmanager.xyz>',
            to: [email],
            subject: 'Account verification - OTP code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">AuthManager</h1>
                        
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${username},</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                            Thank you for registering with AuthManager! To finalize the creation of your account, 
                            please use the verification code below:
                        </p>
                        
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <h3 style="color: #2563eb; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">
                                ${otpCode}
                            </h3>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                            <strong>Important :</strong> This code expires in 10 minutes. If you haven't requested verification, 
                            you can safely ignore this email.
                        </p>
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                                This email has been sent automatically, please do not reply.
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error while sending the otp code:', error);
            return { success: false, error };
        }

        console.log('OTP Code successfully sent:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error while sending the otp code:', error);
        return { success: false, error: error.message };
    }
};

const sendEmailVerification = async (email, verificationCode, username) => {
    try {
        const { data, error } = await emailResend.emails.send({
            from: 'AuthManager <noreply@authmanager.xyz>',
            to: [email],
            subject: 'Email Verification - AuthManager',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">AuthManager</h1>
                        
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${username},</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                            Please verify your email address to secure your account. 
                            Use the verification code below:
                        </p>
                        
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <h3 style="color: #2563eb; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">
                                ${verificationCode}
                            </h3>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                            <strong>Important:</strong> This code expires in 15 minutes. If you didn't request this verification, 
                            you can safely ignore this email.
                        </p>
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                                This email has been sent automatically, please do not reply.
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error while sending email verification:', error);
            return { success: false, error };
        }

        console.log('Email verification successfully sent:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error while sending email verification:', error);
        return { success: false, error: error.message };
    }
};

const sendPasswordReset = async (email, resetCode, username) => {
    try {
        const { data, error } = await passwordResend.emails.send({
            from: 'AuthManager <noreply@authmanager.xyz>',
            to: [email],
            subject: 'Password Reset - AuthManager',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">AuthManager</h1>
                        
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${username},</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                            You have requested to reset your password. Please use the reset code below to create a new password:
                        </p>
                        
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <h3 style="color: #2563eb; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">
                                ${resetCode}
                            </h3>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                            <strong>Important:</strong> This code expires in 15 minutes. If you didn't request a password reset, 
                            you can safely ignore this email.
                        </p>
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                                This email has been sent automatically, please do not reply.
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error while sending password reset:', error);
            return { success: false, error };
        }

        console.log('Password reset successfully sent:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error while sending password reset:', error);
        return { success: false, error: error.message };
    }
};

const sendBanNotification = async (email, username, isBanned) => {
    try {
        const { data, error } = await banResend.emails.send({
            from: 'AuthManager <noreply@authmanager.xyz>',
            to: [email],
            subject: `Account ${isBanned ? 'Suspended' : 'Reactivated'} - AuthManager`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">AuthManager</h1>
                        
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${username},</h2>
                        
                        ${isBanned ? `
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                <h3 style="color: #dc2626; margin: 0 0 10px 0;">Account Suspended</h3>
                                <p style="color: #991b1b; margin: 0; font-size: 16px;">
                                    Your account has been suspended by an administrator. You will no longer be able to access AuthManager services.
                                </p>
                            </div>
                            
                            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                                If you believe this action was taken in error, please contact our support team for assistance.
                            </p>
                        ` : `
                            <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                <h3 style="color: #16a34a; margin: 0 0 10px 0;">Account Reactivated</h3>
                                <p style="color: #15803d; margin: 0; font-size: 16px;">
                                    Your account has been reactivated by an administrator. You can now access AuthManager services again.
                                </p>
                            </div>
                            
                            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                                Welcome back! You can now log in to your account and resume using our services.
                            </p>
                        `}
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                                This email has been sent automatically, please do not reply.
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error while sending ban notification:', error);
            return { success: false, error };
        }

        console.log('Ban notification successfully sent:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error while sending ban notification:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendEmailVerification,
    sendPasswordReset,
    sendBanNotification
};