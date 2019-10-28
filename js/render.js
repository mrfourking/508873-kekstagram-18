'use strict';

(function () {
  /* Инициализация блока для заполнения и шаблона */
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

  var onError = function (errorText) {
    var errorNode = errorTemplate.cloneNode(true);

    errorNode.querySelector('.error__title').textContent = errorText;

    pictureBlock.appendChild(errorNode);
  };


  window.network.loadData(renderPhoto, onError);

  window.render = {
    pictureBlock: pictureBlock
  };
})();
