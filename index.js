"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var Board_1 = require("./classes/Board");
var Grasshopper_1 = require("./classes/Grasshopper");
var findBestPosition = function (arr) {
    var bestVariant = null;
    if (arr.length > 0) {
        var fMin = arr[0].h + arr[0].g;
        bestVariant = {
            id: arr[0].id,
            board: arr[0].board,
            h: arr[0].h,
            g: arr[0].g
        };
        for (var i = 0; i < arr.length; i++) {
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
};
var board = new Board_1.default();
var size = board.getSize();
board.draw();
board.setStartPosition();
board.setPos(3, 3, new Grasshopper_1.default(3, 3, 'white'));
board.setPos(3, 2, null);
console.log("++++++");
board.draw();
console.log("------");
var OPEN = [];
var hLocal = board.getH();
var gLocal = 0;
var currentBoard;
var id = 0;
var newObj = {
    id: id,
    board: board,
    h: hLocal,
    g: gLocal
};
OPEN.push(newObj);
currentBoard = newObj;
// while (hLocal !== 0) {
var step = 0;
while (step !== 20000) {
    step++;
    console.log(step);
    if (currentBoard && currentBoard.board) {
        gLocal += 1;
        var newBoards = currentBoard.board.getNextPossiblePositions();
        newBoards.forEach(function (newBoard) {
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
        OPEN = OPEN.filter(function (state) { return state.id !== currentBoard.id && state.g + state.h < 1000000; });
        currentBoard = findBestPosition(OPEN);
        // console.log(OPEN)
        if (currentBoard) {
            hLocal = currentBoard.h;
        }
        // console.log("hlocal")
        // console.log(hLocal)
    }
}
console.log("BEST");
(_a = currentBoard === null || currentBoard === void 0 ? void 0 : currentBoard.board) === null || _a === void 0 ? void 0 : _a.draw();
console.log("H = " + ((_b = currentBoard === null || currentBoard === void 0 ? void 0 : currentBoard.board) === null || _b === void 0 ? void 0 : _b.getH()));
// currentBoard?.board?.draw()
