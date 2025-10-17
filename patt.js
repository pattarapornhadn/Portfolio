// JavaScript สำหรับ Portfolio Website

// Gallery Slider Global Variables and Functions
let currentSlideIndex = 0;
let slides, dots, totalSlides;
// เพิ่มตัวแปรสำหรับ autoplay
let sliderIntervalId = null;
const AUTOPLAY_DELAY = 4000;

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
    // รีเซ็ต autoplay ทุกครั้งที่มีการเปลี่ยนสไลด์ด้วยผู้ใช้
    resetAutoplay();

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

    // รีเซ็ต autoplay เมื่อเลือก dot โดยตรง
    resetAutoplay();

    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Utility: change image in project carousel
function changeProjectImage(container, step) {
    const imgEl = container.querySelector('img.project-image');
    const counterEl = container.querySelector('.image-counter');
    const imagesRaw = (container.getAttribute('data-images') || '')
        .split(',').map(s => s.trim()).filter(Boolean);
    if (!imgEl || imagesRaw.length === 0) return;
    let current = parseInt(container.dataset.currentIndex || '0', 10) || 0;
    const total = imagesRaw.length;
    if (step !== 0) {
        current = (current + step + total) % total;
        container.dataset.currentIndex = String(current);
    }
    const nextSrc = imagesRaw[current];
    imgEl.src = nextSrc;
    if (counterEl) counterEl.textContent = `${current + 1}/${total}`;

    // Auto-detect tall portrait (e.g., 9:16) and apply class for contain fit
    const applyAspectClass = () => {
        // Respect manual portrait forcing from markup; don't remove if already set
        if (container.classList.contains('portrait-9-16')) {
            return;
        }
        const w = imgEl.naturalWidth;
        const h = imgEl.naturalHeight;
        if (!w || !h) return;
        const isTallPortrait = (h / w) >= 1.6; // approx 9:16 or taller
        container.classList.toggle('portrait-9-16', isTallPortrait);
    };
    imgEl.onload = () => applyAspectClass();
    if (imgEl.complete) {
        // If image was cached and already loaded
        applyAspectClass();
    }
}

// Initialize per-project image carousels
function initProjectCarousels() {
    const containers = document.querySelectorAll('.project-image-container[data-images]');
    containers.forEach(container => {
        const prevBtn = container.querySelector('.image-nav.prev');
        const nextBtn = container.querySelector('.image-nav.next');
        const imagesAttr = container.getAttribute('data-images') || '';
        const imagesRaw = imagesAttr.split(',').map(s => s.trim()).filter(Boolean);
        if (!imagesRaw.length) return;

        // Init index
        container.dataset.currentIndex = '0';
        changeProjectImage(container, 0);

        // Buttons
        prevBtn && prevBtn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            changeProjectImage(container, -1);
        });
        nextBtn && nextBtn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            changeProjectImage(container, 1);
        });

        // Touch swipe
        let startX = null;
        container.addEventListener('touchstart', e => {
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
            }
        }, { passive: true });
        container.addEventListener('touchend', e => {
            if (startX === null) return;
            const endX = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : startX;
            const dx = endX - startX;
            if (Math.abs(dx) > 30) {
                changeProjectImage(container, dx < 0 ? 1 : -1);
            }
            startX = null;
        }, { passive: true });
    });
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
    
    // Scroll spy ด้วย IntersectionObserver จากลิงก์เมนู
    (function initScrollSpy() {
        const items = Array.from(document.querySelectorAll('nav a[href^="#"]'));
        const entriesMap = new Map();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entriesMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
            });
            // เลือก section ที่เห็นมากที่สุด
            let activeId = null;
            let maxRatio = 0;
            entriesMap.forEach((ratio, id) => {
                if (ratio > maxRatio) { maxRatio = ratio; activeId = id; }
            });
            items.forEach(a => {
                const hrefId = a.getAttribute('href').slice(1);
                const isActive = hrefId === activeId;
                a.classList.toggle('active', isActive);
                a.setAttribute('aria-current', isActive ? 'page' : 'false');
            });
        }, { root: null, threshold: [0.25, 0.5, 0.75], rootMargin: '0px 0px -30% 0px' });
        items.forEach(a => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) observer.observe(target);
        });
    })();
    
    console.log('Portfolio website loaded successfully!');
    
    // Initialize gallery slider when DOM is loaded
    initializeGallerySlider();
    
    // ตั้งค่า autoplay/keyboard/touch สำหรับ Gallery
    (function enhanceGallery() {
        if (!slides || slides.length === 0) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) startAutoplay();
        
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            // Pause on hover/focus
            sliderContainer.addEventListener('mouseenter', stopAutoplay);
            sliderContainer.addEventListener('mouseleave', () => {
                if (!reduceMotion) startAutoplay();
            });
            sliderContainer.addEventListener('focusin', stopAutoplay);
            sliderContainer.addEventListener('focusout', () => {
                if (!reduceMotion) startAutoplay();
            });
            // ทำให้ container โฟกัสได้และเพิ่ม aria
            sliderContainer.setAttribute('tabindex', '0');
            sliderContainer.setAttribute('role', 'region');
            sliderContainer.setAttribute('aria-label', 'Gallery slider');
            
            // Touch swipe
            let startX = null;
            sliderContainer.addEventListener('touchstart', e => {
                if (e.touches && e.touches.length > 0) {
                    startX = e.touches[0].clientX;
                }
            }, { passive: true });
            sliderContainer.addEventListener('touchend', e => {
                if (startX === null) return;
                const endX = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : startX;
                const dx = endX - startX;
                if (Math.abs(dx) > 30) {
                    if (dx < 0) {
                        changeSlide(1);
                    } else {
                        changeSlide(-1);
                    }
                }
                startX = null;
            }, { passive: true });
        }
        
        // Keyboard arrows
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); changeSlide(-1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); changeSlide(1); }
        });
    })();
    
    // Initialize project carousels (per project card)
    initProjectCarousels();
    
    // Initialize skill bars animation
    initSkillBars();
    
    // เพิ่มเอฟเฟกต์ parallax สำหรับรูปพื้นหลัง (ปิดถ้าผู้ใช้เลือก reduce motion)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const backgroundImage = document.querySelector('.background-image');
            if (backgroundImage) {
                const speed = scrolled * 0.5;
                backgroundImage.style.transform = `translateY(${speed}px)`;
            }
        });
    }
    
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
        if (!heroTitle) return;
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

// เพิ่มเอฟเฟกต์ smooth scroll สำหรับทุก anchor links และ delegated handler สำหรับปุ่มรูป
// Delegated handler สำหรับปุ่มลูกศรเปลี่ยนรูป
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.image-nav');
    if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const container = btn.closest('.project-image-container[data-images]');
        if (!container) return;
        changeProjectImage(container, btn.classList.contains('prev') ? -1 : 1);
        return;
    }

    // Smooth scroll สำหรับ anchor links
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

// เพิ่มเอฟเฟก์ typing สำหรับหัวข้อ (ถ้าต้องการ)
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

// Add mobile nav toggle behavior
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle('active');
      });
      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && e.target !== toggle) {
          menu.classList.remove('active');
        }
      });
    }
  });
})();

// Autoplay controls
function startAutoplay() {
  if (sliderIntervalId) return;
  sliderIntervalId = setInterval(() => {
    changeSlide(1);
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (sliderIntervalId) {
    clearInterval(sliderIntervalId);
    sliderIntervalId = null;
  }
}

function resetAutoplay() {
  // หยุดและเริ่มใหม่ตามค่าตั้งค่าการลดการเคลื่อนไหวของผู้ใช้
  stopAutoplay();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    startAutoplay();
  }
}

// Initialize skill bars animation on scroll
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar, .skill-list li[data-percent]');
  if (!bars.length) return;

  const onVisible = (entryEl) => {
    const fillEl = entryEl.querySelector('.bar-fill');
    const percent = parseInt(entryEl.getAttribute('data-percent') || '0', 10);
    if (!fillEl) return;
    fillEl.style.width = percent + '%';

    const label = entryEl.querySelector('.skill-percent');
    if (label) { label.textContent = percent + '%'; }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onVisible(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach((bar) => observer.observe(bar));
}