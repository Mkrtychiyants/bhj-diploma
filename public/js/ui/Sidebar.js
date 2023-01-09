/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */

class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const body = document.querySelector("body.app");
    const sidebarButton = document.querySelector("a.sidebar-toggle");
    sidebarButton.addEventListener("click", function () {
      body.classList.toggle("sidebar-open");
      body.classList.toggle("sidebar-collapse");
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const regButton = document.querySelector("li.menu-item_register");
    const signInButton = document.querySelector("li.menu-item_login");
    const signOutButton = document.querySelector("li.menu-item_logout");

    regButton.addEventListener("click", function (e) {

      App.getModal("register").open();
      e.preventDefault();
    });

    signInButton.addEventListener("click", function (e) {
      App.getModal("login").open();
      e.preventDefault();
    });

    signOutButton.addEventListener("click", function (e) {
      User.logout(() => {
        App.setState('init');
      })
    })
  }
}