/**
 * Login Page JavaScript
 * Handles login form functionality and Turnstile integration
 */

// Global variables
let loginTurnstileWidgetId = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
});

/**
 * Initialize login page functionality
 */
function initializeLoginPage() {
    setupPasswordToggle();
    setupFormValidation();
    setupTurnstileIntegration();
    console.log('Login page initialized');
}

/**
 * Setup password toggle functionality
 */
function setupPasswordToggle() {
    const passwordToggle = document.getElementById('loginPasswordToggle');
    const passwordInput = document.getElementById('loginPassword');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearFieldError);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', clearFieldError);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * Setup Turnstile integration
 */
function setupTurnstileIntegration() {
    // Wait for Turnstile to be available
    const checkTurnstile = setInterval(() => {
        if (typeof turnstile !== 'undefined') {
            clearInterval(checkTurnstile);
            console.log('Turnstile is ready for login page');
        }
    }, 100);
}

/**
 * Validate email field
 */
function validateEmail() {
    const emailInput = document.getElementById('loginEmail');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(emailInput);
    return true;
}

/**
 * Validate password field
 */
function validatePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const password = passwordInput.value;
    
    if (password && password.length < 6) {
        showFieldError(passwordInput, 'Password must be at least 6 characters long');
        return false;
    }
    
    clearFieldError(passwordInput);
    return true;
}

/**
 * Show field error
 */
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '5px';
    
    input.parentNode.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#dc3545';
}

/**
 * Clear field error
 */
function clearFieldError(input) {
    const errorDiv = input.parentNode.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '';
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');
    
    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
        showLoginError('Please fix the errors above and try again.');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        showLoginError('Please fill in all required fields.');
        return;
    }
    
    // Show loading state
    setLoginLoading(true);
    hideLoginMessages();
    
    try {
        // Check if Turnstile is required
        const loginData = {
            email: email,
            password: password,
            rememberMe: document.getElementById('rememberMe').checked
        };
        
        // Get Turnstile token if available
        const captchaToken = await getLoginCaptchaToken();
        if (captchaToken) {
            loginData.captchaToken = captchaToken;
        }
        
        // Simulate login API call (replace with actual API)
        const response = await simulateLoginAPI(loginData);
        
        if (response.success) {
            showLoginSuccess('Login successful! Redirecting...');
            
            // Store login state
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            if (response.code === 'CAPTCHA_REQUIRED' || response.captchaRequired) {
                showLoginTurnstileWidget();
                showLoginError('Security verification required. Please complete the verification below.');
            } else {
                showLoginError(response.message || 'Login failed. Please check your credentials and try again.');
            }
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Login failed. Please try again.');
    } finally {
        setLoginLoading(false);
    }
}

/**
 * Get Turnstile token for login
 */
async function getLoginCaptchaToken() {
    // Check if Turnstile token is available from callback
    if (window.loginTurnstileToken) {
        return window.loginTurnstileToken;
    }
    
    // For invisible mode, check if widget is rendered and has a token
    if (typeof turnstile !== 'undefined' && loginTurnstileWidgetId) {
        try {
            const token = turnstile.getResponse(loginTurnstileWidgetId);
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
 * Show Turnstile widget for login
 */
function showLoginTurnstileWidget() {
    const turnstileContainer = document.getElementById('loginTurnstileContainer');
    if (turnstileContainer) {
        // For invisible mode, container can be hidden but widget still works
        turnstileContainer.style.display = 'none';
        
        // Render invisible Turnstile widget if not already rendered
        if (typeof turnstile !== 'undefined' && !loginTurnstileWidgetId) {
            loginTurnstileWidgetId = turnstile.render(turnstileContainer, {
                sitekey: window.TURNSTILE_CONFIG.siteKey,
                callback: (token) => {
                    console.log('Login Turnstile verification successful');
                    window.loginTurnstileToken = token;
                },
                'error-callback': (error) => {
                    console.error('Login Turnstile verification failed:', error);
                    window.loginTurnstileToken = null;
                    showLoginError('Security verification failed. Please try again.');
                },
                'expired-callback': () => {
                    console.log('Login Turnstile token expired');
                    window.loginTurnstileToken = null;
                    resetLoginTurnstileWidget();
                },
                theme: window.TURNSTILE_CONFIG.theme || 'light',
                size: window.TURNSTILE_CONFIG.size || 'invisible',
                execution: window.TURNSTILE_CONFIG.execution || 'execute',
                appearance: window.TURNSTILE_CONFIG.appearance || 'execute'
            });
            
            // Execute the invisible challenge immediately
            if (loginTurnstileWidgetId) {
                turnstile.execute(turnstileContainer);
            }
        }
    }
}

/**
 * Reset Turnstile widget for login
 */
function resetLoginTurnstileWidget() {
    if (typeof turnstile !== 'undefined' && loginTurnstileWidgetId) {
        turnstile.reset(loginTurnstileWidgetId);
    }
    window.loginTurnstileToken = null;
}

/**
 * Remove Turnstile widget for login
 */
function removeLoginTurnstileWidget() {
    if (typeof turnstile !== 'undefined' && loginTurnstileWidgetId) {
        turnstile.remove(loginTurnstileWidgetId);
        loginTurnstileWidgetId = null;
    }
    window.loginTurnstileToken = null;
}

/**
 * Set login loading state
 */
function setLoginLoading(loading) {
    const submitBtn = document.getElementById('loginSubmitBtn');
    const form = document.getElementById('loginForm');
    
    if (submitBtn) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    if (form) {
        if (loading) {
            form.classList.add('loading');
        } else {
            form.classList.remove('loading');
        }
    }
}

/**
 * Show login error message
 */
function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorMessage = document.getElementById('loginErrorMessage');
    
    if (errorDiv && errorMessage) {
        errorMessage.textContent = message;
        errorDiv.style.display = 'flex';
    }
    
    // Hide success message if visible
    hideLoginSuccess();
}

/**
 * Show login success message
 */
function showLoginSuccess(message) {
    const successDiv = document.getElementById('loginSuccess');
    const successMessage = document.getElementById('loginSuccessMessage');
    
    if (successDiv && successMessage) {
        successMessage.textContent = message;
        successDiv.style.display = 'flex';
    }
    
    // Hide error message if visible
    hideLoginError();
}

/**
 * Hide login error message
 */
function hideLoginError() {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

/**
 * Hide login success message
 */
function hideLoginSuccess() {
    const successDiv = document.getElementById('loginSuccess');
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

/**
 * Hide all login messages
 */
function hideLoginMessages() {
    hideLoginError();
    hideLoginSuccess();
}

/**
 * Handle Google login
 */
function handleGoogleLogin() {
    console.log('Google login clicked');
    // Implement Google OAuth login here
    showLoginError('Google login is not yet implemented. Please use email/password login.');
}

/**
 * Open forgot password modal
 */
function openForgotModal() {
    // Reset the modal to step 1
    document.getElementById('forgotPasswordStep1').style.display = 'block';
    document.getElementById('forgotPasswordStep2').style.display = 'none';
    
    // Clear any previous errors
    clearForgotPasswordErrors();
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

/**
 * Handle forgot password form submission
 */
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    // Clear previous errors
    clearForgotPasswordErrors();
    
    // Validate email
    if (!email) {
        showForgotPasswordError('forgotEmailError', 'Please enter your email address.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showForgotPasswordError('forgotEmailError', 'Please enter a valid email address.');
        return;
    }
    
    // Show loading state
    setLoadingState(sendCodeBtn, true);
    
    try {
        // Simulate API call to send verification code
        const result = await sendForgotPasswordCode(email);
        
        if (result.success) {
            // Store email in sessionStorage for reset password page
            console.log('Storing email in sessionStorage:', email);
            sessionStorage.setItem('resetPasswordEmail', email);
            console.log('Email stored, redirecting to reset-password.html');
            // Redirect to reset password page
            window.location.href = 'reset-password.html';
        } else {
            showForgotPasswordError('forgotEmailError', result.message || 'Failed to send verification code. Please try again.');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showForgotPasswordError('forgotEmailError', 'An error occurred. Please try again.');
    } finally {
        setLoadingState(sendCodeBtn, false);
    }
}

/**
 * Send forgot password verification code
 */
async function sendForgotPasswordCode(email) {
    // Simulate API call - replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate success
            resolve({
                success: true,
                message: 'Verification code sent successfully'
            });
        }, 2000);
    });
}

/**
 * Show forgot password success step
 */
function showForgotPasswordSuccess(email) {
    document.getElementById('forgotPasswordStep1').style.display = 'none';
    document.getElementById('forgotPasswordStep2').style.display = 'block';
    document.getElementById('sentEmail').textContent = email;
}

/**
 * Resend verification code
 */
async function resendCode() {
    const email = document.getElementById('forgotEmail').value.trim();
    
    try {
        const result = await sendForgotPasswordCode(email);
        if (result.success) {
            showLoginSuccess('Verification code resent successfully!');
        } else {
            showLoginError(result.message || 'Failed to resend code. Please try again.');
        }
    } catch (error) {
        console.error('Resend code error:', error);
        showLoginError('An error occurred while resending the code.');
    }
}

/**
 * Go to reset password page
 */
function goToResetPassword() {
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    modal.hide();
    
    // Redirect to reset password page
    window.location.href = 'reset-password.html';
}

/**
 * Show forgot password error
 */
function showForgotPasswordError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Clear forgot password errors
 */
function clearForgotPasswordErrors() {
    const errorElements = document.querySelectorAll('#forgotPasswordModal .field-error');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
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

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


/**
 * Simulate login API call (replace with actual API)
 */
async function simulateLoginAPI(loginData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate different responses based on email
    if (loginData.email === 'test@example.com' && loginData.password === 'password123') {
        return {
            success: true,
            message: 'Login successful',
            user: {
                email: loginData.email,
                name: 'Test User'
            }
        };
    } else if (loginData.email === 'captcha@example.com') {
        return {
            success: false,
            code: 'CAPTCHA_REQUIRED',
            captchaRequired: true,
            message: 'Security verification required'
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }
}

// Global functions for backward compatibility
function handleLogin(event) {
    if (event) {
        event.preventDefault();
    }
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        console.error('Login form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        showLoginError('Please fill in all required fields.');
        return;
    }
    
    // Call the main login handler
    handleLogin(event);
}
