const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const MAX_ITERATIONS = 20000;
const MUTATION_CHANCE = 0.5;
const POPULATION_SIZE = 50;

function convertBinaryStringToDecimal(str) {
  if (str == "000") return 0;
  if (str == "001") return 1;
  if (str == "010") return 2;
  if (str == "011") return 3;
  if (str == "100") return 4;
  if (str == "101") return 5;
  if (str == "110") return 6;
  return 7;
}

function convertToBinaryString(num) {
  if (num == 0) return [0, 0, 0];
  if (num == 1) return [0, 0, 1];
  if (num == 2) return [0, 1, 0];
  if (num == 3) return [0, 1, 1];
  if (num == 4) return [1, 0, 0];
  if (num == 5) return [1, 0, 1];
  if (num == 6) return [1, 1, 0];
  return [1, 1, 1];
}

function changePositionInitial(chromosome) {
  const initialPosition = generateInitialPosition();
  const col = convertToBinaryString(initialPosition[0]);
  const row = convertToBinaryString(initialPosition[1]);
  let newPosition = [...col, ...row];
  return [...newPosition, ...chromosome.slice(6)];
}

function initChromosome() {
  const initialPosition = generateInitialPosition();
  const col = convertToBinaryString(initialPosition[0]);
  const row = convertToBinaryString(initialPosition[1]);
  let chromosome = [...col, ...row];
  const randomTour = generateRandomTour();
  chromosome = [...chromosome, ...randomTour];
  return chromosome;
}

function getKnightMove(str) {
  if (str == "000") return [2, -1];
  if (str == "001") return [2, 1];
  if (str == "010") return [1, 2];
  if (str == "011") return [-1, 2];
  if (str == "100") return [-2, 1];
  if (str == "101") return [-2, -1];
  if (str == "110") return [1, -2];
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
  return [newRow, newCol];
}

function generateInitialPosition() {
  let row = Math.ceil(Math.random() * (BOARD_ROWS - 1));
  let column = Math.ceil(Math.random() * (BOARD_COLS - 1));
  if (row >= BOARD_ROWS) row = 0;
  if (column >= BOARD_COLS) column = 0;
  return [row, column];
}

function generateMutation(population) {
  let populationAfterMutate = [];
  let chromosome = [];
  for (i = 0; i < population.length; i++) {
    chromosome = mutate(population[i].chromosome);
    populationAfterMutate.push(fitnest(chromosome));
  }
  populationAfterMutate.sort(sortByScore);
  return populationAfterMutate;
}

function generatePopulation() {
  let population = [];
  let chromosome = [];
  for (i = 0; i < POPULATION_SIZE; i++) {
    chromosome = initChromosome();
    population.push(fitnest(chromosome));
  }
  population.sort(sortByScore);
  return population;
}

function generateRandomTour() {
  const tour = [];
  const squares = BOARD_ROWS * BOARD_COLS * 3;
  for (let i = 0; i < squares; i++) {
    tour.push(Math.random() <= 0.5 ? 0 : 1);
  }
  return tour;
}

function initBoard() {
  const board = [];
  for (let i = 0; i < BOARD_ROWS; i++) {
    board.push(Array(BOARD_COLS).fill("-"));
  }
  return board;
}

function doWeHaveValidMove(board, knightMove, lastPosition, moveOrder) {
  const newPosition = getNewPosition(lastPosition, knightMove);
  if (!board[newPosition[0]])
    return false;
  if (!board[newPosition[0]][newPosition[1]])
    return false;
  if (board[newPosition[0]][newPosition[1]] != "-")
    return false;
  return true;
}

function makeFirstMove(board, move, moveOrder) {
  board[move[0]][move[1]] = moveOrder;
  return board;
}

function makeMove(board, knightMove, lastPosition, moveOrder) {
  const newPosition = getNewPosition(lastPosition, knightMove);
  board[newPosition[0]][newPosition[1]] = moveOrder;
  return board;
}

function crossover(chromosome1, chromosome2) {
  const pivot = Math.round(chromosome1.length / 2) - 1;
  const child1 = [...chromosome1.slice(0, 6), ...chromosome1.slice(6, pivot), ...chromosome2.slice(pivot)];
  const child2 = [...chromosome2.slice(0, 6), ...chromosome2.slice(6, pivot), ...chromosome1.slice(pivot)];
  return [child1, child2];
}

function mutate(chromosome) {
  if (Math.random() > MUTATION_CHANCE) return chromosome;
  const index = Math.floor(Math.random() * chromosome.length);
  const upOrDown = Math.random() <= 0.5 ? 0 : 1;
  if (index <= 5) chromosome = changePositionInitial(chromosome);
  if (index > 5) chromosome[index] = upOrDown;
  return chromosome;
}

function fitnest(chromosome, geneRepair = false) {
  let isValidMove = false;
  let pos = 0;
  let score = 0;
  let moveOrder = 1;
  let knightMove = [];
  let lastPosition = [];
  let wrongMove = false;
  let squares = BOARD_ROWS * BOARD_COLS;
  let board = initBoard();
  let initialPosition = getInitialPosition(
    chromosome.slice(0, 3).join(""),
    chromosome.slice(3, 6).join("")
  );
  board = makeFirstMove(board, initialPosition, moveOrder);
  moveOrder++;
  lastPosition = initialPosition;
  while (!wrongMove && pos < squares) {
    knightMove = getKnightMove(chromosome.slice(pos * 3 + 6, pos * 3 + 9).join(""));
    isValidMove = doWeHaveValidMove(board, knightMove, lastPosition, moveOrder);
    if (isValidMove) {
      board = makeMove(board, knightMove, lastPosition, moveOrder);
      lastPosition = getNewPosition(lastPosition, knightMove);
    }
    if (!isValidMove && geneRepair) {
      wrongMove = true;
      knightMove = tryValidMove(board, lastPosition, moveOrder);
      if (knightMove.length > 0) {
        board = makeMove(board, knightMove, lastPosition, moveOrder);
        lastPosition = getNewPosition(lastPosition, knightMove);
        wrongMove = false;
      }
    }
    moveOrder++;
    pos++;
  }
  score = getScore(moveOrder);
  return {
    board: board,
    chromosome: chromosome,
    score: score
  };
}

function getScore(moveOrder) {
  const boardSize = BOARD_ROWS * BOARD_COLS;
  return (100 / boardSize) * (moveOrder - 2);
}

function tryValidMove(board, lastPosition, moveOrder) {
  let knightMove = [];
  if (doWeHaveValidMove(board, getKnightMove("000"), lastPosition, moveOrder))
    knightMove = getKnightMove("000");
  if (doWeHaveValidMove(board, getKnightMove("001"), lastPosition, moveOrder))
    knightMove = getKnightMove("001");
  if (doWeHaveValidMove(board, getKnightMove("010"), lastPosition, moveOrder))
    knightMove = getKnightMove("010");
  if (doWeHaveValidMove(board, getKnightMove("011"), lastPosition, moveOrder))
    knightMove = getKnightMove("011");
  if (doWeHaveValidMove(board, getKnightMove("100"), lastPosition, moveOrder))
    knightMove = getKnightMove("100");
  if (doWeHaveValidMove(board, getKnightMove("101"), lastPosition, moveOrder))
    knightMove = getKnightMove("101");
  if (doWeHaveValidMove(board, getKnightMove("110"), lastPosition, moveOrder))
    knightMove = getKnightMove("110");
  if (doWeHaveValidMove(board, getKnightMove("111"), lastPosition, moveOrder))
    knightMove = getKnightMove("111");
  return knightMove;
}

function geneRepair(population) {
  let child = {};
  const repairActivated = true;
  for (let i = 0; i < population.length; i++) {
    child = fitnest(population[i].chromosome, repairActivated);
    population.splice(i, 1, child);
  }
  population.sort(sortByScore);
  return population;
}

function printPopulation(population) {
  for (let i = 0; i < population.length; i++) {
    console.log(population[i].score);
    console.log(population[i].board);
  }
}

function selectAndInsertTheTwoFittest(population) {
  const children = crossover(population[0].chromosome, population[1].chromosome);
  const child_1 = fitnest(children[0]);
  const child_2 = fitnest(children[1]);
  population.splice(population.length - 2, 2, child_1, child_2);
  population.sort(sortByScore);
  return population;
}

function sortByScore(a, b) {
  return b.score - a.score;
}

function run() {
  const hrstart = process.hrtime();
  let bestScore = 0;
  let bestBoard = {};
  let population = generatePopulation();
  let iteration = 0;
  while (iteration < MAX_ITERATIONS && bestScore < 100) {
    population = selectAndInsertTheTwoFittest(population);
    population = generateMutation(population);
    population = geneRepair(population);
    console.log("Iteration: ", iteration + 1);
    printPopulation(population);
    if (bestScore < population[0].score) {
      bestScore = population[0].score;
      bestBoard = population[0].board;
    }
    iteration++;
  }
  console.log("Best Score: ", bestScore);
  console.log("Best Board: ");
  console.log(bestBoard);
  const hrend = process.hrtime(hrstart);
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
}

function printProgramName() {
  console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
  console.log("*                  CHESS KNIGHT TOUR                      *");
  console.log("*                                                         *");
  console.log("*  by: Carlos Edwin Sandoval Diaz                         *");
  console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
  console.log("");
}

printProgramName();

run();
