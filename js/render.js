'use strict';

(function () {
  /* Инициализация блока для заполнения и шаблона */
  var mainBlock = document.querySelector('main');
  var pictureBlock = document.querySelector('.pictures');
  var pictureFilter = mainBlock.querySelector('.img-filters');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  /**
   * Функция отрисовки фотографий на странице
   * @param {Object[]} photos - массив объектов с параметрами фотографий
   */
  var initPhoto = function (photos) {
    if (!window.render.defaultPhotos) {
      window.render.defaultPhotos = photos;
    }

    window.render.photos = photos;

    /* Удаляем фотографии в блоке */
    var children = Array.from(pictureBlock.children);

    children.forEach(function (item) {
      if (item.classList.contains('picture')) {
        pictureBlock.removeChild(item);
      }
    });

    /* Инициализируем DocumentFragment */
    var fragment = document.createDocumentFragment();

    /* Клонируем содержимое шаблона, добавляем данные из массива
      объектов и записываем получившийся блок во фрагмент */
    photos.forEach(function (item) {
      var picture = pictureTemplate.cloneNode(true);

      picture.querySelector('.picture__img').src = item.url;
      picture.querySelector('.picture__likes').textContent = item.likes;
      picture.querySelector('.picture__comments').textContent = item.comments.length;

      fragment.appendChild(picture);
    });

    /* Присоединяем готовый фрагмент к блоку picture */
    pictureBlock.appendChild(fragment);
    pictureFilter.classList.remove('img-filters--inactive');
  };

  /**
   * Функция обработчика закрытия блока с ошибкой
   */
  var onCloseErrorBlock = function () {
    var errorBlock = mainBlock.querySelector('.error');
    var errorButtons = errorBlock.querySelectorAll('.error__button');
    mainBlock.removeChild(errorBlock);

    errorButtons.forEach(function (item) {
      item.removeEventListener('click', onCloseErrorBlock);
    });

    document.removeEventListener('keydown', onEscCloseErrorBlock, true);
    document.removeEventListener('click', onClickCloseErrorBlock);
  };

  /**
   * Функция закрытия блока с ошибкой по нажатию клавиши Esc
   * @param {Object} evt - объект Event
   */
  var onEscCloseErrorBlock = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      onCloseErrorBlock();
      evt.stopPropagation();
    }
  };

  /**
   * Функция закрытия окна с ошибкой при клике по произвольной
   * области вне окна
   * @param {Object} evt - объект Event
   */
  var onClickCloseErrorBlock = function (evt) {
    var innerErrorBlock = mainBlock.querySelector('.error__inner');
    if (evt.target !== innerErrorBlock && !(innerErrorBlock.contains(evt.target))) {
      onCloseErrorBlock();
    }
  };

  /**
   * Функция вывода ошибок в отдельный блок
   * @param {string} errorText - строка с описанием ошибки
   */
  var onError = function (errorText) {
    var errorBlock = errorTemplate.cloneNode(true);
    var errorButtons = errorBlock.querySelectorAll('.error__button');

    errorBlock.querySelector('.error__title').textContent = errorText;
    errorBlock.style = 'z-index: 100;';

    mainBlock.appendChild(errorBlock);

    errorButtons.forEach(function (item) {
      item.addEventListener('click', onCloseErrorBlock);
    });

    document.addEventListener('keydown', onEscCloseErrorBlock, true);
    document.addEventListener('click', onClickCloseErrorBlock);
  };


  window.network.loadData(initPhoto, onError);

  window.render = {
    pictureBlock: pictureBlock,
    onError: onError,
    mainBlock: mainBlock,
    pictureFilter: pictureFilter,
    initPhoto: initPhoto
  };
})();
