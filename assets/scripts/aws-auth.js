/**
 * AWS Authentication Service
 * Handles user registration and email verification with AWS Lambda backend
 */

class AWSAuthService {
    constructor() {
        this.baseURL = 'https://da84s1s15g.execute-api.af-south-1.amazonaws.com';
        this.endpoints = {
            register: '/auth/register',
            login: '/auth/login',
            verifyEmail: '/auth/verify-email',
            resendVerification: '/auth/resend-verification',
            forgotPassword: '/auth/forgot-password',
            resendForgotCode: '/auth/resend-forgot-code',
            resetPassword: '/auth/reset-password'
        };
        
        
        // Prevent duplicate resend calls
        this.isResending = false;
        
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
        // Sanitize: keep digits only
        return otpCode.replace(/\D/g, '');
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
        
        // Obtain Turnstile token (prefer invisible, programmatic execution)
        let captchaToken = await this.getCaptchaToken();
        if (!captchaToken && typeof turnstile !== 'undefined') {
            try {
                captchaToken = await this.executeInvisibleTurnstile('register');
            } catch (e) {
                console.warn('Turnstile execution for register failed or timed out:', e?.message || e);
            }
        }
        if (captchaToken) {
            // Include both keys for backend compatibility
            registrationData.turnstileToken = captchaToken;
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
                // Check if Turnstile is required and retry once with an executed token
                if (response.code === 'TURNSTILE_REQUIRED' || response.turnstileRequired) {
                    try {
                        const retryToken = await this.executeInvisibleTurnstile('register');
                        if (retryToken) {
                            registrationData.turnstileToken = retryToken;
                            registrationData.captchaToken = retryToken;

                            const retry = await this.register(registrationData);
                            if (retry.success) {
                                this.showOTPVerification(registrationData.email);
                                this.showNotification('Registration successful! Please check your email for verification code.', 'success');
                                this.hideTurnstileWidget();
                            } else {
                                this.showRegistrationError(retry.message || 'Registration failed. Please try again.');
                            }
                            return;
                        }
                    } catch (e) {
                        console.error('Turnstile retry failed:', e);
                    }
                    this.showRegistrationError('Security verification required. Please try again.');
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
     * Get Turnstile token if available (Implicit rendering)
     */
    async getCaptchaToken() {
        // For implicit rendering, get token from the hidden form field
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileResponse && turnstileResponse.value) {
            return turnstileResponse.value;
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
     * Login user
     */
    async login(email, password, turnstileToken = null) {
        const url = this.baseURL + this.endpoints.login;
        
        const data = {
            email: email,
            password: password
        };
        
        // Add Turnstile token if provided
        if (turnstileToken) {
            data.turnstileToken = turnstileToken;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }
        
        return result;
    }

    /**
     * Handle login form submission
     */
    async handleLogin(email, password) {
        try {
            console.log('Starting login request for:', email);
            
            // First attempt without Turnstile
            const response = await this.login(email, password);
            
            // If successful, handle the response
            if (response.success) {
                console.log('Login successful');
                
                // Store tokens if provided
                if (response.data && response.data.tokens) {
                    localStorage.setItem('accessToken', response.data.tokens.accessToken);
                    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
                    localStorage.setItem('idToken', response.data.tokens.idToken);
                }
                
                // Store user data if provided
                if (response.data && response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                
                return response;
            }
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Check if Turnstile is required
            if (error.message && error.message.includes('TURNSTILE_REQUIRED')) {
                console.log('Turnstile required for login');
                return await this.handleTurnstileRequiredLogin(email, password, error);
            }
            
            throw error;
        }
    }

    /**
     * Handle Turnstile requirement for login
     */
    async handleTurnstileRequiredLogin(email, password, initialResponse) {
        try {
            console.log('Handling Turnstile requirement for login');
            
            // Execute invisible Turnstile
            const turnstileToken = await this.executeInvisibleTurnstile('login');
            
            if (!turnstileToken) {
                throw new Error('Turnstile verification failed');
            }
            
            // Retry login with Turnstile token
            const response = await this.login(email, password, turnstileToken);
            
            if (response.success) {
                console.log('Login successful with Turnstile');
                
                // Store tokens if provided
                if (response.data && response.data.tokens) {
                    localStorage.setItem('accessToken', response.data.tokens.accessToken);
                    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
                    localStorage.setItem('idToken', response.data.tokens.idToken);
                }
                
                // Store user data if provided
                if (response.data && response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
            }
            
            return response;
            
        } catch (error) {
            console.error('Turnstile login error:', error);
            throw error;
        }
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
     * Resend verification code API call with optional Turnstile token
     */
    async resendVerification(email, turnstileToken = null) {
        const url = this.baseURL + this.endpoints.resendVerification;
        
        // Prepare request body
        const requestBody = {
            email: email
        };
        
        // Add Turnstile token if provided
        if (turnstileToken) {
            requestBody.turnstileToken = turnstileToken;
        }
        
        // Debug logging
        console.log('Resending verification code for:', { 
            email, 
            hasTurnstileToken: !!turnstileToken,
            requestBody: { ...requestBody, turnstileToken: turnstileToken ? '[PROVIDED]' : '[NOT_PROVIDED]' }
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
                requestBody: { ...requestBody, turnstileToken: turnstileToken ? '[PROVIDED]' : '[NOT_PROVIDED]' }
            });
            throw new Error(result.message || `Resend verification failed with status ${response.status}`);
        }
        
        return result;
    }

    /**
     * Resend verification code with invisible Turnstile support
     */
    async resendVerificationCode() {
        const email = this.getStoredEmail();
        
        if (!email) {
            this.showNotification('Email not found. Please try registering again.', 'error');
            return;
        }
        
        // Prevent multiple simultaneous calls
        if (this.isResending) {
            console.log('Resend already in progress, ignoring duplicate call');
            return;
        }
        
        try {
            this.isResending = true;
            this.setResendButtonLoading(true);
            
            console.log('Starting resend verification for:', email);
            
            // First attempt without Turnstile
            const response = await this.resendVerification(email);
            
            console.log('Resend response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'New verification code sent successfully! Please check your email.', 'success');
                this.startResendTimer();
            } else {
                // Check if Turnstile is required
                if (response.turnstileRequired) {
                    console.log('Turnstile required for resend verification:', response.abuseReason);
                    await this.handleTurnstileRequiredResend(email, response);
                } else {
                    this.showNotification(response.message || 'Failed to resend verification code. Please try again.', 'error');
                }
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
                } else if (error.message.includes('TURNSTILE_REQUIRED')) {
                    errorMessage = 'Security verification required. Please try again.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            this.isResending = false;
            this.setResendButtonLoading(false);
        }
    }

    /**
     * Handle Turnstile requirement for resend verification
     */
    async handleTurnstileRequiredResend(email, initialResponse) {
        try {
            console.log('Handling Turnstile requirement for resend verification');
            console.log('Initial response:', initialResponse);
            
            // Show a notification that security verification is required
            this.showNotification('Security verification required. Please complete the security check.', 'info');
            
            // Execute invisible Turnstile
            const turnstileToken = await this.executeInvisibleTurnstile('resend_verification');
            
            if (!turnstileToken) {
                this.showNotification('Security verification failed. Please try again.', 'error');
                return;
            }
            
            console.log('Turnstile token obtained, sending resend request with token');
            
            // Send resend with Turnstile token (this is the ONLY email send)
            const response = await this.resendVerification(email, turnstileToken);
            
            console.log('Turnstile resend response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'New verification code sent successfully! Please check your email.', 'success');
                this.startResendTimer();
                
                // Log that Turnstile was used
                console.log('Resend verification successful with Turnstile:', {
                    email,
                    abuseReason: response.data?.abuseReason,
                    turnstileUsed: response.data?.turnstileUsed
                });
            } else {
                this.showNotification(response.message || 'Failed to resend verification code. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Turnstile resend verification error:', error);
            this.showNotification('Security verification failed. Please try again.', 'error');
        }
    }

    /**
     * Forgot password API call with optional Turnstile token
     */
    async forgotPassword(email, turnstileToken = null) {
        const url = this.baseURL + this.endpoints.forgotPassword;
        
        // Prepare request body
        const requestBody = {
            email: email
        };
        
        // Add Turnstile token if provided
        if (turnstileToken) {
            requestBody.turnstileToken = turnstileToken;
        }
        
        console.log('Forgot password request:', { url, requestBody });
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Forgot password response status:', response.status);
            console.log('Forgot password response headers:', response.headers);
            
            const data = await response.json();
            console.log('Forgot password response data:', data);
            
            if (!response.ok) {
                console.error('Forgot password failed:', { status: response.status, data });
                throw new Error(data.message || 'Failed to send password reset email');
            }
            
            return data;
        } catch (error) {
            console.error('Forgot password API error:', error);
            throw error;
        }
    }

    /**
     * Handle forgot password request with invisible Turnstile support
     */
    async handleForgotPassword(email) {
        try {
            console.log('Starting forgot password request for:', email);
            
            // First attempt without Turnstile
            const response = await this.forgotPassword(email);
            console.log('Forgot password response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'Password reset code sent successfully! Please check your email.', 'success');
                
                // Store email for reset password page
                sessionStorage.setItem('resetPasswordEmail', email);
                
                // Don't redirect here - let the calling page handle it
                return { success: true, data: response.data || null, message: response.message || 'Password reset code sent successfully!' };
                
            } else if (response.turnstileRequired) {
                // Handle Turnstile requirement
                await this.handleTurnstileRequiredForgotPassword(email, response);
                // After Turnstile flow, return a generic success indicator to the caller
                return { success: true, turnstileUsed: true, message: 'Password reset code sent successfully!' };
            } else {
                const message = response.message || 'Failed to send password reset email. Please try again.';
                this.showNotification(message, 'error');
                return { success: false, message };
            }
            
        } catch (error) {
            console.error('Forgot password error:', error);
            const message = error?.message || 'An error occurred. Please try again.';
            this.showNotification(message, 'error');
            return { success: false, message };
        }
    }

    /**
     * Handle Turnstile requirement for forgot password
     */
    async handleTurnstileRequiredForgotPassword(email, initialResponse) {
        try {
            console.log('Handling Turnstile requirement for forgot password');
            console.log('Initial response:', initialResponse);
            
            // Show a notification that security verification is required
            this.showNotification('Security verification required. Please complete the security check.', 'info');
            
            // Execute invisible Turnstile
            const turnstileToken = await this.executeInvisibleTurnstile('forgot_password');
            
            if (!turnstileToken) {
                this.showNotification('Security verification failed. Please try again.', 'error');
                return;
            }
            
            console.log('Turnstile token obtained, sending forgot password request with token');
            
            // Send forgot password with Turnstile token
            const response = await this.forgotPassword(email, turnstileToken);
            
            console.log('Turnstile forgot password response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'Password reset code sent successfully! Please check your email.', 'success');
                
                // Store email for reset password page
                sessionStorage.setItem('resetPasswordEmail', email);
                
                // Navigation handled by caller (e.g., login.html forgot flow)
                // Do not redirect here to avoid double-navigation
                
                // Log that Turnstile was used
                console.log('Forgot password successful with Turnstile:', {
                    email,
                    abuseReason: response.data?.abuseReason,
                    turnstileUsed: response.data?.turnstileUsed
                });
            } else {
                this.showNotification(response.message || 'Failed to send password reset email. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Turnstile forgot password error:', error);
            this.showNotification('Security verification failed. Please try again.', 'error');
        }
    }

    /**
     * Resend forgot code API call with optional Turnstile token
     */
    async resendForgotCode(email, turnstileToken = null) {
        const url = this.baseURL + this.endpoints.resendForgotCode;
        
        // Prepare request body
        const requestBody = {
            email: email
        };
        
        // Add Turnstile token if provided
        if (turnstileToken) {
            requestBody.turnstileToken = turnstileToken;
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend password reset code');
            }
            
            return data;
        } catch (error) {
            console.error('Resend forgot code API error:', error);
            throw error;
        }
    }

    /**
     * Handle resend forgot code request with invisible Turnstile support
     */
    async handleResendForgotCode(email) {
        try {
            console.log('Starting resend forgot code request for:', email);
            
            // First attempt without Turnstile
            const response = await this.resendForgotCode(email);
            console.log('Resend forgot code response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'New password reset code sent successfully! Please check your email.', 'success');
                
            } else if (response.turnstileRequired) {
                // Handle Turnstile requirement
                await this.handleTurnstileRequiredResendForgotCode(email, response);
            } else {
                this.showNotification(response.message || 'Failed to resend password reset code. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Resend forgot code error:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        }
    }

    /**
     * Handle Turnstile requirement for resend forgot code
     */
    async handleTurnstileRequiredResendForgotCode(email, initialResponse) {
        try {
            console.log('Handling Turnstile requirement for resend forgot code');
            console.log('Initial response:', initialResponse);
            
            // Show a notification that security verification is required
            this.showNotification('Security verification required. Please complete the security check.', 'info');
            
            // Execute invisible Turnstile
            const turnstileToken = await this.executeInvisibleTurnstile('resend_forgot_code');
            
            if (!turnstileToken) {
                this.showNotification('Security verification failed. Please try again.', 'error');
                return;
            }
            
            console.log('Turnstile token obtained, sending resend forgot code request with token');
            
            // Send resend forgot code with Turnstile token
            const response = await this.resendForgotCode(email, turnstileToken);
            
            console.log('Turnstile resend forgot code response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'New password reset code sent successfully! Please check your email.', 'success');
                
                // Log that Turnstile was used
                console.log('Resend forgot code successful with Turnstile:', {
                    email,
                    abuseReason: response.data?.abuseReason,
                    turnstileUsed: response.data?.turnstileUsed
                });
            } else {
                this.showNotification(response.message || 'Failed to resend password reset code. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Turnstile resend forgot code error:', error);
            this.showNotification('Security verification failed. Please try again.', 'error');
        }
    }

    /**
     * Reset password API call with optional Turnstile token
     */
    async resetPassword(email, otpCode, newPassword, turnstileToken = null) {
        const url = this.baseURL + this.endpoints.resetPassword;
        
        // Prepare request body
        const requestBody = {
            email: email,
            otpCode: otpCode,
            newPassword: newPassword
        };
        
        // Add Turnstile token if provided
        if (turnstileToken) {
            requestBody.turnstileToken = turnstileToken;
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }
            
            return data;
        } catch (error) {
            console.error('Reset password API error:', error);
            throw error;
        }
    }

    /**
     * Handle reset password request with invisible Turnstile support
     */
    async handleResetPassword(email, otpCode, newPassword) {
        try {
            console.log('Starting reset password request for:', email);
            
            // First attempt without Turnstile
            const response = await this.resetPassword(email, otpCode, newPassword);
            console.log('Reset password response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'Password reset successfully! You can now log in with your new password.', 'success');
                
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                
            } else if (response.turnstileRequired) {
                // Handle Turnstile requirement
                await this.handleTurnstileRequiredResetPassword(email, otpCode, newPassword, response);
            } else {
                this.showNotification(response.message || 'Failed to reset password. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Reset password error:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        }
    }

    /**
     * Handle Turnstile requirement for reset password
     */
    async handleTurnstileRequiredResetPassword(email, otpCode, newPassword, initialResponse) {
        try {
            console.log('Handling Turnstile requirement for reset password');
            console.log('Initial response:', initialResponse);
            
            // Show a notification that security verification is required
            this.showNotification('Security verification required. Please complete the security check.', 'info');
            
            // Execute invisible Turnstile
            const turnstileToken = await this.executeInvisibleTurnstile('reset_password');
            
            if (!turnstileToken) {
                this.showNotification('Security verification failed. Please try again.', 'error');
                return;
            }
            
            console.log('Turnstile token obtained, sending reset password request with token');
            
            // Send reset password with Turnstile token
            const response = await this.resetPassword(email, otpCode, newPassword, turnstileToken);
            
            console.log('Turnstile reset password response:', response);
            
            if (response.success) {
                this.showNotification(response.message || 'Password reset successfully! You can now log in with your new password.', 'success');
                
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                
                // Log that Turnstile was used
                console.log('Reset password successful with Turnstile:', {
                    email,
                    abuseReason: response.data?.abuseReason,
                    turnstileUsed: response.data?.turnstileUsed
                });
            } else {
                this.showNotification(response.message || 'Failed to reset password. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Turnstile reset password error:', error);
            this.showNotification('Security verification failed. Please try again.', 'error');
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
        const form = document.getElementById('registerForm');
        const submitBtn = form ? form.querySelector('.register-submit-btn') : document.querySelector('.register-submit-btn');
        
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
                input.disabled = !!loading;
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
     * Show Turnstile widget when required (Implicit rendering)
     */
    showTurnstileWidget() {
        // For implicit rendering, the widget is already in the DOM
        // Just ensure it's visible if it was hidden
        const turnstileWidget = document.querySelector('.cf-turnstile');
        if (turnstileWidget) {
            turnstileWidget.style.display = 'block';
        }
    }

    /**
     * Hide Turnstile widget
     */
    hideTurnstileWidget() {
        const containerA = document.getElementById('turnstileContainer');
        const containerB = document.getElementById('loginTurnstileContainer');
        if (containerA) containerA.style.display = 'none';
        if (containerB) containerB.style.display = 'none';
    }

    /**
     * Reset Turnstile widget (Implicit rendering)
     */
    resetTurnstileWidget() {
        // For implicit rendering, reset by clearing the hidden input
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileResponse) {
            turnstileResponse.value = '';
        }
    }

    /**
     * Remove Turnstile widget completely (Implicit rendering)
     */
    removeTurnstileWidget() {
        // For implicit rendering, just clear the token
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileResponse) {
            turnstileResponse.value = '';
        }
    }

    /**
     * Execute Turnstile in invisible mode and wait for token
     * Uses the implicitly rendered widget and programmatically executes it.
     */
    async executeInvisibleTurnstile(action = 'resend_verification') {
        return new Promise((resolve, reject) => {
            try {
                if (typeof turnstile === 'undefined') {
                    reject(new Error('Turnstile not loaded'));
                    return;
                }

                // Clear any previous token to avoid stale values
                const hidden = document.querySelector('input[name="cf-turnstile-response"]');
                if (hidden) hidden.value = '';

                // Choose a container close to the active flow if possible
                const registerForm = document.getElementById('registerForm');
                const loginForm = document.getElementById('loginForm');
                let containerEl = (registerForm && registerForm.querySelector('.cf-turnstile'))
                                || (loginForm && loginForm.querySelector('.cf-turnstile'))
                                || document.querySelector('.cf-turnstile');

                // Ensure container has an id so we can execute by selector reliably
                if (containerEl && !containerEl.id) {
                    containerEl.id = 'turnstile-widget-' + Math.random().toString(36).slice(2, 8);
                }
                const containerSelector = containerEl ? ('#' + containerEl.id) : '.cf-turnstile';

                // Execute when Turnstile is ready
                turnstile.ready(() => {
                    try {
                        turnstile.execute(containerSelector, { action });
                    } catch (execErr) {
                        console.warn('turnstile.execute failed, will still poll for a token if available:', execErr);
                    }

                    const startedAt = Date.now();
                    const poll = setInterval(() => {
                        const input = document.querySelector('input[name="cf-turnstile-response"]');
                        if (input && input.value) {
                            clearInterval(poll);
                            resolve(input.value);
                        } else if (Date.now() - startedAt > 30000) {
                            clearInterval(poll);
                            reject(new Error('Security verification timeout'));
                        }
                    }, 250);
                });
            } catch (error) {
                console.error('Error executing Turnstile:', error);
                reject(error);
            }
        });
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

