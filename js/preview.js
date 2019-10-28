'use strict';

(function () {

  /* Инициализация блока полноразмерного просмотра изображения*/
  var pictures = window.render.pictureBlock.querySelectorAll('.picture');
  var bigPictureElement = document.querySelector('.big-picture');
  var bigCloseButton = bigPictureElement.querySelector('.big-picture__cancel');
  var commentsList = document.querySelector('.social__comments');
  var commentElement = commentsList.querySelector('.social__comment');

  /**
   * Функция отрисовки большого изображения
   * @param {object} photo - объект с полями информации о большой фотографии
   */
  var showBigPicture = function (photo) {
    bigPictureElement.classList.remove('hidden');

    /* Заполняем элемент контентом */
    bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
    bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
    bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
    bigPictureElement.querySelector('.social__caption').textContent = photo.description;

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photo.comments.length; i++) {
      var comment = commentElement.cloneNode(true);

      comment.querySelector('.social__picture').src = photo.comments[i].avatar;
      comment.querySelector('.social__picture').alt = photo.comments[i].name;
      comment.querySelector('.social__text').textContent = photo.comments[i].message;

      fragment.appendChild(comment);
    }

    /* Удаляем элементы по умолчанию */
    var children = commentsList.children;

    for (i = children.length - 1; i >= 0; i--) {
      commentsList.removeChild(children[i]);
    }

    commentsList.appendChild(fragment);

    bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPictureElement.querySelector('.comments-loader').classList.add('visually-hidden');
  };

  /**
   * Функция закрытия окна с большим изображением
   */
  var closeBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    bigCloseButton.removeEventListener('click', closeBigPicture);
    document.removeEventListener('keydown', onEscCloseBigPicture);
  };

  /**
   * Функция закрытия окна с большим изображением по нажатию на Esc
   * @param {object} evt - объект Event
   */
  var onEscCloseBigPicture = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  /**
   * Функция обертка обработчика, которая передает нужный индекс и
   * запускает процесс отрисовки большого изображения
   * @param {number} i - индекс нужного объекта в массиве photos
   * с описанием фото
   * @return {function} возвращает функцию обработчика
   */
  var onSmallPictureClick = function (i) {
    return function (evt) {
      evt.preventDefault();
      showBigPicture(window.render.photoDescriptions[i]);

      bigCloseButton.addEventListener('click', closeBigPicture);
      document.addEventListener('keydown', onEscCloseBigPicture);
    };
  };

  /**
   * Функция инициализации обработчиков для показа полноразмерного
   * изображения
   */
  var initPreview = function () {

    /* Ищем все сгенерированные изображения в разметке и
      вешает на них обработчики для открытия окна с большим фото */
    pictures = window.render.pictureBlock.querySelectorAll('.picture');

    for (var i = 0; i < pictures.length; i++) {
      pictures[i].addEventListener('click', onSmallPictureClick(i));
    }
  };

  setTimeout(initPreview, 1000);
})();
