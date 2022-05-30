import { capitalize } from './capitalize.js';

('use strict');

const URL_PATH = 'http://localhost:4200/api/dish';

document.addEventListener('DOMContentLoaded', () => {
  renderDishData();
  // Agregar metodo al scope global para poder llamarlo desde el archivo html
  window.setMainImage = setMainImage;
});

const renderDishData = async () => {
  const { id } = getUrlVars();
  const { msg, dish } = await getDish(id);
  if (dish) {
    const url = dish.media_library[0];
    setMainImage(url);
    setBackgroundImage(dish.media_library);
    seImagesContainer(dish.media_library);
    setDataDish(dish);
    return;
  }
  // Si no hay ningun platillo con ese id
  const mainContainer = document.getElementById('main-container');
  mainContainer.innerHTML = `
    <div class="error-message">
      <p>${msg} :(</p>
    </div>
  `;
  mainContainer.style.background = `rgba(0, 0, 0, 0.6) url('/assets/imgs/backgroud-default.jpg') no-repeat center center / cover`;
};

const getUrlVars = () => {
  let vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    vars[key] = value;
  });
  return vars;
};

const getDish = async (id) => {
  const response = await fetch(`${URL_PATH}/${id}`);
  const data = await response.json();
  return data;
};

const setMainImage = (url) => {
  let html = '';
  if (url) {
    const isImage = url.includes('image');
    if (isImage) {
      html = `
        <img src="${url}" alt="Imagen de un platillo" />
      `;
    } else {
      html = `
        <video src="${url}" controls >
        </video>
      `;
    }
  } else {
    html = `
      <p>No hay imagenes para mostrar :(</p>
    `;
  }
  document.getElementById('main-image').innerHTML = html;
};

const seImagesContainer = (urls = []) => {
  let html = '';
  urls.forEach((url) => {
    const isImage = url.includes('image');
    if (isImage) {
      html += `
        <img src="${url}" alt="Imagen de un platillo" onclick="setMainImage('${url}')" />
      `;
    } else {
      html += `
        <video src="${url}" onclick="setMainImage('${url}')" >
        </video>
      `;
    }
  });
  document.getElementById('images-container').innerHTML = html;
};

const setBackgroundImage = (urls = []) => {
  const urlImages = urls.filter((url) => url.includes('image'));
  if (urlImages.length === 0) {
    document.getElementById(
      'main-container'
    ).style.background = `rgba(0, 0, 0, 0.6) url('/assets/imgs/backgroud-default.jpg') no-repeat center center / cover`;
  } else {
    document.getElementById(
      'main-container'
    ).style.background = `rgba(0, 0, 0, 0.6) url('${urlImages[0]}') no-repeat center center / cover`;
  }
};

const setDataDish = (dish) => {
  const html = `
    <h1>${capitalize(dish.name)}</h1>
    <p>
      ${capitalize(dish.description)}
    </p>
  `;
  document.getElementById('image-content').innerHTML = html;
};
