// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.documentElement.dataset.theme = 'light';
}

const updateThemeToggle = () => {
  const isLight = document.documentElement.dataset.theme === 'light';
  themeToggle.textContent = isLight ? 'Dark mode' : 'Light mode';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.setAttribute('aria-pressed', String(isLight));
};

updateThemeToggle();

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.dataset.theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'dark' : 'light';
  localStorage.setItem('portfolio-theme', isLight ? 'dark' : 'light');
  updateThemeToggle();
});

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Project screenshot gallery
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryImage = document.getElementById('galleryLightboxImage');
const galleryCounter = document.getElementById('galleryCounter');
const galleryTriggers = [...document.querySelectorAll('.gallery-trigger')];
const galleryGroups = galleryTriggers.reduce((groups, trigger) => {
  const group = trigger.dataset.gallery;
  groups[group] = groups[group] || [];
  groups[group].push(trigger.querySelector('img'));
  return groups;
}, {});
let activeGallery = [];
let activeGalleryIndex = 0;
let galleryTouchStartX = 0;

const renderGalleryImage = (index) => {
  activeGalleryIndex = (index + activeGallery.length) % activeGallery.length;
  const image = activeGallery[activeGalleryIndex];
  galleryImage.classList.add('is-changing');
  window.setTimeout(() => {
    galleryImage.src = image.src;
    galleryImage.alt = image.alt;
    galleryCounter.textContent = `${activeGalleryIndex + 1} / ${activeGallery.length}`;
    galleryImage.classList.remove('is-changing');
  }, 120);
};

const closeGallery = () => {
  galleryLightbox.classList.remove('is-open');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

galleryTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    activeGallery = galleryGroups[trigger.dataset.gallery];
    renderGalleryImage(Number(trigger.dataset.index));
    galleryLightbox.classList.add('is-open');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelector('[data-gallery-prev]').addEventListener('click', () => renderGalleryImage(activeGalleryIndex - 1));
document.querySelector('[data-gallery-next]').addEventListener('click', () => renderGalleryImage(activeGalleryIndex + 1));
document.querySelectorAll('[data-gallery-close]').forEach(element => element.addEventListener('click', closeGallery));

galleryLightbox.addEventListener('touchstart', event => {
  galleryTouchStartX = event.changedTouches[0].screenX;
}, { passive: true });

galleryLightbox.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - galleryTouchStartX;
  if (Math.abs(distance) < 45) return;
  renderGalleryImage(activeGalleryIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener('keydown', event => {
  if (!galleryLightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') renderGalleryImage(activeGalleryIndex - 1);
  if (event.key === 'ArrowRight') renderGalleryImage(activeGalleryIndex + 1);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form (no backend wired up — replace with your own endpoint or form service)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  // Opens the visitor's email client with the submitted message.
  window.location.href = `mailto:yosrelnoby3@gmail.com?subject=${subject}&body=${body}`;

  formNote.textContent = "Opening your email client — if nothing happens, email me directly.";
});
