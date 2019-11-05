'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  /**
  * Функция генерации случайного целого числа в заданном диапазоне
  * @param {number} min - нижняя граница диапазона
  * @param {number} max - верхняя граница диапазона
  * @return {number} случайное число из заданного диапазона
 */
  var getRandomElement = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };


  var shuffleArray = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }

    return arr;
  };


  /**
   * Функция генерации массива неповторяющихся целых чисел в заданном диапазоне
   * @param {Number} min - нижняя граница диапазона
   * @param {Number} max - верхняя граница диапазона
   * @return {Number[]} - массив с целыми числами
   */
  var getRandomUniqueArray = function (min, max) {
    var arr = [];

    /* Заполняем массив числами из заданного диапазона */
    for (var i = 0; i < (max - min); i++) {
      arr.push(min + i);
    }

    /* Меняем элементы местами */
    return shuffleArray(arr);
  };

  /**
   * Функция, выполняющая задержку функции, передаваемой в параметре,
   * для устранение "дрезбезга" при отрисовке страницы
   * @param {function} callback - функция
   * @return {function}
   */
  var debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var params = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, params);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    getRandomElement: getRandomElement,
    shuffleArray: shuffleArray,
    getRandomUniqueArray: getRandomUniqueArray,
    debounce: debounce
  };
})();
