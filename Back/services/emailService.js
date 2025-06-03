const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.OTP_RESEND_KEY);

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

module.exports = {
    sendOTPEmail
};