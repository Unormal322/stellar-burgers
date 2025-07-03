import styles from './ingredients-category.module.css';
import { forwardRef } from 'react';
import { TIngredientsCategoryUIProps } from './type';
import { BurgerIngredient } from '@components';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryUIProps
>(({ title, titleRef, ingredients, ingredientsCounters }, ref) => {
  // ВРЕМЕННО для отладки:
  console.log('Category:', title, 'Ingredients:', ingredients);

  return (
    <>
      <h3 className='text text_type_main-medium mt-10 mb-6' ref={titleRef}>
        {title}
      </h3>
      <ul
        className={styles.items}
        ref={ref}
        data-cy={
          title === 'Булки'
            ? 'bun-ingredients'
            : title === 'Начинки'
              ? 'mains-ingredients'
              : title === 'Соусы'
                ? 'sauces-ingredients'
                : undefined
        }
      >
        {ingredients.map((ingredient) => (
          <BurgerIngredient
            ingredient={ingredient}
            key={ingredient._id}
            count={ingredientsCounters[ingredient._id]}
          />
        ))}
      </ul>
    </>
  );
});
