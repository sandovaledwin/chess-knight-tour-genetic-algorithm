function convertBinaryStringToDecimal(str) {
  if ( str == "000" ) return 1;
  if ( str == "001" ) return 2;
  if ( str == "010" ) return 3;
  if ( str == "011" ) return 4;
  if ( str == "100" ) return 5;
  if ( str == "101" ) return 6;
  if ( str == "110" ) return 7;
  return 8;
}

function convertToBinaryString(num) {
  if ( num == 1 ) return [0,0,0];
  if ( num == 2 ) return [0,0,1];
  if ( num == 3 ) return [0,1,0];
  if ( num == 4 ) return [0,1,1];
  if ( num == 5 ) return [1,0,0];
  if ( num == 6 ) return [1,0,1];
  if ( num == 7 ) return [1,1,0];
  return [1,1,1];
}

function initChromosome(rows, cols) {
  const initialPosition = generateInitialPosition(rows, cols);
  const col = convertToBinaryString(initialPosition[0]);
  const row = convertToBinaryString(initialPosition[1]);
  let chromosome = [...col, ...row];
  const randomTour = generateRandomTour(rows, cols);
  chromosome = [...chromosome, ...randomTour];
  return chromosome;
}

function getKnightMove(str) {
  if ( str == "000" ) return [ 2, -1];
  if ( str == "001" ) return [ 2,  1];
  if ( str == "010" ) return [ 1,  2];
  if ( str == "011" ) return [-1,  2];
  if ( str == "100" ) return [-2,  1];
  if ( str == "101" ) return [-2, -1];
  if ( str == "110" ) return [ 1, -2];
  return [-1, -2];
}

function getInitialPosition(row, col) {
  let initialPosition = [];
  initialPosition.push(convertBinaryStringToDecimal(row));
  initialPosition.push(convertBinaryStringToDecimal(col));
  return initialPosition;
}

function getNewPosition(lastPosition, knightMove) {
  const newRow = lastPosition[0] + knightMove[0];
  const newCol = lastPosition[1] + knightMove[1];
  return [ newRow, newCol ];
}

function generateInitialPosition(boardRows, boardColumns) {
  const row = Math.ceil(Math.random() * (boardRows - 1));
  const column = Math.ceil(Math.random() * (boardColumns - 1));
  return [row, column];
}

function generateRandomTour(boardRows, boardColumns) {
  const tour = [];
  const squares = boardColumns * boardRows * 3;
  for (let i=0; i<squares; i++) {
    tour.push(Math.random() <= 0.5 ? 0 : 1);
  }
  return tour;
}

function fitnest(chromosome, boardRows, boardColumns) {
  let i = 0;
  let score = 0;
  let moveOrder = 1;
  let knightMove = "";
  let lastPosition = [];
  let wrongMove = false;
  let squares = boardColumns * boardRows;
  let board = initBoard(boardColumns, boardRows);
  let initialPosition = getInitialPosition(
    chromosome.slice(0,3).join(""),
    chromosome.slice(3,6).join("")
  );
  board = makeFirstMove(board, initialPosition, moveOrder);
  moveOrder++;
  lastPosition = initialPosition;
  while(!wrongMove && i < squares) {
    knightMove = getKnightMove(chromosome.slice(i*3+6, i*3+9).join(""));
    if ( isValidMove(board, knightMove, lastPosition, moveOrder) ){
      board = makeMove(board, knightMove, lastPosition, moveOrder);
      lastPosition = getNewPosition(lastPosition, knightMove);
      moveOrder++;
    } else {
      wrongMove = true;
    }
    i++;
  }
  score = (100 / squares) * moveOrder;
  return {
    chromosome: chromosome,
    board: board,
    score: score
  };
}

function initBoard(boardColumns, boardRows) {
  const board = [];
  for (let i=0; i<boardRows; i++) {
    board.push(Array(boardColumns).fill("-"));
  }
  return board;
}

function isValidMove(board, knightMove, lastPosition, moveOrder) {
  const newPosition = getNewPosition(lastPosition, knightMove);
  if (!board[ newPosition[0] ])
    return false;
  if (!board[ newPosition[0] ][ newPosition[1] ])
    return false;
  if ( board[ newPosition[0] ][ newPosition[1] ] != "-" )
    return false;
  return true;
}

function makeFirstMove(board, move, moveOrder) {
  board[ move[0] ][ move[1] ] = moveOrder;
  return board;
}

function makeMove(board, knightMove, lastPosition, moveOrder) {
  const newPosition = getNewPosition(lastPosition, knightMove);
  board[ newPosition[0] ][ newPosition[1] ] = moveOrder;
  return board;
}

//generateTours()

//
//printTourPretty()
console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
console.log("*                  CHESS KNIGHT TOUR                      *");
console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
console.log("");

const rows = 4;
const cols = 8;

let chromosome = initChromosome(rows, cols);
let result = fitnest(chromosome, rows, cols);

console.log(result);
