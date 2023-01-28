const OPTIONS = Array(1,2,3,4,5,6,7,8,9);


function *iter_rc() {
    for (var r = 0; r < 9; r++)
    for (var c = 0; c < 9; c++)
    yield [r, c];
  }

  
function ValidateBoard(board) {
    for (var i = 0; i < 9; i++) if ((!ValidateArray(Row(board, i))) || (!ValidateArray(Col(board, i)))) return false;
        for (var r3 = 0; r3 < 3; r3++) for (var c3 = 0; c3 < 3; c3++) if (!ValidateArray(Box(board, r3, c3))) return false;
        return true;
}


function Col(board, c) {
    var col = [];
    for (var r = 0; r < 9; r++) col.push(board[r][c]);
    return col;    
}


function Row(board, r) {
    var row = [];
    for (var c = 0; c < 9; c++) row.push(board[r][c]);
    return row;    
}


function Box(board, r3, c3) {
    var box = [];
    for (var r = r3 * 3; r < (r3 * 3) + 3; r++) for (var c = c3 * 3; c < (c3 * 3) + 3; c++) box.push(board[r][c]);
    return box;    
}

function ValidateArray(array) {
    var taken = new Array(9).fill(0);
    for (a in array) if (array[a] > 0) {
        const i = array[a]-1;
        taken[i]++;
        if (taken[i] > 1) {
            return false;
        }
    }
    return true;
}



function solutions(board, r, c) {
    var row = Row(board, r);
    // console.log("%d, %d row: %s", r, c, Array(...row).sort().join(", "));
    var col = Col(board, c);
    // console.log("%d, %d col: %s", r, c, Array(...col).sort().join(", "));
    var box = Box(board, parseInt(r/3), parseInt(c/3));
    // console.log("%d, %d box: %s", r, c, Array(...box).sort().join(", "));
    var taken = new Set([...row, ...col, ...box]);
    // console.log("solutions.taken: %s", Array(...taken).sort().join(", "));
    var opts = OPTIONS.filter(x => !taken.has(x));
    // console.log("solutions.opts: %s", opts);
    return opts;
}


function done(b) {
    for (const [r, c] of iter_rc()) if (b[r][c] < 1) return false;
    return true;
}


function doneAndValid(b) {
    return done(b) && ValidateBoard(b);
}



class Board {
    constructor(board) {
        this._b = board;
        this._depth = 0;
    }

    print() {
        this._b.forEach((row) => {
            console.log(Array(...row).join(" "));
        })        
    }
    
    validateBoard() {
        return ValidateBoard(this._b);
    }

    _solve() {
        for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) if (this._b[r][c] < 1) {
            var sol = solutions(this._b, r, c);
            if (sol.length == 0) return false;
            if (sol.length == 1) {
                this._b[r][c] = sol.pop();
                return true;
            }
        }
        return this._backtrack();
    }

    _backtrack() {
        var sol = []
        for (const [r, c] of iter_rc()) if (this._b[r][c] == 0) sol.push([r, c, solutions(this._b, r, c)]);
        var s = Array(...sol).sort((l, r) => {
            var a = l[2].length, b = r[2].length;
            return a < b ? -1 : a == b ? 0 : 1;
        })[0]
        var backup = this.getBackup();
        var r = s[0], c = s[1], opts = s[2];
        this._depth++;
        opts.forEach((v) => {
            this._b[r][c] = v;
            if (this.Solve()) {
                return true;
            }
            else this.reset(backup);
        })
        return false;
    }

    getBackup() {
        var b = [];
        for (var i = 0; i < 9; i++) b.push([...this._b[i]]);
        return b;
    }

    reset(to) {
        for (var i = 0; i < 9; i++) this._b[i] = [...to[i]];
    }

    Solve() {
        var i = 0;
        while (!doneAndValid(this._b)) if (!this._solve()) break;
        return doneAndValid(this._b);
    }

};

module.exports = Board;
