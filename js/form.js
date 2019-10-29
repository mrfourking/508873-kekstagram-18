'use strict';

(function () {
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;

  /* Инициализация формы загрузки изображения */
  var uploadFile = window.render.pictureBlock.querySelector('#upload-file');
  var uploadFileForm = window.render.pictureBlock.querySelector('.img-upload__form');
  var editFileForm = window.render.pictureBlock.querySelector('.img-upload__overlay');
  var editCloseButton = editFileForm.querySelector('#upload-cancel');
  var effectLevel = editFileForm.querySelector('.effect-level');
  var effectInput = effectLevel.querySelector('.effect-level__value');

  /* Инициализация поля ввода хэш-тега и комментариев*/
  var hashtagInput = editFileForm.querySelector('.text__hashtags');
  var commentTextArea = editFileForm.querySelector('.text__description');

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  /**
   * Функция закрытия формы загрузки изображений
   * @param {object} evt - объект Event
   */
  var closeEditForm = function () {
    editFileForm.classList.add('hidden');
    document.removeEventListener('keydown', onEscCloseForm);
    uploadFile.value = '';
  };

  /**
   * Функция закрытия формы загрузки изображений по нажатию на Esc
   * @param {object} evt - объект Event
   */
  var onEscCloseForm = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeEditForm();
    }
  };

  /**
   * Функция открытия формы загрузки изображений
   * @param {object} evt - объект Event
   */
  var openEditForm = function () {
    editFileForm.classList.remove('hidden');
    effectInput.value = '0';
    document.addEventListener('keydown', onEscCloseForm);
    effectLevel.classList.add('hidden');
  };

  /**
   * Функция поиска дубликатов
   * @param {array} hashtags - массив строк хэш-тегов
   * @return {boolean} флаг, который показывает был ли найден дубликат
   */
  var searchForDuplicate = function (hashtags) {
    var duplicateFlag = false;

    for (var i = 0; i < hashtags.length; i++) {
      for (var j = i + 1; j < hashtags.length; j++) {
        if (hashtags[i].indexOf(hashtags[j]) > -1) {
          duplicateFlag = true;
          return duplicateFlag;
        }
      }
    }

    return duplicateFlag;
  };

  /**
   * Функция валидации хэш-тегов
   */
  var validateHashtags = function () {
    var hashtags = hashtagInput.value.toLowerCase().split(' ');

    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== '#') {
        hashtagInput.setCustomValidity('Хэш-тег должен начинатсья с символа #');
      } else if (hashtags[i].length === 1) {
        hashtagInput.setCustomValidity('Хэш-тег не может состоять из одного символа #');
      } else if (hashtags[i].indexOf('#', 1) > -1) {
        hashtagInput.setCustomValidity('Хэш-теги должны быть разделены пробелом');
      } else if (searchForDuplicate(hashtags)) {
        hashtagInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      } else if (hashtags.length > MAX_HASHTAGS) {
        hashtagInput.setCustomValidity('Максимальное число тегов: ' + MAX_HASHTAGS);
      } else if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
        hashtagInput.setCustomValidity('Максимальная длина хэш-тэга: ' + MAX_HASHTAG_LENGTH + ' символов');
      } else {
        hashtagInput.setCustomValidity('');
      }
    }
  };

  /**
   * Функция закрытия окна с сообщением об удачной загрузке фото
   */
  var closeSuccessBlock = function () {
    var successBlock = window.render.mainBlock.querySelector('.success');
    var successButton = successBlock.querySelector('.success__button');
    window.render.mainBlock.removeChild(successBlock);

    document.removeEventListener('keydown', onEscCloseSuccessBlock);
    successButton.removeEventListener('click', closeSuccessBlock);
    document.removeEventListener('click', onClickCloseSuccessBlock);

    uploadFileForm.reset();
  };

  /**
   * Функция закрытия окна с сообщением об удачной загрузке фото
   * по нажатию на кнопку Esc
   * @param {Object} evt - объект Event
   */
  var onEscCloseSuccessBlock = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeSuccessBlock();
    }
  };

  /**
   * Функция закрытия окна с сообщением об удачной загрузке фото
   * при клике по произвольной области вне окна
   * @param {Object} evt - объект Event
   */
  var onClickCloseSuccessBlock = function (evt) {
    var innerSuccessBlock = window.render.mainBlock.querySelector('.success__inner');
    if (evt.target !== innerSuccessBlock && !(innerSuccessBlock.contains(evt.target))) {
      closeSuccessBlock();
    }
  };

  /**
   * Функция callback, которая выводит сообщение при удачной
   * отправке запроса
   */
  var onSuccess = function () {
    closeEditForm();

    var successBlock = successTemplate.cloneNode(true);
    var successButton = successBlock.querySelector('.success__button');

    window.render.mainBlock.appendChild(successBlock);

    document.addEventListener('keydown', onEscCloseSuccessBlock);
    successButton.addEventListener('click', closeSuccessBlock);
    document.addEventListener('click', onClickCloseSuccessBlock);
  };

  /* Обработчики событий открытия/закрытия
    формы загрузки изображений */
  uploadFile.addEventListener('change', function () {
    openEditForm();
  });

  editCloseButton.addEventListener('click', function () {
    closeEditForm();
  });

  /* Обработчик валидации поля с хэш-тегами */
  hashtagInput.addEventListener('change', function () {
    validateHashtags();
  });

  /* Обработчики, прерывающие/восстанавливающие обработчик закрытия формы */
  hashtagInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscCloseForm);
  });

  hashtagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onEscCloseForm);
  });

  commentTextArea.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscCloseForm);
  });

  commentTextArea.addEventListener('blur', function () {
    document.addEventListener('keydown', onEscCloseForm);
  });

  /* Обработчик кнопки отправки формы */
  uploadFileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.network.saveData(new FormData(uploadFileForm), onSuccess, window.render.onError);
  });

  window.form = {
    editFileForm: editFileForm,
    effectLevel: effectLevel,
    effectInput: effectInput
  };
})();
