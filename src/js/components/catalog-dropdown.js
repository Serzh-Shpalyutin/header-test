import { catalogData } from '../data/catalog-data.js';
import { giftsCatalogData } from '../data/gifts-catalog-data.js';

export function initCatalogDropdown() {
  const catalogBtn = document.querySelector('.catalog-btn');
  const catalogDropdown = document.querySelector('.catalog-dropdown');
  const header = document.querySelector('.header');

  if (!catalogBtn || !catalogDropdown) return;

  let isOpen = false;
  let activeCategory = null;
  let activeSubcategory = null;
  let currentDataSet = 'catalog'; // 'catalog' или 'gifts'

  // Получение текущего набора данных
  function getCurrentData() {
    return currentDataSet === 'gifts' ? giftsCatalogData : catalogData;
  }

  // Инициализация - создание структуры dropdown
  function initDropdownStructure(dataSet = 'catalog') {
    currentDataSet = dataSet;
    const data = getCurrentData();

    catalogDropdown.innerHTML = `
      <div class="catalog-dropdown__lside">
        <nav class="drop-cat-nav">
          <ul class="drop-cat-nav__list list-reset">
            ${generateCategoryList(data)}
          </ul>
        </nav>
      </div>
      <div class="catalog-dropdown__rside">
        <div class="catalog-dropdown__rside-columns catalog-dropdown-columns">
          ${generateSubcategoriesContent(data)}
        </div>
      </div>
    `;

    // Устанавливаем первую категорию как активную
    if (data.length > 0) {
      setActiveCategory(data[0].id);
    }

    // Добавляем обработчики для кнопок категорий
    addCategoryHandlers();
  }

  // Генерация списка категорий
  function generateCategoryList(data) {
    return data.map(category => `
      <li class="drop-cat-nav__item">
        <button class="drop-cat-nav__btn btn-reset" data-category="${category.id}">
          <span class="drop-cat-nav__btn-lside">
            ${category.icon}
            ${category.title}
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#4888FF" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');
  }

  // Генерация контента подкатегорий
  function generateSubcategoriesContent(data) {
    // Изначально показываем только первый уровень первой категории
    if (data.length === 0) return '';

    const firstCategory = data[0];
    return generateLevel1ForCategory(firstCategory);
  }

  // Генерация первого уровня для конкретной категории
  function generateLevel1ForCategory(category) {
    if (!category.subcategories || !category.subcategories[0]) return '';

    const firstSubcategory = category.subcategories[0];

    return `
      <div class="catalog-dropdown-columns__col catalog-dropdown-columns__col--lvl1">
        <h3 class="catalog-dropdown-columns__col-title">${firstSubcategory.title}</h3>
        <ul class="catalog-dropdown-columns__col-list list-reset">
          ${firstSubcategory.items.map(item => `
            <li class="catalog-dropdown-columns__col-item">
              <button class="btn-reset catalog-dropdown-columns__col-btn ${item.isActive ? 'is-open' : ''}"
                      data-item="${item.id}"
                      data-has-subcategories="${item.subcategories ? 'true' : 'false'}"
                      ${!item.subcategories ? `onclick="window.location.href='${item.link}'"` : ''}>
                ${item.title}
                <span>${item.count}</span>

                <svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Генерация второго уровня для элемента
  function generateLevel2ForItem(categoryId, itemId) {
    const data = getCurrentData();
    const category = data.find(cat => cat.id === categoryId);
    if (!category || !category.subcategories) return '';

    const subcategory = category.subcategories[0]; // Пока берем первую подкатегорию
    const item = subcategory.items.find(it => it.id === itemId);

    if (!item || !item.subcategories) return '';

    return `
      <div class="catalog-dropdown-columns__col catalog-dropdown-columns__col--lvl2">
        <h3 class="catalog-dropdown-columns__col-title">${item.title}</h3>
        <ul class="catalog-dropdown-columns__col-list list-reset">
          ${item.subcategories.map(subItem => `
            <li class="catalog-dropdown-columns__col-item">
              <button class="catalog-dropdown-columns__col-btn catalog-dropdown-columns__col-btn--lvl2 btn-reset"
                      onclick="window.location.href='${subItem.link}'">
                ${subItem.title}
                <span>${subItem.count}</span>
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Установка активной категории
  function setActiveCategory(categoryId) {
    const data = getCurrentData();

    // Удаляем активный класс со всех кнопок категорий
    catalogDropdown.querySelectorAll('.drop-cat-nav__btn').forEach(btn => {
      btn.classList.remove('is-open');
    });

    // Добавляем активный класс к выбранной категории
    const activeBtn = catalogDropdown.querySelector(`[data-category="${categoryId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('is-open');
    }

    // Обновляем контент правой части - показываем только уровень 1
    const category = data.find(cat => cat.id === categoryId);
    if (category) {
      const rightSide = catalogDropdown.querySelector('.catalog-dropdown-columns');
      if (rightSide) {
        rightSide.innerHTML = generateLevel1ForCategory(category);
        // Добавляем обработчики для элементов первого уровня
        addLevel1Handlers();
      }
    }

    activeCategory = categoryId;
    activeSubcategory = null;
  }

  // Установка активного элемента первого уровня (показ второго уровня)
  function setActiveLevel1Item(itemId) {
    // Удаляем активный класс со всех кнопок первого уровня
    catalogDropdown.querySelectorAll('.catalog-dropdown-columns__col--lvl1 .catalog-dropdown-columns__col-btn').forEach(btn => {
      btn.classList.remove('is-open');
    });

    // Добавляем активный класс к выбранному элементу
    const activeBtn = catalogDropdown.querySelector(`[data-item="${itemId}"]`);
    if (activeBtn && activeBtn.dataset.hasSubcategories === 'true') {
      activeBtn.classList.add('is-open');

      // Удаляем существующий второй уровень
      const existingLvl2 = catalogDropdown.querySelector('.catalog-dropdown-columns__col--lvl2');
      if (existingLvl2) {
        existingLvl2.remove();
      }

      // Генерируем и добавляем второй уровень
      const level2Content = generateLevel2ForItem(activeCategory, itemId);
      if (level2Content) {
        const rightSide = catalogDropdown.querySelector('.catalog-dropdown-columns');
        rightSide.insertAdjacentHTML('beforeend', level2Content);
      }

      activeSubcategory = itemId;
    } else if (activeBtn && activeBtn.dataset.hasSubcategories === 'false') {
      // Если подкатегорий нет, переходим по ссылке
      const data = getCurrentData();
      const category = data.find(cat => cat.id === activeCategory);
      if (category && category.subcategories && category.subcategories[0]) {
        const item = category.subcategories[0].items.find(it => it.id === itemId);
        if (item && item.link) {
          window.location.href = item.link;
        }
      }
    }
  }

  // Добавление обработчиков для кнопок категорий
  function addCategoryHandlers() {
    catalogDropdown.querySelectorAll('.drop-cat-nav__btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryId = btn.dataset.category;
        if (categoryId && categoryId !== activeCategory) {
          setActiveCategory(categoryId);
        }
      });
    });
  }

  // Добавление обработчиков для элементов первого уровня
  function addLevel1Handlers() {
    catalogDropdown.querySelectorAll('.catalog-dropdown-columns__col--lvl1 .catalog-dropdown-columns__col-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemId = btn.dataset.item;
        const hasSubcategories = btn.dataset.hasSubcategories === 'true';

        if (hasSubcategories) {
          // Если есть подкатегории, показываем второй уровень
          if (itemId !== activeSubcategory) {
            setActiveLevel1Item(itemId);
          }
        }
        // Если подкатегорий нет, обработчик onclick уже установлен в HTML
      });
    });
  }

  // Функция для позиционирования dropdown
  function positionDropdown() {
    if (!isOpen) return;

    const btnRect = catalogBtn.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Сброс позиции для получения реальных размеров
    catalogDropdown.style.top = 'auto';
    catalogDropdown.style.left = 'auto';
    catalogDropdown.style.right = 'auto';
    catalogDropdown.style.bottom = 'auto';
    catalogDropdown.style.maxHeight = 'none';

    const dropdownRect = catalogDropdown.getBoundingClientRect();

    // Позиционируем dropdown от нижней границы header'а
    let top = headerRect.bottom;
    let maxHeight = viewportHeight - top - 20; // 20px отступ снизу

    // Если dropdown не помещается снизу, показываем сверху от header'а
    if (top + dropdownRect.height > viewportHeight - 20) {
      top = headerRect.top - dropdownRect.height;
      maxHeight = headerRect.top - 20;

      // Если сверху тоже не помещается, показываем снизу с ограничением высоты
      if (top < 20) {
        top = headerRect.bottom;
        maxHeight = viewportHeight - top - 20;
      }
    }

    // Вычисляем позицию по горизонтали - выравниваем по левому краю кнопки
    let left = btnRect.left;

    // Проверяем, не выходит ли dropdown за правый край экрана
    if (left + dropdownRect.width > viewportWidth - 20) {
      left = viewportWidth - dropdownRect.width - 20;
    }

    // Проверяем, не выходит ли dropdown за левый край экрана
    if (left < 20) {
      left = 20;
    }

    // Применяем вычисленные позиции
    catalogDropdown.style.position = 'fixed';
    catalogDropdown.style.top = `${top}px`;
    catalogDropdown.style.left = `${left}px`;
    catalogDropdown.style.maxHeight = `${maxHeight}px`;
    catalogDropdown.style.overflowY = 'auto';
    catalogDropdown.style.zIndex = '1000';
  }

  // Функция открытия dropdown
  function openDropdown() {
    isOpen = true;
    catalogDropdown.classList.add('is-open');
    catalogBtn.classList.add('is-active');
    positionDropdown();

    // Добавляем обработчик клика вне dropdown
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
  }

  // Функция закрытия dropdown
  function closeDropdown() {
    isOpen = false;
    catalogDropdown.classList.remove('is-open');
    catalogBtn.classList.remove('is-active');
    document.removeEventListener('click', handleOutsideClick);
  }

  // Обработка клика вне dropdown
  function handleOutsideClick(event) {
    if (!catalogDropdown.contains(event.target) && !catalogBtn.contains(event.target)) {
      closeDropdown();
    }
  }

  // Функция для открытия каталога с определенной категорией
  function openCatalogWithCategory(categoryId, dataSet = 'catalog') {
    // Если нужно сменить набор данных, переинициализируем структуру
    if (currentDataSet !== dataSet) {
      initDropdownStructure(dataSet);
    }

    if (!isOpen) {
      openDropdown();
    }

    // Небольшая задержка для корректной инициализации
    setTimeout(() => {
      const data = getCurrentData();
      const category = data.find(cat => cat.id === categoryId);
      if (category) {
        setActiveCategory(categoryId);
      } else if (data.length > 0) {
        // Если категория не найдена, выбираем первую доступную
        setActiveCategory(data[0].id);
      }
    }, 10);
  }

  // Обработка клика по кнопке каталога
  catalogBtn.addEventListener('click', (event) => {
    event.stopPropagation();

    if (isOpen) {
      closeDropdown();
    } else {
      // Всегда открываем основной каталог при клике на кнопку каталога
      openCatalogWithCategory(catalogData[0]?.id, 'catalog');
    }
  });

  // Обработчики для кнопок навигации с data-catalog-trigger
  document.querySelectorAll('[data-catalog-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const categoryId = trigger.dataset.catalogTrigger;

      if (categoryId === 'gifts') {
        // Для подарочных наборов используем специальные данные
        openCatalogWithCategory(giftsCatalogData[0]?.id, 'gifts');
      } else {
        // Для остальных категорий используем основные данные
        openCatalogWithCategory(categoryId, 'catalog');
      }
    });
  });

  // Переповозиционирование при изменении размера окна
  window.addEventListener('resize', () => {
    if (isOpen) {
      positionDropdown();
    }
  });

  // Переповозиционирование при скролле
  window.addEventListener('scroll', () => {
    if (isOpen) {
      positionDropdown();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      closeDropdown();
    }
  });

  // Инициализация структуры dropdown с основными данными
  initDropdownStructure('catalog');
}

// Функция для добавления новой категории (для админки)
export function addCatalogCategory(categoryData, isGifts = false) {
  const targetData = isGifts ? giftsCatalogData : catalogData;
  targetData.push(categoryData);

  // Перезапуск инициализации если dropdown уже инициализирован
  if (document.querySelector('.catalog-dropdown .drop-cat-nav__list')) {
    initCatalogDropdown();
  }
}

// Функция для обновления категории
export function updateCatalogCategory(categoryId, newData, isGifts = false) {
  const targetData = isGifts ? giftsCatalogData : catalogData;
  const categoryIndex = targetData.findIndex(cat => cat.id === categoryId);

  if (categoryIndex !== -1) {
    targetData[categoryIndex] = { ...targetData[categoryIndex], ...newData };

    // Перезапуск инициализации если dropdown уже инициализирован
    if (document.querySelector('.catalog-dropdown .drop-cat-nav__list')) {
      initCatalogDropdown();
    }
  }
}
