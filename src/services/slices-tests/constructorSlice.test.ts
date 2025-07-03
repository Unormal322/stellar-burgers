import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

// Создаем моки для конструктора
const mockBun = { id: 'bun-id', type: 'bun', name: 'Краторная булка' } as TConstructorIngredient;
const mockIngredient = { id: 'main-id', type: 'main', name: 'Говяжий метеорит (отбивная)' } as TConstructorIngredient;
const createMockIngredient = (id: string, name: string) =>
  ({ id, type: 'main', name } as TConstructorIngredient);

describe('Проверяем редьюсер конструктора', () => {
  test('Проверяет возвращает ли начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Добавление булки', () => {
    const state = reducer(undefined, addIngredient(mockBun));
    expect(state.bun).toEqual(expect.objectContaining({ type: 'bun', name: 'Краторная булка' }));
    expect(state.ingredients).toEqual([]);
  });

  test('Добавление ингредиента', () => {
    const state = reducer({ bun: null, ingredients: [] }, addIngredient(mockIngredient));
    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]).toEqual(expect.objectContaining({ type: 'main', name: 'Говяжий метеорит (отбивная)' }));
  });

  test('Удаление ингредиента', () => {
    const stateWithIngredients = reducer({ bun: null, ingredients: [] }, addIngredient(mockIngredient));
    const idToRemove = stateWithIngredients.ingredients[0].id;
    const state = reducer(stateWithIngredients, removeIngredient(idToRemove));
    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Перемещение ингредиента', () => {
    const ingredient1 = createMockIngredient('id-1', 'Говяжий метеорит (отбивная)');
    const ingredient2 = createMockIngredient('id-2', 'Сыр с астероидной плесенью');
    let state = reducer({ bun: null, ingredients: [] }, addIngredient(ingredient1));
    state = reducer(state, addIngredient(ingredient2));
    const newState = reducer(state, moveIngredient({ from: 0, to: 1 }));
    expect(newState.ingredients[0].name).toBe('Сыр с астероидной плесенью');
    expect(newState.ingredients[1].name).toBe('Говяжий метеорит (отбивная)');
  });

  test('Очистка конструктора', () => {
    const stateWithIngredient = reducer({ bun: mockBun, ingredients: [mockIngredient] }, clearConstructor());
    expect(stateWithIngredient).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
