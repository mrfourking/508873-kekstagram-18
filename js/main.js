'use strict';

var PHOTO_NUMBER = 25;
var AVATAR_NUMBER = 6;
var MAX_COMMENTS = 100;
var VISIBLE_COMMENTS = 5;
var ESC_KEYCODE = 27;
var SCALE_STEP = 25;
var MIN_SCALE = 25;
var MAX_SCALE = 100;

/* Инициализация блока для заполнения и шаблона */
var pictureBlock = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var bigPictureElement = document.querySelector('.big-picture');
var commentsList = document.querySelector('.social__comments');
var commentElement = commentsList.querySelector('.social__comment');

/* Инициализация формы загрузки изображения */
var uploadFile = pictureBlock.querySelector('#upload-file');
var uploadFileForm = pictureBlock.querySelector('.img-upload__overlay');
var editCloseButton = uploadFileForm.querySelector('#upload-cancel');
var imagePreview = uploadFileForm.querySelector('.img-upload__preview img');

/* Инициализация элементов масштабирования изображения */
var smallerScaleButton = uploadFileForm.querySelector('.scale__control--smaller');
var biggerScaleButton = uploadFileForm.querySelector('.scale__control--bigger');
var scaleField = uploadFileForm.querySelector('.scale__control--value');

var commentExamples = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var names = ['Артем', 'Мария', 'Виталий', 'Кекс', 'Прохор', 'Анастасия'];

/*  Функция генерации случайного целого числа в заданном диапазоне */
var getRandomElement = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/* Функция генерации массива комментариев */
var generateComments = function (commentsNumber) {
  var comments = [];

  for (var i = 0; i < commentsNumber; i++) {
    comments.push({
      avatar: 'img/avatar-' + getRandomElement(1, AVATAR_NUMBER) + '.svg',
      message: commentExamples[getRandomElement(0, commentExamples.length)],
      name: names[getRandomElement(0, names.length)]
    });
  }

  return comments;
};

/* Функция генерации массива объектов с описанием фотографий */
var generatePhotoDescription = function () {
  var photos = [];
  for (var i = 0; i < PHOTO_NUMBER; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomElement(15, 200),
      comments: generateComments(getRandomElement(0, MAX_COMMENTS))
    });
  }

  return photos;
};

/* Функция отрисовки большого изображения */
var showBigPicture = function (photo) {
  // bigPictureElement.classList.remove('hidden');

  /* Заполняем элемент контентом */
  bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
  bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
  bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = photo.description;

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < VISIBLE_COMMENTS; i++) {
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

/* Функция отрисовки фотографий на странице */
var renderPhoto = function () {
  var photos = generatePhotoDescription();

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

  showBigPicture(photos[0]);

  /* Присоединяем готовый фрагмент к блоку picture */
  pictureBlock.appendChild(fragment);
};

/* Функции открытия/закрытия формы загрузки изображений */
var onEscCloseForm = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    uploadFileForm.classList.add('hidden');
  }
};

var openEditForm = function () {
  uploadFileForm.classList.remove('hidden');
  document.addEventListener('keydown', onEscCloseForm);
};

var closeEditForm = function () {
  uploadFileForm.classList.add('hidden');
  document.removeEventListener('keydown', onEscCloseForm);
  uploadFile.value = '';
};

/* Функция масштабирования изображения */
var setImageScale = function (positiveFlag) {
  var currentScale = Number.parseInt(scaleField.value, 10);

  if (positiveFlag && (currentScale + SCALE_STEP) <= MAX_SCALE) {
    scaleField.value = (currentScale + SCALE_STEP) + '%';
    imagePreview.style.transform = 'scale(' + (currentScale + SCALE_STEP) / 100 + ')';
  } else {
    if (!positiveFlag && (currentScale - SCALE_STEP) >= MIN_SCALE) {
      scaleField.value = (currentScale - SCALE_STEP) + '%';
      imagePreview.style.transform = 'scale(' + (currentScale - SCALE_STEP) / 100 + ')';
    }
  }
};

/* Обработчики событий открытия/закрытия
  формы загрузки изображений */
uploadFile.addEventListener('change', function () {
  openEditForm();
});

editCloseButton.addEventListener('click', function () {
  closeEditForm();
});

/* Обработчики кнопок масштабирования изображения */
smallerScaleButton.addEventListener('click', function () {
  var positiveFlag = false;
  setImageScale(positiveFlag);
});

biggerScaleButton.addEventListener('click', function () {
  var positiveFlag = true;
  setImageScale(positiveFlag);
});

renderPhoto();
