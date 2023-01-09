/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    let currentForm = this.element;
    Account.create(data, function (err, resp) {
      if (resp && resp.success) {


        App.getModal('createAccount').close();
        currentForm.reset();
        App.update();
      }
      if (resp && !resp.success) {
        console.log(resp.data);
      }
      if (err) {
        console.log("Ошибка получения счёта");
      }
    })

  }
}