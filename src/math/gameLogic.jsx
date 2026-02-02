import { MathEngine, Random, DigitUtils } from './mathEngine';

// Класс для управления игровой логикой
class GameLogic {
  constructor() {
    this.reset();
  }

  reset() {
    this.plan = [];
    this.planIndex = 0;
    this.operandOne = 0;
    this.operandTwo = 0;
    this.result = 0;
    this.exampleSize = 10;
    this.operator = '/';
    this.selectedOperator = '?';
  }

  generateExample(size = 10, operator = '?') {
    this.exampleSize = size;
    this.selectedOperator = operator;
    this.setOperator();
    this.generateValues();
    return this.solveExample();
  }

  setOperator() {
    if (this.selectedOperator === '?') {
      this.operator = Random.operator();
    } else {
      this.operator = this.selectedOperator;
    }
  }

  generateValues() {
    switch (this.operator) {
      case '/':
        this.generateDivisionValues();
        break;
      case '-':
        this.generateSubtractionValues();
        break;
      case '+':
        this.generateAdditionValues();
        break;
      case '*':
        this.generateMultiplicationValues();
        break;
    }
  }

  generateDivisionValues() {
    do {
      this.operandTwo = Random.int(1 * this.exampleSize + 1, 10 * this.exampleSize);
      this.result = Random.int(100, 10000);
    } while (this.operandTwo % 10 === 0 || this.result % 10 === 0);

    this.operandOne = MathEngine.multiply(this.operandTwo, this.result);
  }

  generateSubtractionValues() {
    this.operandTwo = Random.int(100 * this.exampleSize + 1, 10000 * this.exampleSize);
    this.result = Random.int(100 * this.exampleSize + 1, 10000 * this.exampleSize);
    this.operandOne = MathEngine.add(this.operandTwo, this.result);
  }

  generateAdditionValues() {
    this.operandOne = Random.int(100 * this.exampleSize + 1, 10000 * this.exampleSize);
    this.operandTwo = Random.int(10 * this.exampleSize + 1, 1000 * this.exampleSize);
    this.result = MathEngine.add(this.operandOne, this.operandTwo);
  }

  generateMultiplicationValues() {
    do {
      this.operandOne = Random.int(100, 10000);
      this.operandTwo = Random.int(1 * this.exampleSize + 1, 10 * this.exampleSize);
      this.result = Random.int(100, 10000);
    } while (this.operandOne % 10 === 0 || this.operandTwo % 10 === 0);

    this.result = MathEngine.multiply(this.operandOne, this.operandTwo);
  }

  solveExample() {
    this.plan = [];
    this.planIndex = 0;

    switch (this.operator) {
      case '/':
        return this.solveDivision();
      case '-':
      case '+':
        return this.solveSumSub();
      case '*':
        return this.solveMultiplication();
      default:
        throw new Error(`Unknown operator: ${this.operator}`);
    }
  }

  solveDivision() {
    const divisibleDigits = DigitUtils.split(this.operandOne);
    const dividerDigits = DigitUtils.split(this.operandTwo);
    const resultDigits = DigitUtils.split(this.result);

    let remain = this.operandOne;
    let currentY = 0;

    resultDigits.forEach((resDigit, index) => {
      this.plan.push({
        value: resDigit,
        x: index,
        y: 1,
        isResult: resDigit !== 0,
      });

      const offset = resultDigits.length - index - 1;
      const currentX = -offset;
      const localSub = MathEngine.multiply(resDigit, this.operandTwo);
      const localSubDigits = DigitUtils.split(localSub);
      remain = remain - MathEngine.multiply(localSub, Math.pow(10, offset));
      const remainDigits = DigitUtils.split(remain);
      const subLength = remainDigits.length - offset;

      if (resDigit !== 0) {
        currentY += 1;

        localSubDigits.reverse().forEach((d, i) => {
          this.plan.push({
            value: d,
            x: currentX - i - 1,
            y: currentY,
            isUnderscore: true,
          });
        });

        currentY += 1;

        if (subLength < 1) {
          this.plan.push({ value: 0, x: currentX - 1, y: currentY });
        } else {
          for (let i = subLength - 1; i >= 0; i--) {
            this.plan.push({
              value: remainDigits[i],
              x: currentX - subLength + i,
              y: currentY,
            });
          }
        }
      }

      if (remain > 0 && offset >= 0) {
        this.plan.push({
          value: divisibleDigits.at(-offset),
          x: currentX,
          y: currentY,
        });
      }
    });

    return this.plan;
  }

  solveMultiplication() {
    const opOneDigits = DigitUtils.split(this.operandOne);
    const opTwoDigits = DigitUtils.split(this.operandTwo);
    const resultDigits = DigitUtils.split(this.result);

    let currentY = 2;
    let currentX = -1;

    opTwoDigits.reverse().forEach((digit, index) => {
      if (digit !== 0) {
        const localResult = MathEngine.multiply(digit, this.operandOne);
        const localResultDigits = DigitUtils.split(localResult);

        localResultDigits.reverse().forEach((d, i) => {
          const isUnderscore = index === opTwoDigits.length - 1;
          const isWithSign = !isUnderscore && i === localResultDigits.length - 1;
          
          this.plan.push({
            value: d,
            x: currentX - i,
            y: currentY,
            isResult: isWithSign,
            isUnderscore: isUnderscore,
            xOffset: isWithSign ? DigitUtils.split(opTwoDigits[index + 1] * this.operandOne).length - localResultDigits.length + 1 : 1,
          });
        });
      }
      
      currentY += 1;
      currentX -= 1;
    });

    resultDigits.reverse().forEach((resDigit, i) => {
      this.plan.push({ value: resDigit, x: -i - 1, y: currentY });
    });

    return this.plan;
  }

  solveSumSub() {
    const opOneDigits = DigitUtils.split(this.operandOne);
    const opTwoDigits = DigitUtils.split(this.operandTwo);
    const resultDigits = DigitUtils.split(this.result);

    resultDigits.reverse().forEach((resDigit, i) => {
      this.plan.push({ value: resDigit, x: -i - 1, y: 2 });
    });

    return this.plan;
  }

  checkAnswer(digit) {
    const currentStep = this.plan[this.planIndex];
    const isCorrect = currentStep.value === digit;
    
    if (!isCorrect) {
      this.planIndex = 0; // Сброс при ошибке
    } else {
      this.planIndex++;
    }

    return isCorrect;
  }

  isCompleted() {
    return this.planIndex >= this.plan.length;
  }

  getCurrentStep() {
    return this.plan[this.planIndex];
  }
}

// Создаем singleton экземпляр
const gameLogic = new GameLogic();

export { gameLogic, GameLogic };