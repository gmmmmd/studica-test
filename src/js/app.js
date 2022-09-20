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
});
