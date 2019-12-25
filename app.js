function convertBinaryStringToDecimal(str) {
  if ( str == "000" ) return 0;
  if ( str == "001" ) return 1;
  if ( str == "010" ) return 2;
  if ( str == "011" ) return 3;
  if ( str == "100" ) return 4;
  if ( str == "101" ) return 5;
  if ( str == "110" ) return 6;
  return 7;
}

function convertToBinaryString(num) {
  if ( num == 0 ) return [0,0,0];
  if ( num == 1 ) return [0,0,1];
  if ( num == 2 ) return [0,1,0];
  if ( num == 3 ) return [0,1,1];
  if ( num == 4 ) return [1,0,0];
  if ( num == 5 ) return [1,0,1];
  if ( num == 6 ) return [1,1,0];
  return [1,1,1];
}

function changePositionInitial(chromosome, rows, cols) {
  const initialPosition = generateInitialPosition(rows, cols);
  const col = convertToBinaryString(initialPosition[0]);
  const row = convertToBinaryString(initialPosition[1]);
  let newPosition = [...col, ...row];
  return [...newPosition, ...chromosome.slice(6)];
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
  let row = Math.ceil(Math.random() * (boardRows - 1));
  let column = Math.ceil(Math.random() * (boardColumns - 1));
  if (row >= boardRows) row = 0;
  if (column >= boardColumns) column = 0;
  return [row, column];
}

function generateMutation(population, chance, rows, cols) {
  let populationAfterMutate = [];
  let chromosome = [];
  for (i=0; i<population.length; i++) {
    chromosome = mutate(population[i].chromosome, chance);
    populationAfterMutate.push(fitnest(chromosome, rows, cols));
  }
  populationAfterMutate.sort(sortByScore);
  return populationAfterMutate;
}

function generatePopulation(size, rows, cols) {
  let population = [];
  let chromosome = [];
  for (i=0; i<size; i++) {
    chromosome = initChromosome(rows, cols);
    population.push(fitnest(chromosome, rows, cols));
  }
  population.sort(sortByScore);
  return population;
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
  console.log("chromosome:");
  console.log(chromosome.slice(0,10));
  console.log(initialPosition);
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

function mate(chromosome1, chromosome2) {
  const pivot = Math.round(chromosome1.length / 2) - 1;
  const child1 = [ ...chromosome1.slice(0, 6), ...chromosome1.slice(6, pivot), ...chromosome2.slice(pivot) ];
  const child2 = [ ...chromosome2.slice(0, 6), ...chromosome2.slice(6, pivot), ...chromosome1.slice(pivot) ];
  return [child1, child2];
}

function mutate(chromosome, chance) {
  if (Math.random() > chance) return chromosome;
  const index = Math.floor(Math.random() * chromosome.length);
  const upOrDown = Math.random() <= 0.5 ? 0 : 1;
  if (index <= 5 ) chromosome = changePositionInitial(chromosome, rows, cols);
  if (index > 5) chromosome[index] = upOrDown;
  return chromosome;
}

function printPopulation(population) {
  for (let i=0; i<population.length; i++) {
    console.log(population[i].score);
    console.log(population[i].board);
  }
}

function selectAndInsertTheTwoFittest(population, rows, cols) {
  const children = mate(population[0].chromosome, population[1].chromosome);
  const child_1 = fitnest(children[0], rows, cols);
  const child_2 = fitnest(children[1], rows, cols);
  population.splice(population.length - 2, 2, child_1, child_2);
  population.sort(sortByScore);
  return population;
}

function sortByScore(a, b) {
  return b.score - a.score;
}

function run(populationSize, iterations, mutationChance, rows, cols) {
  let bestScore = 0;
  let bestBoard = {};
  let times = 1;
  let population = generatePopulation(populationSize, rows, cols);
  for (let i=0; i<iterations; i++) {
    population = selectAndInsertTheTwoFittest(population, rows, cols);
    population = generateMutation(population, mutationChance, rows, cols);
    console.log("Iteration: ", i + 1);
    printPopulation(population);
    if (bestScore < population[0].score) {
      bestScore = population[0].score;
      bestBoard = population[0].board;
    }
  }
  console.log("Best Score: ", bestScore);
  console.log("Best Board: ");
  console.log(bestBoard);
}

console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
console.log("*                  CHESS KNIGHT TOUR                      *");
console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
console.log("");

const rows = 4;
const cols = 8;
const iterations = 30000;
const mutationChance = 0.5;
const populationSize = 50;

run(populationSize, iterations, mutationChance, rows, cols);


