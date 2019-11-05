'use strict';

(function () {
  var ServerUrl = {
    LOAD: 'https://js.dump.academy/kekstagram/data',
    SAVE: 'https://js.dump.academy/kekstagram'
  };

  var SUCCESS_STATUS = 200;
  var XHR_TIMEOUT = 10000;

  /**
   * Функция инициализации запроса с первоначальными настройками
   * @param {function} onLoad - callback-функция, вызывающаяся при удачном запросе
   * @param {function} onError - callback-функция, вызывающаяся при неудачном запросе
   * @return {Object} возвращает экземляр объекта XMLHttpRequest
   */
  var generateRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
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

    xhr.timeout = XHR_TIMEOUT;

    return xhr;
  };

  /**
   * Функция загрузки данных с сервера
   * @param {function} onLoad - callback-функция, вызывающаяся при удачном запросе
   * @param {function} onError - callback-функция, вызывающаяся при неудачном запросе
   */
  var loadData = function (onLoad, onError) {
    var xhr = generateRequest(onLoad, onError);

    xhr.open('GET', ServerUrl.LOAD);
    xhr.send();

  };

  var saveData = function (data, onLoad, onError) {
    var xhr = generateRequest(onLoad, onError);

    xhr.open('POST', ServerUrl.SAVE);
    xhr.send(data);
  };

  window.network = {
    loadData: loadData,
    saveData: saveData
  };
})();
