import React from 'react';

const DigitPanel = ({ onDigitClick, currentCell, showHelp }) => {
  return (
    <div className="digit-panel">
      {Array.from({ length: 10 }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDigitClick(i)}
          disabled={!currentCell}
          aria-label={`digit-${i}`}>
          {i}
        </button>
      ))}
      <button className="help-button" onClick={showHelp}>
        ?
      </button>
    </div>
  );
};

export default DigitPanel;