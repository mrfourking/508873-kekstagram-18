'use strict';

(function () {
  var PHOTO_NUMBER = 25;
  var AVATAR_NUMBER = 6;
  var MAX_COMMENTS = 100;

  var photos = [];

  var commentExamples = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var names = ['Артем', 'Мария', 'Виталий', 'Кекс', 'Прохор', 'Анастасия'];

  /**
   * Функция генерации массива комментариев
   * @param {number} commentsNumber - число комментариев
   * @return {array} массив объектов с коммментариями
   */
  var generateComments = function (commentsNumber) {
    var comments = [];

    for (var i = 0; i < commentsNumber; i++) {
      comments.push({
        avatar: 'img/avatar-' + window.util.getRandomElement(1, AVATAR_NUMBER) + '.svg',
        message: commentExamples[window.util.getRandomElement(0, commentExamples.length)],
        name: names[window.util.getRandomElement(0, names.length)]
      });
    }

    return comments;
  };

  /**
   * Функция генерации массива объектов с описанием фотографий
   * @return {array} массив объектов с фотографиями
   */
  var generatePhotoDescription = function () {
    for (var i = 0; i < PHOTO_NUMBER; i++) {
      photos.push({
        url: 'photos/' + (i + 1) + '.jpg',
        description: 'Описание фотографии',
        likes: window.util.getRandomElement(15, 200),
        comments: generateComments(window.util.getRandomElement(0, MAX_COMMENTS))
      });
    }

    return photos;
  };

  window.data = {
    photos: photos = generatePhotoDescription()
  };

})();
