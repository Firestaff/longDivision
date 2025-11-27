/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./Notebook.css";

let planIndex,
	divider,
	result,
	divisible = 0;
let exampleSize = 10;
let cellSize = 0;
const plan = [];

const Notebook = () => {
	const [cells, setCells] = useState([]);
	const [currentCell, setCurrentCell] = useState(null);
	const [examples, setExamples] = useState(0);
	const [solved, setSolved] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [allMistakes, setAllMistakes] = useState(0);
	const [showCongratulations, setShowCongratulations] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const [showMistakesTooMuch, setShowMistakesTooMuch] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	cellSize = getCurrentCellSize();
	let { startX: START_X, startY: START_Y } = getStartCoords();

	const [, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	if (!isInitialized) {
		setIsInitialized(true);
		setTimeout(() => {
			generateExample();
		}, 0);
	}

	const generateExample = () => {
		generateValues();

		setShowCongratulations(false);
		setShowHelp(false);
		setShowMistakesTooMuch(false);
		setCells([]);
		setCurrentCell(null);
		setMistakes(0);
		setExamples((prev) => prev + 1);

		const divisibleDigits = splitDigits(divisible);
		const dividerDigits = splitDigits(divider);

		divisibleDigits.forEach((digit, i) => {
			placeDigits(START_X - divisibleDigits.length + i, START_Y, [digit]);
		});

		dividerDigits.forEach((digit, i) => {
			placeDigits(START_X + i, START_Y, [digit], {
				isUnderscore: true,
				isResultStart: i === 0,
			});
		});

		updateCurrentCell(START_X, START_Y + 1, true);
		solveExample();
	};

	const handleDigitClick = (digit) => {
		if (!currentCell) {
			return;
		}

		let step = plan[planIndex];

		placeDigits(step.x, step.y, [digit], { isUnderscore: step.isUnderscore });

		if (updateWrongDigit(step.x, step.y, step.value != digit)) {
			setAllMistakes((prev) => prev + 1);

			if (mistakes >= 3) {
				setShowMistakesTooMuch(true);
				return;
			}
			setMistakes((prev) => prev + 1);
			return;
		}

		if (step.isResult) {
			placeMinus();
		}

		planIndex++;

		if (planIndex >= plan.length) {
			setSolved((prev) => prev + 1);
			setShowCongratulations(true);
		} else {
			const nextStep = plan[planIndex];
			updateCurrentCell(nextStep.x, nextStep.y);
		}
	};

	const handleNewExample = () => {
		generateExample();
	};

	const placeDigits = (startX, startY, digits, options = {}) => {
		const { isUnderscore = false, isResultStart = false } = options;

		setCells((prev) => {
			const newCells = [...prev];

			digits.forEach((d, i) => {
				const x = startX + i;
				const existingIndex = newCells.findIndex(
					(cell) => cell.x === x && cell.y === startY
				);

				if (existingIndex !== -1) {
					newCells[existingIndex] = {
						...newCells[existingIndex],
						value: String(d),
						isUnderscore,
					};
				} else {
					newCells.push({
						x,
						y: startY,
						isUnderscore,
						isResultStart,
						value: String(d),
						fontSize: cellSize - 5,
					});
				}
			});

			return newCells;
		});

		return {
			x: startX,
			y: startY,
			isResultStart,
		};
	};

	const placeMinus = () => {
		if (cells.length > 0) {
			const y = planIndex === 0 ? START_Y : plan[planIndex - 1].y;
			const x = Math.min(
				...cells.filter((cell) => cell.y === y).map((cell) => cell.x)
			);
			placeDigits(x - 0.7, y + 0.1, ["_"]);
		}
	};

	const updateWrongDigit = (startX, startY, isWrong) => {
		const existingCell = cells.find(
			(cell) =>
				cell.x === startX && cell.y === startY && cell.isWrongDigit != isWrong
		);

		if (existingCell) {
			setCells((prev) =>
				prev.map((cell) =>
					cell.x === existingCell.x && cell.y === existingCell.y
						? { ...cell, isWrongDigit: isWrong }
						: cell
				)
			);
		}

		return isWrong;
	};

	const updateCurrentCell = (x, y, isResultStart = false) => {
		const newCurrentCell = placeDigits(x, y, [""], { isResultStart });
		setCurrentCell(newCurrentCell);
	};

	const updateExampleSize = (size) => {
		exampleSize = Number(size);
		generateExample();
		setExamples((prev) => prev - 1);
	};

	// Обновляем размер клетки при изменении окна
	useEffect(() => {
		const handleResize = () => {
			cellSize = getCurrentCellSize();

			const newCoords = getStartCoords();
			const oldStartX = START_X;
			const oldStartY = START_Y;

			START_X = newCoords.startX;
			START_Y = newCoords.startY;

			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});

			if (cells.length > 0) {
				const deltaX = START_X - oldStartX;
				const deltaY = START_Y - oldStartY;

				setCells((prevCells) =>
					prevCells.map((cell) => ({
						...cell,
						x: cell.x + deltaX,
            y: cell.y + deltaY,
            fontSize: cellSize - 5,
					}))
				);

				if (currentCell) {
					setCurrentCell((prev) => ({
						...prev,
						x: prev.x + deltaX,
						y: prev.y + deltaY,
					}));
				}

				plan.forEach((step) => {
					step.x += deltaX;
					step.y += deltaY;
				});
			}
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, [cells, currentCell]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			setShowHelp(false);
		};

		if (showHelp) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showHelp]);

	function getCurrentCellSize() {
		const root = document.documentElement;
		const size = getComputedStyle(root).getPropertyValue("--cell-size").trim();
		return parseInt(size) || 40;
	}

  function getStartCoords() {
    const isWide = window.innerWidth > window.innerHeight;
    const xMultiplicator = isWide ? 0.55 : 0.6;
    const yMultiplicator = isWide ? 0.25 : 0.4;
		return {
			startX: Math.floor((window.innerWidth / cellSize) * xMultiplicator),
			startY: Math.floor((window.innerHeight / cellSize) * yMultiplicator),
		};
	}

	function generateValues() {
		do {
			divider = randInt(1 * exampleSize + 1, 10 * exampleSize);
			result = randInt(100, 10000);
		} while (divider % 10 === 0 || result % 10 === 0);

		divisible = divider * result;
		return [divider, result, divisible];
	}

	function solveExample() {
		plan.length = 0;
		planIndex = 0;
		const resultDigits = splitDigits(result);
		const divisibleDigits = splitDigits(divisible);
		let remain = divisible;
		let currentY = START_Y;

		resultDigits.forEach((resDigit, index) => {
			plan.push({
				value: resDigit,
				x: START_X + index,
				y: START_Y + 1,
				isResult: resDigit != 0,
			});

			const offset = resultDigits.length - index - 1;
			const currentX = START_X - offset;
			const localSub = resDigit * divider;
			const localSubDigits = splitDigits(localSub);
			remain = remain - localSub * 10 ** offset;
			const remainDigits = splitDigits(remain);
			const subLength = remainDigits.length - offset;

			// Если в делителе не 0
			if (resDigit != 0) {
				currentY += 1;

				// Добавляем цифры вычитания
				localSubDigits.reverse().forEach((d, i) => {
					plan.push({
						value: d,
						x: currentX - i - 1,
						y: currentY,
						isUnderscore: true,
					});
				});

				currentY += 1;

				if (subLength < 1) {
					plan.push({ value: 0, x: currentX - 1, y: currentY });
				} else {
					// Добавляем цифры остатка
					for (let i = subLength - 1; i >= 0; i--) {
						plan.push({
							value: remainDigits[i],
							x: currentX - subLength + i,
							y: currentY,
						});
					}
				}
			}

			// Сносим следующую цифру
			if (remain > 0 && offset >= 0) {
				plan.push({
					value: divisibleDigits.at(-offset),
					x: currentX,
					y: currentY,
				});
			}
		});
	}

	function randInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function splitDigits(n) {
		const s = String(Math.trunc(n));
		return s.split("").map((ch) => Number(ch));
	}

	return (
		<div className="notebook-container">
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

			<div className="notebook-grid">
				{cells.map((cell) => (
					<div
						key={cell.x + "-" + cell.y}
						data-cell-id={cell.x + "-" + cell.y}
						className={`number-cell 
              ${
								cell.x === currentCell?.x && cell.y === currentCell?.y
									? "Current"
									: ""
							}
              ${cell.isWrongDigit ? "WrongDigit" : ""}
              ${cell.isResultStart ? "ResultStart" : ""}
              ${cell.isUnderscore ? "WithUnderscore" : ""}`}
						style={{
							left: cell.x * cellSize,
							top: cell.y * cellSize,
							fontSize: `${cell.fontSize}px`,
						}}>
						{cell.value}
					</div>
				))}
			</div>

			<div className="controls">
        <div className="info">
          <div>Примеров:<span className="number">{examples}</span></div>
          <div>Ошибок:<span className="number">{mistakes}</span></div>
          <div>Всего ошибок:<span className="number">{allMistakes}</span></div>
          {/* <div>Ширина:<span className="number">{window.innerWidth}</span></div>
          <div>Высота:<span className="number">{window.innerHeight}</span></div> */}
        </div>
        <button onClick={generateExample}>Новый пример</button>
				<select
					onChange={(e) => updateExampleSize(e.target.value)}
          defaultValue="10">
					<option value="1">Однозначное</option>
					<option value="10">Двузначное</option>
					<option value="100">Трехзначное</option>
				</select>
			</div>

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
				<button className="help-button" onClick={() => setShowHelp(true)}>
					?
				</button>
			</div>
		</div>
	);
};

export default Notebook;
