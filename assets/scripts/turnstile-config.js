/**
 * Cloudflare Turnstile Configuration
 * Managed mode with implicit rendering - intelligent challenge display
 * Privacy-focused alternative to reCAPTCHA
 * Following official Cloudflare documentation best practices
 */

window.TURNSTILE_CONFIG = {
     // Cloudflare Turnstile site key (Production key)
        siteKey: '0x4AAAAAAB3qNtVK4DShvWVn',

    // Turnstile theme options (matches HTML data-theme)
    theme: 'light', // 'light', 'dark', or 'auto'

    // Turnstile size options (matches HTML data-size for implicit rendering)
    size: 'invisible', // 'normal' for visible widget, 'invisible' for hidden

    // Execution mode - when to run the challenge
    execution: 'execute', // 'execute' for programmatic execution (recommended for invisible)

    // Appearance mode - when the widget is visible
    appearance: 'execute', // 'execute' = widget only appears while executing (invisible UX)
    
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