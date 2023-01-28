#!/usr/bin/env node
// Helper modules to provide common or secret values
// // const CONFIG = require('../config/config');

const Read = require('./utils');
const Board = require('./board');


const args = require('args-parser')(process.argv);


console.info(args);

const DEFAULT_PUZZLE_FILE = "puzzles/sudoku-com-easy-20230126T132000.txt";

const file = String(args.F ? args.F : args.file ? args.file : DEFAULT_PUZZLE_FILE);

function validate(board) {
    if (!board.validateBoard()) {
        console.error("board is not valid");
        board.print();
        process.exit(1);
    }
}

const main = async () => {
    const board = new Board(await Read(file));
    validate(board);
    board.print();
    const res = board.Solve();
    console.log(res ? "solved " + file : "failed to solve " + file);
    board.print();
    return res;
}

main()
.then((res) => {
    return res ? 0 : 1
})
.catch(error => {
    console.error(error);
    process.exit(1);
}).finally(process.exit);
