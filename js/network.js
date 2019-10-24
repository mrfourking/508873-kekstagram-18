'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';

  /**
   * Функция загрузки данных с сервера
   * @param {function} onLoad - callback-функция, вызывающаяся при удачном запросе
   * @param {function} onError - callback-функция, вызывающаяся при неудачном запросе
   */
  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('GET', URL);
    xhr.send();

  };

  window.network = {
    loadData: loadData
  };
})();
