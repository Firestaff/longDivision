import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';

const Controls = () => {
  const { examples, mistakes, allMistakes, solved, generateExample, updateExampleOperand, updateExampleSize } = useGameLogic();

  return (
    <div className="controls">
      <div className="info">
        <div>Примеров:<span className="number">{examples}</span></div>
        <div>Ошибок:<span className="number">{mistakes}</span></div>
        <div>Всего ошибок:<span className="number">{allMistakes}</span></div>
      </div>
      <button onClick={generateExample}>Новый пример</button>
      <select
        onChange={(e) => updateExampleOperand(e.target.value)}
        defaultValue="?">
        <option value="+">Сложение</option>
        <option value="−">Вычитание</option>
        <option value="×">Умножение</option>
        <option value="/">Деление</option>
        <option value="?">Случайно</option>
      </select>
      <select
        onChange={(e) => updateExampleSize(e.target.value)}
        defaultValue="10">
        <option value="1">Легко</option>
        <option value="10">Нормально</option>
        <option value="100">Сложно</option>
      </select>
    </div>
  );
};

export default Controls;