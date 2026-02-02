import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';

const DigitPanel = () => {
  const { currentCell, handleDigitClick, setShowHelp } = useGameLogic();

  return (
    <div className="digit-panel">
      {Array.from({ length: 10 }).map((_, i) => (
        <button
          key={i}
          onClick={() => handleDigitClick(i)}
          disabled={!currentCell}
          aria-label={`digit-${i}`}>
          {i}
        </button>
      ))}
      <button className="help-button" onClick={() => setShowHelp(true)}>?</button>
    </div>
  );
};

export default DigitPanel;