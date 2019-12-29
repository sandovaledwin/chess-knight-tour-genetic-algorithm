# Genetic algorithm in Javascript for solving the Chess Knight Tour problem.

![Chess-Knight-Tour](https://github.com/sandovaledwin/chess-knight-tour-genetic-algorithm/blob/master/images/Knights-Tour-Animation.gif)

This project was developed following some of the main ideas found in the next
researches about the subject:

* [Paper - Genetic Algorithms with Heuristic - Knight's Tour Problem](https://www.researchgate.net/publication/220862449_Genetic_Algorithms_with_Heuristic_-_Knight's_Tour_Problem).

* [GeneRepair - A Repair Operator for Genetic Algorithms](https://www.researchgate.net/publication/229149949_GeneRepair_-_A_Repair_Operator_for_Genetic_Algorithms).

## Prerequisites

### Install Git
* [Download](https://git-scm.com/downloads).

### Install NodeJS
* [Download](https://nodejs.org/en/download/).

## 1. Clone the project.
After installing the git CLI tool and NodeJS compiler, you'll be ready to start working.

### 1.1 Clone the repository.
  ```
  git clone https://github.com/sandovaledwin/chess-knight-tour-genetic-algorithm
  ```

### 1.2 Go into the directory.
  ```
  cd chess-knight-tour-genetic-algorithm
  ```

## 2. Running the project.
Now, you're ready for performing the calculation of the first knight tour over a chess board of NxN.

### 3.1 Copy the excel document that contains all the information into the next path.
  ```
  npm run start
  ```

## 3. Results.
After finishing successfully the program, you'll be getting the a complete knight tour over a chess board.
  ```
  Best Score:  100
  Best Board:
  [ [ 13, 10, 17, 22, 37, 40, 43, 24 ],
    [ 18, 21, 14, 11, 16, 23, 38, 41 ],
    [ 9, 12, 19, 36, 39, 42, 25, 44 ],
    [ 20, 35, 30, 15, 48, 45, 54, 59 ],
    [ 31, 8, 1, 46, 53, 58, 49, 26 ],
    [ 34, 5, 32, 29, 2, 47, 60, 55 ],
    [ 7, 64, 3, 52, 57, 62, 27, 50 ],
    [ 4, 33, 6, 63, 28, 51, 56, 61 ] ]
  Execution time (hr): 23s 588.610731ms
  ```

## 4. Extra.
If you want to know more about this problem, you can follow the next references:

* [Chess Knight Tour problem description - Youtube](https://www.youtube.com/watch?v=ab_dY3dZFHM).
* [Wikipedia](https://en.wikipedia.org/wiki/Knight%27s_tour).