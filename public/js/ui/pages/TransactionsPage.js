/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      const error = new Error("Empty element");
      console.log(error.message);
    }
    this.element = element;
    this.registerEvents();
    this.lastOptions;
  }
  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.options);
    }

  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const delTransaction = document.querySelector("button.remove-account");
    const delAcc = document.querySelector("section.content");

    delTransaction.addEventListener("click", () => {
      this.removeAccount();
    });
    
      delAcc.addEventListener("click", (e) => {
        this.removeTransaction(e.target.dataset.id);
      })
    

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const res = confirm("Вы действительно хотите удалить счёт?");
      if (res) {
        Account.remove(null, function (err, resp) {
          if (resp && resp.success) {


            App.updateWidgets()
            App.updateForms()

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
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const res = confirm("Вы действительно хотите удалить эту транзакцию?");
    if (res) {
      Transaction.remove(id, function (err, resp) {
        if (resp && resp.success) {
          App.update()
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

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, resp) => {
        this.renderTitle(resp);
      })
      Transaction.list(options, (err, resp) => {
        this.renderTransactions(resp);
      });
    } else {
      let err = new Error("No argument!")
    }

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = undefined;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(cont) {
    const contSpan = document.querySelector("span.content-title");
    contSpan.textContent = cont.data.name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateTimeArr = date.split(" ");
    const dateTime = new Date(dateTimeArr[0] + "T" + dateTimeArr[1]);
    const dateDay = dateTime.getDate();
    const dateMounth = dateTime.getMonth();
    const dateYear = dateTime.getFullYear();
    const dateHours = dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();
    const dateMins = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes();
    const mounth = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const outPut = dateDay + " " + mounth[dateMounth] + " " + dateYear + " г. в " + dateHours + ":" + dateMins;
    return outPut;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const transRowDiv = document.createElement("div");
    transRowDiv.classList.add("transaction", "row", "transaction_" + item.type.toLowerCase());
    const colMd7Div = document.createElement("div");
    colMd7Div.classList.add("col-md-7", "transaction__details");
    const transIconDiv = document.createElement("div");
    transIconDiv.classList.add("transaction__icon");
    const iconSpan = document.createElement("span");
    iconSpan.classList.add("fa", "fa-money", "fa-2x");
    const transInfoDiv = document.createElement("div");
    transInfoDiv.classList.add("transaction__info");
    const transTitleH4 = document.createElement("h4");
    transTitleH4.classList.add("transaction__title");
    transTitleH4.textContent = item.name;
    const transDateDiv = document.createElement("div");
    transDateDiv.classList.add("transaction__date");
    transDateDiv.textContent = this.formatDate(item.created_at);
    transInfoDiv.appendChild(transTitleH4);
    transInfoDiv.appendChild(transDateDiv);
    transIconDiv.appendChild(iconSpan);
    colMd7Div.appendChild(transIconDiv);
    colMd7Div.appendChild(transInfoDiv);
    transRowDiv.appendChild(colMd7Div);
    const colMd3Div = document.createElement("div");
    colMd3Div.classList.add("col-md-3");
    const transSumDiv = document.createElement("div");
    transSumDiv.classList.add("transaction__summ");
    transSumDiv.textContent = item.sum;
    const currSpan = document.createElement("span");
    currSpan.classList.add("currency");
    currSpan.textContent = "₽";
    transSumDiv.appendChild(currSpan);
    colMd3Div.appendChild(transSumDiv);
    transRowDiv.appendChild(colMd3Div);
    const colMd2Div = document.createElement("div");
    colMd2Div.classList.add("col-md-2", "transaction__controls");
    const transRemoveBut = document.createElement("div");
    transRemoveBut.classList.add("btn", "btn-danger", "transaction__remove");
    transRemoveBut.dataset.id = item.id;
    const iconI = document.createElement("span");
    iconI.classList.add("fa", "fa-trash");
    transRemoveBut.appendChild(iconI);
    colMd2Div.appendChild(transRemoveBut);
    transRowDiv.appendChild(colMd2Div);
    return transRowDiv;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    for (let index = 0; index < data.data.length; index++) {
      const contSection = document.querySelector("section.content");
      contSection.appendChild(this.getTransactionHTML(data.data[index]));

    }
  }
}