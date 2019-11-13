'use strict';

(function () {
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PREVIEW_DEFAULT_URL = 'img/upload-default-image.jpg';

  /* Инициализация формы загрузки изображения */
  var uploadFile = window.render.pictureBlock
    .querySelector('#upload-file');
  var uploadFileForm = window.render.pictureBlock
    .querySelector('.img-upload__form');
  var editFile = window.render.pictureBlock
    .querySelector('.img-upload__overlay');
  var preview = editFile.querySelector('.img-upload__preview img');
  var editCloseButton = editFile.querySelector('#upload-cancel');
  var effectLevel = editFile.querySelector('.effect-level');
  var effectInput = effectLevel.querySelector('.effect-level__value');

  /* Инициализация поля ввода хэш-тега и комментариев*/
  var hashtagInput = editFile.querySelector('.text__hashtags');
  var commentTextArea = editFile.querySelector('.text__description');

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  /**
   * Функция закрытия формы загрузки изображений
   * @param {object} evt - объект Event
   */
  var closeEditForm = function () {
    editFile.classList.add('hidden');

    document.removeEventListener('keydown', onUploadFileFormKeydown);

    /* Сбрасываем значения формы */
    uploadFile.value = '';
    preview.removeAttribute('style');
    preview.removeAttribute('class');
    preview.src = PREVIEW_DEFAULT_URL;
    effectInput.setAttribute('value', 0);

    uploadFileForm.reset();
  };

  /**
   * Функция закрытия формы загрузки изображений по нажатию на Esc
   * @param {object} evt - объект Event
   */
  var onUploadFileFormKeydown = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closeEditForm();
    }
  };

  /**
   * Функция открытия формы загрузки изображений
   * @param {object} evt - объект Event
   */
  var openEditForm = function () {
    editFile.classList.remove('hidden');
    effectInput.setAttribute('value', 0);
    document.addEventListener('keydown', onUploadFileFormKeydown);
    effectLevel.classList.add('hidden');
  };

  /**
   * Функция проверки массива на наличие дубликатов
   * @param {Array} array - входной массив
   * @return {boolean} - возвращает true если элементы массива уникальны,
   * false - если элементы дублируются
   */
  var searchForDuplicates = function (array) {
    var newArray = array.slice().filter(function (item, index, innerArray) {
      return innerArray.indexOf(item) === index;
    });

    return array.length === newArray.length;
  };

  /**
   * Функция валидации хэш-тегов
   */
  var validateHashtags = function () {
    var hashtags = hashtagInput.value.toLowerCase().split(' ');

    hashtags.forEach(function (item, index, innerArray) {
      if (item[0] !== '#') {
        hashtagInput.setCustomValidity('Хэш-тег должен начинатсья с символа #');
        hashtagInput.style.borderColor = 'red';
      } else if (item.length === 1) {
        hashtagInput.setCustomValidity('Хэш-тег не может состоять из одного символа #');
        hashtagInput.style.borderColor = 'red';
      } else if (item.indexOf('#', 1) > -1) {
        hashtagInput.setCustomValidity('Хэш-теги должны быть разделены пробелом');
        hashtagInput.style.borderColor = 'red';
      } else if (!searchForDuplicates(innerArray)) {
        hashtagInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
        hashtagInput.style.borderColor = 'red';
      } else if (innerArray.length > MAX_HASHTAGS) {
        hashtagInput.setCustomValidity('Максимальное число тегов: ' + MAX_HASHTAGS);
        hashtagInput.style.borderColor = 'red';
      } else if (item.length > MAX_HASHTAG_LENGTH) {
        hashtagInput.setCustomValidity('Максимальная длина хэш-тэга: ' + MAX_HASHTAG_LENGTH + ' символов');
        hashtagInput.style.borderColor = 'red';
      } else {
        hashtagInput.setCustomValidity('');
        hashtagInput.style.borderColor = 'rgb(238, 238, 238)';
      }
    });
  };

  /**
   * Функция закрытия окна с сообщением об удачной загрузке фото
   */
  var closeSuccessBlock = function () {
    var successBlock = window.render.mainBlock.querySelector('.success');
    var successButton = successBlock.querySelector('.success__button');
    window.render.mainBlock.removeChild(successBlock);

    document.removeEventListener('keydown', onSuccessBlockKeydown);
    successButton.removeEventListener('click', onSuccessButtonClick);
    document.removeEventListener('click', onSuccessBlockClick);
  };

  var onSuccessButtonClick = function () {
    closeSuccessBlock();
  };

  /**
   * Функция закрытия окна с сообщением об удачной загрузке фото
   * по нажатию на кнопку Esc
   * @param {Object} evt - объект Event
   */
  var onSuccessBlockKeydown = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closeSuccessBlock();
    }
  };

  /**
   * Функция закрытия окна с сообщением об удачной загрузке фото
   * при клике по произвольной области вне окна
   * @param {Object} evt - объект Event
   */
  var onSuccessBlockClick = function (evt) {
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

    document.addEventListener('keydown', onSuccessBlockKeydown);
    successButton.addEventListener('click', onSuccessButtonClick);
    document.addEventListener('click', onSuccessBlockClick);
  };

  /**
   * Функция рендера загружаемого изображения в окно редактирования
   */
  var onUploadFileChange = function () {
    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var imageFileType = FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (imageFileType) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

    openEditForm();
  };

  /* Обработчики событий открытия/закрытия
    формы загрузки изображений */
  uploadFile.addEventListener('change', onUploadFileChange);

  editCloseButton.addEventListener('click', function () {
    closeEditForm();
  });

  /* Обработчик валидации поля с хэш-тегами */
  hashtagInput.addEventListener('change', function () {
    validateHashtags();
  });

  /* Обработчики, прерывающие/восстанавливающие обработчик закрытия формы */
  hashtagInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadFileFormKeydown);
  });

  hashtagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadFileFormKeydown);
  });

  commentTextArea.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadFileFormKeydown);
  });

  commentTextArea.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadFileFormKeydown);
  });

  /* Обработчик кнопки отправки формы */
  uploadFileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.network.saveData(new FormData(uploadFileForm), onSuccess, window.render.onError);
  });

  window.form = {
    editFile: editFile,
    effectLevel: effectLevel,
    effectInput: effectInput,
    uploadFile: uploadFile,
    preview: preview
  };
})();
