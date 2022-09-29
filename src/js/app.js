window.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');

  const toggleLocationCityForm = document.forms.locationSearchForm;
  const inputLocationCityForm = toggleLocationCityForm.querySelector('input');

  const citiesTemplate = document.querySelector('[data-cities-template]');
  const citiesContainer = document.querySelector('[data-cities-container]');

  const celectedTemplate = document.querySelector('[data-celected-template]');
  const celectedContainer = document.querySelector('[data-celected-container]');

  const preloader = document.querySelector('#loading');
  let dataCities = [];
  let searchParams = [];

  (function toggleMobileMenu() {
    const buttonBurgerMenu = document.querySelector('.js-header__burger');

    if (buttonBurgerMenu) {
      buttonBurgerMenu.addEventListener('click', () => {
        body.classList.toggle('mobile-menu--open');
      });
    };
  })();

  (function tooglelocationPopup() {
    const buttonLocationMenu = document.querySelector('.js-location__btn');
    const containerLocationMenu = document.querySelector('.js-location__search-container');

    const locationBtn = document.querySelector('.js-location__btn-apply');

    //открытие окна
    if (buttonLocationMenu) {
      buttonLocationMenu.addEventListener('click', () => {
        containerLocationMenu.classList.toggle('location__search-container-open');
        inputLocationCityForm.focus(); //хм, не работает фокус

        if (containerLocationMenu.classList.contains('location__search-container-open')) {
          if (dataCities.length === 0) {
            openPreloader(preloader);
            getCities(dataCities);
            locationBtn.disabled = true;
          }
        }
      });
    };

    //Поиск
    inputLocationCityForm.addEventListener('input', handleInput);

    //Выбор города
    citiesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-location__bth-choise');      

      if (btn) {
        celectedContainer.classList.add('location__selected-cities--active');
        const btnContext = btn.querySelector('[data-name]');

        dataCities.filter((item) => {
          if (item.name === btnContext.textContent) {
            if (searchParams.includes(item)) {
              let index = searchParams.indexOf(item);
              searchParams.splice(index, 1);
              return searchParams;
            }
            searchParams.push(item);
            return searchParams;
          }
        });

        if (searchParams.length === 0) {
          celectedContainer.classList.remove('location__selected-cities--active');
        }

        createBadge(searchParams);

        locationBtn.disabled = false;
      }
    });

    //Удаление города
    celectedContainer.addEventListener('click', (e) => {
      const btnClearChoise = e.target.closest('[data-id]');

      if (btnClearChoise) {
        searchParams = searchParams.filter(i => {
          return i.id != btnClearChoise.dataset.id
        });
        
        if (searchParams.length === 0) {
          celectedContainer.classList.remove('location__selected-cities--active');
        }

        createBadge(searchParams);
      }
    });

    //закрытые окна по кнопке esc
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        containerLocationMenu.classList.remove('location__search-container-open');
      }
    });

    //закрытие окна по клику вне его области
    document.addEventListener('click', (e) => {
      let target = e.target;

      if (!target.closest('.js-location__btn') && !target.closest('.js-location__search-container') && !target.closest('.js-location__choise-selected')) {
        containerLocationMenu.classList.remove('location__search-container-open');
      }
    });

  })();

  async function getCities(obj) {
    try {
      const response = await fetch('https://studika.ru/api/areas',{
        method: 'POST'
      });

      const data = await response.json();

      data.forEach(region => {
        obj.push({name: region.name, id: region.id});
        if (region.cities) {
          region.cities.forEach(city => {
            obj.push({name: city.name, region: region.name, id: city.id});
          });
        }
      });
      createTemplate(obj);
      closePreloader(preloader);
    } catch(err) {
      alert(err);
    }
  };

  function createTemplate(obj) {
    obj.forEach(item => {
      const card = citiesTemplate.content.cloneNode(true);
      const name = card.querySelector('[data-name]');
      const state = card.querySelector('[data-state]');
      const cityId = card.querySelector('[data-id]');
      name.textContent = item.name;
      state.textContent = item.region;
      cityId.dataset.id = item.id;
      citiesContainer.appendChild(card);
    })
  };

  function createBadge(obj) {
    celectedContainer.innerHTML = '';

    obj.map((i) => {
      const card = celectedTemplate.content.cloneNode(true);
      const celectedCity = card.querySelector('[data-selected-city]');
      const cityId = card.querySelector('[data-id]');

      celectedCity.textContent = i.name;
      cityId.dataset.id = i.id;
      celectedContainer.appendChild(card);
    });
  };

  function openPreloader(preloader) {
    preloader.style.display = "inline-flex";
  };

  function closePreloader(preloader) {
    if (preloader.style.display = "inline-flex") {
        preloader.style.display = "none";
    }
  };

  function handleInput(e) {
    let query = e.target.value.toLowerCase();
    const btnClear = document.querySelector('.js-location-search-form__clear-svg');
    let result = dataCities.filter(i => i.name.toLowerCase().includes(query));
    citiesContainer.innerHTML = '';
    createTemplate(result);

    if (query) {
      btnClear.classList.add('location-search-form__clear-svg--active');
      btnClear.addEventListener('click', () => {
        query = '';
        inputLocationCityForm.value = '';
        result = dataCities.filter(i => i.name.toLowerCase().includes(query));
        citiesContainer.innerHTML = '';
        createTemplate(result);
        btnClear.classList.remove('location-search-form__clear-svg--active');
      })
    }
  };

});
