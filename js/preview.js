'use strict';

(function () {
  var COMMENTS_DEFAULT_NUMBER = 5;

  /* Инициализация блока полноразмерного просмотра изображения*/
  var bigPictureBlock = document.querySelector('.big-picture');
  var bigCloseButton = bigPictureBlock.querySelector('.big-picture__cancel');
  var commentsList = document.querySelector('.social__comments');
  var commentTemplate = commentsList.querySelector('.social__comment');
  var commentLoadButton = bigPictureBlock.querySelector('.comments-loader');
  var commentCounter = bigPictureBlock.querySelector('.social__comment-count');

  var currentComments;

  /**
   * Функция загрузки дополнительных комментариев
   * @param {Object[]} comments - массив объектов с текущими комментариями
   * @return {function} возвращает функцию, которая выполнит приватные методы
   */
  var showComments = function (comments) {
    var privateCounter = 0;

    /**
     * Метод для установки счетчика открытых комментариев и
     * сокрытия кнопки со счетчиком
     */
    var setCommentCounter = function () {
      if (privateCounter < comments.length) {
        var counterString = commentCounter.innerHTML;
        counterString = privateCounter + counterString.slice(counterString.indexOf(' '));
        commentCounter.innerHTML = counterString;
      } else {
        commentCounter.classList.add('visually-hidden');
        commentLoadButton.classList.add('visually-hidden');
      }
    };

    /**
     * Метод отрисовки комментариев в окне полноэкранного просмотра фотографий
     */
    var renderComments = function () {
      var fragment = document.createDocumentFragment();

      if (privateCounter <= comments.length) {
        comments.slice(privateCounter, privateCounter + COMMENTS_DEFAULT_NUMBER)
          .forEach(function (item) {
            var comment = commentTemplate.cloneNode(true);

            comment.querySelector('.social__picture').src = item.avatar;
            comment.querySelector('.social__picture').alt = item.name;
            comment.querySelector('.social__text').textContent = item.message;

            fragment.appendChild(comment);
          });

        privateCounter += COMMENTS_DEFAULT_NUMBER;
        setCommentCounter();
      }

      commentsList.appendChild(fragment);
    };

    return {
      show: function () {
        renderComments();
      }
    };
  };

  /**
   * Функция нажатия на кнопку загрузки комментариев
   */
  var onCommentButtonClick = function () {
    currentComments.show();
  };

  /**
   * Функция отрисовки большого изображения
   * @param {object} photo - объект с полями информации о большой фотографии
   */
  var showBigPicture = function (photo) {
    bigPictureBlock.classList.remove('hidden');

    currentComments = showComments(photo.comments);

    /* Удаляем комментарии по умолчанию */
    var children = Array.from(commentsList.children);

    children.forEach(function (item) {
      commentsList.removeChild(item);
    });

    /* Заполняем элемент контентом */
    bigPictureBlock.querySelector('.big-picture__img img').src = photo.url;
    bigPictureBlock.querySelector('.likes-count').textContent = photo.likes;
    bigPictureBlock.querySelector('.comments-count').textContent = photo.comments.length;
    bigPictureBlock.querySelector('.social__caption').textContent = photo.description;

    /* Отрисовываем первую порцию комментариев */
    currentComments.show();

    /* обработчик нажатия на кнопку загрузки комментариев */
    commentLoadButton.addEventListener('click', onCommentButtonClick);

    bigCloseButton.addEventListener('click', onBigCloseButtonClick);
    document.addEventListener('keydown', onBigPictureKeydown);

    document.body.classList.add('modal-open');
  };

  /**
   * Функция закрытия окна с большим изображением
   */
  var closeBigPicture = function () {
    commentCounter.classList.remove('visually-hidden');
    commentLoadButton.classList.remove('visually-hidden');
    bigPictureBlock.classList.add('hidden');

    bigCloseButton.removeEventListener('click', onBigCloseButtonClick);
    document.removeEventListener('keydown', onBigPictureKeydown);
    commentLoadButton.removeEventListener('click', onCommentButtonClick);

    document.body.classList.remove('modal-open');
  };

  /**
   * Функция обработчика нажатия на кнопку закрытия
   * блока полноэкранного просмотра
   */
  var onBigCloseButtonClick = function () {
    closeBigPicture();
  };

  /**
   * Функция закрытия окна с большим изображением по нажатию на Esc
   * @param {object} evt - объект Event
   */
  var onBigPictureKeydown = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closeBigPicture();
    }
  };

  window.preview = {
    showBigPicture: showBigPicture
  };
})();
