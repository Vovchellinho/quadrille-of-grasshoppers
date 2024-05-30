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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var Board_1 = require("./classes/Board");
var fs_1 = require("fs");
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
    }
    return bestVariant;
};
var board = new Board_1.default();
board.setStartPosition();
var OPEN = [];
var CLOSE = [];
var hLocal = board.getH();
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
var parentId = 0;
OPEN.push(newObj);
CLOSE.push(newObj);
currentBoard = newObj;
var history = new Set();
history.add(currentBoard.board.getIdName());
var step = 0;
while (hLocal !== 0) {
    step++;
    console.log(step);
    if (currentBoard && currentBoard.board) {
        var newBoards = currentBoard.board.getNextPossiblePositions().positions;
        newBoards.forEach(function (newBoard) {
            id += 1;
            var h = newBoard.getH();
            var name = newBoard.getIdName();
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
        OPEN = OPEN.filter(function (state) { return state.id !== currentBoard.id && ((state.h + state.g) < 1000000); });
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
    var variant = CLOSE.filter(function (vari) { return vari.id === parentId; });
    result.push(variant[0]);
    parentId = variant[0].parentId;
}
var resultString = [];
for (var _i = 0, _c = result.reverse(); _i < _c.length; _i++) {
    var item = _c[_i];
    resultString.push("g: ".concat(item.g));
    for (var i = 0; i < item.board.getSize(); i++) {
        var strBoard = '';
        for (var j = 0; j < item.board.getSize(); j++) {
            var color = (_b = (_a = item.board) === null || _a === void 0 ? void 0 : _a.getPos(i, j)) === null || _b === void 0 ? void 0 : _b.color;
            strBoard += color ? (color === 'black' ? 'b' : 'w') : 0;
            strBoard += ' ';
        }
        resultString.push(strBoard);
    }
    resultString.push(' ');
}
var saveToFile = function (filePath, dataToWrite) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fs_1.writeFile)(filePath, dataToWrite, function (err) { return console.error(err); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
if (hLocal == 0) {
    console.log("Success");
}
else {
    console.log("Failed");
}
saveToFile('data.txt', resultString.join('\n'));
