/**
 * AWS Authentication Service
 * Handles user registration and email verification with AWS Lambda backend
 */

class AWSAuthService {
    constructor() {
        this.baseURL = 'https://da84s1s15g.execute-api.af-south-1.amazonaws.com';
        this.endpoints = {
            register: '/auth/register',
            verifyEmail: '/auth/verify-email',
            resendVerification: '/auth/resend-verification'
        };
        
        // Turnstile widget management
        this.turnstileWidgetId = null;
        
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Initialize the AWS Auth service
     */
    initialize() {
        this.setupEventListeners();
        this.initializeOTPInputs();
        console.log('AWS Auth Service initialized');
    }

    /**
     * Setup event listeners for forms
     */
    setupEventListeners() {
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // OTP verification form
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => this.handleVerifyEmail(e));
        }

        // Resend OTP button
        const resendBtn = document.getElementById('resendOtpBtn');
        if (resendBtn) {
            resendBtn.addEventListener('click', () => this.resendVerificationCode());
        }
    }

    /**
     * Initialize OTP input functionality
     */
    initializeOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        
        otpInputs.forEach((input, index) => {
            // Handle input
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Only allow digits
                if (!/^\d$/.test(value)) {
                    e.target.value = '';
                    return;
                }
                
                // Move to next input
                if (value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                
                this.checkOTPCompletion();
            });
            
            // Handle backspace
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
            
            // Handle paste
            input.addEventListener('paste', (e) => this.handleOTPPaste(e));
        });
    }

    /**
     * Handle OTP paste
     */
    handleOTPPaste(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        const otpInputs = document.querySelectorAll('.otp-input');
        digits.split('').forEach((digit, index) => {
            if (otpInputs[index]) {
                otpInputs[index].value = digit;
            }
        });
        
        // Focus last filled input or first empty
        const lastFilledIndex = Math.min(digits.length - 1, otpInputs.length - 1);
        if (otpInputs[lastFilledIndex]) {
            otpInputs[lastFilledIndex].focus();
        }
        
        this.checkOTPCompletion();
    }

    /**
     * Check if OTP is complete
     */
    checkOTPCompletion() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const otpCode = Array.from(otpInputs).map(input => input.value).join('');
        const verifyBtn = document.getElementById('verifyOtpBtn');
        
        if (verifyBtn) {
            verifyBtn.disabled = otpCode.length !== 6;
        }
        
        return otpCode.length === 6;
    }

    /**
     * Get OTP code from inputs
     */
    getOTPCode() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const otpCode = Array.from(otpInputs).map(input => input.value).join('');
        
        // Debug logging for OTP collection
        console.log('OTP Collection Debug:', {
            individualInputs: Array.from(otpInputs).map((input, index) => ({
                index,
                value: input.value,
                length: input.value.length,
                charCodes: input.value.split('').map(char => char.charCodeAt(0))
            })),
            finalOTP: otpCode,
            otpLength: otpCode.length,
            otpType: typeof otpCode,
            otpCharCodes: otpCode.split('').map(char => char.charCodeAt(0)),
            isOnlyDigits: /^\d+$/.test(otpCode)
        });
        
        // Sanitize the OTP to ensure it's clean
        const sanitizedOTP = otpCode.replace(/\D/g, ''); // Remove any non-digit characters
        
        if (sanitizedOTP !== otpCode) {
            console.warn('OTP contained non-digit characters:', {
                original: otpCode,
                sanitized: sanitizedOTP
            });
        }
        
        return sanitizedOTP;
    }

    /**
     * Clear OTP inputs
     */
    clearOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach(input => {
            input.value = '';
        });
        this.checkOTPCompletion();
    }

    /**
     * Handle registration form submission
     */
    async handleRegister(event) {
        event.preventDefault();
        
        // Prevent multiple simultaneous submissions
        if (this.isRegistering) {
            console.log('Registration already in progress, ignoring duplicate submission');
            return;
        }
        
        this.isRegistering = true;
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Get form values
        const registrationData = {
            email: formData.get('email'),
            password: formData.get('password'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName')
        };
        
        // Validate form data
        if (!this.validateRegistrationData(registrationData)) {
            return;
        }
        
        // Check if Turnstile is required and get token
        const captchaToken = await this.getCaptchaToken();
        if (captchaToken) {
            registrationData.captchaToken = captchaToken;
        }
        
        try {
            this.setSubmitButtonLoading(true);
            this.hideRegistrationError();
            
            const response = await this.register(registrationData);
            
            if (response.success) {
                this.showOTPVerification(registrationData.email);
                this.showNotification('Registration successful! Please check your email for verification code.', 'success');
                this.hideTurnstileWidget();
            } else {
                // Check if Turnstile is required
                if (response.code === 'CAPTCHA_REQUIRED' || response.captchaRequired) {
                    this.showTurnstileWidget();
                    this.showRegistrationError('Security verification required. Please complete the verification below.');
                } else {
                    this.showRegistrationError(response.message || 'Registration failed. Please try again.');
                }
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Handle specific error cases
            if (error.message && error.message.includes('already exists')) {
                this.showRegistrationError('An account with this email already exists. Please try logging in instead.');
            } else {
                this.showRegistrationError('Registration failed. Please try again.');
            }
        } finally {
            this.setSubmitButtonLoading(false);
            this.isRegistering = false;
        }
    }

    /**
     * Validate registration data
     */
    validateRegistrationData(data) {
        const errors = [];
        
        if (!data.email || !data.email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.password || data.password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }
        
        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }
        
        if (errors.length > 0) {
            this.showRegistrationError(errors.join('. '));
            return false;
        }
        
        return true;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Get Turnstile token if available (Invisible mode)
     */
    async getCaptchaToken() {
        // Check if Turnstile token is available from callback
        if (window.turnstileToken) {
            return window.turnstileToken;
        }
        
        // For invisible mode, check if widget is rendered and has a token
        if (typeof turnstile !== 'undefined' && this.turnstileWidgetId) {
            try {
                const token = turnstile.getResponse(this.turnstileWidgetId);
                if (token) {
                    return token;
                }
            } catch (error) {
                console.warn('Turnstile token retrieval failed:', error);
            }
        }
        
        return null;
    }

    /**
     * Register user
     */
    async register(data) {
        const url = this.baseURL + this.endpoints.register;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }
        
        return result;
    }

    /**
     * Handle OTP verification form submission
     */
    async handleVerifyEmail(event) {
        event.preventDefault();
        
        const otpCode = this.getOTPCode();
        const email = this.getStoredEmail();
        
        // Enhanced OTP validation
        if (!otpCode || otpCode.length !== 6) {
            this.showOTPError('Please enter a valid 6-digit verification code');
            return;
        }
        
        if (!/^\d{6}$/.test(otpCode)) {
            this.showOTPError('Verification code must contain only numbers');
            return;
        }
        
        console.log('OTP Validation passed:', {
            otpCode,
            length: otpCode.length,
            isOnlyDigits: /^\d{6}$/.test(otpCode)
        });
        
        if (!email) {
            this.showOTPError('Email not found. Please try registering again.');
            return;
        }
        
        try {
            this.setVerifyButtonLoading(true);
            this.hideOTPError();
            
            const response = await this.verifyEmail(email, otpCode);
            
            if (response.success) {
                this.showOTPSuccess();
                this.showNotification('Email verified successfully! Welcome to CompareHubPrices!', 'success');
            } else {
                this.showOTPError(response.message || 'Verification failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Email verification error:', error);
            
            // Show more specific error message
            let errorMessage = 'Verification failed. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            }
            
            this.showOTPError(errorMessage);
        } finally {
            this.setVerifyButtonLoading(false);
        }
    }

    /**
     * Verify email with OTP
     */
    async verifyEmail(email, otpCode) {
        const url = this.baseURL + this.endpoints.verifyEmail;
        
        // Prepare request body
        const requestBody = {
            email: email,
            otpCode: otpCode
        };
        
        // CAPTCHA not required for email verification
        // Email verification is already secure with OTP validation
        
        // Debug logging
        console.log('Verifying email with:', { 
            email, 
            otpCode, 
            otpLength: otpCode.length,
            requestBody 
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        // Debug logging for response
        console.log('Verification response:', { 
            status: response.status, 
            statusText: response.statusText,
            result,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            console.error('Verification failed:', {
                status: response.status,
                statusText: response.statusText,
                result,
                requestBody
            });
            throw new Error(result.message || `Email verification failed with status ${response.status}`);
        }
        
        return result;
    }

    /**
     * Resend verification code API call
     */
    async resendVerification(email) {
        const url = this.baseURL + this.endpoints.resendVerification;
        
        // Prepare request body
        const requestBody = {
            email: email
        };
        
        // Debug logging
        console.log('Resending verification code for:', { 
            email, 
            requestBody 
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        // Debug logging for response
        console.log('Resend verification response:', { 
            status: response.status, 
            statusText: response.statusText,
            result,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            console.error('Resend verification failed:', {
                status: response.status,
                statusText: response.statusText,
                result,
                requestBody
            });
            throw new Error(result.message || `Resend verification failed with status ${response.status}`);
        }
        
        return result;
    }

    /**
     * Resend verification code
     */
    async resendVerificationCode() {
        const email = this.getStoredEmail();
        
        if (!email) {
            this.showNotification('Email not found. Please try registering again.', 'error');
            return;
        }
        
        try {
            this.setResendButtonLoading(true);
            
            const response = await this.resendVerification(email);
            
            if (response.success) {
                this.showNotification(response.message || 'New verification code sent successfully! Please check your email.', 'success');
                this.startResendTimer();
            } else {
                this.showNotification(response.message || 'Failed to resend verification code. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Resend verification error:', error);
            
            // Handle specific error cases
            let errorMessage = 'Failed to resend verification code. Please try again.';
            
            if (error.message) {
                if (error.message.includes('too frequently')) {
                    errorMessage = error.message;
                } else if (error.message.includes('cooldown')) {
                    errorMessage = error.message;
                } else if (error.message.includes('bounced')) {
                    errorMessage = error.message;
                } else {
                    errorMessage = error.message;
                }
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            this.setResendButtonLoading(false);
        }
    }

    /**
     * Show OTP verification section
     */
    showOTPVerification(email) {
        // Hide registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.style.display = 'none';
        }
        
        // Show OTP verification section
        const otpSection = document.getElementById('otpVerificationSection');
        if (otpSection) {
            otpSection.style.display = 'block';
        }
        
        // Display email
        const emailDisplay = document.getElementById('otpEmailDisplay');
        if (emailDisplay) {
            emailDisplay.textContent = email;
        }
        
        // Store email for later use
        this.storeEmail(email);
        
        // Focus first OTP input
        const firstOtpInput = document.querySelector('.otp-input');
        if (firstOtpInput) {
            firstOtpInput.focus();
        }
        
        // Start resend timer
        this.startResendTimer();
    }

    /**
     * Show OTP success
     */
    showOTPSuccess() {
        // Hide OTP form
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.style.display = 'none';
        }
        
        // Show success message
        const successSection = document.getElementById('otpSuccess');
        if (successSection) {
            successSection.style.display = 'block';
        }
        
        // Clear stored email
        this.clearStoredEmail();
    }

    /**
     * Show OTP error
     */
    showOTPError(message) {
        const errorElement = document.getElementById('otpError');
        const errorMessageElement = document.getElementById('otpErrorMessage');
        
        if (errorElement && errorMessageElement) {
            errorMessageElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        // Clear OTP inputs
        this.clearOTPInputs();
        
        // Focus first OTP input
        const firstOtpInput = document.querySelector('.otp-input');
        if (firstOtpInput) {
            firstOtpInput.focus();
        }
    }

    /**
     * Hide OTP error
     */
    hideOTPError() {
        const errorElement = document.getElementById('otpError');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Show registration error
     */
    showRegistrationError(message) {
        // Create or update error element
        let errorElement = document.querySelector('.registration-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'registration-error alert alert-danger';
            errorElement.style.marginTop = '10px';
            
            const form = document.getElementById('registerForm');
            if (form) {
                form.appendChild(errorElement);
            }
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Hide registration error
     */
    hideRegistrationError() {
        const errorElement = document.querySelector('.registration-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Set submit button loading state
     */
    setSubmitButtonLoading(loading) {
        const submitBtn = document.querySelector('.register-submit-btn');
        const form = document.getElementById('registerForm');
        
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Registering...';
                submitBtn.style.opacity = '0.6';
                submitBtn.style.cursor = 'not-allowed';
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }
        
        // Also disable the entire form to prevent any input changes during registration
        if (form) {
            const inputs = form.querySelectorAll('input, button');
            inputs.forEach(input => {
                if (loading) {
                    input.disabled = true;
                } else {
                    input.disabled = false;
                }
            });
        }
    }

    /**
     * Set verify button loading state
     */
    setVerifyButtonLoading(loading) {
        const verifyBtn = document.getElementById('verifyOtpBtn');
        if (verifyBtn) {
            if (loading) {
                verifyBtn.disabled = true;
                verifyBtn.textContent = 'Verifying...';
            } else {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify';
            }
        }
    }

    /**
     * Set resend button loading state
     */
    setResendButtonLoading(loading) {
        const resendBtn = document.getElementById('resendOtpBtn');
        if (resendBtn) {
            if (loading) {
                resendBtn.disabled = true;
                resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            } else {
                resendBtn.disabled = false;
                resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
            }
        }
    }

    /**
     * Start resend timer
     */
    startResendTimer() {
        const resendBtn = document.getElementById('resendOtpBtn');
        const timerElement = document.getElementById('resendTimer');
        const timerCount = document.getElementById('timerCount');
        
        if (!resendBtn || !timerElement || !timerCount) return;
        
        let timeLeft = 60;
        
        resendBtn.style.display = 'none';
        timerElement.style.display = 'inline';
        
        const timer = setInterval(() => {
            timeLeft--;
            timerCount.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                resendBtn.style.display = 'inline';
                timerElement.style.display = 'none';
            }
        }, 1000);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback to alert
            alert(message);
        }
    }

    /**
     * Store email in session storage
     */
    storeEmail(email) {
        sessionStorage.setItem('aws_auth_email', email);
    }

    /**
     * Get stored email
     */
    getStoredEmail() {
        return sessionStorage.getItem('aws_auth_email');
    }

    /**
     * Clear stored email
     */
    clearStoredEmail() {
        sessionStorage.removeItem('aws_auth_email');
    }

    /**
     * Show Turnstile widget when required (Invisible mode)
     */
    showTurnstileWidget() {
        const turnstileContainer = document.getElementById('turnstileContainer');
        if (turnstileContainer) {
            // For invisible mode, container can be hidden but widget still works
            turnstileContainer.style.display = 'none';
            
            // Render invisible Turnstile widget if not already rendered
            if (typeof turnstile !== 'undefined' && !this.turnstileWidgetId) {
                this.turnstileWidgetId = turnstile.render(turnstileContainer, {
                    sitekey: window.TURNSTILE_CONFIG.siteKey,
                    callback: (token) => {
                        console.log('Turnstile verification successful');
                        window.turnstileToken = token;
                    },
                    'error-callback': (error) => {
                        console.error('Turnstile verification failed:', error);
                        window.turnstileToken = null;
                        this.showRegistrationError('Security verification failed. Please try again.');
                    },
                    'expired-callback': () => {
                        console.log('Turnstile token expired');
                        window.turnstileToken = null;
                        this.resetTurnstileWidget();
                    },
                    theme: window.TURNSTILE_CONFIG.theme || 'light',
                    size: window.TURNSTILE_CONFIG.size || 'invisible',
                    execution: window.TURNSTILE_CONFIG.execution || 'execute',
                    appearance: window.TURNSTILE_CONFIG.appearance || 'execute'
                });
                
                // Execute the invisible challenge immediately
                if (this.turnstileWidgetId) {
                    turnstile.execute(turnstileContainer);
                }
            }
        }
    }

    /**
     * Hide Turnstile widget
     */
    hideTurnstileWidget() {
        const turnstileContainer = document.getElementById('turnstileContainer');
        if (turnstileContainer) {
            turnstileContainer.style.display = 'none';
        }
    }

    /**
     * Reset Turnstile widget
     */
    resetTurnstileWidget() {
        if (typeof turnstile !== 'undefined' && this.turnstileWidgetId) {
            turnstile.reset(this.turnstileWidgetId);
        }
        window.turnstileToken = null;
    }

    /**
     * Remove Turnstile widget completely
     */
    removeTurnstileWidget() {
        if (typeof turnstile !== 'undefined' && this.turnstileWidgetId) {
            turnstile.remove(this.turnstileWidgetId);
            this.turnstileWidgetId = null;
        }
        window.turnstileToken = null;
    }
}

// Global functions for backward compatibility
function handleRegister(event) {
    if (window.awsAuthService) {
        window.awsAuthService.handleRegister(event);
    }
}

function handleVerifyEmail(event) {
    if (window.awsAuthService) {
        window.awsAuthService.handleVerifyEmail(event);
    }
}

function resendVerificationCode() {
    if (window.awsAuthService) {
        window.awsAuthService.resendVerificationCode();
    }
}

// Turnstile callback functions are now handled inline in the render method
// This provides better encapsulation and avoids global function pollution

// Initialize the service
window.awsAuthService = new AWSAuthService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWSAuthService;
}

