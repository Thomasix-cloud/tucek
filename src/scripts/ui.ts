const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Hlavička: pozadí po odscrollování ---
const header = document.getElementById('site-header');
const onScroll = () => header?.setAttribute('data-scrolled', String(window.scrollY > 24));
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// --- Mobilní menu ---
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');
if (toggle && menu) {
  const setOpen = (open: boolean) => {
    menu.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only')!.textContent = open ? 'Zavřít menu' : 'Otevřít menu';
    toggle.querySelector('.menu-open')?.classList.toggle('hidden', open);
    toggle.querySelector('.menu-close')?.classList.toggle('hidden', !open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) header?.setAttribute('data-scrolled', 'true');
    else onScroll();
  };
  toggle.addEventListener('click', () => setOpen(menu.dataset.open !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

// --- Odhalování sekcí při scrollu ---
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
}

// --- Jemný parallax hlavní fotografie ---
const parallax = document.querySelector<HTMLElement>('[data-parallax]');
if (parallax && !reduceMotion) {
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    parallax.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}
