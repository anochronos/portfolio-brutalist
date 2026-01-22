// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // ===== Pixel Blast Background =====
    const hero = document.querySelector('.hero');
    const canvas = document.createElement('canvas');
    canvas.id = 'pixel-blast-bg';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let time = 0;
    const pixelSize = 10;  // Larger pixels = better performance
    const speed = 0.003;
    let mouse = { x: -1000, y: -1000 };
    const ripples = [];

    // Perlin-style noise
    function noise2D(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = fade(x);
        const v = fade(y);
        const A = p[X] + Y, B = p[X + 1] + Y;
        return lerp(v, lerp(u, grad(p[A], x, y), grad(p[B], x - 1, y)),
            lerp(u, grad(p[A + 1], x, y - 1), grad(p[B + 1], x - 1, y - 1)));
    }

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    // Permutation table
    const perm = [];
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    const p = [...perm, ...perm];

    // Simplified noise - fewer octaves for performance
    function fbm(x, y) {
        return noise2D(x, y) * 0.6 + noise2D(x * 2, y * 2) * 0.3;
    }

    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function addRipple(x, y) {
        ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 250,
            speed: 4,
            alpha: 1
        });
    }

    function drawPixelBlast() {
        ctx.fillStyle = '#f5f5f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cols = Math.ceil(canvas.width / pixelSize);
        const rows = Math.ceil(canvas.height / pixelSize);
        const scale = 0.02;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * pixelSize;
                const y = j * pixelSize;

                // Simplified noise calculation
                let noiseVal = fbm(i * scale + time, j * scale + time * 0.4);

                // Simplified ripple effects
                for (let r = 0; r < ripples.length; r++) {
                    const ripple = ripples[r];
                    const dx = x - ripple.x;
                    const dy = y - ripple.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (Math.abs(dist - ripple.radius) < 50) {
                        noiseVal += Math.sin((dist - ripple.radius) * 0.1) * ripple.alpha * 0.3;
                    }
                }

                // Mouse interaction
                const mx = mouse.x - x;
                const my = mouse.y - y;
                const mouseDist = mx * mx + my * my;  // Skip sqrt for performance
                if (mouseDist < 40000) {  // 200^2
                    noiseVal += (1 - mouseDist / 40000) * 0.4;
                }

                // LOWERED threshold for more visible pixels
                const threshold = 0.0 + Math.sin(time * 2) * 0.03;

                if (noiseVal > threshold) {
                    // Size varies with noise value - INCREASED multiplier
                    const size = Math.min(pixelSize - 1, (noiseVal - threshold) * pixelSize * 2.5);

                    // Color based on noise intensity
                    const intensity = Math.min(1, (noiseVal - threshold) * 1.8);
                    const alpha = 0.2 + intensity * 0.7;

                    // Create gradient from dark to accent color - MORE vibrant
                    if (intensity > 0.5) {
                        ctx.fillStyle = `rgba(255, 60, 0, ${alpha * 0.9})`;
                    } else if (intensity > 0.25) {
                        ctx.fillStyle = `rgba(20, 20, 20, ${alpha})`;
                    } else {
                        ctx.fillStyle = `rgba(50, 50, 50, ${alpha * 0.6})`;
                    }

                    // Draw square pixel
                    const offset = (pixelSize - size) / 2;
                    ctx.fillRect(x + offset, y + offset, size, size);
                }
            }
        }

        // Update ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].radius += ripples[i].speed;
            ripples[i].alpha -= 0.008;
            if (ripples[i].alpha <= 0 || ripples[i].radius > ripples[i].maxRadius) {
                ripples.splice(i, 1);
            }
        }

        time += speed;
        if (isHeroVisible) {
            requestAnimationFrame(drawPixelBlast);
        }
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    hero.addEventListener('click', (e) => {
        const rect = hero.getBoundingClientRect();
        addRipple(e.clientX - rect.left, e.clientY - rect.top);
    });

    // Pause animation when hero is not visible
    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wasVisible = isHeroVisible;
            isHeroVisible = entry.isIntersecting;
            // Resume animation when hero becomes visible again
            if (!wasVisible && isHeroVisible) {
                requestAnimationFrame(drawPixelBlast);
            }
        });
    }, { threshold: 0 });
    heroObserver.observe(hero);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawPixelBlast();

    // ===== Typing Effect =====
    const typingText = document.getElementById('typing-text');
    const phrases = [
        'Software Engineer',
        'Full-Stack Developer',
        'Python Developer',
        'Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    // ===== Mobile Navigation Toggle =====
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ===== Navbar Scroll Effect (throttled) =====
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ===== Smooth Scroll for Navigation Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Scroll Reveal Animation =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for reveal animation - optimized with will-change
    document.querySelectorAll('.glass-card, .timeline-item, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        el.style.willChange = 'opacity, transform';
        observer.observe(el);
    });

    // Add revealed class styles - remove will-change after animation
    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; will-change: auto !important; }';
    document.head.appendChild(style);

    // ===== Active Navigation Link Highlight (throttled) =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');  // Cache query
    let navTicking = false;

    window.addEventListener('scroll', function () {
        if (!navTicking) {
            requestAnimationFrame(() => {
                let current = '';
                sections.forEach(section => {
                    if (scrollY >= section.offsetTop - 200) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
                });
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });

    // ===== Contact Form Handling =====
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple form validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
});
