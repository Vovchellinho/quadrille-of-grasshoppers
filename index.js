"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Board_1 = require("./classes/Board");
var findBestPosition = function (arr) {
    var bestVariant = null;
    if (arr.length > 0) {
        var fMin = arr[0].h + arr[0].g;
        bestVariant = {
            parentId: arr[0].parentId,
            id: arr[0].id,
            board: arr[0].board,
            h: arr[0].h,
            g: arr[0].g
        };
        for (var i = 0; i < arr.length; i++) {
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
        // console.log(`g=${bestVariant.g},h=${bestVariant.h}`)
    }
    return bestVariant;
};
var board = new Board_1.default();
var size = board.getSize();
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
var OPEN = [];
var CLOSE = [];
var hLocal = board.getH();
console.log(hLocal);
var currentBoard;
var id = 0;
var result = [];
var newObj = {
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
var parentId = 0;
OPEN.push(newObj);
CLOSE.push(newObj);
currentBoard = newObj;
var step = 0;
var min = 100000;
var minPos = null;
while (step !== 500000) {
    step++;
    console.log(step);
    if (currentBoard && currentBoard.board) {
        var newBoards = currentBoard.board.getNextPossiblePositions().positions;
        newBoards.forEach(function (newBoard) {
            id += 1;
            var h = newBoard.getH();
            if (h < 1000000) {
                OPEN.push({
                    parentId: parentId,
                    id: id,
                    board: newBoard,
                    h: h,
                    g: currentBoard.g + 1
                });
            }
        });
        OPEN = OPEN.filter(function (state) { return state.id !== currentBoard.id && ((state.h + state.g) < 1000000); });
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
console.log(min);
if (minPos) {
    (_a = minPos.board) === null || _a === void 0 ? void 0 : _a.draw();
}
console.log('====================================');
while (parentId !== null) {
    var variant = CLOSE.filter(function (vari) { return vari.id === parentId; });
    result.push(variant[0]);
    parentId = variant[0].parentId;
}
// for (const item of result.reverse()) {
// 	item.board?.draw();
// 	console.log("!!!!!")
// }
// console.log(result.length)
