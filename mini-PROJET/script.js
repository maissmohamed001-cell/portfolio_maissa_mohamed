
class MobileMenuManager {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.menuToggle && this.mainNav) {
            this.menuToggle.addEventListener('click', () => this.toggle());
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
        }
    }

    toggle() {
        this.mainNav.classList.toggle('is-open');
        const isOpen = this.mainNav.classList.contains('is-open');
        this.menuToggle.setAttribute('aria-expanded', isOpen);
    }

    close() {
        this.mainNav.classList.remove('is-open');
        this.menuToggle.setAttribute('aria-expanded', false);
    }
}


class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }

    updateActiveLink() {
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}


class FormValidator {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.successMessage = document.getElementById('form-success');
        this.thanksPopup = document.getElementById('thanks-popup'); // New thanks page element
        this.closePopupButton = document.getElementById('close-popup');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.attachFieldValidators();
        }
        if (this.closePopupButton) {
            this.closePopupButton.addEventListener('click', () => this.hideSuccess());
        }
    }

    attachFieldValidators() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}-error`);
        const formGroup = field.closest('.form-group');
        let error = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    error = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    error = 'Subject must be at least 3 characters';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    error = 'Message must be at least 10 characters';
                }
                break;
        }

        if (error) {
            formGroup.classList.add('error');
            if (errorElement) errorElement.textContent = error;
            return false;
        } else {
            formGroup.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
            return true;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const fields = ['name', 'email', 'subject', 'message'];
        let isValid = true;

        fields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        console.log('Form Data Submitted:', data);

        try {
            
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError('Failed to send message. Please try again.');
        }
    }

    showSuccess() {
        if (this.thanksPopup) {
            this.thanksPopup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        }
    }

    hideSuccess() {
        if (this.thanksPopup) {
            this.thanksPopup.classList.remove('active');
            document.body.style.overflow = 'auto'; // Resume scrolling
        }
    }

    showError(message) {
        alert(message);
    }
}


class ScrollToTopManager {
    constructor() {
        this.scrollBtn = document.getElementById('scroll-to-top');
        this.init();
    }

    init() {
        if (this.scrollBtn) {
            window.addEventListener('scroll', () => this.toggleButton());
            this.scrollBtn.addEventListener('click', () => this.scrollToTop());
        }
    }

    toggleButton() {
        if (window.scrollY > 300) {
            this.scrollBtn.style.display = 'flex';
        } else {
            this.scrollBtn.style.display = 'none';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}


class HeaderScrollEffect {
    constructor() {
        this.header = document.getElementById('header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateHeaderStyle());
    }

    updateHeaderStyle() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}


class ScrollAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToObserve = document.querySelectorAll(
            '.skill-card, .contact-form, .contact-info'
        );
        elementsToObserve.forEach(el => observer.observe(el));
    }
}


class KeyboardShortcuts {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const nameField = document.getElementById('name');
            if (nameField) nameField.focus();
        }

        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.main-nav');
            if (mobileMenu) {
                mobileMenu.classList.remove('is-open');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', false);
            }
            // Close popup on Escape
            const thanksPopup = document.getElementById('thanks-popup');
            if (thanksPopup) thanksPopup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}


class Utils {
    static debounce(func, wait) {
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

    static logPerformance() {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⏱️ Page Load Time: ${pageLoadTime}ms`);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio website initializing...');

    new MobileMenuManager();
    new NavigationManager();
    new FormValidator();
    new ScrollToTopManager();
    new HeaderScrollEffect();
    new ScrollAnimationManager();
    new KeyboardShortcuts();

    Utils.logPerformance();
    console.log('✅ Portfolio website ready!');
});

window.addEventListener('load', () => {
    document.querySelectorAll('[data-aos]').forEach(element => {
        const delay = element.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
            element.classList.add('fade-in-up');
        }, delay);
    });
});