import { catalogData } from '../data/catalog-data.js';
import { giftsCatalogData } from '../data/gifts-catalog-data.js';

export function initCatalogMobile() {
  // Функция работает только для экранов 1439px и меньше
  const mediaQuery = window.matchMedia('(max-width: 1439px)');

  const catalogMobBtn = document.querySelector('.catalog-mob-btn');
  const catalogDropdownMob = document.querySelector('.catalog-dropdown-mob');

  if (!catalogMobBtn || !catalogDropdownMob) {
    console.warn('Элементы мобильного каталога не найдены');
    return;
  }

  let isOpen = false;
  let currentLevel = 'main';
  let currentCategory = null;
  let currentSubcategory = null;
  let navigationHistory = [];
  let isAnimating = false; // Флаг для предотвращения множественных анимаций

  // Данные для основного меню (оставляем как есть)
  const mainMenuData = [
    // ... все данные меню остаются без изменений ...
    {
      id: 'catalog',
      title: 'Каталог',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.18182" y="5" width="19.6364" height="1.45455" rx="0.727273" fill="#4888FF" />
        <rect x="2.18182" y="15.9091" width="19.6364" height="1.45455" rx="0.727273" fill="#4888FF" />
        <rect x="2.18182" y="10.4546" width="13.0909" height="1.45455" rx="0.727273" fill="#4888FF" />
      </svg>`,
      hasSubcategories: true,
      action: 'showCatalog'
    },
    {
      id: 'promotions',
      title: 'Акции',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.4773 18.6099C15.4773 17.3269 14.6693 16.5809 13.1203 15.2659C12.7703 14.9659 12.3923 14.6479 12.0023 14.2939C11.5573 14.7029 11.1343 15.0629 10.7463 15.3939C9.20025 16.6999 8.52325 17.3389 8.52325 18.6099C8.52325 19.5321 8.88958 20.4165 9.54164 21.0686C10.1937 21.7206 11.0781 22.0869 12.0003 22.0869C12.9224 22.0869 13.8068 21.7206 14.4589 21.0686C15.1109 20.4165 15.4773 19.5321 15.4773 18.6099Z" fill="#4888FF" fill-opacity="0.5" />
        <path d="M16.4085 4.035C15.2085 3.016 13.9685 1.963 12.7145 0.71L12.0005 0L11.3005 0.711C9.04654 2.973 7.98054 6.447 7.51854 8.531C7.16403 7.98206 6.90094 7.37922 6.73954 6.746L6.31254 5.109L5.07954 6.266C2.92054 8.294 1.47954 10.305 1.47954 13.525C1.45878 15.8485 2.2151 18.1123 3.62833 19.9568C5.04156 21.8012 7.03064 23.1205 9.27954 23.705C9.84462 23.8482 10.42 23.9468 11.0005 24C9.74182 23.7654 8.60464 23.0983 7.78567 22.1141C6.96669 21.1299 6.51742 19.8904 6.51554 18.61C6.51554 16.36 7.87254 15.21 9.44354 13.868C10.0045 13.391 10.6435 12.85 11.2885 12.201L12.0005 11.493L12.7085 12.201C13.2845 12.777 13.8605 13.265 14.4175 13.739C15.9935 15.076 17.4815 16.339 17.4815 18.61C17.4799 19.8853 17.0343 21.1203 16.2211 22.1028C15.408 23.0853 14.2781 23.754 13.0255 23.994C15.6261 23.7417 18.0394 22.5298 19.7949 20.5946C21.5503 18.6594 22.5221 16.1398 22.5205 13.527C22.5205 9.225 19.6875 6.82 16.4085 4.035Z" fill="#4888FF" fill-opacity="0.5" />
      </svg>`,
      hasSubcategories: false,
      link: '#'
    },
    {
      id: 'hot-offers',
      title: 'Горячее предложение',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.9305 7.9568C20.8198 7.69847 20.5656 7.53103 20.2845 7.53103H15.3972L18.6541 1.01757C18.763 0.799697 18.7514 0.540756 18.6233 0.333473C18.4952 0.126142 18.2688 0 18.0251 0L8.23429 0.000562507C7.94681 0.000562507 7.68829 0.175596 7.58151 0.442552L3.0627 11.7387C2.97603 11.9553 3.00247 12.2008 3.1333 12.394C3.26408 12.5872 3.48219 12.7029 3.71554 12.7029H9.45526L5.32215 23.0357C5.1969 23.3488 5.31151 23.7067 5.59548 23.8887C5.71206 23.9636 5.84383 24 5.97471 24C6.16221 24 6.34798 23.9251 6.48476 23.7811L20.7943 8.71838C20.9878 8.51462 21.0415 8.21508 20.9305 7.9568Z" fill="#4888FF" fill-opacity="0.5" />
        <path d="M20.9305 7.9568C20.8198 7.69847 20.5656 7.53103 20.2845 7.53103H15.3972L18.6541 1.01757C18.763 0.799697 18.7514 0.540756 18.6233 0.333473C18.4952 0.126142 18.2688 0 18.0251 0L12 0.000328129V17.9756L20.7942 8.71852C20.9878 8.51462 21.0415 8.21508 20.9305 7.9568Z" fill="#4888FF" fill-opacity="0.5" />
      </svg>`,
      hasSubcategories: true,
      action: 'showHotOffers'
    },
    {
      id: 'gifts',
      title: 'Подарочные наборы',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_4_2890)">
          <path d="M19.5624 5.37781C21.3279 7.6073 21.0972 10.7624 21.0972 12.8496H23.6744C23.6744 10.6727 23.7164 10.1208 23.5098 9.19849C23.0521 7.14203 21.6475 5.65411 19.5624 5.37781Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M3.23785 12.8497C3.23785 10.6385 3.208 9.99982 3.36785 8.93396C3.5548 7.68481 3.9851 6.36572 4.77282 5.37842C2.89654 5.60272 1.32531 6.95294 0.82525 9.198C0.618707 10.1212 0.660821 10.6718 0.660821 12.8497H3.23785Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M4.79479 9.14794C4.6527 10.0962 4.6809 10.6421 4.6809 12.8496H6.62401V12.1002C6.62401 10.4403 7.97478 9.08971 9.63463 9.08971H14.7004C16.3603 9.08971 17.711 10.4403 17.711 12.1002V12.8496H19.6542C19.6542 10.6523 19.6824 10.0973 19.5403 9.14794C19.2865 7.45074 18.399 5.34228 16.7393 5.34228C6.8767 5.34228 7.48479 5.32507 7.2224 5.38219C6.0335 5.63946 5.10369 7.08196 4.79479 9.14794Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M17.5393 15.7563H21.7255C22.1241 15.7563 22.4469 16.0797 22.4469 16.4779V21.6942C22.4469 22.0927 22.1239 22.4156 21.7255 22.4156H2.51056C2.11212 22.4156 1.78912 22.0927 1.78912 21.6942V16.4779C1.78912 16.0797 2.11194 15.7563 2.51056 15.7563H6.79578C6.60059 15.192 6.62402 14.8032 6.62402 14.2927H0.660828V23.1992C0.660828 23.5978 0.983826 23.9208 1.38226 23.9208H22.9528C23.3513 23.9208 23.6744 23.5978 23.6744 23.1992V14.2927H17.7111C17.7111 14.7986 17.7352 15.1898 17.5393 15.7563Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M3.23218 17.1992V20.9727H3.23785H21.0038V17.1992C19.1296 17.1992 20.2628 17.1992 16.5075 17.1992C16.1252 17.4984 15.672 17.7114 15.1776 17.8077C15.1776 19.2919 14.2614 20.0428 13.2177 20.0428H11.029C10.0459 20.0428 9.06848 19.3628 9.06848 17.7888C8.6087 17.6855 8.18738 17.4807 7.82849 17.1992C7.20099 17.1992 3.57587 17.1992 3.23218 17.1992Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M14.7004 10.5326H9.63464C8.77075 10.5326 8.06708 11.2359 8.06708 12.1002V14.7323C8.06708 15.6178 8.76489 16.4224 9.78992 16.4224C10.1856 16.4224 10.5115 16.7435 10.5115 17.144V18.0828C10.5115 18.368 10.7433 18.5999 11.029 18.5999H13.2177C13.5027 18.5999 13.7346 18.368 13.7346 18.0828C13.7346 17.5338 13.7346 17.6895 13.7346 17.144C13.7346 16.8439 13.9184 16.5864 14.1791 16.4778C14.4976 16.3455 15.2867 16.5881 15.9218 15.7562C16.3141 15.243 16.268 14.7841 16.268 14.2927C16.268 13.5608 16.268 12.8304 16.268 12.1002C16.268 11.2359 15.5643 10.5326 14.7004 10.5326ZM10.9512 13.3191C10.9512 13.719 10.6265 14.0405 10.2296 14.0405C9.8324 14.0405 9.50812 13.7186 9.50812 13.3191C9.50812 13.0051 9.50812 12.7974 9.50812 12.4744C9.50812 12.0762 9.8313 11.753 10.2296 11.753C10.6278 11.753 10.9512 12.0762 10.9512 12.4744V13.3191ZM12.889 15.561C12.889 15.9587 12.566 16.2825 12.1675 16.2825C11.7693 16.2825 11.4461 15.9591 11.4461 15.561C11.4461 14.7032 11.4045 14.5417 11.6082 14.2927C11.74 14.1301 11.942 14.0261 12.1675 14.0261C12.5654 14.0261 12.889 14.3494 12.889 14.7477V15.561ZM14.6927 13.571C14.5908 13.8453 14.3267 14.0405 14.0165 14.0405C13.6192 14.0405 13.2949 13.7186 13.2949 13.3191C13.2949 13.0051 13.2949 12.7974 13.2949 12.4744C13.2949 12.0762 13.6183 11.753 14.0165 11.753C14.4152 11.753 14.738 12.0762 14.738 12.4744C14.738 13.3929 14.7512 13.4152 14.6927 13.571Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M23.2786 2.36469H22.8411V1.92725C22.8411 1.52881 22.5181 1.20581 22.1197 1.20581C21.7213 1.20581 21.3981 1.52881 21.3981 1.92725V2.36469H20.9608C20.5624 2.36469 20.2394 2.68768 20.2394 3.08612C20.2394 3.48456 20.5624 3.80756 20.9608 3.80756H21.3981V4.245C21.3981 4.64343 21.7213 4.96643 22.1197 4.96643C22.5181 4.96643 22.8411 4.64343 22.8411 4.245V3.80756H23.2786C23.677 3.80756 24 3.48456 24 3.08612C24 2.68768 23.677 2.36469 23.2786 2.36469Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M16.6024 2.6488H17.0398V3.08606C17.0398 3.4845 17.3628 3.8075 17.7612 3.8075C18.1597 3.8075 18.4827 3.4845 18.4827 3.08606V2.6488H18.9201C19.3185 2.6488 19.6415 2.32562 19.6415 1.92719C19.6415 1.52875 19.3185 1.20575 18.9201 1.20575H18.4827V0.768311C18.4827 0.369873 18.1597 0.046875 17.7612 0.046875C17.3628 0.046875 17.0398 0.369873 17.0398 0.768311V1.20575H16.6024C16.2039 1.20575 15.8809 1.52875 15.8809 1.92719C15.8809 2.32562 16.2039 2.6488 16.6024 2.6488Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M5.0799 2.6488H5.51733V3.08606C5.51733 3.4845 5.84033 3.8075 6.23877 3.8075C6.63721 3.8075 6.96021 3.4845 6.96021 3.08606V2.6488H7.39764C7.79608 2.6488 8.11908 2.32562 8.11908 1.92719C8.11908 1.52875 7.79608 1.20575 7.39764 1.20575H6.96021V0.768311C6.96021 0.369873 6.63721 0.046875 6.23877 0.046875C5.84033 0.046875 5.51733 0.369873 5.51733 0.768311V1.20575H5.0799C4.68146 1.20575 4.35846 1.52875 4.35846 1.92719C4.35846 2.32562 4.68146 2.6488 5.0799 2.6488Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M1.15887 3.80756V4.245C1.15887 4.64343 1.48187 4.96643 1.88031 4.96643C2.27875 4.96643 2.60193 4.64343 2.60193 4.245V3.80756H3.03918C3.43762 3.80756 3.76062 3.48456 3.76062 3.08612C3.76062 2.68768 3.43762 2.36469 3.03918 2.36469H2.60193V1.92725C2.60193 1.52881 2.27875 1.20581 1.88031 1.20581C1.48187 1.20581 1.15887 1.52881 1.15887 1.92725V2.36469H0.721436C0.322998 2.36469 0 2.68768 0 3.08612C0 3.48456 0.322998 3.80756 0.721436 3.80756H1.15887Z" fill="#4888FF" fill-opacity="0.5" />
        </g>
        <defs>
          <clipPath id="clip0_4_2890">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>`,
      hasSubcategories: true,
      action: 'showGifts'
    },
    {
      id: 'events',
      title: 'События',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_4_2909)">
          <path d="M13.4366 20.5688C13.6304 20.5642 13.7957 20.4274 13.8365 20.2379C13.8503 20.1685 13.8695 20.1013 13.8871 20.0332C13.8975 19.9924 13.9056 19.9504 13.9177 19.9105C13.9261 19.881 13.9378 19.8532 13.9468 19.8248C14.1758 19.1074 14.6104 18.473 15.1965 18H12.6597C12.6031 18.2622 12.5638 18.5224 12.5334 18.7822C12.5273 18.834 12.5217 18.8859 12.5171 18.9377C12.4918 19.1949 12.4742 19.452 12.4742 19.7142C12.4742 19.8699 12.4845 20.0198 12.499 20.1672C12.5123 20.2916 12.5316 20.4153 12.5561 20.5389C12.5581 20.5496 12.5594 20.5607 12.5616 20.5714H13.4187C13.4264 20.5714 13.4312 20.5688 13.4366 20.5688Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M13.8083 2.44281C13.8212 2.34851 13.834 2.25861 13.8554 2.16852C13.864 2.11707 13.8812 2.0658 13.894 2.01434C13.9155 1.93286 13.9369 1.85138 13.9669 1.77008C13.9828 1.71899 14.0015 1.66901 14.0226 1.61993C14.0526 1.54285 14.0826 1.46576 14.1169 1.39288C14.1383 1.34564 14.1639 1.29437 14.1854 1.24713C14.224 1.17426 14.2668 1.10138 14.3055 1.0329C14.3355 0.985657 14.3611 0.94281 14.387 0.899963C14.434 0.827087 14.4897 0.754211 14.5411 0.68573C14.567 0.647095 14.5926 0.612854 14.6226 0.574219C14.6924 0.487427 14.7667 0.40448 14.8455 0.325745C14.8627 0.308533 14.8755 0.291504 14.8883 0.278503C14.9817 0.184387 15.0804 0.095581 15.184 0.0128174L15.1968 0H3.04688C1.38995 0 0.046875 1.34308 0.046875 3C0.046875 4.65692 1.38995 6 3.04688 6H15.1968C14.2896 5.26831 13.7618 4.16565 13.7611 3C13.7611 2.85809 13.7697 2.71655 13.7869 2.57574C13.7911 2.5329 13.7997 2.48566 13.8083 2.44281ZM3.04688 1.71423C2.46002 1.71405 1.94714 2.11047 1.79974 2.67865C1.7525 2.86725 1.58295 2.99982 1.38831 3C1.25555 3.00018 1.13031 2.93903 1.04901 2.83411C0.967712 2.72937 0.939331 2.59277 0.972656 2.46423C1.21674 1.51831 2.07001 0.8573 3.04688 0.857117C3.28363 0.857117 3.47552 1.04901 3.47552 1.28577C3.47552 1.52234 3.28363 1.71423 3.04688 1.71423ZM6.04688 1.71423H4.76111C4.52454 1.71423 4.33264 1.52234 4.33264 1.28577C4.33264 1.04901 4.52454 0.857117 4.76111 0.857117H6.04688C6.28363 0.857117 6.47552 1.04901 6.47552 1.28577C6.47552 1.52234 6.28363 1.71423 6.04688 1.71423Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M20.3732 22.0508C20.6843 21.3999 20.8566 20.3795 19.9111 19.2078C19.3678 18.4803 18.5255 18.0366 17.6182 18C17.5206 18 17.4272 18.0163 17.3317 18.0253C17.2502 18.0335 17.1671 18.0339 17.0872 18.0483C17.0273 18.0591 16.9717 18.0806 16.9133 18.0952C15.9864 18.3208 15.2214 18.9728 14.8519 19.8523C14.8442 19.8708 14.8326 19.8865 14.8253 19.905C14.7936 19.9869 14.7751 20.0764 14.7502 20.1621C14.7255 20.2478 14.6937 20.3284 14.6761 20.4166C14.5567 20.9881 14.0627 21.4043 13.4791 21.4248C13.4599 21.4248 13.442 21.4299 13.4225 21.4299H12.8381C13.2045 22.2087 13.7994 22.8574 14.5437 23.2894L14.5532 23.295C14.7372 23.4038 14.9282 23.5003 15.1249 23.5838C15.1514 23.595 15.1785 23.6039 15.2051 23.6142C15.3605 23.6777 15.5213 23.7318 15.685 23.7801C15.7407 23.7964 15.796 23.814 15.8522 23.8286C16.0356 23.876 16.2217 23.9136 16.4094 23.9409C16.4615 23.9485 16.5139 23.9537 16.5661 23.9601C16.773 23.9854 16.9812 23.9987 17.1898 24C18.5272 23.9802 19.7476 23.2332 20.3732 22.0508Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M4.76111 24H14.0482C12.8758 23.3216 12.0423 22.1816 11.7512 20.8586C11.7339 20.7814 11.7169 20.7043 11.7041 20.6272C11.6869 20.5329 11.6697 20.4342 11.6569 20.3357C11.6312 20.1295 11.6184 19.9221 11.6182 19.7142C11.6182 19.4828 11.6312 19.2557 11.6483 19.0243C11.6526 18.9472 11.6611 18.8657 11.6697 18.7886C11.6869 18.6429 11.7041 18.4929 11.7297 18.3472C11.7426 18.2529 11.7554 18.1544 11.7726 18.0557C11.8112 17.8629 11.8541 17.6656 11.9055 17.4642C11.9784 17.1815 12.0597 16.8986 12.1626 16.6157C11.9312 16.8386 11.7426 17.04 11.5968 17.2029C11.5926 17.2072 11.5926 17.2114 11.5884 17.2114C11.5283 17.28 11.4727 17.3443 11.4254 17.4C11.4223 17.4064 11.4179 17.4122 11.4126 17.4172C11.3698 17.4686 11.3311 17.5157 11.3011 17.5585L11.2797 17.58C11.254 17.6186 11.2284 17.6486 11.2112 17.6743C11.2026 17.6829 11.1984 17.6915 11.194 17.6957C11.1801 17.7149 11.1672 17.735 11.1555 17.7557L11.1425 17.7686C11.1383 17.7772 11.1341 17.7814 11.1341 17.7858C11.1341 17.79 11.1255 17.7944 11.1255 17.7944C11.1211 17.8024 11.1152 17.8098 11.1083 17.8158C11.1008 17.8279 11.0922 17.8394 11.0826 17.85C11.068 17.8667 11.0522 17.8824 11.0354 17.8971C11.0312 17.9015 11.0226 17.9057 11.0184 17.9099C11.0094 17.9185 10.9993 17.9258 10.9883 17.9315C10.9667 17.9454 10.9438 17.957 10.9197 17.9658C10.9155 17.9658 10.9155 17.97 10.9111 17.97C10.9069 17.97 10.9026 17.9744 10.8983 17.9744C10.894 17.9744 10.8854 17.9786 10.8768 17.9828C10.8448 17.9916 10.8116 17.996 10.7783 17.9958C10.7741 17.9958 10.7655 18 10.7611 18H10.7569C10.7483 18 10.7483 17.9958 10.7397 17.9958C10.6987 17.9969 10.6578 17.9897 10.6198 17.9744C10.6154 17.9744 10.6154 17.97 10.6111 17.97H10.6069C10.5582 17.9533 10.5143 17.9253 10.4784 17.8885C10.4661 17.8793 10.4559 17.8676 10.4484 17.8542C10.4222 17.8279 10.4004 17.7975 10.3841 17.7643C10.3751 17.7479 10.3678 17.7307 10.3627 17.7129L10.3497 17.6743C10.3412 17.6656 10.3412 17.6528 10.3369 17.64C10.3326 17.6272 10.3412 17.6228 10.3369 17.6186C10.3412 17.5759 10.3425 17.5329 10.3412 17.4901C10.5383 15.5951 11.1784 13.7732 12.2097 12.1714C13.9233 9.41125 16.5498 7.33832 19.6326 6.31293C20.2538 5.31757 20.5944 4.17297 20.6182 3C20.6182 1.34308 19.2751 0 17.6182 0C15.9615 0 14.6182 1.34308 14.6182 3C14.6182 4.65692 15.9615 6 17.6182 6C17.855 6 18.0469 6.19189 18.0469 6.42865C18.0454 6.57074 17.9751 6.70331 17.8583 6.78424C17.7876 6.83258 17.7039 6.85803 17.6182 6.85712H4.46539C4.04022 7.88068 3.52551 8.8645 2.92694 9.79706C2.67407 10.2215 2.4126 10.6544 2.15973 11.1086C0.920837 13.1876 0.204712 15.5363 0.0725098 17.9529C0.055481 18.2443 0.046875 18.5486 0.046875 18.8571C0.046875 21.5013 2.33972 24 4.76111 24ZM3.05969 11.4686C3.08569 11.3646 3.14996 11.2744 3.23969 11.2158L4.07117 10.6586C4.48883 10.3797 5.03339 10.3797 5.45123 10.6586L5.83264 10.9114C5.96118 11.0015 6.13257 11.0015 6.26111 10.9114L6.64252 10.6586C7.06036 10.3797 7.60492 10.3797 8.02258 10.6586L8.40399 10.9114C8.53271 11.0015 8.70392 11.0015 8.83264 10.9114L9.21405 10.6586C9.63171 10.3797 10.1763 10.3797 10.5939 10.6586L11.4254 11.2158C11.603 11.3311 11.6673 11.5605 11.5754 11.7513C11.5671 11.7709 11.5571 11.7894 11.5455 11.8072C11.4666 11.9269 11.3331 11.9993 11.1898 12C11.1055 12.0009 11.0229 11.9755 10.9541 11.9271L10.1182 11.3743C9.98969 11.2842 9.81848 11.2842 9.68976 11.3743L9.30835 11.6272C8.8905 11.9061 8.34613 11.9061 7.92828 11.6272L7.54688 11.3743C7.41815 11.2842 7.24695 11.2842 7.11823 11.3743L6.73682 11.6272C6.31915 11.9061 5.7746 11.9061 5.35693 11.6272L4.97552 11.3743C4.8468 11.2842 4.6756 11.2842 4.54688 11.3743L3.71118 11.9271C3.61707 11.9903 3.50153 12.0132 3.39038 11.9907C3.27924 11.9681 3.18182 11.902 3.11975 11.8072C3.0542 11.7072 3.03241 11.5849 3.05969 11.4686ZM1.9541 14.2158L2.7854 13.6586C3.20325 13.3797 3.74762 13.3797 4.16547 13.6586L4.54688 13.9114C4.6756 14.0015 4.8468 14.0015 4.97552 13.9114L5.35693 13.6586C5.7746 13.3797 6.31915 13.3797 6.73682 13.6586L7.11823 13.9114C7.24695 14.0015 7.41815 14.0015 7.54688 13.9114L7.92828 13.6586C8.34613 13.3797 8.8905 13.3797 9.30835 13.6586L10.1396 14.2158C10.2957 14.3205 10.3652 14.5148 10.3112 14.6948C10.257 14.8748 10.092 14.9985 9.90399 15C9.81976 15.0009 9.73737 14.9755 9.66833 14.9271L8.83264 14.3743C8.70392 14.2842 8.53271 14.2842 8.40399 14.3743L8.02258 14.6272C7.60492 14.9061 7.06036 14.9061 6.64252 14.6272L6.26111 14.3743C6.13257 14.2842 5.96118 14.2842 5.83264 14.3743L5.45123 14.6272C5.03339 14.9061 4.48883 14.9061 4.07117 14.6272L3.68976 14.3743C3.56104 14.2842 3.38983 14.2842 3.26111 14.3743L2.42542 14.9271C2.29871 15.0291 2.12531 15.0507 1.97754 14.9828C1.82977 14.9149 1.73328 14.7691 1.72815 14.6065C1.72321 14.4439 1.81073 14.2927 1.9541 14.2158ZM1.0968 17.6442L1.92828 17.0872C2.34613 16.8083 2.8905 16.8083 3.30835 17.0872L3.68976 17.3401C3.81848 17.43 3.98969 17.43 4.11823 17.3401L4.49982 17.0872C4.91748 16.8083 5.46204 16.8083 5.8797 17.0872L6.26111 17.3401C6.38983 17.43 6.56104 17.43 6.68976 17.3401L7.07117 17.0872C7.48883 16.8083 8.03339 16.8083 8.45123 17.0872L9.28253 17.6442C9.31256 17.6636 9.33984 17.6867 9.36401 17.7129C9.47736 17.8385 9.50629 18.019 9.43762 18.1736C9.36914 18.3283 9.21606 18.4281 9.04688 18.4286C8.96265 18.4296 8.88025 18.4041 8.81122 18.3558L7.97552 17.8028C7.8468 17.7129 7.6756 17.7129 7.54688 17.8028L7.16547 18.0557C6.74762 18.3345 6.20325 18.3345 5.7854 18.0557L5.40399 17.8028C5.27527 17.7129 5.10406 17.7129 4.97552 17.8028L4.59393 18.0557C4.17627 18.3345 3.63171 18.3345 3.21405 18.0557L2.83264 17.8028C2.70392 17.7129 2.53271 17.7129 2.40399 17.8028L1.5683 18.3558C1.47418 18.4191 1.35864 18.4422 1.2475 18.4195C1.13635 18.397 1.03876 18.3307 0.976868 18.2357C0.930359 18.1659 0.90509 18.0839 0.903992 18C0.904724 17.8566 0.977051 17.7231 1.0968 17.6442Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M11.4897 15.283C13.0369 12.9086 16.3969 9.09436 23.074 6.48438C15.874 7.08002 12.7326 12.2143 11.4897 15.283Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M23.9484 7.07568C16.504 9.82703 13.1697 14.0828 11.8669 16.2943C13.48 14.7972 15.2672 13.4994 17.1898 12.4286C19.71 11.0108 21.991 9.20428 23.9484 7.07568Z" fill="#4888FF" fill-opacity="0.5" />
        </g>
        <defs>
          <clipPath id="clip0_4_2909">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>`,
      hasSubcategories: true,
      action: 'showEvents'
    },
    {
      id: 'brands',
      title: 'Наши бренды',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_4_2924)">
          <path d="M20.3227 15.6746C18.6595 18.5475 15.5517 20.4844 12 20.4844C8.44828 20.4844 5.34047 18.5475 3.67734 15.6746C1.43766 17.4624 0 20.2149 0 23.2969C0 23.685 0.315 24 0.703125 24H23.2969C23.685 24 24 23.685 24 23.2969C24 20.2149 22.5623 17.4624 20.3227 15.6746Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M5.40234 1.54688H2.625C2.23687 1.54688 1.92188 1.86187 1.92188 2.25C1.92188 3.60797 2.445 4.84641 3.30047 5.77359C3.60938 4.16953 4.35234 2.71828 5.40234 1.54688Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M22.0781 2.25C22.0781 1.86187 21.7631 1.54688 21.375 1.54688H18.5977C19.6477 2.71828 20.3906 4.16953 20.6995 5.77359C21.555 4.84641 22.0781 3.60797 22.0781 2.25Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M4.54688 8.76562H5.85562C6.11766 7.89891 6.92391 7.26562 7.875 7.26562C8.82609 7.26562 9.63234 7.89891 9.89437 8.76562H14.1056C14.3677 7.89891 15.1739 7.26562 16.125 7.26562C17.0761 7.26562 17.8823 7.89891 18.1444 8.76562H19.4531V7.45312C19.4531 3.34359 16.1095 0 12 0C7.89047 0 4.54688 3.34359 4.54688 7.45312V8.76562ZM13.5 3.79688H15C15.3881 3.79688 15.7031 4.11188 15.7031 4.5C15.7031 4.88812 15.3881 5.20312 15 5.20312H13.5C13.1119 5.20312 12.7969 4.88812 12.7969 4.5C12.7969 4.11188 13.1119 3.79688 13.5 3.79688ZM9 3.79688H10.5C10.8881 3.79688 11.2031 4.11188 11.2031 4.5C11.2031 4.88812 10.8881 5.20312 10.5 5.20312H9C8.61188 5.20312 8.29688 4.88812 8.29688 4.5C8.29688 4.11188 8.61188 3.79688 9 3.79688Z" fill="#4888FF" fill-opacity="0.5" />
          <path d="M7.875 8.67188C7.48669 8.67188 7.17188 8.98669 7.17188 9.375V10.1719H4.5C4.11169 10.1719 3.79688 10.4867 3.79688 10.875C3.79688 15.3982 7.4768 19.0781 12 19.0781C16.5232 19.0781 20.2031 15.3982 20.2031 10.875C20.2031 10.4867 19.8883 10.1719 19.5 10.1719H16.8281V9.375C16.8281 8.98669 16.5133 8.67188 16.125 8.67188C15.7367 8.67188 15.4219 8.98669 15.4219 9.375V10.1719H8.57812V9.375C8.57812 8.98669 8.26331 8.67188 7.875 8.67188Z" fill="#4888FF" fill-opacity="0.5" />
        </g>
        <defs>
          <clipPath id="clip0_4_2924">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>`,
      hasSubcategories: false,
      link: '#'
    }
  ];

  // Получаем контейнер для категорий и drop-info
  const categoriesContainer = catalogDropdownMob.querySelector('.categories-mob');
  const dropInfoContainer = catalogDropdownMob.querySelector('.drop-info');

  if (!categoriesContainer) {
    console.warn('Контейнер .categories-mob не найден');
    return;
  }

  // Функция анимации слайда с одновременным показом/скрытием
  function animateSlide(newContent, direction = 'forward', callback = null) {
    if (isAnimating) return;
    isAnimating = true;

    const currentSlide = categoriesContainer.querySelector('.categories-mob__slide.is-active');

    // Создаем новый слайд
    const newSlide = document.createElement('div');
    newSlide.className = 'categories-mob__slide';
    newSlide.innerHTML = newContent;

    // Добавляем новый слайд в контейнер
    categoriesContainer.appendChild(newSlide);

    // Обновляем высоту контейнера под новый контент
    const newHeight = newSlide.scrollHeight;
    categoriesContainer.style.minHeight = `${Math.max(newHeight, 300)}px`;

    // Принудительный reflow для применения стилей
    newSlide.offsetHeight;

    if (direction === 'forward') {
      // Анимация вперед
      newSlide.classList.add('slide-enter-right');
      if (currentSlide) {
        currentSlide.classList.remove('is-active');
        currentSlide.classList.add('slide-exit-left');
      }

      // Запускаем анимацию в следующем кадре
      requestAnimationFrame(() => {
        newSlide.classList.add('slide-enter-right-active');
        if (currentSlide) {
          currentSlide.classList.add('slide-exit-left-active');
        }
      });

    } else {
      // Анимация назад
      newSlide.classList.add('slide-enter-left');
      if (currentSlide) {
        currentSlide.classList.remove('is-active');
        currentSlide.classList.add('slide-exit-right');
      }

      // Запускаем анимацию в следующем кадре
      requestAnimationFrame(() => {
        newSlide.classList.add('slide-enter-left-active');
        if (currentSlide) {
          currentSlide.classList.add('slide-exit-right-active');
        }
      });
    }

    // Ждем завершения анимации
    setTimeout(() => {
      // Удаляем старый слайд
      if (currentSlide) {
        currentSlide.remove();
      }

      // Убираем классы анимации и делаем слайд активным
      newSlide.className = 'categories-mob__slide is-active';

      // Обновляем высоту контейнера
      updateContainerHeight();

      isAnimating = false;

      // Прикрепляем обработчики событий к новому контенту
      attachCategoryEventListeners();

      if (callback) callback();
    }, 300);
  }

  // Функция для динамической установки высоты контейнера
  function updateContainerHeight() {
    const activeSlide = categoriesContainer.querySelector('.categories-mob__slide.is-active');
    if (activeSlide) {
      const slideHeight = activeSlide.scrollHeight;
      categoriesContainer.style.minHeight = `${slideHeight}px`;
    }
  }

  // Функция обновления data-атрибутов и классов
  function updateDropdownState(level, categoryId = null, subcategoryId = null) {
    catalogDropdownMob.dataset.level = level;
    if (categoryId) catalogDropdownMob.dataset.category = categoryId;
    if (subcategoryId) catalogDropdownMob.dataset.subcategory = subcategoryId;

    catalogDropdownMob.classList.remove('lvl-1', 'lvl-2', 'lvl-3', 'lvl-4');

    switch(level) {
      case 'main':
        catalogDropdownMob.classList.add('lvl-1');
        break;
      case 'categories':
        catalogDropdownMob.classList.add('lvl-2');
        break;
      case 'subcategories':
        catalogDropdownMob.classList.add('lvl-3');
        break;
      case 'items':
        catalogDropdownMob.classList.add('lvl-4');
        break;
    }

    if (dropInfoContainer) {
      if (level === 'main') {
        dropInfoContainer.style.display = 'flex';
      } else {
        dropInfoContainer.style.display = 'none';
      }
    }

    console.log(`Updated state: level=${level}, category=${categoryId}, subcategory=${subcategoryId}`);
  }

  // Функция переключения состояния dropdown
  function toggleDropdown() {
    console.log('Toggle dropdown clicked, isOpen:', isOpen);
    isOpen = !isOpen;

    if (isOpen) {
      catalogDropdownMob.classList.add('is-open');
      catalogMobBtn.classList.add('is-open');
      renderMainMenu();
    } else {
      catalogDropdownMob.classList.remove('is-open');
      catalogMobBtn.classList.remove('is-open');
      resetNavigation();
    }
  }

  // Функция закрытия dropdown
  function closeDropdown() {
    if (isOpen) {
      isOpen = false;
      catalogDropdownMob.classList.remove('is-open');
      catalogMobBtn.classList.remove('is-open');
      resetNavigation();
    }
  }

  // Сброс навигации к главному меню
  function resetNavigation() {
    currentLevel = 'main';
    currentCategory = null;
    currentSubcategory = null;
    navigationHistory = [];
    updateDropdownState('main');

    // Очищаем все слайды
    const existingSlides = categoriesContainer.querySelectorAll('.categories-mob__slide');
    existingSlides.forEach(slide => slide.remove());
  }

  // Рендер главного меню
  function renderMainMenu() {
    console.log('Rendering main menu');
    currentLevel = 'main';
    updateDropdownState('main');

    const menuHTML = mainMenuData.map(item => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="${item.action || 'link'}"
                data-link="${item.link || ''}"
                data-id="${item.id}"
                data-level="main">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${item.icon}
            </span>
            <span>${item.title}</span>
          </div>

          ${item.hasSubcategories ? `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          ` : ''}
        </button>
      </li>
    `).join('');

    const content = `
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    // Для главного меню создаем без анимации (первый показ)
    categoriesContainer.innerHTML = `<div class="categories-mob__slide is-active">${content}</div>`;
    attachCategoryEventListeners();
  }

  // Функция рендера с анимацией
  function renderWithAnimation(content, direction = 'forward') {
    animateSlide(content, direction);
  }

  // Обновляем все функции рендера для использования анимации
  function renderCatalog() {
    console.log('Rendering catalog');
    currentLevel = 'categories';
    navigationHistory.push({ level: 'main', title: 'Главное меню' });
    updateDropdownState('categories', 'catalog');

    const menuHTML = catalogData.map(category => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="showCategory"
                data-id="${category.id}"
                data-level="categories"
                data-category="${category.id}">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${category.icon}
            </span>
            <span>${category.title}</span>
          </div>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');

    const content = `
      ${renderBackButton('Каталог')}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Аналогично обновляем остальные функции рендера...
  function renderGifts() {
    console.log('Rendering gifts');
    currentLevel = 'categories';
    navigationHistory.push({ level: 'main', title: 'Главное меню' });
    updateDropdownState('categories', 'gifts');

    const menuHTML = giftsCatalogData.map(category => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="showGiftCategory"
                data-id="${category.id}"
                data-level="categories"
                data-category="${category.id}">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${category.icon}
            </span>
            <span>${category.title}</span>
          </div>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');

    const content = `
      ${renderBackButton('Подарочные наборы')}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Остальные функции рендера обновляем аналогично...
  function renderGiftCategory(categoryId) {
    const category = giftsCatalogData.find(cat => cat.id === categoryId);
    if (!category) return;

    currentLevel = 'subcategories';
    currentCategory = category;
    navigationHistory.push({ level: 'categories', title: 'Подарочные наборы' });
    updateDropdownState('subcategories', categoryId);

    const menuHTML = category.subcategories.map(subcategory => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="showGiftSubcategory"
                data-id="${subcategory.id}"
                data-level="subcategories"
                data-category="${category.id}"
                data-subcategory="${subcategory.id}">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${category.icon}
            </span>
            <span>${subcategory.title}</span>
          </div>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');

    const content = `
      ${renderBackButton(category.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Добавляем остальные функции рендера с анимацией...
  function renderCategory(categoryId) {
    const category = catalogData.find(cat => cat.id === categoryId);
    if (!category) return;

    currentLevel = 'subcategories';
    currentCategory = category;
    navigationHistory.push({ level: 'categories', title: 'Каталог' });
    updateDropdownState('subcategories', categoryId);

    const menuHTML = category.subcategories.map(subcategory => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="showSubcategory"
                data-id="${subcategory.id}"
                data-level="subcategories"
                data-category="${categoryId}"
                data-subcategory="${subcategory.id}">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${category.icon}
            </span>
            <span>${subcategory.title}</span>
          </div>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');

    const content = `
      ${renderBackButton(category.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Рендер кнопки "Назад"
  function renderBackButton(title) {
    return `
      <div class="categories-mob__header">
        <button class="categories-mob__back btn-reset" data-action="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#999C9F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          ${title}
        </button>
      </div>
    `;
  }

  // Навигация назад с анимацией
  function navigateBack() {
    console.log('Navigate back called, history length:', navigationHistory.length);
    console.log('Current level:', currentLevel);
    console.log('Navigation history:', navigationHistory);

    // Если мы на главном уровне каталога (categories), возвращаемся к главному меню
    if (currentLevel === 'categories' && navigationHistory.length > 0) {
      const lastHistoryItem = navigationHistory[navigationHistory.length - 1];
      if (lastHistoryItem.level === 'categories') {
        // Мы на главной странице каталога, возвращаемся к главному меню
        console.log('Returning to main menu from main categories level');
        navigationHistory = []; // Очищаем историю при возврате к главному меню
        renderMainMenu();
        return;
      }
    }

    if (navigationHistory.length === 0) {
      renderMainMenu();
      return;
    }

    const previousLevel = navigationHistory.pop();
    console.log('Going back to:', previousLevel);

    switch (previousLevel.level) {
      case 'main':
        currentLevel = 'main';
        currentCategory = null;
        currentSubcategory = null;
        updateDropdownState('main');

        const mainContent = `
          <ul class="categories-mob__list list-reset">
            ${mainMenuData.map(item => `
              <li class="categories-mob__item">
                <button class="categories-mob__btn btn-reset"
                        data-action="${item.action || 'link'}"
                        data-link="${item.link || ''}"
                        data-id="${item.id}"
                        data-level="main">
                  <div class="categories-mob__btn-lside">
                    <span class="categories-mob__btn-icon">
                      ${item.icon}
                    </span>
                    <span>${item.title}</span>
                  </div>

                  ${item.hasSubcategories ? `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  ` : ''}
                </button>
              </li>
            `).join('')}
          </ul>
        `;

        renderWithAnimation(mainContent, 'backward');
        break;

      case 'categories':
        currentLevel = 'categories';
        currentSubcategory = null;

        if (previousLevel.title === 'Подарочные наборы') {
          renderGiftsWithAnimation('backward');
        } else {
          renderCatalogWithAnimation('backward');
        }
        break;

      case 'subcategories':
        currentLevel = 'subcategories';

        if (currentCategory && giftsCatalogData.find(cat => cat.id === currentCategory.id)) {
          renderGiftCategoryWithAnimation(currentCategory.id, 'backward');
        } else {
          renderCategoryWithAnimation(currentCategory.id, 'backward');
        }
        break;

      case 'items':
        currentLevel = 'items';

        if (currentSubcategory) {
          if (currentCategory && giftsCatalogData.find(cat => cat.id === currentCategory.id)) {
            renderGiftSubcategoryWithAnimation(currentSubcategory.id, 'backward');
          } else {
            renderSubcategoryWithAnimation(currentSubcategory.id, 'backward');
          }
        }
        break;
    }
  }

  // Вспомогательные функции для рендера с анимацией назад
  function renderGiftsWithAnimation(direction = 'forward') {
    currentLevel = 'categories';
    updateDropdownState('categories', 'gifts');

    const menuHTML = `
      <div class="categories-mob__header">
        <button class="categories-mob__back btn-reset" data-action="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#999C9F" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Подарочные наборы
        </button>
      </div>

      <ul class="categories-mob__list list-reset">
        ${giftsCatalogData.map(category => `
          <li class="categories-mob__item">
            <button class="categories-mob__btn btn-reset" data-action="showGiftCategory" data-id="${category.id}" data-level="categories" data-category="${category.id}">
              <div class="categories-mob__btn-lside">
                <span class="categories-mob__btn-icon">
                  ${category.icon}
                </span>
                <span>${category.title}</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    renderWithAnimation(menuHTML, direction);
    attachCategoryEventListeners();
  }

  function renderCatalogWithAnimation(direction = 'forward') {
    currentLevel = 'categories';
    updateDropdownState('categories', 'catalog');

    const menuHTML = `
      <div class="categories-mob__header">
        <button class="categories-mob__back btn-reset" data-action="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#999C9F" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Каталог
        </button>
      </div>

      <ul class="categories-mob__list list-reset">
        ${catalogData.map(category => `
          <li class="categories-mob__item">
            <button class="categories-mob__btn btn-reset" data-action="showCategory" data-id="${category.id}" data-level="categories" data-category="${category.id}">
              <div class="categories-mob__btn-lside">
                <span class="categories-mob__btn-icon">
                  ${category.icon}
                </span>
                <span>${category.title}</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    renderWithAnimation(menuHTML, direction);
    attachCategoryEventListeners();
  }

  // Прикрепление обработчиков событий к категориям
  function attachCategoryEventListeners() {
    const activeSlide = categoriesContainer.querySelector('.categories-mob__slide.is-active');
    if (!activeSlide) return;

    // Обработчик кнопки "Назад"
    const backBtn = activeSlide.querySelector('.categories-mob__back, .categories-mob__back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAnimating) {
          navigateBack();
        }
      });
    }

    // Обработчики кнопок категорий
    const categoryBtns = activeSlide.querySelectorAll('.categories-mob__btn:not(.categories-mob__back):not(.categories-mob__back-btn)');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAnimating) return; // Предотвращаем клики во время анимации

        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const link = btn.dataset.link;

        console.log('Category button clicked:', action, id, 'level:', btn.dataset.level);

        switch (action) {
          case 'showCatalog':
            renderCatalog();
            break;
          case 'showGifts':
            renderGifts();
            break;
          case 'showGiftCategory':
            renderGiftCategory(id);
            break;
          case 'showGiftSubcategory':  // ДОБАВЛЯЕМ
            renderGiftSubcategory(id);
            break;
          case 'showGiftItems':        // ДОБАВЛЯЕМ
            renderGiftItems(id);
            break;
          case 'showCategory':
            renderCategory(id);
            break;
          case 'showSubcategory':      // ДОБАВЛЯЕМ
            renderSubcategory(id);
            break;
          case 'showItems':            // ДОБАВЛЯЕМ
            renderItems(id);
            break;
          case 'showEvents':
            console.log('Events section not implemented yet');
            break;
          case 'showHotOffers':
            console.log('Hot offers section not implemented yet');
            break;
          case 'link':
            if (link && link !== '#') {
              window.location.href = link;
            }
            break;
          default:
            console.log(`Action "${action}" for item "${id}" not implemented`);
        }
      });
    });

    // 1. ИСПРАВЛЯЕМ ОБРАБОТЧИК ФИНАЛЬНЫХ ССЫЛОК
    // В функции attachCategoryEventListeners заменяем:

    // Обработчики ссылок (финальный уровень)
    const categoryLinks = activeSlide.querySelectorAll('.categories-mob__link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Если ссылка ведет на #, предотвращаем действие и ничего не делаем
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        // Если ссылка реальная, закрываем dropdown
        closeDropdown();
      });
    });
  }

  // Рендер подкатегории подарков
  function renderGiftSubcategory(subcategoryId) {
    if (!currentCategory) return;

    const subcategory = currentCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory || !subcategory.items) return;

    currentSubcategory = subcategory;
    navigationHistory.push({ level: 'subcategories', title: currentCategory.title }); // ИСПРАВИЛИ
    updateDropdownState('items', currentCategory.id, subcategoryId);

    const menuHTML = subcategory.items.map(item => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
              data-action="${item.subcategories ? 'showGiftItems' : 'link'}"
              data-link="${item.link || ''}"
              data-id="${item.id}"
              data-level="items"
              data-category="${currentCategory.id}"
              data-subcategory="${subcategoryId}"
              data-item="${item.id}">
        <div class="categories-mob__btn-lside">
          <span class="categories-mob__btn-icon">
            ${currentCategory.icon}
          </span>
          <span>${item.title}</span>
          ${item.count ? `<span class="categories-mob__count">${item.count}</span>` : ''}
        </div>

        ${item.subcategories ? `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        ` : ''}
      </button>
    </li>
  `).join('');

    const content = `
      ${renderBackButton(subcategory.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Рендер элементов подарков (финальный уровень)
  function renderGiftItems(itemId) {
    if (!currentSubcategory) return;

    const item = currentSubcategory.items.find(itm => itm.id === itemId);
    if (!item || !item.subcategories) return;

    navigationHistory.push({ level: 'items', title: currentSubcategory.title }); // ДОБАВЛЯЕМ В ИСТОРИЮ

    const menuHTML = item.subcategories.map(subItem => `
      <li class="categories-mob__item">
        <a href="${subItem.link || '#'}"
          class="categories-mob__btn btn-reset categories-mob__link"
          data-level="final"
          data-category="${currentCategory.id}"
          data-subcategory="${currentSubcategory.id}"
          data-item="${item.id}"
          data-subitem="${subItem.id}">
        <div class="categories-mob__btn-lside">
          <span class="categories-mob__btn-icon">
            ${currentCategory.icon}
          </span>
          <span>${subItem.title}</span>
          ${subItem.count ? `<span class="categories-mob__count">${subItem.count}</span>` : ''}
        </div>
      </a>
    </li>
  `).join('');

    const content = `
      ${renderBackButton(item.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Рендер подкатегории обычного каталога
  function renderSubcategory(subcategoryId) {
    if (!currentCategory) return;

    const subcategory = currentCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory || !subcategory.items) return;

    currentSubcategory = subcategory;
    navigationHistory.push({ level: 'subcategories', title: currentCategory.title }); // ИСПРАВИЛИ
    updateDropdownState('items', currentCategory.id, subcategoryId);

    const menuHTML = subcategory.items.map(item => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
              data-action="${item.subcategories ? 'showItems' : 'link'}"
              data-link="${item.link || ''}"
              data-id="${item.id}"
              data-level="items"
              data-category="${currentCategory.id}"
              data-subcategory="${subcategoryId}"
              data-item="${item.id}">
        <div class="categories-mob__btn-lside">
          <span class="categories-mob__btn-icon">
            ${currentCategory.icon}
          </span>
          <span>${item.title}</span>
          ${item.count ? `<span class="categories-mob__count">${item.count}</span>` : ''}
        </div>

        ${item.subcategories ? `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        ` : ''}
      </button>
    </li>
  `).join('');

    const content = `
      ${renderBackButton(subcategory.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Рендер элементов товаров (финальный уровень)
  function renderItems(itemId) {
    if (!currentSubcategory) return;

    const item = currentSubcategory.items.find(itm => itm.id === itemId);
    if (!item || !item.subcategories) return;

    navigationHistory.push({ level: 'items', title: currentSubcategory.title }); // ДОБАВЛЯЕМ В ИСТОРИЮ

    const menuHTML = item.subcategories.map(subItem => `
      <li class="categories-mob__item">
        <a href="${subItem.link || '#'}"
          class="categories-mob__btn btn-reset categories-mob__link"
          data-level="final"
          data-category="${currentCategory.id}"
          data-subcategory="${currentSubcategory.id}"
          data-item="${item.id}"
          data-subitem="${subItem.id}">
        <div class="categories-mob__btn-lside">
          <span class="categories-mob__btn-icon">
            ${currentCategory.icon}
          </span>
          <span>${subItem.title}</span>
          ${subItem.count ? `<span class="categories-mob__count">${subItem.count}</span>` : ''}
        </div>
      </a>
    </li>
  `).join('');

    const content = `
      ${renderBackButton(item.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, 'forward');
  }

  // Добавляем недостающие функции после существующих функций рендера (около строки 600):

  // Функция для рендера подкатегорий с анимацией
  function renderSubcategoryWithAnimation(subcategoryId, direction = 'forward') {
    if (!currentCategory) return;

    const subcategory = currentCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory || !subcategory.items) return;

    currentSubcategory = subcategory;
    updateDropdownState('items', currentCategory.id, subcategoryId);

    const menuHTML = `
      <div class="categories-mob__header">
        <button class="categories-mob__back btn-reset" data-action="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#999C9F" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${currentCategory.title}
        </button>
      </div>
      <ul class="categories-mob__list list-reset">
        ${subcategory.items.map(item => `
          <li class="categories-mob__item">
            <button class="categories-mob__btn btn-reset"
                  data-action="${item.subcategories ? 'showItems' : 'link'}"
                  data-link="${item.link || ''}"
                  data-id="${item.id}"
                  data-level="items"
                  data-category="${currentCategory.id}"
                  data-subcategory="${subcategoryId}"
                  data-item="${item.id}">
              <div class="categories-mob__btn-lside">
                <span class="categories-mob__btn-icon">
                  ${currentCategory.icon}
                </span>
                <span>${item.title}</span>
                ${item.count ? `<span class="categories-mob__count">${item.count}</span>` : ''}
              </div>

              ${item.subcategories ? `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              ` : ''}
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    renderWithAnimation(menuHTML, direction);
    attachCategoryEventListeners();
  }

  // Функция для рендера подкатегорий подарков с анимацией
  function renderGiftSubcategoryWithAnimation(subcategoryId, direction = 'forward') {
    if (!currentCategory) return;

    const subcategory = currentCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory || !subcategory.items) return;

    currentSubcategory = subcategory;
    updateDropdownState('items', currentCategory.id, subcategoryId);

    const menuHTML = `
      <div class="categories-mob__header">
        <button class="categories-mob__back btn-reset" data-action="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#999C9F" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${currentCategory.title}
        </button>
      </div>
      <ul class="categories-mob__list list-reset">
        ${subcategory.items.map(item => `
          <li class="categories-mob__item">
            <button class="categories-mob__btn btn-reset"
                  data-action="${item.subcategories ? 'showGiftItems' : 'link'}"
                  data-link="${item.link || ''}"
                  data-id="${item.id}"
                  data-level="items"
                  data-category="${currentCategory.id}"
                  data-subcategory="${subcategoryId}"
                  data-item="${item.id}">
              <div class="categories-mob__btn-lside">
                <span class="categories-mob__btn-icon">
                  ${currentCategory.icon}
                </span>
                <span>${item.title}</span>
                ${item.count ? `<span class="categories-mob__count">${item.count}</span>` : ''}
              </div>

              ${item.subcategories ? `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              ` : ''}
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    renderWithAnimation(menuHTML, direction);
    attachCategoryEventListeners();
  }

  // Функция для рендера категорий с анимацией
  function renderCategoryWithAnimation(categoryId, direction = 'forward') {
    const category = catalogData.find(cat => cat.id === categoryId);
    if (!category) return;

    currentLevel = 'subcategories';
    currentCategory = category;
    navigationHistory.push({ level: 'categories', title: 'Каталог' });
    updateDropdownState('subcategories', categoryId);

    const menuHTML = category.subcategories.map(subcategory => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="showSubcategory"
                data-id="${subcategory.id}"
                data-level="subcategories"
                data-category="${categoryId}"
                data-subcategory="${subcategory.id}">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${category.icon}
            </span>
            <span>${subcategory.title}</span>
          </div>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');

    const content = `
      ${renderBackButton(category.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, direction);
  }

  // Функция для рендера подарочных категорий с анимацией
  function renderGiftCategoryWithAnimation(categoryId, direction = 'forward') {
    const category = giftsCatalogData.find(cat => cat.id === categoryId);
    if (!category) return;

    currentLevel = 'subcategories';
    currentCategory = category;
    navigationHistory.push({ level: 'categories', title: 'Подарочные наборы' });
    updateDropdownState('subcategories', categoryId);

    const menuHTML = category.subcategories.map(subcategory => `
      <li class="categories-mob__item">
        <button class="categories-mob__btn btn-reset"
                data-action="showGiftSubcategory"
                data-id="${subcategory.id}"
                data-level="subcategories"
                data-category="${category.id}"
                data-subcategory="${subcategory.id}">
          <div class="categories-mob__btn-lside">
            <span class="categories-mob__btn-icon">
              ${category.icon}
            </span>
            <span>${subcategory.title}</span>
          </div>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#343A3F" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    `).join('');

    const content = `
      ${renderBackButton(category.title)}
      <ul class="categories-mob__list list-reset">
        ${menuHTML}
      </ul>
    `;

    renderWithAnimation(content, direction);
  }

  // Остальные функции остаются без изменений...
  function handleMediaQueryChange(e) {
    if (e.matches) {
      catalogMobBtn.addEventListener('click', toggleDropdown);
    } else {
      catalogMobBtn.removeEventListener('click', toggleDropdown);
      closeDropdown();
    }
  }

  handleMediaQueryChange(mediaQuery);
  mediaQuery.addListener(handleMediaQueryChange);

  document.addEventListener('click', (e) => {
    if (!mediaQuery.matches) return;
    if (isOpen && !catalogMobBtn.contains(e.target) && !catalogDropdownMob.contains(e.target)) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!mediaQuery.matches) return;
    if (e.key === 'Escape' && isOpen) {
      closeDropdown();
    }
  });

  console.log('Mobile catalog initialized');
}
