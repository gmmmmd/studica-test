window.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');

const toggleLocationCityForm = document.forms.locationSearchForm;
const inputLocationCityForm = toggleLocationCityForm.querySelector('input');

  const preloader = document.querySelector('#loading');

  (function toggleMobileMenu() {
    const buttonBurgerMenu = document.querySelector('.js-header__burger');

    if (buttonBurgerMenu) {
      buttonBurgerMenu.addEventListener('click', () => {
        body.classList.toggle('mobile-menu--open');
      });
    };
  })();

  (function getLocation() {
    const buttonLocationMenu = document.querySelector('.js-location__btn');
    const containerLocationMenu = document.querySelector('.js-location__search-container');
    const cities = document.querySelector('.js-location__cities-data');

    if (buttonLocationMenu) {
      buttonLocationMenu.addEventListener('click', () => {
        containerLocationMenu.classList.toggle('location__search-container-open');
        inputLocationCityForm.focus(); //хм, не работает фокус

        if (containerLocationMenu.classList.contains('location__search-container-open')) {
          openPreloader(preloader);
          getCities();
        }
      });
    };

    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        containerLocationMenu.classList.remove('location__search-container-open');
      }
    });

    document.addEventListener('click', (e) => {
      let target = e.target;

      if (!target.closest('.js-location__btn') && !target.closest('.js-location__search-container')) {
        containerLocationMenu.classList.remove('location__search-container-open');
      }
    });

    async function getCities() {
      try {
        const response = await fetch('https://studika.ru/api/areas',{
          method: 'POST'
        });
        const body = await response.json();
        let dataRegions = '';
        body.forEach(region => {
          dataRegions += createRegion(region.name);
          if (region.cities) {
            region.cities.forEach(city => {
              console.log(city.name)
              dataRegions += createRegion(city.name);
            });
          }
        });
        cities.innerHTML = dataRegions;
        closePreloader(preloader);
      } catch(err) {
        alert(err);
      }
    }
  })();

  function openPreloader(preloader) {
    preloader.style.display = "inline-flex";
  };

  function closePreloader(preloader) {
    if (preloader.style.display = "inline-flex") {
        preloader.style.display = "none";
    }
  };

  function createRegion(region) {
    return`
    <li class="location__city">
      <button type="button" class="button">
        <span>${region}</span>
      </button>
    </li>`
  };
});
