import { capitalize } from './capitalize.js';

('use strict');

const URL_PATH = 'http://localhost:4200/api/dish';

document.addEventListener('DOMContentLoaded', () => {
  renderDishData();
  // Agregar metodos globales
  window.nextPage = nextPage;
  window.previousPage = previousPage;
  window.sortPrice = sortPrice;
});

let originalDishes = [];

let page = 0;
let dishesSorted = [];

const renderDishData = async () => {
  const { dishes } = await getDishes();

  // guardar el array original
  originalDishes = dishes;

  const newDishes = createDishesPagination(dishes);
  // actualizar la variable global
  dishesSorted = newDishes;

  // Deshabilitar el boton de siguiente si no hay mas paginas
  if (newDishes.length <= 1) {
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.add('btn-disabled');
    btnNext.setAttribute('disabled', 'true');
  }

  setMenuList(newDishes[0]);
};

const getDishes = async () => {
  const response = await fetch(URL_PATH);
  const data = await response.json();
  return data;
};

const createDishesPagination = (dishes = []) => {
  const newDishes = [];
  let arrTemp = [];
  let indexArray = 0;

  dishes.forEach((dish) => {
    if (arrTemp.length < 5) {
      arrTemp.push(dish);
    } else {
      indexArray = +1;
      arrTemp = [];
      arrTemp.push(dish);
    }
    newDishes[indexArray] = arrTemp;
  });

  return newDishes;
};

const setMenuList = (dishes = []) => {
  const dishList = document.querySelector('.menu-list');
  if (dishes.length === 0) {
    dishList.innerHTML = `
      <div class="error-message">
        <p>No hay platillos para mostrar</p>
      </div>
    `;
    return;
  }

  const dishListTemplate = dishes.map((dish) => {
    return `
      <li class="menu-item">
        <div class="menu-item__first-row">
          <h2 class="menu-item__title">${capitalize(dish.name)}</h2>
          <span class="menu-item__price">$${dish.price}</span>
        </div>
        <div class="menu-item__second-row">
          <p class="menu-item__description">
            ${capitalize(dish.description)}
          </p>
          <div class="menu-item__btn">
            <a href="dish?id=${dish._id}" class="btn">Ver más</a>
          </div>
        </div>
      </li>
    `;
  });

  dishList.innerHTML = dishListTemplate.join('');
};

const nextPage = () => {
  if (page !== dishesSorted.length - 1) {
    page += 1;
    setMenuList(dishesSorted[page]);
  }

  // deshabilitar el boton de siguiente si es la ultima pagina
  if (page === dishesSorted.length - 1) {
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.add('btn-disabled');
    btnNext.setAttribute('disabled', 'true');
  }

  // habilitar el boton de anterior si no esta en la primera pagina
  if (page !== 0) {
    const btnPrevious = document.getElementById('btn-previous');
    btnPrevious.classList.remove('btn-disabled');
    btnPrevious.removeAttribute('disabled');
  }
};

const previousPage = () => {
  if (page !== 0) {
    page -= 1;
    setMenuList(dishesSorted[page]);
  }

  // deshabilitar el boton de anteriror si es la primera pagina
  if (page === 0) {
    const btnPrevious = document.getElementById('btn-previous');
    btnPrevious.classList.add('btn-disabled');
    btnPrevious.setAttribute('disabled', 'true');
  }

  // habilitar el boton de next si no esta en la ultima pagina
  if (page !== dishesSorted.length - 1) {
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.remove('btn-disabled');
    btnNext.removeAttribute('disabled');
  }
};

const sortPrice = (e) => {
  const { value } = e;
  // ordenar de menor a mayor
  const sortedDishes = originalDishes.sort((a, b) => {
    if (value === 'low') return a.price - b.price;
    if (value === 'high') return b.price - a.price;
  });

  // Crear un nuevo array con las paginas
  const newDishes = createDishesPagination(sortedDishes);
  // actualizar la variable global
  dishesSorted = newDishes;
  // Actualizar la pagina
  setMenuList(newDishes[0]);

  // resetear los botones
  page = 0;
  if (newDishes.length === 1) {
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.add('btn-disabled');
    btnNext.setAttribute('disabled', 'true');
  } else {
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.remove('btn-disabled');
    btnNext.removeAttribute('disabled');
  }

  const btnPrevious = document.getElementById('btn-previous');
  btnPrevious.classList.add('btn-disabled');
  btnPrevious.setAttribute('disabled', 'true');
};
