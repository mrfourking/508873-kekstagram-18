'use strict';

(function () {
  var COMMENTS_DEFAULT_NUMBER = 5;

  /* Инициализация блока полноразмерного просмотра изображения*/
  var pictures = window.render.pictureBlock.querySelectorAll('.picture');
  var bigPictureElement = document.querySelector('.big-picture');
  var bigCloseButton = bigPictureElement.querySelector('.big-picture__cancel');
  var commentsList = document.querySelector('.social__comments');
  var commentElement = commentsList.querySelector('.social__comment');
  var commentLoadButton = bigPictureElement.querySelector('.comments-loader');
  var commentCounter = bigPictureElement.querySelector('.social__comment-count');

  var currentComments;

  /**
   * Функция загрузки дополнительных комментариев
   */
  var showComments = function () {
    var fragment = document.createDocumentFragment();
    var children = Array.from(commentsList.children);

    /* Если разница между показанными комментариями и их общим
      количеством больше заданной порции комментариев, то рендерим
      еще одну порцию */
    if (currentComments.length - children.length > COMMENTS_DEFAULT_NUMBER) {
      currentComments.slice(children.length, children.length + COMMENTS_DEFAULT_NUMBER)
        .forEach(function (item) {
          var comment = commentElement.cloneNode(true);

          comment.querySelector('.social__picture').src = item.avatar;
          comment.querySelector('.social__picture').alt = item.name;
          comment.querySelector('.social__text').textContent = item.message;

          fragment.appendChild(comment);
        });

      commentsList.appendChild(fragment);

      /* Прибавляем счетчик отображенных комментариев */
      var str = commentCounter.innerHTML;
      var index = str.indexOf(' ');
      str = (children.length + COMMENTS_DEFAULT_NUMBER) + str.slice(index);
      commentCounter.innerHTML = str;

    } else {
      /* Если разница отображенных комментариев с их общим числом
      меньше порции, то рендерим остаток и скрываем счетчик и кнопку
      загрузки комментариев */
      currentComments.slice(children.length, currentComments.length)
        .forEach(function (item) {
          var comment = commentElement.cloneNode(true);

          comment.querySelector('.social__picture').src = item.avatar;
          comment.querySelector('.social__picture').alt = item.name;
          comment.querySelector('.social__text').textContent = item.message;

          fragment.appendChild(comment);
        });

      commentsList.appendChild(fragment);
      commentLoadButton.classList.add('visually-hidden');
      commentCounter.classList.add('visually-hidden');
    }
  };

  /**
   * Функция отрисовки большого изображения
   * @param {object} photo - объект с полями информации о большой фотографии
   */
  var showBigPicture = function (photo) {
    bigPictureElement.classList.remove('hidden');

    currentComments = photo.comments;

    /* Удаляем комментарии по умолчанию */
    var children = Array.from(commentsList.children);

    children.forEach(function (item) {
      commentsList.removeChild(item);
    });

    /* Заполняем элемент контентом */
    bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
    bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
    bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
    bigPictureElement.querySelector('.social__caption').textContent = photo.description;

    var fragment = document.createDocumentFragment();

    /* Если число комментариев меньше заданной порции, то рендерим
    их и скрываем счетчик отображенных комментариев и кнопку загрузки */
    if (currentComments.length <= COMMENTS_DEFAULT_NUMBER) {
      currentComments.forEach(function (item) {
        var comment = commentElement.cloneNode(true);

        comment.querySelector('.social__picture').src = item.avatar;
        comment.querySelector('.social__picture').alt = item.name;
        comment.querySelector('.social__text').textContent = item.message;

        fragment.appendChild(comment);
      });

      commentCounter.classList.add('visually-hidden');
      commentLoadButton.classList.add('visually-hidden');

    } else {
      /* Если число комментариев больше заданной порции, то рендерим
      первую порцию, задаем счетчик отображенных комментариев и
      инициализируем обработчик нажатия на кнопку загрузки комментариев */
      currentComments.slice(0, COMMENTS_DEFAULT_NUMBER)
        .forEach(function (item) {
          var comment = commentElement.cloneNode(true);

          comment.querySelector('.social__picture').src = item.avatar;
          comment.querySelector('.social__picture').alt = item.name;
          comment.querySelector('.social__text').textContent = item.message;

          fragment.appendChild(comment);
        });

      var str = commentCounter.innerHTML;
      var index = str.indexOf(' ');
      str = COMMENTS_DEFAULT_NUMBER + str.slice(index);
      commentCounter.innerHTML = str;

      /* обработчик нажатия на кнопку загрузки комментариев */
      commentLoadButton.addEventListener('click', showComments);
    }

    /* Присоединяем фрагмент к блоку */
    commentsList.appendChild(fragment);
  };

  /**
   * Функция закрытия окна с большим изображением
   */
  var closeBigPicture = function () {
    commentCounter.classList.remove('visually-hidden');
    commentLoadButton.classList.remove('visually-hidden');
    bigPictureElement.classList.add('hidden');
    bigCloseButton.removeEventListener('click', closeBigPicture);
    document.removeEventListener('keydown', onEscCloseBigPicture);
    commentLoadButton.removeEventListener('click', showComments);
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
      showBigPicture(window.render.photos[i]);

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

  window.preview = {
    initPreview: initPreview
  };
})();
