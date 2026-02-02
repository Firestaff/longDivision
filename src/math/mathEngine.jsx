// Математические операции
export const MathEngine = {
  divide: (dividend, divisor) => {
    if (divisor === 0) {
      throw new Error('Division by zero');
    }
    return dividend / divisor;
  },

  multiply: (a, b) => a * b,

  add: (a, b) => a + b,

  subtract: (a, b) => a - b,
};

// Генерация случайных чисел
export const Random = {
  int: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  operator: () => {
    const operators = ['+', '-', '*', '/'];
    return operators[Math.floor(Math.random() * operators.length)];
  },
};

// Утилиты для работы с цифрами
export const DigitUtils = {
  split: (number) => {
    return String(Math.trunc(number)).split('').map(Number);
  },

  join: (digits) => {
    return Number(digits.join(''));
  },
};