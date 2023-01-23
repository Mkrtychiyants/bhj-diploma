/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {

  static URL = "";

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data = {}, callback) {
    let newUrl = this.URL;
    if (this.URL === "/transaction") {
      newUrl = this.URL + "?account_id=" + data.account_id;
    }
    if (this.URL === "/account") {
      newUrl = this.URL + data;
    }

    createRequest({
      url: newUrl,
      data: data,
      method: "GET",
      callback: callback,
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    createRequest({
      url: this.URL,
      data: data,
      method: "PUT",
      callback: callback,
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {

    let formData = new FormData;
    for (const iterator in data) {
      formData.append(`${iterator}`, `${data[iterator]}`);
    }


    //formData.append( 'password', 'odinodin'  );

    createRequest({
      url: this.URL,
      data: formData,
      method: "DELETE",
      callback: callback,
    });
  }
}

