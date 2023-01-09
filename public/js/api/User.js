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
    if (localStorage.user) {
      try {
        return JSON.parse(localStorage.user);
      } catch (error) {
        return null;
      }

    } else {
      return undefined
    }
  }
  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {

    createRequest({
      //url: 'http://localhost:8000', // адрес
      url: '/user/current', // адрес
      method: 'get', // метод запроса
      /*
        Функция, которая сработает после запроса.
        Если в процессе запроса произойдёт ошибка, её объект
        должен быть в параметре err.
        Если в запросе есть данные, они должны быть переданы в response.
      */
      callback(err, resp) {
        if (resp && resp.user) {
          User.setCurrent(resp.user);
        } if (resp && !resp.success) {
          User.unsetCurrent();
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
      url: User.URL + '/login',
      method: 'POST',
      // responseType: 'json',
      data,
      callback: (err, resp) => {
        if (resp && resp.user) {
          this.setCurrent(resp.user);
        }
        if (resp && !resp.success) {
          alert(resp.error);
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
      url: '/user/register', // адрес
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
          console.log("reg.success: ");
          console.log(resp.success);
        } if (!resp.success) {
          console.log("resp.success:" + resp.success);
        } else {
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
        if (!resp.success) {
          alert("callback err", err)
        }
        callback(err, resp);
      }
    });
  }
}
