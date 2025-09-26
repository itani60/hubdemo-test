// Register2.js - Registration Form Functionality

// Global variables
let isFormValid = false;

// Password requirements - clean implementation

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
});

function initializeRegistrationForm() {
    // Get form elements
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Form submission is now handled by AWS Auth system
    // if (form) {
    //     form.addEventListener('submit', handleRegistration);
    // }

    // Password toggle buttons
    const passwordToggle = document.getElementById('registerPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

    // Password input events
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordRequirements(this.value);
            checkPasswordMatch();
        });
    }

    // Confirm password input events
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    // Password toggle events
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility('registerPassword', this);
        });
    }

    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('confirmPassword', this);
        });
    }


    // Real-time validation for all inputs
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Initialize Google Sign-In
    initializeGoogleSignIn();
    
    // Add event listener for reset password modal
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmNewPasswordToggle = document.getElementById('confirmNewPasswordToggle');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordRequirements(this.value);
            
            // Check if passwords match in reset form
            const confirmNewPassword = document.getElementById('confirmNewPassword');
            if (confirmNewPassword && confirmNewPassword.value) {
                checkResetPasswordMatch();
            }
        });
    }
    
    // Add event listener for confirm new password
    if (confirmNewPasswordInput) {
        confirmNewPasswordInput.addEventListener('input', checkResetPasswordMatch);
    }
    
    // Add event listeners for password toggle buttons in reset modal
    if (newPasswordToggle) {
        newPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('newPassword', this);
        });
    }
    
    if (confirmNewPasswordToggle) {
        confirmNewPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('confirmNewPassword', this);
        });
    }
    }
    
    // Check if passwords match in reset form
    function checkResetPasswordMatch() {
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        const matchContainer = document.getElementById('resetPasswordMatch');
    
        if (!matchContainer) return false;
    
        if (confirmPassword && password !== confirmPassword) {
            matchContainer.classList.add('show');
            matchContainer.classList.remove('valid');
            return false;
        } else if (confirmPassword && password === confirmPassword) {
            matchContainer.classList.add('show', 'valid');
            matchContainer.querySelector('i').className = 'fas fa-check';
            matchContainer.querySelector('span').textContent = 'Passwords match';
            return true;
        } else {
            matchContainer.classList.remove('show');
            return true;
        }
    }

// Clean password requirements checking
function checkPasswordRequirements(password) {
    const requirements = [
        { id: 'length', test: password.length >= 8, text: 'At least 8 characters' },
        { id: 'uppercase', test: /[A-Z]/.test(password), text: 'One uppercase letter' },
        { id: 'lowercase', test: /[a-z]/.test(password), text: 'One lowercase letter' },
        { id: 'number', test: /\d/.test(password), text: 'One number' },
        { id: 'special', test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' }
    ];

    requirements.forEach(req => {
        // Update all matching requirement elements (both in registration form and reset modal)
        const elements = document.querySelectorAll(`[data-requirement="${req.id}"]`);
        elements.forEach(element => {
            const icon = element.querySelector('i');
            if (req.test) {
                element.classList.add('valid');
                element.classList.remove('invalid');
                if (icon) {
                    icon.className = 'fas fa-check';
                }
            } else {
                element.classList.add('invalid');
                element.classList.remove('valid');
                if (icon) {
                    icon.className = 'fas fa-times';
                }
            }
        });
    });

    return requirements.every(req => req.test);
}

// Password match checking
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchContainer = document.getElementById('registerPasswordMatch');

    if (confirmPassword && password !== confirmPassword) {
        matchContainer.classList.add('show');
        matchContainer.classList.remove('valid');
        return false;
    } else if (confirmPassword && password === confirmPassword) {
        matchContainer.classList.add('show', 'valid');
        matchContainer.querySelector('i').className = 'fas fa-check';
        matchContainer.querySelector('span').textContent = 'Passwords match';
        return true;
    } else {
        matchContainer.classList.remove('show');
        return true;
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId, toggleButton) {
    const input = document.getElementById(inputId);
    const icon = toggleButton.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error state
    const formGroup = field.closest('.form-group') || field.closest('.form-options');
    if (formGroup) {
        formGroup.classList.remove('error', 'success');
    }
    hideFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Password validation
    if (fieldName === 'password' || fieldName === 'newPassword') {
        if (value && !checkPasswordRequirements(value)) {
            isValid = false;
            errorMessage = 'Password does not meet requirements';
        }
    }

    // Confirm password validation
    if (fieldName === 'confirmPassword' && value) {
        const password = document.getElementById('registerPassword').value;
        if (value !== password) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }
    
    // Confirm new password validation (for reset modal)
    if (fieldName === 'confirmNewPassword' && value) {
        const password = document.getElementById('newPassword').value;
        if (value !== password) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }

    // Name validation
    if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = `${getFieldLabel(fieldName)} must be at least 2 characters`;
        }
    }

    // Update field state
    if (formGroup) {
        if (isValid) {
            formGroup.classList.add('success');
        } else {
            formGroup.classList.add('error');
            showFieldError(field, errorMessage);
        }
    }

    return isValid;
}

// Get field label
function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group') || field.closest('.form-options');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Hide field error
function hideFieldError(field) {
    const formGroup = field.closest('.form-group') || field.closest('.form-options');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Set submit button loading state
function setSubmitButtonLoading(loading) {
    const submitBtn = document.querySelector('.register-submit-btn');
    if (submitBtn) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Register';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Register';
        }
    }
}

// Handle form submission - Now handled by AWS Auth
function handleRegistration(event) {
    // This function is now handled by the AWS Auth system
    // The form submission is managed by aws-auth.js
    console.log('Registration handled by AWS Auth system');
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    // Check if Google Identity Services is loaded
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
            callback: handleGoogleSignIn
        });
        
        google.accounts.id.renderButton(
            document.querySelector('.gsi-material-button'),
            {
                theme: 'outline',
                size: 'large',
                width: '100%'
            }
        );
    }
}

// Handle Google Sign-In
function handleGoogleSignIn(response) {
    console.log('Google Sign-In response:', response);
    
    // Decode the JWT token (you'll need a JWT library for production)
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log('Google user data:', payload);
        
        // Handle successful Google sign-in
        alert('Google Sign-In successful! Welcome to CompareHubPrices!');
        
    } catch (error) {
        console.error('Error processing Google Sign-In:', error);
        alert('Error processing Google Sign-In. Please try again.');
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// OTP Verification Functions - Now handled by AWS Auth
// These variables are no longer needed as AWS Auth handles OTP functionality

// Show OTP verification section - Now handled by AWS Auth
function showOTPVerification(email) {
    // This is now handled by the AWS Auth system
    console.log('OTP verification display handled by AWS Auth system');
}

// Generate and send OTP - Now handled by AWS Auth
function generateAndSendOTP(email) {
    // This is now handled by the AWS Auth system
    console.log('OTP generation handled by AWS Auth system');
}

// Initialize OTP input functionality - Now handled by AWS Auth
function initializeOTPInputs() {
    // This is now handled by the AWS Auth system
    console.log('OTP input initialization handled by AWS Auth system');
}

// Handle OTP paste - Now handled by AWS Auth
function handleOTPPaste(e) {
    // This is now handled by the AWS Auth system
    console.log('OTP paste handling by AWS Auth system');
}

// Check if OTP is complete - Now handled by AWS Auth
function checkOTPCompletion() {
    // This is now handled by the AWS Auth system
    console.log('OTP completion check by AWS Auth system');
}

// Handle OTP verification - Now handled by AWS Auth
function handleOTPVerification(event) {
    // This is now handled by the AWS Auth system
    console.log('OTP verification handled by AWS Auth system');
}

// Show OTP error - Now handled by AWS Auth
function showOTPError(message) {
    // This is now handled by the AWS Auth system
    console.log('OTP error display handled by AWS Auth system');
}

// Show OTP success - Now handled by AWS Auth
function showOTPSuccess() {
    // This is now handled by the AWS Auth system
    console.log('OTP success display handled by AWS Auth system');
}

// Resend OTP - Now handled by AWS Auth
function resendOTP() {
    // This is now handled by the AWS Auth system
    console.log('Resend OTP handled by AWS Auth system');
}

// Start resend timer - Now handled by AWS Auth
function startResendTimer() {
    // This is now handled by the AWS Auth system
    console.log('Resend timer handled by AWS Auth system');
}

// Export only the functions that are still needed (UI helpers)
window.register2Functions = {
    validateField,
    checkPasswordRequirements,
    checkPasswordMatch,
    togglePasswordVisibility
    // Removed testing functions that are now handled by AWS Auth
};
