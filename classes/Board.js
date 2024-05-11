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
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var getDistance = function (i, j, color) {
            var _a, _b;
            var finishBoard = new Board();
            finishBoard.setFinishPosition();
            var possible = [];
            for (var k = 0; k < _this.size; k++) {
                for (var p = 0; p < _this.size; p++) {
                    if (((_a = finishBoard.board[k][p]) === null || _a === void 0 ? void 0 : _a.color) === color && ((_b = _this.board[k][p]) === null || _b === void 0 ? void 0 : _b.color) !== color) {
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
            var distance = 1000;
            var x = 0;
            var y = 0;
            if (possible.length === 0) {
                distance = 0;
            }
            else {
                for (var _i = 0, possible_1 = possible; _i < possible_1.length; _i++) {
                    var pos = possible_1[_i];
                    if (pos.distance < distance) {
                        distance = pos.distance;
                        x = pos.x;
                        y = pos.y;
                    }
                }
                ;
            }
            return distance;
        };
        var h = 0;
        var finishBoard = new Board();
        finishBoard.setFinishPosition();
        var countLimitWhiteV = 0;
        var countLimitBlackV = 0;
        var countLastWhite = 0;
        var countPreLastWhite = 0;
        var countPrePreLastWhite = 0;
        var countLastBlack = 0;
        var countPreLastBlack = 0;
        var countFirstWhite = 0;
        var countBlackLastLines = 0;
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.board[i][j] !== null && (((_a = this.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) === 'white' || ((_b = this.board[i][j]) === null || _b === void 0 ? void 0 : _b.color) === 'black')) {
                    if (((_c = this.board[i][j]) === null || _c === void 0 ? void 0 : _c.color) !== ((_d = finishBoard.board[i][j]) === null || _d === void 0 ? void 0 : _d.color)) {
                        h += getDistance(i, j, this.board[i][j].color);
                    }
                    if (((_e = finishBoard.board[i][j]) === null || _e === void 0 ? void 0 : _e.color) !== ((_f = this.board[i][j]) === null || _f === void 0 ? void 0 : _f.color)) {
                        h += 1;
                    }
                }
                if (i > 2 && ((_g = this.board[i][j]) === null || _g === void 0 ? void 0 : _g.color) === 'white') {
                    if (i == 3) {
                        countPrePreLastWhite += 1;
                    }
                    else {
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
                }
                else if (i === 0 && ((_h = this.board[i][j]) === null || _h === void 0 ? void 0 : _h.color) === 'white') {
                    countFirstWhite += 1;
                }
                else if (i < 3 && ((_j = this.board[i][j]) === null || _j === void 0 ? void 0 : _j.color) === 'black') {
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
                }
                else if (i > 3 && ((_k = this.board[i][j]) === null || _k === void 0 ? void 0 : _k.color) === 'black') {
                    countBlackLastLines += 1;
                }
                if (i == this.size - 1 || j == this.size - 1) {
                    if (((_l = this.board[i][j]) === null || _l === void 0 ? void 0 : _l.color) === 'white') {
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
        var positions = this.getNextPossiblePositions();
        if (h !== 0 && !positions.valid) {
            h += 1000000;
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
        var notValid = 0;
        positions.forEach(function (pos) {
            var _a;
            var h = 0;
            for (var i = 0; i < pos.size; i++) {
                for (var j = 0; j < pos.size; j++) {
                    if (i == pos.size - 1 || j == pos.size - 1) {
                        if (((_a = pos.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) === 'white') {
                            h += 1000000;
                        }
                    }
                }
            }
            if (h >= 1000000)
                notValid += 1;
        });
        return {
            positions: positions,
            valid: positions.length !== notValid
        };
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
