/**
 * AURA Store — GSAP Animation Engine
 * Handles smooth entrance reveals, ScrollTrigger scroll animations, 
 * micro-interactions, drawer & modal motion, respecting prefers-reduced-motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize GSAP & ScrollTrigger if loaded and motion is allowed
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initHeroAnimations();
    initScrollReveals();
    initCardMicroInteractions();
  }
});

/**
 * Hero Banner GSAP Entrance Animation
 */
function initHeroAnimations() {
  const heroElements = document.querySelectorAll('.aura-hero [data-aura-animate]');
  if (!heroElements.length) return;

  gsap.from(heroElements, {
    y: 40,
    opacity: 0,
    duration: 1.1,
    stagger: 0.18,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

/**
 * ScrollTrigger Section & Card Grid Reveals
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('[data-aura-reveal]');
  if (!revealElements.length || typeof ScrollTrigger === 'undefined') return;

  revealElements.forEach((el) => {
    const animationType = el.dataset.auraReveal || 'fade-up';
    let fromState = { opacity: 0, y: 30 };

    if (animationType === 'fade-in') fromState = { opacity: 0, y: 0 };
    if (animationType === 'scale-up') fromState = { opacity: 0, scale: 0.94 };
    if (animationType === 'slide-right') fromState = { opacity: 0, x: -40 };

    gsap.from(el, {
      ...fromState,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      clearProps: 'all'
    });
  });
}

/**
 * Card & Button Micro-Interactions
 */
function initCardMicroInteractions() {
  const cards = document.querySelectorAll('.aura-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, { y: -5, duration: 0.25, ease: 'power1.out' });
      }
    });
    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, { y: 0, duration: 0.25, ease: 'power1.out' });
      }
    });
  });
}

/**
 * Helper to animate Quick View Modal opening/closing with GSAP
 */
window.auraAnimateModal = function(modalEl, isOpen) {
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    modalEl.style.display = isOpen ? 'flex' : 'none';
    return;
  }

  const container = modalEl.querySelector('.aura-modal__container') || modalEl;
  if (isOpen) {
    modalEl.style.display = 'flex';
    gsap.fromTo(modalEl, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(container, { y: 30, scale: 0.95 }, { y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' });
  } else {
    gsap.to(container, { y: 20, scale: 0.96, opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(modalEl, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        modalEl.style.display = 'none';
        gsap.set([modalEl, container], { clearProps: 'all' });
      }
    });
  }
};
