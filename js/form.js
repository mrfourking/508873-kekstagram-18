'use strict';

(function () {
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;

  var mainNode = document.querySelector('main');

  /* Инициализация формы загрузки изображения */
  var uploadFile = window.render.pictureBlock.querySelector('#upload-file');
  var uploadFileForm = window.render.pictureBlock.querySelector('.img-upload__form');
  var editFileForm = window.render.pictureBlock.querySelector('.img-upload__overlay');
  var editCloseButton = editFileForm.querySelector('#upload-cancel');
  var effectLevel = editFileForm.querySelector('.effect-level');

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

  var onSuccess = function () {
    closeEditForm();

    var successNode = successTemplate.cloneNode(true);
    mainNode.appendChild(successNode);
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

  uploadFileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.network.saveData(new FormData(uploadFileForm), onSuccess, window.render.onError);
  });

  window.form = {
    editFileForm: editFileForm,
    effectLevel: effectLevel
  };
})();
