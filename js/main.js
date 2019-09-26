'use strict';

var PHOTO_NUMBER = 25;
var AVATAR_NUMBER = 6;
var MAX_COMMENTS = 5;

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

/* Функция отрисовки фотографий на странице */
var renderPhoto = function () {

  /* Инициализируем блок для заполнения и шаблон */
  var pictureBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var photos = generatePhotoDescription();

  var fragment = document.createDocumentFragment();

  /* Клонируем содержимое шаблона, добавляем данные из массива объектов
     и записываем получившийся блок во фрагмент */
  for (var i = 0; i < photos.length; i++) {
    var picture = pictureTemplate.cloneNode(true);

    picture.querySelector('.picture__img').src = photos[i].url;
    picture.querySelector('.picture__likes').textContent = photos[i].likes;
    picture.querySelector('.picture__comments').textContent = photos[i].comments.length;

    fragment.appendChild(picture);
  }

  /* Присоединяем готовый фрагмент к блоку picture */
  pictureBlock.appendChild(fragment);
};

renderPhoto();
