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
    Account.create(data,(err, resp) => {
      if (resp && resp.success) {
        App.getModal('createAccount').close();
        this.element.reset();
        App.update();
      }
      if (err) {
        console.log("Ошибка получения счёта");
      }
    })

  }
}