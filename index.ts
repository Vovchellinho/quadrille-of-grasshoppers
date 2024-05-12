import Board from "./classes/Board";
import Grasshopper from "./classes/Grasshopper";
import type { TBoardClass, TBoardVariant } from "./typings";

const findBestPosition = (arr: TBoardVariant[]): TBoardVariant | null => {
	let bestVariant: TBoardVariant | null = null;

	if (arr.length > 0) {
		let fMin = arr[0].h + arr[0].g;

		bestVariant = {
			parentId: arr[0].parentId,
			id: arr[0].id,
			board: arr[0].board,
			h: arr[0].h,
			g: arr[0].g
		};
	
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].h + arr[i].g < fMin) {
				bestVariant = {
					parentId: arr[i].parentId,
					id: arr[i].id,
					board: arr[i].board,
					h: arr[i].h,
					g: arr[i].g
				};
				fMin = arr[i].h + arr[i].g;
			}
		}

		parentId = bestVariant.id;
		// console.log(`id=${bestVariant.id}, g=${bestVariant.g}, h=${bestVariant.h}`)
	}

	return bestVariant;
}

const board = new Board();
const size = board.getSize();
board.setStartPosition();
board.draw();
// console.log(board.getH())
// console.log(board.getNextPossiblePositions())

// console.log("@!#@")
// board.setFinishPosition();
// console.log(board.getH())

// board.setPos(0, 3, new Grasshopper(0, 3, 'white'));
// board.setPos(0, 4, new Grasshopper(0, 4, 'black'));
// board.draw()
// console.log(board.getNextPossiblePositions())

let OPEN: TBoardVariant[] = [];
let CLOSE: TBoardVariant[] = [];

let hLocal = board.getH();
console.log(hLocal)
let currentBoard: TBoardVariant | null;
let id = 0;

const result: TBoardVariant[] = [];
const newObj: TBoardVariant = {
	parentId: null,
	id: id,
	board: board,
	h: hLocal,
	g: 0
};

// console.log("____")
// board.setFinishPosition();
// board.setPos(0, 3,  new Grasshopper(0,3, 'white'));
// board.setPos(0, 4,  new Grasshopper(0,3, 'black'));
// board.setPos(3, 2, null);
// board.setPos(3,3, new Grasshopper(3,3, 'black'))
// board.draw()
// console.log(board.getH())

// const poses = board.getNextPossiblePositions().positions;

// for (const pos of poses) {
// 	pos.draw()
	
// 	console.log(pos.getH())
// 	console.log("@!#!")
// }

let parentId: number | null = 0;
OPEN.push(newObj);
CLOSE.push(newObj);
currentBoard = newObj;
let step = 0;
let min = 100000;
let minPos: TBoardVariant | null = null;
while (step !== 10000) {
	step++;
	console.log(step)
	if (currentBoard && currentBoard.board) {
		const newBoards = currentBoard.board.getNextPossiblePositions().positions;
		newBoards.forEach((newBoard) => {
			id += 1;
			const h = newBoard.getH();
				if (h < 1000000) {
					OPEN.push({
						parentId: parentId,
						id: id,
						board: newBoard,
						h: h,
						g: currentBoard!.g + 1
					});
				}
		});
		OPEN = OPEN.filter((state) => state.id !== currentBoard!.id && ((state.h + state.g) < 1000000));
		// console.log(OPEN)
		currentBoard = findBestPosition(OPEN);
		if (currentBoard) {
			
			if (currentBoard.h < min) {
				min = currentBoard.h;
				minPos = currentBoard;
			}
			CLOSE.push(currentBoard);
			hLocal = currentBoard.h;
		}
		if (hLocal === 0) {
			break;
		}
	}
}
console.log('====================================');
console.log(min)
if (minPos) {
	minPos.board?.draw();
}
console.log('====================================');

console.log("len")
console.log(OPEN.length)

while (parentId !== null) {
	const variant =  CLOSE.filter((vari) => vari.id === parentId);
	result.push(variant[0]);
	parentId = variant[0].parentId;
}

// for (const item of result.reverse()) {
// 	item.board?.draw();
// 	console.log("!!!!!")
// }

// console.log(result.length)