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
		const getDistance = (i: number, j: number, color: TColor) => {
			const finishBoard = new Board();
			finishBoard.setFinishPosition();
			const possible: Array<TPosition & {distance: number}> = [];
			for (let k = 0; k < this.size; k++) {
				for (let p = 0; p < this.size; p++) {
					if (finishBoard.board[k][p]?.color === color && this.board[k][p]?.color !== color) {
						if ((color === 'white' && k >= i && p >= j) || (color === 'black' && k <= i && k <= j)) {
							possible.push({
								x: k,
								y: p,
								distance: Math.abs(k - i) + Math.abs(p - j)
							});
						}
					}
				}
			}
			let distance = 1000;
			let x = 0;
			let y = 0;
			if (possible.length === 0) {
				distance = 0;
			} else {
				for (const pos of possible) {
					if (pos.distance < distance) {
						distance = pos.distance;
						x = pos.x;
						y = pos.y;
					}
				};
			}
			return distance;
		};

		let h = 0;
		const finishBoard = new Board();
		finishBoard.setFinishPosition();
		let countLimitWhiteV = 0;
		let countLimitBlackV = 0;
		let countLastWhite = 0;
		let countPreLastWhite = 0;
		let countPrePreLastWhite = 0;
		let countLastBlack = 0;
		let countPreLastBlack = 0;
		let countFirstWhite = 0;
		let countBlackLastLines = 0;

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (this.board[i][j] !== null && (this.board[i][j]?.color === 'white' || this.board[i][j]?.color === 'black')) {
					if (this.board[i][j]?.color !== finishBoard.board[i][j]?.color) {
						h += getDistance(i, j, this.board[i][j]!.color) * 10;
					}
					if (finishBoard.board[i][j]?.color !== this.board[i][j]?.color) {
						h += 1;
					}
				}
				if (i > 2 && this.board[i][j]?.color === 'white') {
					if (i == 3) {
						countPrePreLastWhite += 1;
					} else {
						countLimitWhiteV += 1;
					}
					if (i == 5) {
						countPreLastWhite += 1;
					}
					if (i == 6) {
						countLastWhite += 1;
					}
					if (countLastWhite > 4 || (countPreLastWhite > 4 && countLastWhite === 4)) {
						h += 1000000;
						return h;
					}
					if (countLimitWhiteV > 12) {
						h += 1000000;
						return h;
					}
					if (countLimitWhiteV === 12 && countPrePreLastWhite > 3) {
						h += 1000000;
						return h;
					}
				} else if (i === 0 && this.board[i][j]?.color === 'white') {
					countFirstWhite += 1;
				} else if (i < 3 && this.board[i][j]?.color === 'black') {
					countLimitBlackV += 1;
					if (i == 1) {
						countPreLastBlack += 1;
					}
					if (i == 0) {
						countLastBlack += 1;
					}
					if (countLastBlack > 4 || (countPreLastBlack > 4 && countLastBlack === 4)) {
						h += 1000000;
						return h;
					}
					if (countLimitBlackV > 12) {
						h += 1000000;
						return h;
					}
				} else if (i > 3 && this.board[i][j]?.color === 'black') {
					countBlackLastLines += 1;
				}
				if (i == this.size - 1 || j == this.size - 1) {
					if (this.board[i][j]?.color === 'white') {
						h += 1000000;
						return h;
					}
				}
			}
		}
		if (countFirstWhite < 3) {
			h += 1000000;
			return h;
		}
		if (countBlackLastLines < 9) {
			h += 1000000;
			return h;
		}
		const positions = this.getNextPossiblePositions();
		if (h !== 0 && !positions.valid) {
			h += 1000000;
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
		let notValid = 0;
		positions.forEach((pos) => {
			let h = 0;
			for (let i = 0; i < pos.size; i++) {
				for (let j = 0; j < pos.size; j++) {
					if (i == pos.size - 1 || j == pos.size - 1) {
						if (pos.board[i][j]?.color === 'white') {
							h += 1000000;
						}
					}
				}
			}
			if (h >= 1000000) notValid += 1;
		})

		return { 
			positions,
			valid: positions.length !== notValid
		};
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


