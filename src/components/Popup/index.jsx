import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';

const Popup = () => {
  const { 
    showCongratulations, 
    showHelp, 
    showMistakesTooMuch, 
    solved,
    handleNewExample 
  } = useGameLogic();

  return (
    <div>
      {showCongratulations && (
        <div className="popup">
          <div className="popup-content">
            <h2>Ура! Решено!</h2>
            <p>Поздравляем с решением примера!</p>
            <p>Решено примеров: {solved}</p>
            <button className="new-example-btn" onClick={handleNewExample}>
              Еще один?
            </button>
          </div>
        </div>
      )}
      {showHelp && (
        <div className="popup">
          <div className="popup-content">
            <h2>Подсказка</h2>
            <p>Выбери цифру, которую надо подставить в жёлтую клеточку</p>
          </div>
        </div>
      )}
      {showMistakesTooMuch && (
        <div className="popup mistakes">
          <div className="popup-content">
            <h2>Слишком много ошибок!</h2>
            <p>Старайся не ошибаться</p>
            <button className="new-example-btn" onClick={handleNewExample}>
              Новый пример
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;