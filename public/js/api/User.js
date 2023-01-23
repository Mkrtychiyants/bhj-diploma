/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user"
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {

    localStorage.user = JSON.stringify(user)

  }
  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    delete localStorage.user;
  }
  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return JSON.parse(localStorage.getItem('user'));
  }
  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {

    createRequest({
      //url: 'http://localhost:8000', // адрес
      url: this.URL + '/current', // адрес
      method: 'GET', // метод запроса
      /*
        Функция, которая сработает после запроса.
        Если в процессе запроса произойдёт ошибка, её объект
        должен быть в параметре err.
        Если в запросе есть данные, они должны быть переданы в response.
      */
      callback: (err, resp) => {
        if (resp && resp.user) {
          this.setCurrent(resp.user);
        } if (resp && !resp.success) {
          this.unsetCurrent();
        } else if (err) {
          console.log("Callback err " + err)
        }
        callback(err, resp)
      }

    })

  }
  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      data,
      callback: (err, resp) => {
        if (resp && resp.user) {
          this.setCurrent(resp.user);
        }
        if (err) {
          alert("callback err", err)
        }
        callback(err, resp);
      }
    });
  }
  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      //url: 'http://localhost:8000', // адрес
      url: this.URL + '/register', // адрес
      data: data,
      method: 'POST', // метод запроса
      /*
        Функция, которая сработает после запроса.
        Если в процессе запроса произойдёт ошибка, её объект
        должен быть в параметре err.
        Если в запросе есть данные, они должны быть переданы в response.
      */
      callback: (err, resp) => {
        if (resp && resp.user) {
          this.setCurrent(resp.user);
        } 
         else {
          console.log('Callback err: ', err);
        };
        callback(err, resp);
      }
    })
  }
  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',

      callback: (err, resp) => {

        if (resp && resp.success) {
          this.unsetCurrent();
        }
        callback(err, resp);
      }
    });
  }
}
