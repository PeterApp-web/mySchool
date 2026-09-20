/* =========================================================
   PREPSA — Prescious Prime Stars Academy
   Main JavaScript
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     0. Helper utilities
     ========================================================= */
  const $  = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* =========================================================
     1. Footer year
     ========================================================= */
  function initYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* =========================================================
     2. Mobile menu toggle
     ========================================================= */
  function initMobileMenu() {
    const menuBtn    = $('#menuBtn');
    const mobileMenu = $('#mobileMenu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on link click
    $$('a', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        !mobileMenu.classList.contains('hidden') &&
        !mobileMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================================================
     3. Navbar scroll behaviour
     ========================================================= */
  function initNavbarScroll() {
    const navbar = $('#navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 20) navbar.classList.add('shadow-md');
      else navbar.classList.remove('shadow-md');

      // Hide on scroll down, show on scroll up (only on mobile)
      if (window.innerWidth < 1024) {
        if (y > lastScroll && y > 200) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =========================================================
     4. Back to top button
     ========================================================= */
  function initBackToTop() {
    const backTop = $('#backTop');
    if (!backTop) return;

    const onScroll = () => {
      if (window.scrollY > 400) {
        backTop.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        backTop.classList.add('opacity-0', 'pointer-events-none');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     5. Smooth scroll for in-page anchors
     ========================================================= */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();
        const navHeight = $('#navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      });
    });
  }

  /* =========================================================
     6. Scroll reveal
     ========================================================= */
  function initScrollReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    els.forEach(el => observer.observe(el));
  }

  /* =========================================================
     7. Newsletter form
     ========================================================= */
  function initNewsletter() {
    const form = $('#newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email) return;

      // Simple client-side email check
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValid) {
        showToast('Please enter a valid email address.');
        return;
      }

      form.reset();
      showToast('Subscribed! Thank you.');
    });
  }

  /* =========================================================
     8. Toast helper
     ========================================================= */
  let toastTimer = null;
  function showToast(message, duration = 3000) {
    const toast = $('#toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }
  // Expose globally (in case inline scripts need it)
  window.showToast = showToast;

  /* =========================================================
     9. Active nav link based on current page
     ========================================================= */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === 'index.html' && href === '#home')) {
        link.classList.add('active', 'text-royal');
      }
    });
  }

  /* =========================================================
     10. Lazy-load fallback (for older browsers)
     ========================================================= */
  function initLazyFallback() {
    if ('loading' in HTMLImageElement.prototype) return; // native support
    $$('img[loading="lazy"]').forEach(img => {
      img.setAttribute('loading', 'eager');
    });
  }

  /* =========================================================
     11. External link safety
     ========================================================= */
  function initExternalLinks() {
    $$('a[target="_blank"]').forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /* =========================================================
     12. Boot
     ========================================================= */
  function boot() {
    initYear();
    initMobileMenu();
    initNavbarScroll();
    initBackToTop();
    initSmoothScroll();
    initScrollReveal();
    initNewsletter();
    initActiveNav();
    initLazyFallback();
    initExternalLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
