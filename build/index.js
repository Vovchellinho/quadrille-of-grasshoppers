"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = __importDefault(require("./classes/Board"));
const fs_1 = require("fs");
const findBestPosition = (arr) => {
    let bestVariant = null;
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
    }
    return bestVariant;
};
const board = new Board_1.default();
board.setStartPosition();
let OPEN = [];
let CLOSE = [];
let hLocal = board.getH();
let currentBoard;
let id = 0;
const result = [];
const newObj = {
    parentId: null,
    id: id,
    board: board,
    h: hLocal,
    g: 0
};
let parentId = 0;
OPEN.push(newObj);
CLOSE.push(newObj);
currentBoard = newObj;
const history = new Set();
history.add(currentBoard.board.getIdName());
let step = 0;
while (hLocal !== 0) {
    step++;
    console.log(step);
    if (currentBoard && currentBoard.board) {
        const newBoards = currentBoard.board.getNextPossiblePositions().positions;
        newBoards.forEach((newBoard) => {
            id += 1;
            const h = newBoard.getH();
            const name = newBoard.getIdName();
            if (h < 1000000 && !history.has(name)) {
                history.add(name);
                OPEN.push({
                    parentId: parentId,
                    id: id,
                    board: newBoard,
                    h: h,
                    g: currentBoard.g + 1
                });
            }
        });
        OPEN = OPEN.filter((state) => state.id !== currentBoard.id && ((state.h + state.g) < 1000000));
        currentBoard = findBestPosition(OPEN);
        if (currentBoard) {
            CLOSE.push(currentBoard);
            hLocal = currentBoard.h;
        }
        if (hLocal === 0) {
            break;
        }
    }
}
while (parentId !== null) {
    const variant = CLOSE.filter((vari) => vari.id === parentId);
    result.push(variant[0]);
    parentId = variant[0].parentId;
}
const resultString = [];
for (const item of result.reverse()) {
    resultString.push(`g: ${item.g}`);
    for (let i = 0; i < item.board.getSize(); i++) {
        let strBoard = '';
        for (let j = 0; j < item.board.getSize(); j++) {
            const color = (_b = (_a = item.board) === null || _a === void 0 ? void 0 : _a.getPos(i, j)) === null || _b === void 0 ? void 0 : _b.color;
            strBoard += color ? (color === 'black' ? 'b' : 'w') : 0;
            strBoard += ' ';
        }
        resultString.push(strBoard);
    }
    resultString.push(' ');
}
const saveToFile = (filePath, dataToWrite) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, fs_1.writeFile)(filePath, dataToWrite, err => console.error(err));
});
if (hLocal == 0) {
    console.log("Success");
}
else {
    console.log("Failed");
}
saveToFile('data.txt', resultString.join('\n'));
