import Grasshopper from "./Grasshopper";
import type { 
	TBoard, 
	TBoardClass, 
	TColor, 
	TGrasshopperClass, 
	TPosition
} from "../typings";

class Board {
	board: TBoard = [[]];
	size = 8;

	constructor() {
		this.board = this.initialize();
	};

	// копирует по шаблону board
	copy(board: TBoard) {
		for(let i = 0; i < this.size; i++) {
			for(let j = 0; j < this.size; j++) {
				this.board[i][j] = board[i][j];
			}
		}
		return this;
	}

	// устанавливает board в начальную позицию игры
	setStartPosition() {
		for(let i = 0; i < this.size - 1; i++) {
			for(let j = 0; j < this.size - 1; j++) {
				let grasshopper: null | TGrasshopperClass = null;
				if (j < 4) {
					grasshopper = new Grasshopper(i, j, 'white');
				} else if (j < this.size - 1) {
					grasshopper = new Grasshopper(i, j, 'black');
				};
				this.setPos(i, j, grasshopper);
			}
		}
		this.setPos(3, 3, null);
		for (let i = 4; i < this.size - 1; i++) {
			this.setPos(i, 3, new Grasshopper(i, 3, 'black'))
		}
	}

	// установка конечного положения
	setFinishPosition() {
		for(let i = 0; i < this.size - 1; i++) {
			for(let j = 0; j < this.size - 1; j++) {
				let grasshopper: null | TGrasshopperClass = null;
				if (j < 4) {
					grasshopper = new Grasshopper(i, j, 'black');
				} else if (j < this.size - 1) {
					grasshopper = new Grasshopper(i, j, 'white');
				};
				this.setPos(i, j, grasshopper);
			}
		}
		this.setPos(3, 3, null);
		for (let i = 4; i < this.size - 1; i++) {
			this.setPos(i, 3, new Grasshopper(i, 3, 'white'))
		}
	}

	// подсчет h(x) для доски
	getH() {
		let h = 0;
		const finishBoard = new Board();
		finishBoard.setFinishPosition();
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (finishBoard.board[i][j]?.color !== this.board[i][j]?.color) {
					if (this.board[i][j] === null) {
						h += 1;
					} else {
						h += 2;
					}
					if (i == this.size - 1 || j == this.size - 1) {
						if (this.board[i][j]?.color === 'white') {
							h += 1000000;
						}
					}
					h += 1;
				}
			}
		}
		return h;
	}

	// инициализация всех клеток null
	initialize() {
		const arr: any[] = [];
		for(let i = 0; i < this.size; i++) {
			arr.push([]);
		};
		for(let i = 0; i < this.size; i++) {
			for(let j = 0; j < this.size; j++) {
				arr[i][j] = null;
			}
		}
		return arr;
	}

	// получение размера board
	getSize() {
		return this.size;
	};

	// установка grasshopper | null на позицию x,y
	setPos(x: number, y: number, grasshopper: TGrasshopperClass | null) {
		this.board[x][y] = grasshopper;
	};

	// получить grasshopper | null с позиции x,y
	getPos(x: number, y: number) {
		return this.board[x][y];
	};

	// получить все возможные доски из текущей на следующем шаге
	getNextPossiblePositions() {
		const checkPosition = (x: number, y: number) => {
			return x >= 0 && y >= 0 && x < this.size && y < this.size
		}
		const positions: Board[] = [];

		const nullPositions = this.getNullPositions();
		nullPositions.forEach((field) => {
			// верх от пустого
			if (checkPosition(field.x - 1, field.y)) {
				const grasshopper = this.getPos(field.x - 1, field.y);
				if (grasshopper && grasshopper.color === 'white') {
					const newBoard = new Board();
					newBoard.copy(this.board);
					newBoard.setPos(field.x - 1, field.y, null);
					newBoard.setPos(field.x, field.y, grasshopper);
					positions.push(newBoard);
				} else if (grasshopper && grasshopper.color === 'black') {
					if (checkPosition(field.x - 2, field.y)) {
						const grasshopper = this.getPos(field.x - 2, field.y);
						if (grasshopper && grasshopper.color === 'white') {
							const newBoard = new Board();
							newBoard.copy(this.board);
							newBoard.setPos(field.x - 2, field.y, null);
							newBoard.setPos(field.x, field.y, grasshopper);
							positions.push(newBoard);
						}
					}
				}
			}
			// низ от пустого
			if (checkPosition(field.x + 1, field.y)) {
				const grasshopper = this.getPos(field.x + 1, field.y);
				if (grasshopper && grasshopper.color === 'black') {
					const newBoard = new Board();
					newBoard.copy(this.board);
					newBoard.setPos(field.x + 1, field.y, null);
					newBoard.setPos(field.x, field.y, grasshopper);
					positions.push(newBoard);
				} else if (grasshopper && grasshopper.color === 'white') {
					if (checkPosition(field.x + 2, field.y)) {
						const grasshopper = this.getPos(field.x + 2, field.y);
						if (grasshopper && grasshopper.color === 'black') {
							const newBoard = new Board();
							newBoard.copy(this.board);
							newBoard.setPos(field.x + 2, field.y, null);
							newBoard.setPos(field.x, field.y, grasshopper);
							positions.push(newBoard);
						}
					}
				}
			}
			// слева от пустого
			if (checkPosition(field.x, field.y - 1)) {
				const grasshopper = this.getPos(field.x, field.y - 1);
				if (grasshopper && grasshopper.color === 'white') {
					const newBoard = new Board();
					newBoard.copy(this.board);
					newBoard.setPos(field.x, field.y - 1, null);
					newBoard.setPos(field.x, field.y, grasshopper);
					positions.push(newBoard);
				} else if (grasshopper && grasshopper.color === 'black') {
					if (checkPosition(field.x, field.y - 2)) {
						const grasshopper = this.getPos(field.x, field.y - 2);
						if (grasshopper && grasshopper.color === 'white') {
							const newBoard = new Board();
							newBoard.copy(this.board);
							newBoard.setPos(field.x, field.y - 2, null);
							newBoard.setPos(field.x, field.y, grasshopper);
							positions.push(newBoard);
						}
					}
				}
			}
			// справа от пустого
			if (checkPosition(field.x, field.y + 1)) {
				const grasshopper = this.getPos(field.x, field.y + 1);
				if (grasshopper && grasshopper.color === 'black') {
					const newBoard = new Board();
					newBoard.copy(this.board);
					newBoard.setPos(field.x, field.y + 1, null);
					newBoard.setPos(field.x, field.y, grasshopper);
					positions.push(newBoard);
				} else if (grasshopper && grasshopper.color === 'white') {
					if (checkPosition(field.x, field.y + 2)) {
						const grasshopper = this.getPos(field.x, field.y + 2);
						if (grasshopper && grasshopper.color === 'black') {
							const newBoard = new Board();
							newBoard.copy(this.board);
							newBoard.setPos(field.x, field.y  + 2, null);
							newBoard.setPos(field.x, field.y, grasshopper);
							positions.push(newBoard);
						}
					}
				}
			}
		})

		return positions;
	};

	// получить все свободные клетки на доске
	getNullPositions() {
		const positions: TPosition[] = [];
		for(let i = 0; i < this.size; i++) {
			for(let j = 0; j < this.size; j++) {
				if (this.board[i][j] === null) {
					positions.push({
						x: i,
						y: j
					})
				}
			}
		}
		return positions;
	}


	// вывести board на экран
	draw() {
		const dict = {
			white: 'w',
			black: 'b'
		};
		const result: string[] = [];
		for (let i = 0; i < this.size; i++) {
			let raw = '';
			for (let j = 0; j < this.size; j++) {
				const pos = this.board[i][j];
				if (pos === null) {
					raw += '0';
				} else {
					raw += dict[pos.color as TColor];
				}
				raw += ' ';
			};
			result.push(raw);
		}
		console.log(result.join('\n'));
	};
};

export default Board;


