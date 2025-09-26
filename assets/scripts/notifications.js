// Notification System JavaScript

class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = [];
        this.maxNotifications = 5;
    }

    // Show notification
    show(message, type = 'info', title = '', duration = 5000) {
        const notification = this.createNotification(message, type, title, duration);
        this.addNotification(notification);
        return notification;
    }

    // Create notification element
    createNotification(message, type, title, duration) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Get icon based on type
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="notificationSystem.remove(this.closest('.notification'))">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;

        return notification;
    }

    // Get icon for notification type
    getIcon(type) {
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            verification: 'fas fa-envelope-open',
            'login-success': 'fas fa-user-check'
        };
        return icons[type] || icons.info;
    }

    // Add notification to container
    addNotification(notification) {
        // Remove oldest notification if at max capacity
        if (this.notifications.length >= this.maxNotifications) {
            this.remove(this.notifications[0]);
        }

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Trigger show animation with requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove after duration
        const duration = parseInt(notification.dataset.duration) || 5000;
        setTimeout(() => {
            this.remove(notification);
        }, duration);
    }

    // Remove notification
    remove(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.add('hide');
        
        // Use requestAnimationFrame for smoother animations on mobile
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                
                // Remove from notifications array
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        });
    }

    // Clear all notifications
    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    // Predefined notification methods
    showVerificationCode(email) {
        return this.show(
            `A 6-digit verification code has been sent to <strong>${email}</strong>. Please check your email and enter the code to continue.`,
            'verification',
            'Verification Code Sent',
            8000
        );
    }

    showLoginSuccess(email) {
        return this.show(
            `Welcome back! You have successfully logged in as <strong>${email}</strong>.`,
            'login-success',
            'Login Successful',
            4000
        );
    }

    showRegistrationSuccess(email) {
        return this.show(
            `Account created successfully! A verification code has been sent to <strong>${email}</strong>.`,
            'success',
            'Registration Successful',
            6000
        );
    }

    showPasswordResetSent(email) {
        return this.show(
            `Password reset instructions have been sent to <strong>${email}</strong>. Please check your email.`,
            'info',
            'Password Reset Sent',
            6000
        );
    }

    showPasswordResetSuccess() {
        return this.show(
            'Your password has been successfully reset. You can now log in with your new password.',
            'success',
            'Password Reset Successful',
            5000
        );
    }

    showError(message) {
        return this.show(
            message,
            'error',
            'Error',
            6000
        );
    }

    showWarning(message) {
        return this.show(
            message,
            'warning',
            'Warning',
            5000
        );
    }

    showInfo(message, title = 'Information') {
        return this.show(
            message,
            'info',
            title,
            4000
        );
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Make it globally available
window.notificationSystem = notificationSystem;


// Helper functions for easy use
window.showNotification = (message, type = 'info', title = '', duration = 5000) => {
    return notificationSystem.show(message, type, title, duration);
};

window.showVerificationCode = (email) => {
    return notificationSystem.showVerificationCode(email);
};

window.showLoginSuccess = (email) => {
    return notificationSystem.showLoginSuccess(email);
};

window.showRegistrationSuccess = (email) => {
    return notificationSystem.showRegistrationSuccess(email);
};

window.showPasswordResetSent = (email) => {
    return notificationSystem.showPasswordResetSent(email);
};

window.showPasswordResetSuccess = () => {
    return notificationSystem.showPasswordResetSuccess();
};

window.showError = (message) => {
    return notificationSystem.showError(message);
};

window.showWarning = (message) => {
    return notificationSystem.showWarning(message);
};

window.showInfo = (message, title = 'Information') => {
    return notificationSystem.showInfo(message, title);
};

// Example usage:
// showVerificationCode('user@example.com');
// showLoginSuccess('user@example.com');
// showError('Invalid email or password');
// showInfo('Please check your email for verification code');
