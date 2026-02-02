// Типы для игровой логики
export interface Cell {
  x: number;
  y: number;
  value: string;
  isUnderscore?: boolean;
  isResultStart?: boolean;
  isWrongDigit?: boolean;
  fontSize?: number;
}

export interface GameStep {
  value: number;
  x: number;
  y: number;
  isResult?: boolean;
  isUnderscore?: boolean;
  xOffset?: number;
}

export interface GameState {
  cells: Cell[];
  currentCell: Cell | null;
  cellSize: number;
  examples: number;
  solved: number;
  mistakes: number;
  allMistakes: number;
  showCongratulations: boolean;
  showHelp: boolean;
  showMistakesTooMuch: boolean;
  isInitialized: boolean;
}

// Типы для математических операций
export interface MathOperation {
  (a: number, b: number): number;
}

export interface RandomOptions {
  min: number;
  max: number;
}

// Типы для операторов
export type Operator = '+' | '-' | '*' | '/';
export type Difficulty = 1 | 10 | 100;

// Типы для хуков
export interface UseWindowSizeReturn {
  width: number;
  height: number;
}

export interface UseGameLogicReturn {
  cells: Cell[];
  currentCell: Cell | null;
  cellSize: number;
  examples: number;
  solved: number;
  mistakes: number;
  allMistakes: number;
  showCongratulations: boolean;
  showHelp: boolean;
  showMistakesTooMuch: boolean;
  generateExample: () => void;
  handleDigitClick: (digit: number) => void;
  updateCurrentCell: (x: number, y: number) => void;
  updateExampleOperand: (operator: Operator) => void;
  updateExampleSize: (size: Difficulty) => void;
  handleNewExample: () => void;
}

// Типы для пропсов компонентов
export interface GridProps {
  cells: Cell[];
  currentCell: Cell | null;
  cellSize: number;
}

export interface ControlsProps {
  examples: number;
  mistakes: number;
  allMistakes: number;
  solved: number;
  generateExample: () => void;
  updateExampleOperand: (operator: Operator) => void;
  updateExampleSize: (size: Difficulty) => void;
}

export interface DigitPanelProps {
  currentCell: Cell | null;
  handleDigitClick: (digit: number) => void;
}

export interface PopupProps {
  showCongratulations: boolean;
  showHelp: boolean;
  showMistakesTooMuch: boolean;
  solved: number;
  handleNewExample: () => void;
}

// Типы для математического движка
export interface MathEngine {
  divide: MathOperation;
  multiply: MathOperation;
  add: MathOperation;
  subtract: MathOperation;
}

export interface Random {
  int: (options: RandomOptions) => number;
  operator: () => Operator;
}

export interface DigitUtils {
  split: (number: number) => number[];
  join: (digits: number[]) => number;
}

// Типы для игровой логики
export interface GameLogic {
  plan: GameStep[];
  planIndex: number;
  operandOne: number;
  operandTwo: number;
  result: number;
  exampleSize: number;
  operator: Operator;
  selectedOperator: Operator | '?';
  
  generateExample: (size?: number, operator?: Operator) => GameStep[];
  setOperator: () => void;
  generateValues: () => void;
  solveExample: () => GameStep[];
  checkAnswer: (digit: number) => boolean;
  isCompleted: () => boolean;
  getCurrentStep: () => GameStep | undefined;
  reset: () => void;
}

// Типы ошибок
export class DivisionByZeroError extends Error {
  constructor() {
    super('Division by zero is not allowed');
    this.name = 'DivisionByZeroError';
  }
}

export class InvalidOperatorError extends Error {
  constructor(operator: string) {
    super(`Invalid operator: ${operator}`);
    this.name = 'InvalidOperatorError';
  }
}

// Типы для конфигурации
export interface GameConfig {
  defaultCellSize: number;
  maxMistakes: number;
  operators: Operator[];
  difficulties: { [key in Difficulty]: string };
}

export const gameConfig: GameConfig = {
  defaultCellSize: 40,
  maxMistakes: 3,
  operators: ['+', '-', '*', '/'],
  difficulties: {
    1: 'Легко',
    10: 'Нормально',
    100: 'Сложно'
  }
};