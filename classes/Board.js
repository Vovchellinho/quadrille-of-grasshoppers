"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grasshopper_1 = require("./Grasshopper");
var Board = /** @class */ (function () {
    function Board() {
        this.board = [[]];
        this.size = 8;
        this.board = this.initialize();
    }
    ;
    // копирует по шаблону board
    Board.prototype.copy = function (board) {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this.board[i][j] = board[i][j];
            }
        }
        return this;
    };
    // устанавливает board в начальную позицию игры
    Board.prototype.setStartPosition = function () {
        for (var i = 0; i < this.size - 1; i++) {
            for (var j = 0; j < this.size - 1; j++) {
                var grasshopper = null;
                if (j < 4) {
                    grasshopper = new Grasshopper_1.default(i, j, 'white');
                }
                else if (j < this.size - 1) {
                    grasshopper = new Grasshopper_1.default(i, j, 'black');
                }
                ;
                this.setPos(i, j, grasshopper);
            }
        }
        this.setPos(3, 3, null);
        for (var i = 4; i < this.size - 1; i++) {
            this.setPos(i, 3, new Grasshopper_1.default(i, 3, 'black'));
        }
    };
    // установка конечного положения
    Board.prototype.setFinishPosition = function () {
        for (var i = 0; i < this.size - 1; i++) {
            for (var j = 0; j < this.size - 1; j++) {
                var grasshopper = null;
                if (j < 4) {
                    grasshopper = new Grasshopper_1.default(i, j, 'black');
                }
                else if (j < this.size - 1) {
                    grasshopper = new Grasshopper_1.default(i, j, 'white');
                }
                ;
                this.setPos(i, j, grasshopper);
            }
        }
        this.setPos(3, 3, null);
        for (var i = 4; i < this.size - 1; i++) {
            this.setPos(i, 3, new Grasshopper_1.default(i, 3, 'white'));
        }
    };
    // подсчет h(x) для доски
    Board.prototype.getH = function () {
        var _a, _b, _c;
        var h = 0;
        var finishBoard = new Board();
        finishBoard.setFinishPosition();
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (((_a = finishBoard.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) !== ((_b = this.board[i][j]) === null || _b === void 0 ? void 0 : _b.color)) {
                    if (this.board[i][j] === null) {
                        h += 1;
                    }
                    else {
                        h += 2;
                    }
                    if (i == this.size - 1 || j == this.size - 1) {
                        if (((_c = this.board[i][j]) === null || _c === void 0 ? void 0 : _c.color) === 'white') {
                            h += 1000000;
                        }
                    }
                    h += 1;
                }
            }
        }
        return h;
    };
    // инициализация всех клеток null
    Board.prototype.initialize = function () {
        var arr = [];
        for (var i = 0; i < this.size; i++) {
            arr.push([]);
        }
        ;
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                arr[i][j] = null;
            }
        }
        return arr;
    };
    // получение размера board
    Board.prototype.getSize = function () {
        return this.size;
    };
    ;
    // установка grasshopper | null на позицию x,y
    Board.prototype.setPos = function (x, y, grasshopper) {
        this.board[x][y] = grasshopper;
    };
    ;
    // получить grasshopper | null с позиции x,y
    Board.prototype.getPos = function (x, y) {
        return this.board[x][y];
    };
    ;
    // получить все возможные доски из текущей на следующем шаге
    Board.prototype.getNextPossiblePositions = function () {
        var _this = this;
        var checkPosition = function (x, y) {
            return x >= 0 && y >= 0 && x < _this.size && y < _this.size;
        };
        var positions = [];
        var nullPositions = this.getNullPositions();
        nullPositions.forEach(function (field) {
            // верх от пустого
            if (checkPosition(field.x - 1, field.y)) {
                var grasshopper = _this.getPos(field.x - 1, field.y);
                if (grasshopper && grasshopper.color === 'white') {
                    var newBoard = new Board();
                    newBoard.copy(_this.board);
                    newBoard.setPos(field.x - 1, field.y, null);
                    newBoard.setPos(field.x, field.y, grasshopper);
                    positions.push(newBoard);
                }
                else if (grasshopper && grasshopper.color === 'black') {
                    if (checkPosition(field.x - 2, field.y)) {
                        var grasshopper_1 = _this.getPos(field.x - 2, field.y);
                        if (grasshopper_1 && grasshopper_1.color === 'white') {
                            var newBoard = new Board();
                            newBoard.copy(_this.board);
                            newBoard.setPos(field.x - 2, field.y, null);
                            newBoard.setPos(field.x, field.y, grasshopper_1);
                            positions.push(newBoard);
                        }
                    }
                }
            }
            // низ от пустого
            if (checkPosition(field.x + 1, field.y)) {
                var grasshopper = _this.getPos(field.x + 1, field.y);
                if (grasshopper && grasshopper.color === 'black') {
                    var newBoard = new Board();
                    newBoard.copy(_this.board);
                    newBoard.setPos(field.x + 1, field.y, null);
                    newBoard.setPos(field.x, field.y, grasshopper);
                    positions.push(newBoard);
                }
                else if (grasshopper && grasshopper.color === 'white') {
                    if (checkPosition(field.x + 2, field.y)) {
                        var grasshopper_2 = _this.getPos(field.x + 2, field.y);
                        if (grasshopper_2 && grasshopper_2.color === 'black') {
                            var newBoard = new Board();
                            newBoard.copy(_this.board);
                            newBoard.setPos(field.x + 2, field.y, null);
                            newBoard.setPos(field.x, field.y, grasshopper_2);
                            positions.push(newBoard);
                        }
                    }
                }
            }
            // слева от пустого
            if (checkPosition(field.x, field.y - 1)) {
                var grasshopper = _this.getPos(field.x, field.y - 1);
                if (grasshopper && grasshopper.color === 'white') {
                    var newBoard = new Board();
                    newBoard.copy(_this.board);
                    newBoard.setPos(field.x, field.y - 1, null);
                    newBoard.setPos(field.x, field.y, grasshopper);
                    positions.push(newBoard);
                }
                else if (grasshopper && grasshopper.color === 'black') {
                    if (checkPosition(field.x, field.y - 2)) {
                        var grasshopper_3 = _this.getPos(field.x, field.y - 2);
                        if (grasshopper_3 && grasshopper_3.color === 'white') {
                            var newBoard = new Board();
                            newBoard.copy(_this.board);
                            newBoard.setPos(field.x, field.y - 2, null);
                            newBoard.setPos(field.x, field.y, grasshopper_3);
                            positions.push(newBoard);
                        }
                    }
                }
            }
            // справа от пустого
            if (checkPosition(field.x, field.y + 1)) {
                var grasshopper = _this.getPos(field.x, field.y + 1);
                if (grasshopper && grasshopper.color === 'black') {
                    var newBoard = new Board();
                    newBoard.copy(_this.board);
                    newBoard.setPos(field.x, field.y + 1, null);
                    newBoard.setPos(field.x, field.y, grasshopper);
                    positions.push(newBoard);
                }
                else if (grasshopper && grasshopper.color === 'white') {
                    if (checkPosition(field.x, field.y + 2)) {
                        var grasshopper_4 = _this.getPos(field.x, field.y + 2);
                        if (grasshopper_4 && grasshopper_4.color === 'black') {
                            var newBoard = new Board();
                            newBoard.copy(_this.board);
                            newBoard.setPos(field.x, field.y + 2, null);
                            newBoard.setPos(field.x, field.y, grasshopper_4);
                            positions.push(newBoard);
                        }
                    }
                }
            }
        });
        return positions;
    };
    ;
    // получить все свободные клетки на доске
    Board.prototype.getNullPositions = function () {
        var positions = [];
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.board[i][j] === null) {
                    positions.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
        return positions;
    };
    // вывести board на экран
    Board.prototype.draw = function () {
        var dict = {
            white: 'w',
            black: 'b'
        };
        var result = [];
        for (var i = 0; i < this.size; i++) {
            var raw = '';
            for (var j = 0; j < this.size; j++) {
                var pos = this.board[i][j];
                if (pos === null) {
                    raw += '0';
                }
                else {
                    raw += dict[pos.color];
                }
                raw += ' ';
            }
            ;
            result.push(raw);
        }
        console.log(result.join('\n'));
    };
    ;
    return Board;
}());
;
exports.default = Board;
