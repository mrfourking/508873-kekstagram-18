'use strict';

(function () {
  /* Инициализация блока для заполнения и шаблона */
  var pictureBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  /**
   * Функция отрисовки фотографий на странице
   */
  var renderPhoto = function () {
    var fragment = document.createDocumentFragment();

    /* Клонируем содержимое шаблона, добавляем данные из массива
      объектов и записываем получившийся блок во фрагмент */
    for (var i = 0; i < window.data.photos.length; i++) {
      var picture = pictureTemplate.cloneNode(true);

      picture.querySelector('.picture__img').src = window.data.
        photos[i].url;
      picture.querySelector('.picture__likes').textContent = window.data.
        photos[i].likes;
      picture.querySelector('.picture__comments').textContent = window.data.
        photos[i].comments.length;

      fragment.appendChild(picture);
    }

    /* Присоединяем готовый фрагмент к блоку picture */
    pictureBlock.appendChild(fragment);
  };

  renderPhoto();

  window.render = {
    pictureBlock: pictureBlock
  };
})();
