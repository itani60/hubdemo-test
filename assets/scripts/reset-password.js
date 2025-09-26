/**
 * Reset Password JavaScript
 * Handles password reset functionality with verification code
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeResetPassword();
});

/**
 * Initialize reset password functionality
 */
function initializeResetPassword() {
    // Initialize password toggle functionality
    initializePasswordToggles();
    
    // Initialize password strength checker
    initializePasswordStrengthChecker();
    
    // Initialize Turnstile widget
    initializeTurnstile();
    
    // Check if user came from forgot password flow
    checkResetPasswordContext();
}

/**
 * Initialize password toggle functionality
 */
function initializePasswordToggles() {
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (newPasswordToggle && newPasswordInput) {
        newPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(newPasswordInput, newPasswordToggle);
        });
    }
    
    if (confirmPasswordToggle && confirmPasswordInput) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
        });
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(input, toggle) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = toggle.querySelector('i');
    if (type === 'text') {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Initialize password strength checker
 */
function initializePasswordStrengthChecker() {
    const newPasswordInput = document.getElementById('newPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordRequirements = document.getElementById('passwordRequirements');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            checkPasswordStrength(password);
            checkPasswordRequirements(password);
        });
    }
}

/**
 * Check password strength
 */
function checkPasswordStrength(password) {
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        passwordStrength.style.display = 'none';
        return;
    }
    
    passwordStrength.style.display = 'block';
    
    let strength = 0;
    let strengthLabel = '';
    let strengthColor = '';
    
    // Check various criteria
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Determine strength level
    if (strength < 40) {
        strengthLabel = 'Weak';
        strengthColor = '#dc3545';
    } else if (strength < 80) {
        strengthLabel = 'Medium';
        strengthColor = '#ffc107';
    } else {
        strengthLabel = 'Strong';
        strengthColor = '#28a745';
    }
    
    // Update UI
    strengthFill.style.width = strength + '%';
    strengthFill.style.backgroundColor = strengthColor;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = strengthColor;
}

/**
 * Check password requirements
 */
function checkPasswordRequirements(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    // Update requirement indicators
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(`req-${req}`);
        const icon = element.querySelector('i');
        
        if (requirements[req]) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-check');
            element.classList.add('requirement-met');
        } else {
            icon.classList.remove('fa-check');
            icon.classList.add('fa-times');
            element.classList.remove('requirement-met');
        }
    });
}

/**
 * Initialize Turnstile widget
 */
function initializeTurnstile() {
    // Initialize Turnstile widget for reset password
    if (typeof window.awsAuth !== 'undefined') {
        window.awsAuth.showTurnstileWidget();
    }
}

/**
 * Check reset password context
 */
function checkResetPasswordContext() {
    // Check if user came from forgot password flow
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const code = urlParams.get('code');
    
    if (email) {
        // Store email for use in reset password process
        window.resetPasswordEmail = email;
        console.log('Reset password for email:', email);
        
        // Show a message indicating which email the code was sent to
        showResetPasswordInfo(`Verification code sent to: ${email}`);
    }
    
    if (code) {
        // Pre-fill verification code if provided
        const codeInput = document.getElementById('resetCode');
        if (codeInput) {
            codeInput.value = code;
        }
    }
}

/**
 * Handle reset password form submission
 */
async function handleResetPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const code = formData.get('code').trim();
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');
    
    // Clear previous errors
    clearResetPasswordErrors();
    
    // Validate inputs
    if (!validateResetPasswordInputs(code, newPassword, confirmPassword)) {
        return;
    }
    
    // Show loading state
    setLoadingState(resetSubmitBtn, true);
    
    try {
        // Get Turnstile token
        const turnstileToken = await getTurnstileToken();
        if (!turnstileToken) {
            showResetPasswordError('Security verification failed. Please try again.');
            return;
        }
        
        // Simulate API call to reset password
        const result = await resetPasswordAPI(code, newPassword, turnstileToken);
        
        if (result.success) {
            showResetPasswordSuccess();
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } else {
            showResetPasswordError(result.message || 'Failed to reset password. Please try again.');
        }
    } catch (error) {
        console.error('Reset password error:', error);
        showResetPasswordError('An error occurred. Please try again.');
    } finally {
        setLoadingState(resetSubmitBtn, false);
    }
}

/**
 * Validate reset password inputs
 */
function validateResetPasswordInputs(code, newPassword, confirmPassword) {
    let isValid = true;
    
    // Validate verification code
    if (!code) {
        showFieldError('codeError', 'Please enter the verification code.');
        isValid = false;
    } else if (code.length < 6) {
        showFieldError('codeError', 'Verification code must be at least 6 characters.');
        isValid = false;
    }
    
    // Validate new password
    if (!newPassword) {
        showFieldError('newPasswordError', 'Please enter a new password.');
        isValid = false;
    } else if (!isValidPassword(newPassword)) {
        showFieldError('newPasswordError', 'Password does not meet requirements.');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showFieldError('confirmPasswordError', 'Please confirm your new password.');
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        showFieldError('confirmPasswordError', 'Passwords do not match.');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Check if password is valid
 */
function isValidPassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    return Object.values(requirements).every(req => req);
}

/**
 * Get Turnstile token
 */
async function getTurnstileToken() {
    if (typeof window.awsAuth !== 'undefined') {
        return await window.awsAuth.getCaptchaToken();
    }
    return null;
}

/**
 * Reset password API call
 */
async function resetPasswordAPI(code, newPassword, turnstileToken) {
    // Simulate API call - replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate success
            resolve({
                success: true,
                message: 'Password reset successfully'
            });
        }, 2000);
    });
}

/**
 * Show reset password error
 */
function showResetPasswordError(message) {
    const errorElement = document.getElementById('resetError');
    const errorMessageElement = document.getElementById('resetErrorMessage');
    
    if (errorElement && errorMessageElement) {
        errorMessageElement.textContent = message;
        errorElement.style.display = 'flex';
        
        // Hide success message if shown
        hideResetPasswordSuccess();
    }
}

/**
 * Hide reset password error
 */
function hideResetPasswordError() {
    const errorElement = document.getElementById('resetError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * Show reset password success
 */
function showResetPasswordSuccess() {
    const successElement = document.getElementById('resetSuccess');
    if (successElement) {
        successElement.style.display = 'flex';
        
        // Hide error message if shown
        hideResetPasswordError();
    }
}

/**
 * Hide reset password success
 */
function hideResetPasswordSuccess() {
    const successElement = document.getElementById('resetSuccess');
    if (successElement) {
        successElement.style.display = 'none';
    }
}

/**
 * Show reset password info message
 */
function showResetPasswordInfo(message) {
    // Create info message element if it doesn't exist
    let infoElement = document.getElementById('resetInfo');
    if (!infoElement) {
        infoElement = document.createElement('div');
        infoElement.id = 'resetInfo';
        infoElement.className = 'alert alert-info';
        infoElement.style.display = 'none';
        infoElement.style.marginBottom = '20px';
        
        // Insert at the top of the form container
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.insertBefore(infoElement, formContainer.firstChild);
        }
    }
    
    if (infoElement) {
        infoElement.innerHTML = `
            <i class="fas fa-info-circle me-2"></i>
            <span>${message}</span>
        `;
        infoElement.style.display = 'block';
    }
}

/**
 * Show field error
 */
function showFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Clear all reset password errors
 */
function clearResetPasswordErrors() {
    const errorElements = [
        'resetError',
        'codeError',
        'newPasswordError',
        'confirmPasswordError'
    ];
    
    errorElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            if (elementId !== 'resetError') {
                element.textContent = '';
            }
        }
    });
}

/**
 * Set loading state for buttons
 */
function setLoadingState(button, isLoading) {
    const spinner = button.querySelector('.loading-spinner');
    const text = button.querySelector('span');
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        if (spinner) spinner.style.display = 'inline-block';
        if (text) text.style.display = 'none';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
        if (text) text.style.display = 'inline';
    }
}
