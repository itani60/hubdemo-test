/**
 * reCAPTCHA Configuration
 * Update this file with your actual reCAPTCHA site key
 */

window.RECAPTCHA_CONFIG = {
    // Replace with your actual reCAPTCHA v3 site key
    siteKey: '6LdEZtArAAAAABY0urfvtfqD0BVI9H6rDSv-Irba',
    
    // Actions for different authentication flows
    actions: {
        login: 'login',
        register: 'register',
        verifyEmail: 'verify_email',
        resendVerification: 'resend_verification',
        forgotPassword: 'forgot_password',
        resetPassword: 'reset_password',
        resendForgotCode: 'resend_forgot_code'
    }
};
