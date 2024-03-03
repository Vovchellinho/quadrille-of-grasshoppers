import Board from "./classes/Board";
import Grasshopper from "./classes/Grasshopper";
import type { TBoardVariant } from "./typings";

const findBestPosition = (arr: TBoardVariant[]): TBoardVariant | null => {
	let bestVariant: TBoardVariant | null = null;

	if (arr.length > 0) {
		let fMin = arr[0].h + arr[0].g;

		bestVariant = {
			id: arr[0].id,
			board: arr[0].board,
			h: arr[0].h,
			g: arr[0].g
		};
	
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].h + arr[i].g < fMin) {
				bestVariant = {
					id: arr[i].id,
					board: arr[i].board,
					h: arr[i].h,
					g: arr[i].g
				};
				fMin = arr[i].h + arr[i].g;
			}
		}
	}

	return bestVariant;
}

const board = new Board();
const size = board.getSize();
board.draw();
board.setStartPosition();
board.setPos(3, 3, new Grasshopper(3, 3,'white'));
board.setPos(3, 2, null);
console.log("++++++")
board.draw();
console.log("------")

let OPEN: TBoardVariant[] = [];
let hLocal = board.getH();
let gLocal = 0;
let currentBoard: TBoardVariant | null;
let id = 0;
const newObj: TBoardVariant = {
	id: id,
	board: board,
	h: hLocal,
	g: gLocal
};
OPEN.push(newObj);
currentBoard = newObj;

// while (hLocal !== 0) {
let step = 0;
while (step !== 20000) {
	step++;
	console.log(step)
	if (currentBoard && currentBoard.board) {
		gLocal += 1;
		const newBoards = currentBoard.board.getNextPossiblePositions();
		newBoards.forEach((newBoard) => {
			id += 1;
			// console.log("!!!")
			// currentBoard?.board?.draw();
			// newBoard.draw()
			// console.log("!!!")
			OPEN.push({
				id: id,
				board: newBoard,
				h: newBoard.getH(),
				g: gLocal
			});
		});
		OPEN = OPEN.filter((state) => state.id !== currentBoard!.id && state.g + state.h < 1000000)
		currentBoard = findBestPosition(OPEN);
		// console.log(OPEN)
		if (currentBoard) {
			hLocal = currentBoard.h;
		}
		// console.log("hlocal")
		// console.log(hLocal)
	}
}
console.log("BEST")
currentBoard?.board?.draw()
console.log("H = " + currentBoard?.board?.getH())
// currentBoard?.board?.draw()