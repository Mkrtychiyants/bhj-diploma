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
    const delAcc = document.querySelector("button.remove-account");
    const delTransaction = document.querySelector("section.content");

    delTransaction.addEventListener("click", (e) => {
      let par = e.target.closest(".transaction__remove")
      if (par) {
        this.removeTransaction(e.target.dataset);
      }

    });

    delAcc.addEventListener("click", (e) => {
      let tr = e.target;
      this.removeAccount();
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
        Account.remove(this.lastOptions, function (err, resp) {
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
      Transaction.remove(id, (err, resp) => {
        if (resp && resp.success) {
          App.update();
          // this.update()
          // Transaction.list( { "account_id": id.id }, (err, resp) => {
          //   this.renderTransactions(resp);
          // });
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
      this.lastOptions = { "id": options.account_id };
      //this.clear();
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
    if (cont) {
      const contSpan = document.querySelector("span.content-title");
      contSpan.textContent = cont.data.name;
    }

  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateTime = new Date(date);
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

    transRowDiv.insertAdjacentHTML("afterbegin", `<div class="transaction transaction_${item.type.toLowerCase()} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
            <i class="fa fa-trash"></i>  
        </button>
    </div>
    </div>`);

    return transRowDiv;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    if (data) {
      const contSection = document.querySelector("section.content");
      contSection.innerHTML = "";
      for (let index = 0; index < data.data.length; index++) {
        contSection.appendChild(this.getTransactionHTML(data.data[index]));

      }
    }

  }
}