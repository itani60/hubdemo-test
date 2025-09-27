/**
 * Cloudflare Turnstile Configuration
 * Managed mode with implicit rendering - intelligent challenge display
 * Privacy-focused alternative to reCAPTCHA
 * Following official Cloudflare documentation best practices
 */

window.TURNSTILE_CONFIG = {
    // Cloudflare Turnstile site key (matches lambda environment)
    siteKey: '0x4AAAAAAB3faEFmb8ePRkfo',

    // Turnstile theme options (matches HTML data-theme)
    theme: 'light', // 'light', 'dark', or 'auto'

    // Turnstile size options (matches HTML data-size for implicit rendering)
    size: 'normal', // 'normal' for visible widget, 'invisible' for hidden

    // Execution mode - when to run the challenge
    execution: 'render', // 'render' for automatic execution on page load

    // Appearance mode - when the widget is visible
    appearance: 'always', // 'always' for visible widget
    
    // Language (optional)
    language: 'en',
    
    // Debug mode for testing (set to false in production)
    debug: false,
    
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