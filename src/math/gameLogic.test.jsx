import { describe, it, expect } from 'vitest';
import { gameLogic } from '../math/gameLogic';
import { MathEngine, Random, DigitUtils } from '../math/mathEngine';

describe('GameLogic', () => {
  describe('generateExample', () => {
    it('should generate division example', () => {
      gameLogic.generateExample(10, '/');
      expect(gameLogic.operandOne).toBeGreaterThan(0);
      expect(gameLogic.operandTwo).toBeGreaterThan(0);
      expect(gameLogic.result).toBeGreaterThan(0);
      expect(gameLogic.operator).toBe('/');
    });

    it('should generate addition example', () => {
      gameLogic.generateExample(10, '+');
      expect(gameLogic.operandOne).toBeGreaterThan(0);
      expect(gameLogic.operandTwo).toBeGreaterThan(0);
      expect(gameLogic.result).toBeGreaterThan(0);
      expect(gameLogic.operator).toBe('+');
    });

    it('should generate random operator when ? is selected', () => {
      gameLogic.generateExample(10, '?');
      expect(['+', '-', '*', '/']).toContain(gameLogic.operator);
    });
  });

  describe('solveExample', () => {
    it('should solve division correctly', () => {
      gameLogic.operandOne = 24;
      gameLogic.operandTwo = 6;
      gameLogic.result = 4;
      gameLogic.operator = '/';
      
      const plan = gameLogic.solveExample();
      expect(plan.length).toBeGreaterThan(0);
      expect(plan[0].value).toBe(4);
    });

    it('should solve multiplication correctly', () => {
      gameLogic.operandOne = 6;
      gameLogic.operandTwo = 4;
      gameLogic.result = 24;
      gameLogic.operator = '*';
      
      const plan = gameLogic.solveExample();
      expect(plan.length).toBeGreaterThan(0);
      expect(plan[plan.length - 1].value).toBe(24);
    });
  });

  describe('checkAnswer', () => {
    it('should return true for correct answer', () => {
      gameLogic.generateExample(10, '+');
      const step = gameLogic.getCurrentStep();
      if (step) {
        const isCorrect = gameLogic.checkAnswer(step.value);
        expect(isCorrect).toBe(true);
      }
    });

    it('should return false for incorrect answer', () => {
      gameLogic.generateExample(10, '+');
      const isCorrect = gameLogic.checkAnswer(999);
      expect(isCorrect).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('should return false when not completed', () => {
      gameLogic.generateExample(10, '+');
      expect(gameLogic.isCompleted()).toBe(false);
    });

    it('should return true when completed', () => {
      gameLogic.generateExample(10, '+');
      const plan = gameLogic.plan;
      plan.forEach((step) => {
        gameLogic.checkAnswer(step.value);
      });
      expect(gameLogic.isCompleted()).toBe(true);
    });
  });
});

describe('MathEngine', () => {
  describe('divide', () => {
    it('should divide numbers correctly', () => {
      expect(MathEngine.divide(10, 2)).toBe(5);
      expect(MathEngine.divide(100, 4)).toBe(25);
    });

    it('should throw error for division by zero', () => {
      expect(() => MathEngine.divide(10, 0)).toThrow();
    });
  });

  describe('multiply', () => {
    it('should multiply numbers correctly', () => {
      expect(MathEngine.multiply(5, 3)).toBe(15);
      expect(MathEngine.multiply(10, 10)).toBe(100);
    });
  });

  describe('add', () => {
    it('should add numbers correctly', () => {
      expect(MathEngine.add(5, 3)).toBe(8);
      expect(MathEngine.add(10, 15)).toBe(25);
    });
  });

  describe('subtract', () => {
    it('should subtract numbers correctly', () => {
      expect(MathEngine.subtract(10, 3)).toBe(7);
      expect(MathEngine.subtract(20, 5)).toBe(15);
    });
  });
});

describe('Random', () => {
  describe('int', () => {
    it('should generate random integer in range', () => {
      const result = Random.int(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('operator', () => {
    it('should return valid operator', () => {
      const operators = ['+', '-', '*', '/'];
      const result = Random.operator();
      expect(operators).toContain(result);
    });
  });
});

describe('DigitUtils', () => {
  describe('split', () => {
    it('should split number into digits', () => {
      expect(DigitUtils.split(123)).toEqual([1, 2, 3]);
      expect(DigitUtils.split(4567)).toEqual([4, 5, 6, 7]);
    });

    it('should handle single digit', () => {
      expect(DigitUtils.split(5)).toEqual([5]);
    });
  });

  describe('join', () => {
    it('should join digits into number', () => {
      expect(DigitUtils.join([1, 2, 3])).toBe(123);
      expect(DigitUtils.join([4, 5, 6, 7])).toBe(4567);
    });
  });
});