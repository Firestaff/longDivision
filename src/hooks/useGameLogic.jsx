import { useState, useEffect } from 'react';
import { useWindowSize } from './useWindowSize';
import { gameLogic } from '../math/gameLogic';

const useGameLogic = () => {
  const { width, height } = useWindowSize();
  const [cells, setCells] = useState([]);
  const [currentCell, setCurrentCell] = useState(null);
  const [cellSize, setCellSize] = useState(40);
  const [examples, setExamples] = useState(0);
  const [solved, setSolved] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [allMistakes, setAllMistakes] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMistakesTooMuch, setShowMistakesTooMuch] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      generateExample();
    }
  }, [isInitialized]);

  const generateExample = () => {
      const plan = gameLogic.generateExample();
      setExamples((prev) => prev + 1);
      setCells(plan);
      setCurrentCell(plan[0] || null);
      setMistakes(0);
      setShowCongratulations(false);
      setShowHelp(false);
      setShowMistakesTooMuch(false);
      return plan;
    };

  const handleDigitClick = (digit) => {
    if (!currentCell) return;

    const isCorrect = gameLogic.checkAnswer(digit);
    
    if (!isCorrect) {
      setMistakes((prev) => prev + 1);
      setAllMistakes((prev) => prev + 1);
      
      if (mistakes >= 3) {
        setShowMistakesTooMuch(true);
        return;
      }
    }

    if (gameLogic.isCompleted()) {
      setSolved((prev) => prev + 1);
      setShowCongratulations(true);
    } else {
      const step = gameLogic.getCurrentStep();
      updateCurrentCell(step.x, step.y);
    }
  };

  const updateCurrentCell = (x, y) => {
    setCurrentCell({ x, y });
  };

  const updateExampleOperand = (operator) => {
    gameLogic.generateExample(gameLogic.exampleSize, operator);
    setExamples((prev) => prev - 1);
  };

  const updateExampleSize = (size) => {
    gameLogic.generateExample(Number(size), gameLogic.selectedOperator);
    setExamples((prev) => prev - 1);
  };

  const handleNewExample = () => {
    generateExample();
  };

  return {
    cells,
    currentCell,
    cellSize,
    examples,
    solved,
    mistakes,
    allMistakes,
    showCongratulations,
    showHelp,
    showMistakesTooMuch,
    generateExample,
    handleDigitClick,
    updateCurrentCell,
    updateExampleOperand,
    updateExampleSize,
    handleNewExample,
  };
};

export { useGameLogic };