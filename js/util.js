'use strict';

(function () {
  var ESC_KEYCODE = 27;

  /**
  * Функция генерации случайного целого числа в заданном диапазоне
  * @param {number} min - нижняя граница диапазона
  * @param {number} max - верхняя граница диапазона
  * @return {number} случайное число из заданного диапазона
 */
  var getRandomElement = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    getRandomElement: getRandomElement
  };
})();
