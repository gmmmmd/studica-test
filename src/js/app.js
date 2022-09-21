window.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');

  (function toggleMobileMenu() {
    const buttonBurgerMenu = document.querySelector('.js-header__burger');

    if (buttonBurgerMenu) {
      buttonBurgerMenu.addEventListener('click', function() {
        body.classList.toggle('mobile-menu--open');
      });
    };
  })();

  (function toggleLocationCity() {
    const buttonLocationMenu = document.querySelector('.js-location__btn');
    const containerLocationMenu = document.querySelector('.js-location__search-container');

    if (buttonLocationMenu) {
      buttonLocationMenu.addEventListener('click', function() {
        containerLocationMenu.classList.toggle('location__search-container-open');
      });
    };
  })();
});
