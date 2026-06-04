/* --- BERRY N' CRUMBS CAFE - SCRIPT --- */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initStickyCta();
  initMenuFilter();
  initTestimonialSlider();
  initFaqAccordion();
  initContactForm();
  initNewsletterForm();
  initScrollReveals();
});

/* ==========================================================================
   1. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('a');

  if (!hamburger || !navLinks) return;

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle body scroll lock
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when links are clicked (useful for single-page anchors)
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   2. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. STICKY MOBILE CTA BAR
   ========================================================================== */
function initStickyCta() {
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (!stickyBar) return;

  window.addEventListener('scroll', () => {
    // Show sticky CTA bar only after scrolling past the hero fold (e.g. 500px)
    if (window.scrollY > 400 && window.innerWidth <= 768) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  });
}

/* ==========================================================================
   4. MENU TABS FILTERING
   ========================================================================== */
function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-tab');
  const items = document.querySelectorAll('.menu-item-card');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Update active tab styling
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');

      // 2. Filter menu cards with smooth fade
      items.forEach(item => {
        const itemCategory = item.getAttribute('data-item-category');

        if (targetCategory === 'all' || itemCategory === targetCategory) {
          item.classList.remove('hide');
          // Trigger browser reflow to allow scale animation to play again
          void item.offsetWidth;
          item.classList.add('show');
        } else {
          item.classList.remove('show');
          item.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   5. CUSTOMER TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Wrap around logic
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Toggle active state on slides
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active state on indicators/dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startSliderTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Autoplay every 5s
  }

  // Handle dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(targetIndex);
      startSliderTimer(); // Reset autoplay timer on interaction
    });
  });

  // Start initial autoplay
  startSliderTimer();
}

/* ==========================================================================
   6. FAQ ACCORDION (SMOOTH MAX-HEIGHT EXPANSION)
   ========================================================================== */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = parent.querySelector('.faq-content');

      if (!content) return;

      const isActive = parent.classList.contains('active');

      // Close all other active items for clean Accordion look
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-content').style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isActive) {
        parent.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        parent.classList.add('active');
        // Set dynamic height from content scroll size
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION & SIMULATED SUBMIT
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form || !statusEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // 1. Phone number check (10 digits validation)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      showStatus('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    // 2. Validate empty inputs
    if (!name || !message) {
      showStatus('Please fill in all the details.', 'error');
      return;
    }

    // 3. Simulate API submission (Interactive feedback)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending details...';
    showStatus('Preparing your escape... Please wait.', '');

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      
      // Success feedback
      showStatus(`Thank you, ${name}! Your request has been received. We will contact you at ${phone} to confirm.`, 'success');
      form.reset();
    }, 1800);
  });

  function showStatus(msg, type) {
    statusEl.innerText = msg;
    statusEl.className = 'form-status'; // Reset classes
    
    if (type === 'success') {
      statusEl.classList.add('success');
    } else if (type === 'error') {
      statusEl.classList.add('error');
    } else {
      statusEl.style.display = 'block';
    }
  }
}

/* ==========================================================================
   8. NEWSLETTER SUBSCRIPTION FORM
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const statusEl = document.getElementById('newsletter-status');
  if (!form || !statusEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input.value.trim();

    if (!email) return;

    // Show simulated success feedback
    statusEl.innerText = `Subscribed successfully! Thank you for joining our sweet escape.`;
    statusEl.className = 'newsletter-status success';
    
    // Clear form and hide status after 4 seconds
    form.reset();
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 4000);
  });
}

/* ==========================================================================
   9. SCROLL REVEALS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  // Standard premium transition observer configuration
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers reveal when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed to avoid re-triggering animations on scroll back
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => {
    observer.observe(el);
  });
}
