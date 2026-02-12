// Advanced Portfolio Features

// ==================== Sound System ====================
class SoundSystem {
    constructor() {
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.audioContext = null;
        this.initSoundToggle();
    }

    initSoundToggle() {
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            this.updateSoundButton();
            soundToggle.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                localStorage.setItem('soundEnabled', this.soundEnabled);
                this.updateSoundButton();
                if (this.soundEnabled) {
                    this.playClickSound();
                }
            });
        }
    }

    updateSoundButton() {
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            if (this.soundEnabled) {
                soundToggle.classList.add('active');
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i> Sound';
            } else {
                soundToggle.classList.remove('active');
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Muted';
            }
        }
    }

    playClickSound() {
        if (!this.soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    playHoverSound() {
        if (!this.soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }

    playSuccessSound() {
        if (!this.soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G notes
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 100);
        });
    }
}

const soundSystem = new SoundSystem();

// ==================== Image Upload System ====================
class ImageUploadSystem {
    constructor() {
        this.initImageUpload();
    }

    initImageUpload() {
        const profileImg = document.getElementById('profileImg');
        const imageUpload = document.getElementById('imageUpload');
        const userImage = document.getElementById('userImage');
        const placeholderContent = document.getElementById('placeholderContent');

        if (profileImg && imageUpload) {
            profileImg.addEventListener('click', () => {
                imageUpload.click();
            });

            imageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        userImage.src = event.target.result;
                        userImage.style.display = 'block';
                        if (placeholderContent) {
                            placeholderContent.style.display = 'none';
                        }
                        localStorage.setItem('userProfileImage', event.target.result);
                        soundSystem.playSuccessSound();
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Load saved image from localStorage
            const savedImage = localStorage.getItem('userProfileImage');
            if (savedImage) {
                userImage.src = savedImage;
                userImage.style.display = 'block';
                if (placeholderContent) {
                    placeholderContent.style.display = 'none';
                }
            }
        }
    }
}

const imageUploadSystem = new ImageUploadSystem();

// ==================== Mobile Menu Toggle ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==================== Smooth Scrolling ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Form Submission ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        soundSystem.playSuccessSound();
        
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });
}

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill bars on scroll
document.querySelectorAll('.skill-item').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.project-card').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.cert-card').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.timeline-content').forEach(el => {
    observer.observe(el);
});

// ==================== Active Navigation Link on Scroll ====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typing animation for hero title
function typeAnimation(element, text, speed = 100) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Animate elements on page load
window.addEventListener('load', () => {
    // You can add page load animations here
    animation animations();
});

// Skill Progress Animation
function animateSkills() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    skillProgressBars.forEach(bar => {
        const parent = bar.closest('.skill-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(parent);
    });
}

animateSkills();

// ==================== Parallax Effect on Scroll ====================
window.addEventListener('scroll', () => {
    const heroAnimation = document.querySelector('.hero-animation');
    if (heroAnimation) {
        const scrollPosition = window.pageYOffset;
        heroAnimation.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
});

// ==================== Button Hover Effects ====================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        soundSystem.playHoverSound();
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    button.addEventListener('click', function() {
        soundSystem.playClickSound();
    });
});

// ==================== Social Icon Effects ====================
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) rotate(10deg) scale(1.1)';
        soundSystem.playHoverSound();
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0) scale(1)';
    });
});

// ==================== Project Card Glow Effect ====================
document.querySelectorAll('.project-card').forEach(card => {
    let soundPlayed = false;
    
    card.addEventListener('mouseenter', function() {
        soundPlayed = false;
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (!soundPlayed) {
            soundSystem.playHoverSound();
            soundPlayed = true;
        }
        
        this.style.boxShadow = `
            ${(x - rect.width / 2) * 0.1}px ${(y - rect.height / 2) * 0.1}px 20px rgba(99, 102, 241, 0.3)
        `;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// ==================== Email Validation ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== Form Validation ====================
const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.type === 'email') {
            if (!validateEmail(this.value) && this.value !== '') {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        } else if (this.value.trim() === '') {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#10b981';
        }
    });

    input.addEventListener('focus', function() {
        this.style.borderColor = '';
    });

    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
});

// ==================== Lazy Loading Images ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== Accessibility Improvements ====================
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// ==================== Typing Animation ====================
function typeAnimation(element, text, speed = 50) {
    if (!element) return;
    
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Apply typing animation to hero title on page load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent.length > 0) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        typeAnimation(heroTitle, originalText, 50);
    }
});

// ==================== Floating Cards Animation Controller ====================
document.querySelectorAll('.card').forEach((card, index) => {
    const randomDelay = Math.random() * 0.5;
    card.style.animationDelay = randomDelay + 's';
});

// ==================== Glow Text Animation ====================
function addGlowEffect(element) {
    element.style.transition = 'all 0.3s ease';
    element.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 20px rgba(99, 102, 241, 0.8)';
        soundSystem.playHoverSound();
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.textShadow = 'none';
    });
}

document.querySelectorAll('.section-title').forEach(title => {
    addGlowEffect(title);
});

// ==================== Performance Optimization ====================
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

// Debounce scroll events
const debouncedScroll = debounce(() => {
    // Scroll-related heavy computations here
}, 250);

window.addEventListener('scroll', debouncedScroll);

// ==================== Console Message ====================
console.log('%c🎉 Welcome to MHamza Nadeem\'s Portfolio! 🎉', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cSoftware & AI Developer | Building Intelligent Solutions', 'color: #ec4899; font-size: 12px;');
console.log('%c✨ Pro Tips:', 'color: #06b6d4; font-size: 13px; font-weight: bold;');
console.log('%c1. Click the profile circle to upload your photo', 'color: #10b981; font-size: 11px;');
console.log('%c2. Use the Sound button to toggle audio effects', 'color: #10b981; font-size: 11px;');
console.log('%c3. Enjoy interactive sound effects on hover and clicks!', 'color: #10b981; font-size: 11px;');
