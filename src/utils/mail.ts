import { Resend } from 'resend';

export const sendEmail = (email: string, token: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Hello World',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Verify Your Email</h2>
                <p style="color: #666; text-align: center; margin-bottom: 30px;">Click the button below to verify your email address</p>
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}" 
                       style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                        Verify Email
                    </a>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        </div>
        `
    });
}

export const sendResetPasswordEmail = (email: string, token: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset Your Password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
                <p style="color: #666; text-align: center; margin-bottom: 30px;">Click the button below to reset your password</p>
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}" 
                       style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        </div>
        `
    });
}