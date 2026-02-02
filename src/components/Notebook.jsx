import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import Grid from './Grid';
import Controls from './Controls';
import DigitPanel from './DigitPanel';
import Popup from './Popup';

const Notebook = () => {
  const { cells, currentCell, cellSize } = useGameLogic();

  return (
    <div className="notebook-container">
      <Grid
        cells={cells}
        currentCell={currentCell}
        cellSize={cellSize}
      />
      <Controls />
      <DigitPanel />
      <Popup />
    </div>
  );
};



export default Notebook;
