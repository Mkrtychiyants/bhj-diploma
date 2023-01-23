/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */
  static URL = "/account/";



  static get(id = '', callback) {

    createRequest({
      //url: 'http://localhost:8000', // адрес
      url: this.URL + id, // адрес
      method: 'get', // метод запроса
      callback,

    })

  }
}