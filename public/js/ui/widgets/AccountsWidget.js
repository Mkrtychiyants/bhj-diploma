/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      const error = new Error("Empty element");
      console.log(error.message);
    }
    this.element = element;
    this.update();
    this.registerEvents();

  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAcc = document.querySelector(".create-account");
    const existedAccsParent = document.querySelector("ul.accounts-panel");

    createAcc.addEventListener("click", (e) => {
      App.getModal("createAccount").open();
      e.preventDefault();
    });

    existedAccsParent.addEventListener("click", (e) => {
      const selectedAcc = e.target.closest("li.account");
      if (selectedAcc) {
        this.onSelectAccount(selectedAcc);
        e.preventDefault();
      }

    })

  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    let currUser = User.current();

    if (currUser) {
      Account.list(currUser.id, (err, resp) => {
        if (resp && resp.success) {
          this.clear();
          for (let index = 0; index < resp.data.length; index++) {
            const element = resp.data[index];
            this.renderItem(element);
          }
        }
        if (err) {
          console.log("Ошибка получения счётов");
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const existedAccs = document.querySelectorAll("li.account");
    if (existedAccs.length > 0) {
      for (let index = 0; index < existedAccs.length; index++) {
        const element = existedAccs[index];
        element.remove();
      }
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const selecAccs = document.querySelector("li.account.active");
    if (selecAccs) {
      selecAccs.classList.remove("active");
    }
    element.classList.add("active");
    App.showPage('transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {

    const newLi = document.createElement("li");
    newLi.classList.add("account");
    newLi.dataset.id = item.id;
    newLi.insertAdjacentHTML("afterbegin", `<a href="#">
      <span>${item.name}</span> /
      <span>${item.sum} ₽</span>
      </a>`)
    return newLi;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {

    this.element.appendChild(this.getAccountHTML(data));
  }
}
