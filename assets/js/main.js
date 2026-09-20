
/* =========================================================
   PREPSA — Interactions
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Mobile Menu ---------- */
  const menuBtn   = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
    );
  }

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Back to top
    const backTop = document.getElementById('backTop');
    if (backTop) {
      if (window.scrollY > 500) {
        backTop.style.opacity = '1';
        backTop.style.pointerEvents = 'auto';
      } else {
        backTop.style.opacity = '0';
        backTop.style.pointerEvents = 'none';
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to Top ---------- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ---------- Reveal on Scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger children slightly
          setTimeout(() => entry.target.classList.add('revealed'), i * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback for very old browsers
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.textContent.replace(/[0-9]/g, ''); // keep '+' etc.
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target + suffix;
          } else {
            el.textContent = current + suffix;
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ---------- Toast Helper (global) ---------- */
  window.showToast = function (msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  };

  /* ---------- Footer Year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Active Nav Highlight (homepage anchor links) ---------- */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => navIO.observe(s));
  }

})();
