'use strict';

(function () {
  var RANDOM_PHOTO_NUMBER = 10;

  var filterButtons = window.render.pictureFilter.querySelectorAll('.img-filters__button');

  /**
   * Функция отображения нажатой кнопки в фильтре изображений
   * @param {string} pressedButtonId - id нажатой кнопки
   */
  var setFilterButtonPressed = function (pressedButtonId) {
    filterButtons.forEach(function (item) {
      if (item.id === pressedButtonId) {
        item.classList.add('img-filters__button--active');
      } else {
        item.classList.remove('img-filters__button--active');
      }
    });
  };

  /**
   * Функция отрисовки 10 случайных фото из массива
   */
  var renderRandomPhotos = function () {
    var randomPhotos = [];
    var mixedPhotos = window.util.shuffleArray(window.render.defaultPhotos.slice());

    mixedPhotos.slice(0, RANDOM_PHOTO_NUMBER).forEach(function (item) {
      randomPhotos.push(item);
    });

    window.render.initPhoto(randomPhotos);
  };

  /**
   * Функция-callback для сортировки фото по убыванию комментариев
   * @param {Object} left - объект с параметрами фотографии
   * @param {Object} right - объект с параметрами фотографии
   * @return {Number} - число, разность между количеством соседних комментариев
   */
  var compareComments = function (left, right) {
    var difference = right.comments.length - left.comments.length;
    return difference;
  };

  /**
   * Функция отрисовки фото по количеству комментариев
   */
  var initPhotosByComments = function () {
    var array = window.render.defaultPhotos.slice().sort(compareComments);
    window.render.initPhoto(array);
  };

  /**
   * Функция обработчика нажатия на кнопки фильтра изображений
   * @param {Object} evt - объект Event
   */
  var filterPhotos = window.util.debounce(function (evt) {
    switch (evt.target.id) {
      case 'filter-popular':
        window.render.initPhoto(window.render.defaultPhotos);
        break;
      case 'filter-random':
        renderRandomPhotos();
        break;
      case 'filter-discussed':
        initPhotosByComments();
        break;
    }
  });

  filterButtons.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      setFilterButtonPressed(evt.target.id);
      filterPhotos(evt);
    });
  });
})();
