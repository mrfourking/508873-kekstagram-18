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

  /**
   * Функция перемешивания элементов массива в случайном порядке
   * @param {Array} arr - массив, который необходимо перемешать
   * @return {Array} возвращает массив с перемешанными элементами
   */
  var shuffleArray = function (arr) {
    arr.forEach(function (item, index, array) {
      var j = getRandomElement(index, array.length);
      var temp = item;
      array[index] = array[j];
      array[j] = temp;
    });

    return arr;
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
    debounce: debounce
  };
})();
