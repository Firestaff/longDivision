import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
/** @typedef {import("../../types").GridProps} GridProps */

/** @type {React.FC<GridProps>} */
const Grid = ({ cells, currentCell, cellSize }) => {
  return (
    <div className="notebook-grid">
      {cells.map((cell) => (
        <div
          key={`${cell.x}-${cell.y}`}
          data-cell-id={`${cell.x}-${cell.y}`}
          className={`number-cell 
            ${cell.x === currentCell?.x && cell.y === currentCell?.y ? 'Current' : ''}
            ${cell.isWrongDigit ? 'WrongDigit' : ''}
            ${cell.isResultStart ? 'ResultStart' : ''}
            ${cell.isUnderscore ? 'WithUnderscore' : ''}`}
          style={{
            left: cell.x * cellSize,
            top: cell.y * cellSize,
            fontSize: `${cell.fontSize}px`,
          }}
        >
          {cell.value}
        </div>
      ))}
    </div>
  );
};

export default Grid;