export function initEventsDropdown() {
  const eventsBtn = document.querySelector('.main-nav__link--events');

  if (!eventsBtn) return;

  let isEventsOpen = false;

  // Обработка клика по кнопке событий
  eventsBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Закрываем основной каталог если он открыт
    const catalogDropdown = document.querySelector('.catalog-dropdown');
    if (catalogDropdown && catalogDropdown.classList.contains('is-open')) {
      catalogDropdown.classList.remove('is-open');
      const catalogBtn = document.querySelector('.catalog-btn');
      if (catalogBtn) catalogBtn.classList.remove('is-active');
    }

    // Переключаем состояние dropdown событий
    if (isEventsOpen) {
      closeEventsDropdown();
    } else {
      openEventsDropdown();
    }
  });

  function openEventsDropdown() {
    isEventsOpen = true;
    eventsBtn.classList.add('is-open');

    // Добавляем обработчик клика вне dropdown
    setTimeout(() => {
      document.addEventListener('click', handleEventsOutsideClick);
    }, 0);
  }

  function closeEventsDropdown() {
    isEventsOpen = false;
    eventsBtn.classList.remove('is-open');
    document.removeEventListener('click', handleEventsOutsideClick);
  }

  // Обработка клика вне dropdown
  function handleEventsOutsideClick(event) {
    const dropdown = eventsBtn.querySelector('.main-nav__dropdown');

    if (!dropdown.contains(event.target) && !eventsBtn.contains(event.target)) {
      closeEventsDropdown();
    }
  }

  // Обработка кликов по пунктам меню
  const dropdownLinks = eventsBtn.querySelectorAll('.main-nav__dropdown-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const linkText = event.target.textContent;
      console.log('Выбран пункт меню событий:', linkText);

      // Здесь можно добавить логику обработки выбора пункта меню

      // Закрываем dropdown после выбора
      closeEventsDropdown();
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isEventsOpen) {
      closeEventsDropdown();
    }
  });
}
