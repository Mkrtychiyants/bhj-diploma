/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest;

    xhr.responseType = "json";

    try{
        xhr.open(options.method,  options.url);
        xhr.send(options.data);
    } catch (error) {
        console.log(error);
    }


    xhr.addEventListener("load", ()=>{
        if ((xhr.status === 200)){
            options.callback(null,xhr.response);    
        }else{
            let err = new Error("ERR!")
            options.callback(err, xhr.response)
        }
    });
}

// здесь перечислены все возможные параметры для функции
// createRequest({
//     //url: 'http://localhost:8000', // адрес
//     url: '/user/current', // адрес
//     data: { // произвольные данные, могут отсутствовать
//         name: 'new user',
//         email: '1@1.ru',
//         password: '1234'
        
//     },
//     method: 'get', // метод запроса
//     /*
//       Функция, которая сработает после запроса.
//       Если в процессе запроса произойдёт ошибка, её объект
//       должен быть в параметре err.
//       Если в запросе есть данные, они должны быть переданы в response.
//     */
//     callback: (err, response) => {
//         console.log('Ошибка, если есть', err);
//         console.log('Данные, если нет ошибки', response);
//     }
// })