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
   * @param {Array} array - массив, который необходимо перемешать
   * @return {Array} возвращает массив с перемешанными элементами
   */
  var shuffleArray = function (array) {
    array.forEach(function (item, index, newArray) {
      var randomIndex = getRandomElement(index, newArray.length);
      var temp = item;
      newArray[index] = newArray[randomIndex];
      newArray[randomIndex] = temp;
    });

    return array;
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
    isEscPressed: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },
    getRandomElement: getRandomElement,
    shuffleArray: shuffleArray,
    debounce: debounce
  };
})();
