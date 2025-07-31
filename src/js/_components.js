console.log('components');

// Получение высоты шапки сайта (не забудьте вызвать функцию)
import '../js/functions/header-height.js';

// Добавление класса к хедеру при скролле
import { initHeaderScroll } from './functions/header-scroll.js';

// Выпадающее меню каталога
import { initCatalogDropdown } from './components/catalog-dropdown.js';

// Выпадающее меню событий
import { initEventsDropdown } from './components/events-dropdown.js';

// Мобильное меню каталога
import { initCatalogMobile } from './components/catalog-mobile.js';

// Инициализация компонентов после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  initCatalogDropdown();
  initEventsDropdown();
  initHeaderScroll();
  initCatalogMobile();
});
