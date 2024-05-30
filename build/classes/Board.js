"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Grasshopper_1 = __importDefault(require("./Grasshopper"));
class Board {
    constructor() {
        this.board = [[]];
        this.size = 8;
        this.board = this.initialize();
    }
    ;
    // копирует по шаблону board
    copy(board) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = board[i][j];
            }
        }
        return this;
    }
    // устанавливает board в начальную позицию игры
    setStartPosition() {
        for (let i = 0; i < this.size - 1; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                let grasshopper = null;
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
        for (let i = 4; i < this.size - 1; i++) {
            this.setPos(i, 3, new Grasshopper_1.default(i, 3, 'black'));
        }
    }
    // установка конечного положения
    setFinishPosition() {
        for (let i = 0; i < this.size - 1; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                let grasshopper = null;
                if (j < 3) {
                    grasshopper = new Grasshopper_1.default(i, j + 4, 'black');
                }
                else if (j > 3 && j < this.size - 1) {
                    grasshopper = new Grasshopper_1.default(i, j - 4, 'white');
                }
                else if (j === 3) {
                    grasshopper = new Grasshopper_1.default(i + 4, j, 'black');
                }
                this.setPos(i, j, grasshopper);
            }
        }
        this.setPos(3, 3, null);
        for (let i = 4; i < this.size - 1; i++) {
            this.setPos(i, 3, new Grasshopper_1.default(i - 4, 3, 'white'));
        }
    }
    // подсчет h(x) для доски
    getH() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const getDistance = (i, j, color) => {
            var _a, _b;
            const finishBoard = new Board();
            finishBoard.setFinishPosition();
            const possible = [];
            for (let k = 0; k < this.size; k++) {
                for (let p = 0; p < this.size; p++) {
                    if (((_a = finishBoard.board[k][p]) === null || _a === void 0 ? void 0 : _a.color) === color && ((_b = this.board[k][p]) === null || _b === void 0 ? void 0 : _b.color) !== color) {
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
            }
            else {
                for (const pos of possible) {
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
        return h;
    }
    // инициализация всех клеток null
    initialize() {
        const arr = [];
        for (let i = 0; i < this.size; i++) {
            arr.push([]);
        }
        ;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                arr[i][j] = null;
            }
        }
        return arr;
    }
    // получение размера board
    getSize() {
        return this.size;
    }
    ;
    // id for set
    getIdName() {
        let name = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const grasshopper = this.getPos(i, j);
                name += i + j + (grasshopper ? grasshopper === null || grasshopper === void 0 ? void 0 : grasshopper.color : 'o');
            }
        }
        return name;
    }
    // установка grasshopper | null на позицию x,y
    setPos(x, y, grasshopper) {
        this.board[x][y] = grasshopper;
    }
    ;
    // получить grasshopper | null с позиции x,y
    getPos(x, y) {
        return this.board[x][y];
    }
    ;
    // получить все возможные доски из текущей на следующем шаге
    getNextPossiblePositions() {
        const checkPosition = (x, y) => {
            return x >= 0 && y >= 0 && x < this.size && y < this.size;
        };
        const positions = [];
        const nullPositions = this.getNullPositions();
        nullPositions.forEach((field) => {
            // if (field.y === 3) {
            // верх от пустого
            if (checkPosition(field.x - 1, field.y)) {
                const grasshopper = this.getPos(field.x - 1, field.y);
                if (grasshopper && grasshopper.color === 'white') {
                    const newBoard = new Board();
                    newBoard.copy(this.board);
                    newBoard.setPos(field.x - 1, field.y, null);
                    newBoard.setPos(field.x, field.y, grasshopper);
                    positions.push(newBoard);
                }
                else if (grasshopper && grasshopper.color === 'black') {
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
                }
                else if (grasshopper && grasshopper.color === 'white') {
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
            // }
            // слева от пустого
            if (checkPosition(field.x, field.y - 1)) {
                const grasshopper = this.getPos(field.x, field.y - 1);
                if (grasshopper && grasshopper.color === 'white') {
                    const newBoard = new Board();
                    newBoard.copy(this.board);
                    newBoard.setPos(field.x, field.y - 1, null);
                    newBoard.setPos(field.x, field.y, grasshopper);
                    positions.push(newBoard);
                }
                else if (grasshopper && grasshopper.color === 'black') {
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
                }
                else if (grasshopper && grasshopper.color === 'white') {
                    if (checkPosition(field.x, field.y + 2)) {
                        const grasshopper = this.getPos(field.x, field.y + 2);
                        if (grasshopper && grasshopper.color === 'black') {
                            const newBoard = new Board();
                            newBoard.copy(this.board);
                            newBoard.setPos(field.x, field.y + 2, null);
                            newBoard.setPos(field.x, field.y, grasshopper);
                            positions.push(newBoard);
                        }
                    }
                }
            }
        });
        const filter = [];
        positions.forEach((pos) => {
            var _a;
            let h = 0;
            for (let i = 0; i < pos.size; i++) {
                for (let j = 0; j < pos.size; j++) {
                    if (i == pos.size - 1 || j == pos.size - 1) {
                        if (((_a = pos.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) === 'white') {
                            h += 1000000;
                            break;
                        }
                    }
                }
            }
            if (h >= 1000000) {
                filter.push(false);
            }
            else {
                filter.push(true);
            }
        });
        const result = positions.filter((v, i) => {
            if (filter[i] === true) {
                return v;
            }
        });
        return {
            positions: result
        };
    }
    ;
    // получить все свободные клетки на доске
    getNullPositions() {
        const positions = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === null) {
                    positions.push({
                        x: i,
                        y: j
                    });
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
        const result = [];
        for (let i = 0; i < this.size; i++) {
            let raw = '';
            for (let j = 0; j < this.size; j++) {
                const pos = this.board[i][j];
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
    }
    ;
    draw_grasshopper() {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            let raw = '';
            for (let j = 0; j < this.size; j++) {
                const grasshopper = this.getPos(i, j);
                if (grasshopper === null) {
                    raw += '0';
                }
                else {
                    raw += `(${grasshopper.x}; ${grasshopper.y})`;
                }
                raw += ' ';
            }
            ;
            result.push(raw);
        }
        console.log(result.join('\n'));
    }
    ;
}
;
exports.default = Board;
