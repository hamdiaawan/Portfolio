document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. MOBILE NAV TOGGLE
  ────────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu    = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is tapped on mobile
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside the nav area
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ──────────────────────────────────────────
     2. ACTIVE NAV PILL via IntersectionObserver
     Maps section IDs → which nav link goes active
  ────────────────────────────────────────── */
  const sectionToNav = {
    home:     'home',
    about:    'about',
    skills:   'skills',
    projects: 'projects',
    contact:  'contact',
  };

  const navLinks        = document.querySelectorAll('.nav-link');
  const observedSections = document.querySelectorAll('main section[id]');

  const setActiveNav = (sectionId) => {
    const navKey = sectionToNav[sectionId];
    if (!navKey) return;

    navLinks.forEach((link) => {
      const target = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', target === navKey);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));

  /* ──────────────────────────────────────────
     3. HERO TYPING ANIMATION
     Respects prefers-reduced-motion
  ────────────────────────────────────────── */
  const heroTitle = document.getElementById('typing-hero-title');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroTitle && !prefersReduced) {
    const fullName = heroTitle.textContent.trim();
    heroTitle.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');

    let index = 0;

    const typeWriter = () => {
      if (index < fullName.length) {
        heroTitle.textContent += fullName.charAt(index);
        index += 1;
        setTimeout(typeWriter, 72);
      } else {
        heroTitle.appendChild(cursor);
        // Remove blinking cursor after a pause so it doesn't stay forever
        setTimeout(() => cursor.remove(), 2600);
      }
    };

    setTimeout(typeWriter, 380);
  }

  /* ──────────────────────────────────────────
     4. PHOTO FALLBACK
     If profile.jpg loads → add class that hides
     the "HS" initials fallback via CSS opacity.
     If it errors → nothing changes (fallback stays visible).
  ────────────────────────────────────────── */
  const photoPanel = document.getElementById('hero-photo-panel');
  const photoImg   = document.getElementById('hero-photo-img');

  if (photoPanel && photoImg) {
    const markLoaded = () => {
      // Only mark as loaded if the image has actual dimensions (not a broken placeholder)
      if (photoImg.naturalWidth > 0) {
        photoPanel.classList.add('photo-loaded');
      }
    };

    if (photoImg.complete) {
      markLoaded();
    } else {
      photoImg.addEventListener('load', markLoaded);
      // On error, do nothing — fallback remains visible
    }
  }

});
