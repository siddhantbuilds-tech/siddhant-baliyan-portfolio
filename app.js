// Portfolio Website JavaScript - Fixed Version

class PortfolioApp {
    constructor() {
        this.currentPage = 'home';
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.slideInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startSlider();
        this.setupPortfolioFilters();
        this.setupBlogSearch();
        this.setupContactForm();
        this.animateOnLoad();
    }

    setupEventListeners() {
        // Navigation links - Fixed
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Logo click - Fixed
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('home');
            });
            logo.style.cursor = 'pointer';
        }

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Slider controls
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }

        // Hero buttons - Fixed
        const portfolioBtn = document.querySelector('.hero-buttons .btn--primary');
        const contactBtn = document.querySelector('.hero-buttons .btn--outline');
        
        if (portfolioBtn) {
            portfolioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('portfolio');
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('contact');
            });
        }

        // Footer links - Fixed
        const footerLinks = document.querySelectorAll('.footer-section a');
        footerLinks.forEach(link => {
            if (link.getAttribute('onclick')) {
                // Skip links that already have onclick handlers
                return;
            }
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = href.substring(1);
                    this.navigateToPage(page);
                });
            }
        });

        // Smooth scrolling for page transitions
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    navigateToPage(page) {
        console.log('Navigating to:', page); // Debug log
        
        // Hide current page
        const currentPageEl = document.querySelector('.page.active');
        if (currentPageEl) {
            currentPageEl.classList.remove('active');
        }

        // Show target page
        const targetPageEl = document.getElementById(page);
        if (targetPageEl) {
            targetPageEl.classList.add('active');
            targetPageEl.classList.add('animate-fade-in-up');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                targetPageEl.classList.remove('animate-fade-in-up');
            }, 600);
        } else {
            console.error('Page not found:', page);
            return;
        }

        // Update navigation
        this.updateNavigation(page);
        
        // Update current page
        this.currentPage = page;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Stop slider on non-home pages
        if (page !== 'home') {
            this.stopSlider();
        } else {
            this.startSlider();
        }
    }

    updateNavigation(activePage) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            }
        });
    }

    // Slider functionality
    startSlider() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    stopSlider() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }

    updateSlider() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            }
        });
    }

    // Portfolio filtering
    setupPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        const category = item.getAttribute('data-category');
                        if (category === filter) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    // Blog search functionality
    setupBlogSearch() {
        const searchInput = document.getElementById('blogSearch');
        const blogCards = document.querySelectorAll('.blog-card');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                
                blogCards.forEach(card => {
                    const title = card.querySelector('h2').textContent.toLowerCase();
                    const content = card.querySelector('p').textContent.toLowerCase();
                    const category = card.querySelector('.blog-category').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || 
                        content.includes(searchTerm) || 
                        category.includes(searchTerm)) {
                        card.style.display = 'block';
                        card.classList.add('animate-fade-in-up');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    // Contact form handling - Fixed validation
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(contactForm);
            });

            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation (optional but if provided, should be valid)
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Add error styling
        field.style.borderColor = 'var(--color-error)';
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-4);
        `;
        
        // Add error icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorElement.insertBefore(icon, errorElement.firstChild);
        
        field.parentNode.appendChild(errorElement);
    }

    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Name',
            'email': 'Email',
            'phone': 'Phone',
            'address': 'Address',
            'message': 'Message'
        };
        return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }

    handleContactSubmit(form) {
        const formData = new FormData(form);
        let isFormValid = true;

        // Clear any existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show success message
            this.showSuccessMessage(form);
            
            // Reset form
            form.reset();
            
            // Log form data (in a real app, you would send this to a server)
            console.log('Contact form submitted:', Object.fromEntries(formData));
        } else {
            // Show error message
            this.showErrorMessage(form, 'Please correct the errors above and try again.');
        }
    }

    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'form-message success-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your message has been sent successfully. I'll get back to you soon.</span>
        `;
        message.style.cssText = `
            background: rgba(var(--color-success-rgb), 0.1);
            color: var(--color-success);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-top: var(--space-16);
            display: flex;
            align-items: center;
            gap: var(--space-8);
            border: 1px solid rgba(var(--color-success-rgb), 0.3);
        `;

        form.appendChild(message);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (message && message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    showErrorMessage(form, errorText) {
        const message = document.createElement('div');
        message.className = 'form-message error-message';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${errorText}</span>
        `;
        message.style.cssText = `
            background: rgba(var(--color-error-rgb), 0.1);
            color: var(--color-error);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-top: var(--space-16);
            display: flex;
            align-items: center;
            gap: var(--space-8);
            border: 1px solid rgba(var(--color-error-rgb), 0.3);
        `;

        form.appendChild(message);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (message && message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    // Scroll handling
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(var(--color-slate-900-rgb), 0.98)';
        } else {
            navbar.style.background = 'rgba(var(--color-slate-900-rgb), 0.95)';
        }
    }

    // Animation on load
    animateOnLoad() {
        // Add loading animation to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('animate-fade-in-up');
        }

        // Animate skill items
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    // Utility method to get current page
    getCurrentPage() {
        return this.currentPage;
    }
}

// Global navigation function (for onclick handlers in HTML) - Fixed
function navigateToPage(page) {
    if (window.portfolioApp) {
        window.portfolioApp.navigateToPage(page);
    }
}

// Blog read more functionality
function readMoreBlog(element) {
    // In a real application, this would navigate to a full blog post page
    const title = element.closest('.blog-card').querySelector('h2').textContent;
    alert(`This would open the full blog post: "${title}" in a real application.`);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main app
    window.portfolioApp = new PortfolioApp();
    
    // Make navigateToPage globally available
    window.navigateToPage = navigateToPage;
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) { // More than just "#"
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.service-card, .portfolio-card, .blog-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click handlers to blog read more buttons
    const readMoreBtns = document.querySelectorAll('.blog-card .btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            readMoreBlog(this);
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Add loading state removal
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    console.log('Portfolio app initialized successfully'); // Debug log
});

// Window resize handler
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu && window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}