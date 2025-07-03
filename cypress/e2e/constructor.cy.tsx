describe('Тестируем корректную работу конструктора по добавлению ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  it('Добавление булки и начинки в конструктор через кнопку "Добавить"', () => {
    // Добавляем булку в конструктор
    cy.get('[data-cy="bun-ingredients"]')
      .contains('[data-cy="burger-ingredient"]', 'Булка 1')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="constructor-bun-1"]').should('exist');
    cy.get('[data-cy="constructor-bun-2"]').should('exist');

    // Добавляем начинку и соус в конструктор
    cy.get('[data-cy="mains-ingredients"]')
      .contains('Биокотлета')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="mains-ingredients"]')
      .contains('Говяжий метеорит')
      .parent().find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="sauces-ingredients"]')
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
    cy.visit('http://localhost:4000/');
  });

  it('Открытие и закрытие модального окна ингредиента по крестику', () => {
    cy.get('[data-cy="burger-ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрытие модального окна по оверлею', () => {
    cy.get('[data-cy="burger-ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
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
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Собираем бургер, оформляем заказ и очищаем конструктор', () => {
    // Добавляем булку в конструктор
    cy.get('[data-cy="bun-ingredients"]')
      .contains('[data-cy="burger-ingredient"]', 'Булка 2')
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку и соус в конструктор
    cy.get('[data-cy="mains-ingredients"]')
      .contains('Биокотлета')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="mains-ingredients"]')
      .contains('Говяжий метеорит')
      .parent().find('button')
      .contains('Добавить')
      .click();
      cy.get('[data-cy="mains-ingredients"]')
      .contains('Сыр')
      .parent().find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="sauces-ingredients"]')
      .contains('Фирменный соус')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Оформляем заказ
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@postOrder');
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '123');

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очищен
    cy.get('[data-cy="constructor-bun-1"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-2"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredient"]').should('not.exist');
  });
});
