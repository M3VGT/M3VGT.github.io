(() => {
  'use strict';

  const icons = () => window.lucide?.createIcons();
  const dialog = document.getElementById('figure-dialog');
  const dialogImage = document.getElementById('dialog-image');
  const dialogCaption = document.getElementById('dialog-caption');

  document.querySelectorAll('[data-image]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      dialogImage.src = trigger.dataset.image;
      dialogImage.alt = trigger.dataset.caption;
      dialogCaption.textContent = trigger.dataset.caption;
      dialog.showModal();
    });
  });

  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
          link.classList.toggle('active', link.hash === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  icons();
})();
