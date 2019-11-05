'use strict';

(function () {
  var RANDOM_PHOTO_NUMBER = 10;

  var filterButtons = window.render.pictureFilter.querySelectorAll('.img-filters__button');

  /**
   * Функция отображения нажатой кнопки в фильтре изображений
   * @param {string} pressedButtonId - id нажатой кнопки
   */
  var setFilterButtonPressed = function (pressedButtonId) {
    for (var i = 0; i < filterButtons.length; i++) {
      if (filterButtons[i].id === pressedButtonId) {
        filterButtons[i].classList.add('img-filters__button--active');
      } else {
        filterButtons[i].classList.remove('img-filters__button--active');
      }
    }
  };

  /**
   * Функция отрисовки 10 случайных фото из массива
   */
  var renderRandomPhotos = function () {
    var randomPhotos = [];
    var arr = window.util.shuffleArray(window.render.defaultPhotos.slice());

    for (var i = 0; i < RANDOM_PHOTO_NUMBER; i++) {
      randomPhotos.push(arr[i]);
    }

    window.render.renderPhoto(randomPhotos);
  };

  /**
   * Функция-callback для сортировки фото по убыванию комментариев
   * @param {Object} left - объект с параметрами фотографии
   * @param {Object} right - объект с параметрами фотографии
   * @return {Number} - число, разность между количеством соседних комментариев
   */
  var compareComments = function (left, right) {
    var diff = right.comments.length - left.comments.length;
    return diff;
  };

  /**
   * Функция отрисовки фото по количеству комментариев
   */
  var renderPhotosByComments = function () {
    var arr = window.render.defaultPhotos.slice().sort(compareComments);
    window.render.renderPhoto(arr);
  };

  /**
   * Функция обработчика нажатия на кнопки фильтра изображений
   * @param {Object} evt - объект Event
   */
  var onFilterButtonClick = window.util.debounce(function (evt) {
    switch (evt.target.id) {
      case 'filter-popular':
        window.render.renderPhoto(window.render.defaultPhotos);
        window.preview.initPreview();
        break;
      case 'filter-random':
        renderRandomPhotos();
        window.preview.initPreview();
        break;
      case 'filter-discussed':
        renderPhotosByComments();
        window.preview.initPreview();
        break;
    }
  });

  for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function (evt) {
      setFilterButtonPressed(evt.target.id);
      onFilterButtonClick(evt);
    });
  }
})();
