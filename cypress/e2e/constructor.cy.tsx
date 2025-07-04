const selectors = {
  burgerIngredient: '[data-cy="burger-ingredient"]',
  bunIngredient: '[data-cy="bun-ingredients"]',
  mainsIngredient: '[data-cy="mains-ingredients"]',
  sauces: '[data-cy="sauces-ingredients"]',
  bun1: '[data-cy="constructor-bun-1"]',
  bun2: '[data-cy="constructor-bun-2"]',
  constructorIngredient: '[data-cy="constructor-ingredient"]',
  orderButton: '[data-cy="order-button"]',
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  orderNumber: '[data-cy="order-number"]'
};

describe('Тестируем корректную работу конструктора по добавлению ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.viewport(1300, 800);
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавление булки и начинки в конструктор через кнопку "Добавить"', () => {
    // Добавляем булку в конструктор
    cy.get(selectors.bunIngredient)
      .contains(selectors.burgerIngredient, 'Булка 1')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(selectors.bun1).should('exist');
    cy.get(selectors.bun2).should('exist');

    // Добавляем начинку и соус в конструктор
    cy.get(selectors.mainsIngredient)
      .contains('Биокотлета')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(selectors.mainsIngredient)
      .contains('Говяжий метеорит')
      .parent().find('button')
      .contains('Добавить')
      .click();
    cy.get(selectors.sauces)
      .contains('Острый соус')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
  });
});

describe('Тестируем корректную работу модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('Открытие и закрытие модального окна ингредиента по крестику', () => {
    cy.get(selectors.burgerIngredient).first().click();
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modalClose).click();
    cy.get(selectors.modal).should('not.exist');
  });

  it('Закрытие модального окна по оверлею', () => {
    cy.get(selectors.burgerIngredient).first().click();
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modalOverlay).click('topLeft', { force: true });
    cy.get(selectors.modal).should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as('postOrder');
    window.localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Собираем бургер, оформляем заказ и очищаем конструктор', () => {
    // Добавляем булку в конструктор
    cy.get(selectors.bunIngredient)
      .contains(selectors.burgerIngredient, 'Булка 2')
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку и соус в конструктор
    cy.get(selectors.mainsIngredient)
      .contains('Биокотлета')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(selectors.mainsIngredient)
      .contains('Говяжий метеорит')
      .parent().find('button')
      .contains('Добавить')
      .click();
      cy.get(selectors.mainsIngredient)
      .contains('Сыр')
      .parent().find('button')
      .contains('Добавить')
      .click();
    cy.get(selectors.sauces)
      .contains('Фирменный соус')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Оформляем заказ
    cy.get(selectors.orderButton).click();
    cy.wait('@postOrder');
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.orderNumber).should('contain', '123');

    // Закрываем модальное окно
    cy.get(selectors.modalClose).click();
    cy.get(selectors.modal).should('not.exist');

    // Проверяем, что конструктор очищен
    cy.get(selectors.bun1).should('not.exist');
    cy.get(selectors.bun2).should('not.exist');
    cy.get(selectors.constructorIngredient).should('not.exist');
  });
});
