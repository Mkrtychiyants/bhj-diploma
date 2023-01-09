/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {
  static URL = "/transaction";
  static list(data = {}, callback) {
    createRequest({
      url: this.URL + "?account_id=" + data.account_id,
      data: data,
      method: "GET",
      callback: callback,
    });
  }
  static remove(data, callback) {
    createRequest({
      url: this.URL,
      data: data,
      method: "DELETE",
      callback: callback,
    });
  }
}

