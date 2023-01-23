/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let currUser = User.current();
    let accWidget = this.element.querySelector("select");
    if (currUser) {
      Account.list(currUser.id, function (err, resp) {
        if (resp && resp.success) {
          accWidget.options.length = 0;

          for (let index = 0; index < resp.data.length; index++) {
            const element = resp.data[index];
            let newOption = new Option(element.name, element.id);
            accWidget.options[accWidget.options.length] = newOption;
          }
        }
        if (err) {
          console.log("Ошибка получения счётов");
        }
      })
    }

  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {

    Transaction.create(data, (err, resp) => {
      if (resp && resp.success) {
        this.element.reset();
        App.update();
        if (this.element.id === "new-expense-form") {
          App.getModal('newExpense').close();
        }
        if (this.element.id === "new-income-form") {
          App.getModal('newIncome').close();
        }
      }
      if (err) {
        console.log("Ошибка получения счётов");
      }
    });
  }
}