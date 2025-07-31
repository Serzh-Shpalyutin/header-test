import { throttle } from './throttle.js';

export const initHeaderScroll = () => {
  const header = document.querySelector('.header');

  if (!header) {
    console.warn('Header element not found');
    return;
  }

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 0) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  // Используем throttle для оптимизации производительности
  const throttledScroll = throttle(handleScroll, 16); // ~60fps

  // Добавляем обработчик события скролла
  window.addEventListener('scroll', throttledScroll);

  // Проверяем начальное состояние
  handleScroll();
};
