const fs = require('fs');
const readline = require('readline');

function isInt(d) {
    if (typeof d != "string") return false // we only process strings!  
    return !isNaN(d) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseInt(d)) // ...and ensure strings of whitespace fail
}
  

const Read = async (file) => {
    if (typeof file === 'undefined') {
        console.log("file is undefined.");
        process.exit(1);
    };
    board = [];
    console.log("reading file: %s", file);
    const fileStream = fs.createReadStream(file);
  
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        l = String(line).trim().replaceAll(" ", "");
        if (l.length > 0 && l[0] != "#") {
            row = [];
            digits = l.split(",");
            if (digits.length != 9) {
                console.error("invad row %d has %d digits", board.length, digits.length);
                process.exit(1);
            }
            for (var c = 0; c < digits.length; c++) {
                const d = digits[c];
                if (!isInt(d)) {
                    console.error("invad digit %d in position %d in row %d", d, c, board.length);
                    process.exit(1);    
                }
                const n = parseInt(d);
                row.push(n < 1 ? 0 : n);
            }
            board.push(row);
        }
    }
    return board;
}

module.exports = Read;