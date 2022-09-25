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

    const citiesTemplate = document.querySelector('[data-cities-template]');
    const citiesContainer = document.querySelector('[data-cities-container]');

    const celectedContainer = document.querySelector('[data-celected-container]');



    let dataCities = [];
    let searchParams = [];

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

    toggleLocationCityForm.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase(); 
      const cityBlock = document.querySelectorAll('.js-location__city');

      cityBlock.forEach(item => {
        if (item.textContent.toLowerCase().includes(query)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });


    const buttonChoiseLocation = document.querySelectorAll('.js-location__bth-choise');    
    citiesContainer.addEventListener('click', (e) => {
      

      console.log(buttonChoiseLocation)
      celectedContainer.classList.add('location__selected-cities--active');
      searchParams.push(dataCities.find(city => city.name === e.target.textContent));
      //console.log(searchParams)
    });
    

    async function getCities() {
      try {
        const response = await fetch('https://studika.ru/api/areas',{
          method: 'POST'
        });

        const data = await response.json();

        data.forEach(region => {
          dataCities.push({name: region.name});
          if (region.cities) {
            region.cities.forEach(city => {
              dataCities.push({name: city.name, region: region.name});
            });
          }
        });
        
        dataCities.map(i => {
          const card = citiesTemplate.content.cloneNode(true).children[0];
          const header = card.querySelector('[data-header]');
          const body = card.querySelector('[data-body]');
          header.textContent = i.name;          
          body.textContent = i.region;
          citiesContainer.append(card);
        });
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
});
