// JavaScript สำหรับ Portfolio Website

// Gallery Slider Global Variables and Functions
let currentSlideIndex = 0;
let slides, dots, totalSlides;

// Initialize gallery slider
function initializeGallerySlider() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;
}

// Show specific slide
function showSlide(index) {
    if (!slides || !dots) return;
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// Change slide (next/previous) - Global function for onclick
function changeSlide(direction) {
    if (!slides) return;
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    showSlide(currentSlideIndex);
}

// Go to specific slide - Global function for onclick
function currentSlide(index) {
    if (!slides) return;
    
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// รอให้หน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });


            }
        });
    });
    
    // Add active class to navigation items on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('nav a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    console.log('Portfolio website loaded successfully!');
    
    // Initialize gallery slider when DOM is loaded
    initializeGallerySlider();
    
    // เพิ่มเอฟเฟกต์ parallax สำหรับรูปพื้นหลัง
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const backgroundImage = document.querySelector('.background-image');
        if (backgroundImage) {
            const speed = scrolled * 0.5;
            backgroundImage.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // เพิ่มเอฟเฟกต์ fade in สำหรับ portfolio items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // สังเกตการณ์ portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // เพิ่มเอฟเฟกต์ hover สำหรับรูปพื้นหลัง
    const backgroundImage = document.querySelector('.background-image');
    if (backgroundImage) {
        backgroundImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        backgroundImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // เพิ่มการตอบสนองสำหรับ mobile
    function handleResize() {
        const heroTitle = document.querySelector('.hero-title');
        if (window.innerWidth <= 480) {
            heroTitle.style.fontSize = '2rem';
        } else if (window.innerWidth <= 768) {
            heroTitle.style.fontSize = '2.5rem';
        } else {
            heroTitle.style.fontSize = '4rem';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // เรียกใช้ทันทีเมื่อโหลดหน้า
    
    // เพิ่มเอฟเฟกต์ loading
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Loading Portfolio...';
    loadingText.style.cssText = `
        color: white;
        font-size: 2rem;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        animation: pulse 1.5s infinite;
    `;
    
    // เพิ่ม CSS animation สำหรับ pulse effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);
    
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
    
    // ซ่อน loading overlay หลังจาก 1.5 วินาที
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(loadingOverlay)) {
                document.body.removeChild(loadingOverlay);
            }
        }, 500);
    }, 1500);
});

// ฟังก์ชันสำหรับปุ่ม Explore
function explorePortfolio() {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // เพิ่มเอฟเฟกต์ ripple สำหรับปุ่ม
    const button = event.target;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    // เพิ่ม CSS animation สำหรับ ripple effect
    if (!document.querySelector('#ripple-style')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-style';
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .explore-btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (button.contains(ripple)) {
            button.removeChild(ripple);
        }
    }, 600);
}

// ฟังก์ชันสำหรับแสดงข้อความต้อนรับ
function showWelcomeMessage() {
    alert('Welcome to my portfolio! Explore my work and journey.');
}

// เพิ่มเอฟเฟกต์ smooth scroll สำหรับทุก anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// เพิ่มเอฟเฟกต์ typing สำหรับหัวข้อ (ถ้าต้องการ)
function typeWriterEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}