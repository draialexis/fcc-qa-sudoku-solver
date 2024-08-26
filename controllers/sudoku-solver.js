const IS_VALID = process.env.IS_VALID;
const EMPTY_CELL = '.';
const CHAR_CODE_OF_A = 'A'.charCodeAt(0);

const BUNDLE_SIZE = 9;
const BUNDLE_SQ_ROOT = Math.sqrt(BUNDLE_SIZE);
const BUNDLE_SQUARED = BUNDLE_SIZE * BUNDLE_SIZE;

class SudokuSolver {

  /**
   * Validate the puzzle string to ensure it has 81 valid characters (1-9 or .)
   */
  validate(puzzleString) {
    if (puzzleString.length !== BUNDLE_SQUARED) {
      return `Expected puzzle to be ${BUNDLE_SQUARED} characters long`;
    }

    const nonDigitNorPeriodCharRegExp = /[^1-9.]/g;
    if (nonDigitNorPeriodCharRegExp.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }

    return IS_VALID;
  }

  /**
   * Validate row placement against the current state of the board
   * Don't allow for duplicate entries in the same row
   */
  checkRowPlacement(puzzleString, row, col, value) {
    if (this.isInputBad(value)) {
      return false;
    }

    const rowIndex = this.getRowIndex(row);

    if (!this.isCellEmpty(puzzleString, rowIndex, this.getColIndex(col))) {
      return false;
    }

    const start = rowIndex * BUNDLE_SIZE;
    const rowValues = puzzleString.slice(start, start + BUNDLE_SIZE);

    return !rowValues.includes(value);
  }

  /**
   * Validate column placement against the current state of the board
   * Don't allow for duplicate entries in the same column
   */
  checkColPlacement(puzzleString, row, col, value) {
    if (this.isInputBad(value)) {
      return false;
    }

    const colIndex = this.getColIndex(col);

    if (!this.isCellEmpty(puzzleString, this.getRowIndex(row), colIndex)) {
      return false;
    }

    let colValues = '';

    for (let i = colIndex; i < puzzleString.length; i += BUNDLE_SIZE) {
      colValues += puzzleString[i];
    }

    return !colValues.includes(value);
  }

  /**
   * Validate region placement against the current state of the board
   * Don't allow for duplicate entries in the same region
   */
  checkRegionPlacement(puzzleString, row, col, value) {
    if (this.isInputBad(value)) {
      return false;
    }

    const rowIndex = this.getRowIndex(row);
    const colIndex = this.getColIndex(col);

    if (!this.isCellEmpty(puzzleString, rowIndex, colIndex)) {
      return false;
    }

    const startRow = Math.floor(rowIndex / BUNDLE_SQ_ROOT) * BUNDLE_SQ_ROOT;
    const startCol = Math.floor(colIndex / BUNDLE_SQ_ROOT) * BUNDLE_SQ_ROOT;

    let regionValues = '';

    for (let r = startRow; r < startRow + BUNDLE_SQ_ROOT; r++) {
      for (let c = startCol; c < startCol + BUNDLE_SQ_ROOT; c++) {
        regionValues += puzzleString[this.getCellIndex(r, c)];
      }
    }

    return !regionValues.includes(value);
  }

  /**
   * Solve the given puzzle string, returning the solved puzzle as a string.
   */
  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (validateResult !== IS_VALID) {
      return false;
    }

    if (this.hasUnsolvableCells(puzzleString)) {
      return false;
    }

    const emptyCells = this.getAllEmptyCellIndices(puzzleString);

    let backTrackingStack = [{board: puzzleString, index: 0}];

    while (backTrackingStack.length > 0) {
      let {board, index} = backTrackingStack.pop();

      if (index === emptyCells.length) {
        return board;
      }

      const emptyIndex = emptyCells[index];
      const {rowLetter, colNumber} = this.getRowLetterAndColNumber(emptyIndex);

      let validMoveMade = false;

      for (let num = 1; num <= BUNDLE_SIZE; num++) {
        if (
            this.checkRowPlacement(board, rowLetter, colNumber, num) &&
            this.checkColPlacement(board, rowLetter, colNumber, num) &&
            this.checkRegionPlacement(board, rowLetter, colNumber, num)
        ) {
          const newBoard = this.getBoardWithNewNumAtEmptyIndex(board, num, emptyIndex);
          backTrackingStack.push({board: newBoard, index: index + 1});
          validMoveMade = true;
        }
      }

      if (!validMoveMade && backTrackingStack.length === 0) {
        return false;
      }
    }

    // If no solution was found
    return false;
  }

  /**
   * Check if the puzzle has any empty cells that cannot possibly be filled.
   * This acts as a pre-check to avoid running the full backtracking algorithm
   * on puzzles that are obviously unsolvable.
   */
  hasUnsolvableCells(puzzleString) {
    const emptyCells = this.getAllEmptyCellIndices(puzzleString);

    for (let index of emptyCells) {
      const {rowLetter, colNumber} = this.getRowLetterAndColNumber(index);

      let canBeFilled = false;

      for (let num = 1; num <= BUNDLE_SIZE; num++) {
        if (
            this.checkRowPlacement(puzzleString, rowLetter, colNumber, num) &&
            this.checkColPlacement(puzzleString, rowLetter, colNumber, num) &&
            this.checkRegionPlacement(puzzleString, rowLetter, colNumber, num)
        ) {
          canBeFilled = true;
          break;
        }
      }

      if (!canBeFilled) {
        return true;
      }
    }

    return false;
  }

  getAllEmptyCellIndices(puzzleString) {
    const emptyCells = [];
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === EMPTY_CELL) {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  };

  getRowLetterAndColNumber(emptyIndex) {
    const row = Math.floor(emptyIndex / BUNDLE_SIZE);
    const col = emptyIndex % BUNDLE_SIZE;
    const rowLetter = this.getRowLetter(row);
    const colNumber = this.getColumnNumber(col);
    return {rowLetter, colNumber};
  }

  getColumnNumber(col) {
    return col + 1;
  }

  getColIndex(col) {
    return col - 1;
  }

  getRowLetter(row) {
    return String.fromCharCode(CHAR_CODE_OF_A + row);
  }

  getRowIndex(row) {
    const charCodeOfRow = row.charCodeAt(0);
    return charCodeOfRow - CHAR_CODE_OF_A;
  }

  getCellIndex(rowIndex, colIndex) {
    return rowIndex * BUNDLE_SIZE + colIndex;
  }

  isCellEmpty(puzzleString, rowIndex, colIndex) {
    return puzzleString[this.getCellIndex(rowIndex, colIndex)] === EMPTY_CELL;
  }

  isInputBad(value) {
    const nonDigitNorPeriodCharRegExp = /[^1-9.]/g;
    return value === EMPTY_CELL || nonDigitNorPeriodCharRegExp.test(value);
  }

  getBoardWithNewNumAtEmptyIndex(board, num, emptyIndex) {
    return board.slice(0, emptyIndex) + num + board.slice(emptyIndex + 1);
  }

}

module.exports = SudokuSolver;
