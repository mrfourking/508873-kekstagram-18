'use strict';

(function () {
  /* Инициализация блока для заполнения и шаблона */
  var mainBlock = document.querySelector('main');
  var pictureBlock = document.querySelector('.pictures');
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
  var renderPhoto = function (photos) {
    window.render.photoDescriptions = photos;

    var fragment = document.createDocumentFragment();

    /* Клонируем содержимое шаблона, добавляем данные из массива
      объектов и записываем получившийся блок во фрагмент */
    for (var i = 0; i < photos.length; i++) {
      var picture = pictureTemplate.cloneNode(true);

      picture.querySelector('.picture__img').src = photos[i].url;
      picture.querySelector('.picture__likes').textContent = photos[i].likes;
      picture.querySelector('.picture__comments').textContent = photos[i].comments.length;

      fragment.appendChild(picture);
    }

    /* Присоединяем готовый фрагмент к блоку picture */
    pictureBlock.appendChild(fragment);
  };

  /**
   * Функция обработчика закрытия блока с ошибкой
   */
  var closeErrorBlock = function () {
    var errorBlock = mainBlock.querySelector('.error');
    var errorButtons = errorBlock.querySelectorAll('.error__button');
    mainBlock.removeChild(errorBlock);

    for (var i = 0; i < errorButtons.length; i++) {
      errorButtons[i].removeEventListener('click', closeErrorBlock);
    }
    document.removeEventListener('keydown', onEscCloseErrorBlock, true);
    document.removeEventListener('click', onClickCloseErrorBlock);
  };

  /**
   * Функция закрытия блока с ошибкой по нажатию клавиши Esc
   * @param {Object} evt - объект Event
   */
  var onEscCloseErrorBlock = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeErrorBlock();
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
      closeErrorBlock();
    }
  };

  var onError = function (errorText) {
    var errorBlock = errorTemplate.cloneNode(true);
    var errorButtons = errorBlock.querySelectorAll('.error__button');

    errorBlock.querySelector('.error__title').textContent = errorText;
    errorBlock.style = 'z-index: 100;';

    mainBlock.appendChild(errorBlock);

    for (var i = 0; i < errorButtons.length; i++) {
      errorButtons[i].addEventListener('click', closeErrorBlock);
    }

    document.addEventListener('keydown', onEscCloseErrorBlock, true);
    document.addEventListener('click', onClickCloseErrorBlock);
  };


  window.network.loadData(renderPhoto, onError);

  window.render = {
    pictureBlock: pictureBlock,
    onError: onError,
    mainBlock: mainBlock
  };
})();
