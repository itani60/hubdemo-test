// Reset Password Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const resetForm = document.getElementById('resetPasswordForm');
    const otpInputs = document.querySelectorAll('.otp-input');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const resendTimer = document.getElementById('resendTimer');
    const timerCount = document.getElementById('timerCount');
    
    // Password requirements elements
    const passwordRequirements = document.getElementById('newPasswordRequirements');
    const requirementEls = document.querySelectorAll('.requirement');
    const passwordMatch = document.getElementById('resetPasswordMatch');
    
    // Password toggle buttons
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

    // State variables
    let otpTimer = null;
    let otpCountdown = 60;
    let isOtpSent = false;

    // Show "code sent" banner if redirected from Forgot Password (login modal)
    const resetEmail = sessionStorage.getItem('resetPasswordEmail');
    console.log('Reset email from sessionStorage:', resetEmail);
    
    const emailBanner = document.getElementById('emailVerificationBanner');
    const resetEmailSpan = document.getElementById('resetEmailDisplay');
    
    console.log('Email banner element:', emailBanner);
    console.log('Reset email span element:', resetEmailSpan);
    
    if (resetEmail && emailBanner && resetEmailSpan) {
        console.log('Showing email banner for:', resetEmail);
        resetEmailSpan.textContent = resetEmail;
        emailBanner.style.display = 'flex';
        // Optional toast for visibility
        if (typeof showNotification === 'function') {
            showNotification(`Verification code sent to ${resetEmail}`, 'success');
        }
        // Keep email in session until reset succeeds to support resends/retries
        // sessionStorage.removeItem('resetPasswordEmail');
    } else {
        console.log('Email banner not shown. Reasons:');
        console.log('- Reset email:', resetEmail);
        console.log('- Email banner found:', !!emailBanner);
        console.log('- Reset email span found:', !!resetEmailSpan);
    }


    // Initialize form
    initializeForm();

    function initializeForm() {
        console.log('Initializing form...');
        console.log('newPasswordToggle element:', newPasswordToggle);
        console.log('confirmPasswordToggle element:', confirmPasswordToggle);
        
        // Add password validation listeners
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', validatePassword);
        }
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        }
        
        // Add resend OTP functionality
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', handleResendOtp);
        }
        
        // Add manual form submission
        if (resetPasswordBtn) {
            resetPasswordBtn.addEventListener('click', handleManualResetPassword);
        }
        
        if (newPasswordToggle) {
            console.log('Adding click listener to newPasswordToggle');
            newPasswordToggle.addEventListener('click', toggleNewPasswordVisibility);
        } else {
            console.error('newPasswordToggle not found!');
        }
        
        if (confirmPasswordToggle) {
            console.log('Adding click listener to confirmPasswordToggle');
            confirmPasswordToggle.addEventListener('click', toggleConfirmPasswordVisibility);
        } else {
            console.error('confirmPasswordToggle not found!');
        }

        // OTP input handling
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => handleOtpInput(e, index));
            input.addEventListener('keydown', (e) => handleOtpKeydown(e, index));
            input.addEventListener('paste', handleOtpPaste);
        });

        // Form submission is now handled by AWS Auth system
        // resetForm.addEventListener('submit', handleFormSubmit);
    }


    // Password validation
    function validatePassword() {
        const password = newPasswordInput.value;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update requirement indicators
        Object.keys(requirements).forEach(req => {
            const requirementElement = document.querySelector(`[data-requirement="${req}"]`);
            if (requirementElement) {
                if (requirements[req]) {
                    requirementElement.classList.add('valid');
                } else {
                    requirementElement.classList.remove('valid');
                }
            }
        });

        // Check if all requirements are met
        const allValid = Object.values(requirements).every(req => req);
        
        if (password && !allValid) {
            showFieldError(newPasswordInput, 'Password does not meet all requirements');
            return false;
        } else {
            clearFieldError(newPasswordInput);
            return allValid;
        }
    }

    // Password match validation
    function validatePasswordMatch() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            passwordMatch.classList.remove('hidden');
            passwordMatch.classList.remove('valid');
            return false;
        } else if (confirmPassword && password === confirmPassword) {
            passwordMatch.classList.remove('hidden');
            passwordMatch.classList.add('valid');
            return true;
        } else {
            passwordMatch.classList.add('hidden');
            return true;
        }
    }

    // OTP input handling
    function handleOtpInput(e, index) {
        const input = e.target;
        const value = input.value;

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            input.value = value.replace(/\D/g, '');
            return;
        }

        // Move to next input if current is filled
        if (value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        // Check if all inputs are filled
        checkOtpCompletion();
    }

    function handleOtpKeydown(e, index) {
        const input = e.target;

        // Handle backspace
        if (e.key === 'Backspace' && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            otpInputs[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    }

    function handleOtpPaste(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pastedData.length <= 6) {
            for (let i = 0; i < pastedData.length && i < otpInputs.length; i++) {
                otpInputs[i].value = pastedData[i];
            }
            
            // Focus the next empty input or the last input
            const nextEmptyIndex = Math.min(pastedData.length, otpInputs.length - 1);
            otpInputs[nextEmptyIndex].focus();
            
            checkOtpCompletion();
        }
    }

    function checkOtpCompletion() {
        const otpValue = Array.from(otpInputs).map(input => input.value).join('');
        
        if (otpValue.length === 6) {
            // All OTP inputs are filled
            otpInputs.forEach(input => input.classList.add('filled'));
            // Auto-submit form when OTP is complete
            autoSubmitResetForm(otpValue);
        } else {
            // Clear filled state
            otpInputs.forEach(input => input.classList.remove('filled'));
        }
    }

    function validateOtp(otp) {
        // OTP validation is now handled by AWS Auth system
        console.log('OTP validation handled by AWS Auth system');
        return true;
    }

    // Auto-submit form when OTP is complete and passwords are valid
    async function autoSubmitResetForm(otpValue) {
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
        const email = resetEmail || getEmailFromSession();

        // Check if passwords are valid and match
        if (newPassword && confirmPassword && newPassword === confirmPassword && newPassword.length >= 8) {
            // Call AWS Auth system to handle reset password
            if (window.awsAuth && typeof window.awsAuth.handleResetPassword === 'function') {
                try {
                    if (resetPasswordBtn) {
                        resetPasswordBtn.disabled = true;
                        resetPasswordBtn.classList.add('loading');
                    }
                    console.log('Auto-submitting reset password form');
                    await window.awsAuth.handleResetPassword(email, otpValue, newPassword);
                } catch (e) {
                    console.error('Auto reset password error:', e);
                    if (typeof window.showNotification === 'function') {
                        window.showNotification(e?.message || 'Failed to reset password. Please try again.', 'error');
                    }
                } finally {
                    if (resetPasswordBtn) {
                        resetPasswordBtn.disabled = false;
                        resetPasswordBtn.classList.remove('loading');
                    }
                }
            }
        }
    }

    // Get email from session storage or URL parameters
    function getEmailFromSession() {
        return sessionStorage.getItem('resetPasswordEmail') || 
               new URLSearchParams(window.location.search).get('email') || '';
    }

    function clearOtpInputs() {
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
        otpInputs[0].focus();
    }

    // Password visibility toggle - New Password
    function toggleNewPasswordVisibility() {
        const passwordInput = document.getElementById('newPassword');
        const toggleButton = document.getElementById('newPasswordToggle');
        const icon = toggleButton.querySelector('i');
        
        if (passwordInput && toggleButton && icon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }

    // Password visibility toggle - Confirm Password
    function toggleConfirmPasswordVisibility() {
        const passwordInput = document.getElementById('confirmPassword');
        const toggleButton = document.getElementById('confirmPasswordToggle');
        const icon = toggleButton ? toggleButton.querySelector('i') : null;
        
        if (passwordInput && toggleButton && icon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }

    // Handle resend OTP - Now handled by AWS Auth
    async function handleResendOtp() {
        const email = resetEmail || getEmailFromSession();
        
        if (!email) {
            (window.showNotification || showNotification)('Email not found. Please try the forgot password process again.', 'error');
            return;
        }
        
        if (!window.awsAuth) {
            (window.showNotification || showNotification)('Resend functionality not available. Please try again.', 'error');
            return;
        }

        try {
            console.log('Resending forgot code for:', email);

            // First attempt without Turnstile
            let result = await window.awsAuth.resendForgotCode(email);
            
            // If server requires Turnstile, execute and retry once
            if (result && result.turnstileRequired) {
                const token = await window.awsAuth.executeInvisibleTurnstile('resend_forgot_code');
                if (token) {
                    result = await window.awsAuth.resendForgotCode(email, token);
                }
            }

            if (result && result.success) {
                startOtpTimer(); // Start the cooldown only on success
                if (typeof window.showNotification === 'function') {
                    window.showNotification(result.message || 'New password reset code sent successfully! Please check your email.', 'success');
                }
            } else {
                const msg = result?.message || 'Failed to resend password reset code. Please try again.';
                if (typeof window.showNotification === 'function') {
                    window.showNotification(msg, 'error');
                }
            }
        } catch (err) {
            console.error('Resend forgot code error:', err);
            if (typeof window.showNotification === 'function') {
                window.showNotification(err?.message || 'An error occurred. Please try again.', 'error');
            }
        }
    }

    function startOtpTimer() {
        isOtpSent = true;
        resendOtpBtn.disabled = true;
        resendTimer.style.display = 'inline';
        otpCountdown = 60;

        otpTimer = setInterval(() => {
            otpCountdown--;
            timerCount.textContent = otpCountdown;

            if (otpCountdown <= 0) {
                clearInterval(otpTimer);
                resendOtpBtn.disabled = false;
                resendTimer.style.display = 'none';
            }
        }, 1000);
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        handleResetPassword();
    }

    function handleResetPassword() {
        // Password reset is now handled by AWS Auth system
        console.log('Password reset handled by AWS Auth system');
    }

    // Manual reset password function for button click
    async function handleManualResetPassword() {
        const email = resetEmail || getEmailFromSession();
        const otpValue = Array.from(otpInputs).map(input => input.value).join('');
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
        
        // Validate inputs
        if (!email) {
            (window.showNotification || showNotification)('Email not found. Please try the forgot password process again.', 'error');
            return;
        }
        
        if (!otpValue || otpValue.length !== 6) {
            (window.showNotification || showNotification)('Please enter the complete 6-digit verification code.', 'error');
            return;
        }
        
        if (!newPassword || newPassword.length < 8) {
            (window.showNotification || showNotification)('Password must be at least 8 characters long.', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            (window.showNotification || showNotification)('Passwords do not match.', 'error');
            return;
        }
        
        // Call AWS Auth system to handle reset password
        if (window.awsAuth && typeof window.awsAuth.handleResetPassword === 'function') {
            try {
                console.log('Manually submitting reset password form');
                if (resetPasswordBtn) {
                    resetPasswordBtn.disabled = true;
                    resetPasswordBtn.classList.add('loading');
                }
                await window.awsAuth.handleResetPassword(email, otpValue, newPassword);
            } catch (e) {
                console.error('Manual reset password error:', e);
                (window.showNotification || showNotification)(e?.message || 'Failed to reset password. Please try again.', 'error');
            } finally {
                if (resetPasswordBtn) {
                    resetPasswordBtn.disabled = false;
                    resetPasswordBtn.classList.remove('loading');
                }
            }
        } else {
            (window.showNotification || showNotification)('Reset password functionality not available. Please try again.', 'error');
        }
    }

    // Utility functions
    function showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    // Expose notification function globally for AWSAuthService
    window.showNotification = window.showNotification || showNotification;

    // Auto-send OTP on page load - Now handled by AWS Auth
    // This is now managed by the AWS Auth system

    // Debug: Test button clicks
    console.log('Testing button clicks...');
    document.addEventListener('click', function(e) {
        if (e.target.closest('.password-toggle')) {
            console.log('Password toggle button clicked via document listener!');
        }
    });

    // Initialize AWS Auth Service
    if (typeof AWSAuthService !== 'undefined') {
        // Reuse existing global instance if available to avoid duplicate listeners
        window.awsAuth = window.awsAuthService || window.awsAuth || new AWSAuthService();
        console.log('AWS Auth Service initialized for reset password page');
    } else {
        console.error('AWSAuthService not found. Make sure aws-auth.js is loaded before reset-pass.js');
    }
});
