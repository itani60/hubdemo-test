/**
 * Cloudflare Turnstile Configuration
 * Invisible mode - no user interaction required
 * Privacy-focused alternative to reCAPTCHA
 * Following official Cloudflare documentation best practices
 */

window.TURNSTILE_CONFIG = {
    // Cloudflare Turnstile site key
    siteKey: '0x4AAAAAAB3faEFmb8ePRkfo',
    
    // Turnstile theme options
    theme: 'light', // 'light', 'dark', or 'auto'
    
    // Turnstile size options
    size: 'invisible', // 'invisible' for no user interaction
    
    // Execution mode - when to run the challenge
    execution: 'execute', // 'execute' for on-demand challenges
    
    // Appearance mode - when the widget is visible
    appearance: 'execute', // 'execute' for invisible challenges
    
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