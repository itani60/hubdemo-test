/**
 * Login Page JavaScript
 * Handles login form functionality and Turnstile integration
 */

// Global variables (none needed for implicit rendering)

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
        emailInput.addEventListener('input', (e) => clearFieldError(e.target));
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', (e) => clearFieldError(e.target));
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * Setup Turnstile integration (invisible mode)
 */
function setupTurnstileIntegration() {
    console.log('Turnstile invisible mode setup for login page');

    const container = document.querySelector('.cf-turnstile');
    if (!container) {
        console.warn('Turnstile container not found on login page');
        return;
    }

    // Ensure stable selector and correct attributes for invisible/programmatic execution
    if (!container.id) {
        container.id = 'login-turnstile-' + Math.random().toString(36).slice(2, 8);
    }
    container.setAttribute('data-size', 'invisible');
    container.setAttribute('data-action', 'login');
    container.setAttribute('data-execution', 'execute');
    container.setAttribute('data-appearance', 'execute');

    if (typeof turnstile === 'undefined') {
        console.warn('Turnstile library not loaded yet');
        return;
    }
    turnstile.ready(() => {
        console.log('Turnstile ready on login page');
    });
}

/**
 * Turnstile success callback (invisible mode)
 */
function onTurnstileSuccess(token) {
    console.log('Turnstile verification successful');

    // Get form data and submit with token
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (emailInput && passwordInput) {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Submit login data with Turnstile token
        submitLoginData(email, password, token);
    } else {
        console.error('Form inputs not found');
        setLoginLoading(false);
        showLoginError('Form error. Please try again.');
    }
}

/**
 * Turnstile error callback (invisible mode)
 */
function onTurnstileError(error) {
    console.error('Turnstile verification failed:', error);
    setLoginLoading(false);
    showLoginError('Security verification failed. Please try again.');
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
    if (!input) return;
    clearFieldError(input);

    const formGroup = input.closest('.form-group') || input.parentElement;
    if (!formGroup) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '5px';

    formGroup.appendChild(errorDiv);
    formGroup.classList.add('error');
    input.style.borderColor = '#dc3545';
}

/**
 * Clear field error
 */
function clearFieldError(input) {
    if (!input) return;
    const formGroup = input.closest('.form-group') || input.parentElement;
    if (!formGroup) return;

    const errorDiv = formGroup.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    formGroup.classList.remove('error');
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
        // For invisible mode, execute Turnstile and wait for callback
        if (typeof turnstile !== 'undefined') {
            const container = document.querySelector('.cf-turnstile');
            if (container) {
                // Clear any previous token from hidden input to avoid stale values
                const hidden = document.querySelector('input[name="cf-turnstile-response"]');
                if (hidden) hidden.value = '';

                const selector = container.id ? ('#' + container.id) : '.cf-turnstile';
                turnstile.ready(() => {
                    try {
                        turnstile.execute(selector, { action: 'login' });
                    } catch (execErr) {
                        console.error('Turnstile execute failed:', execErr);
                        // Fallback: proceed without token
                        submitLoginData(email, password);
                    }
                });
            } else {
                console.warn('Turnstile container not found, proceeding without verification');
                await submitLoginData(email, password);
            }
        } else {
            // Fallback if Turnstile not loaded
            console.warn('Turnstile not loaded, proceeding without verification');
            await submitLoginData(email, password);
        }

    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Login failed. Please try again.');
        setLoginLoading(false);
    }
}

/**
 * Submit login data after Turnstile verification
 */
async function submitLoginData(email, password, turnstileToken = null) {
    try {
        const loginData = {
            email: email,
            password: password,
            rememberMe: document.getElementById('rememberMe').checked
        };

        // Include Turnstile token if provided
        if (turnstileToken) {
            loginData.turnstileToken = turnstileToken;
        }

        // Call actual AWS Lambda API instead of simulation
        const response = await callLoginAPI(loginData);

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
            if (response.error === 'TURNSTILE_REQUIRED' || response.requiresTurnstile) {
                showLoginError('Security verification required. Please try again.');
            } else {
                showLoginError(response.message || 'Login failed. Please check your credentials and try again.');
            }
        }

    } catch (error) {
        console.error('Login submission error:', error);
        showLoginError('Login failed. Please try again.');
    } finally {
        setLoginLoading(false);
    }
}

/**
 * Call actual login API (AWS Lambda)
 */
async function callLoginAPI(loginData) {
    const response = await fetch('https://da84s1s15g.execute-api.af-south-1.amazonaws.com/prod/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Get Turnstile token for login (implicit rendering)
 */
async function getLoginCaptchaToken() {
    // For implicit rendering, get token from the hidden form field
    const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
    if (turnstileResponse && turnstileResponse.value) {
        return turnstileResponse.value;
    }

    return null;
}

/**
 * Show Turnstile widget for login (implicit rendering - widget is always visible)
 */
function showLoginTurnstileWidget() {
    // For implicit rendering, the widget is already in the DOM
    // Just ensure it's visible if it was hidden
    const turnstileWidget = document.querySelector('.cf-turnstile');
    if (turnstileWidget) {
        turnstileWidget.style.display = 'block';
    }
}

/**
 * Reset Turnstile widget for login (implicit rendering)
 */
function resetLoginTurnstileWidget() {
    // For implicit rendering, reset by clearing the hidden input
    const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
    if (turnstileResponse) {
        turnstileResponse.value = '';
    }
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
    } else if (loginData.email === 'turnstile@example.com') {
        return {
            success: false,
            code: 'TURNSTILE_REQUIRED',
            requiresTurnstile: true,
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
