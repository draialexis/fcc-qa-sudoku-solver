'use strict';
const IS_VALID = process.env.IS_VALID;
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/solve').post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      return res.json({error: 'Required field missing'});
    }

    const validationError = solver.validate(puzzle);
    if (validationError !== IS_VALID) {
      return res.json({error: validationError});
    }

    const solution = solver.solve(puzzle);
    if (!solution) {
      return res.json({error: 'Puzzle cannot be solved'});
    }

    return res.json({solution});
  });

  app.route('/api/check').post((req, res) => {
    const {puzzle, coordinate, value} = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({error: 'Required field(s) missing'});
    }

    const validationError = solver.validate(puzzle);
    if (validationError !== IS_VALID) {
      return res.json({error: validationError});
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({error: 'Invalid value'});
    }

    const row = coordinate[0].toUpperCase();
    const col = parseInt(coordinate.slice(1), 10);

    if (!/^[A-I]$/.test(row) || !(col >= 1 && col <= 9)) {
      return res.json({error: 'Invalid coordinate'});
    }

    const rowIndex = solver.getRowIndex(row);
    const colIndex = solver.getColIndex(col);
    if (puzzle[solver.getCellIndex(rowIndex, colIndex)] === value) {
      return res.json({valid: true});
    }

    const isRowValid = solver.checkRowPlacement(puzzle, row, col, value);
    const isColValid = solver.checkColPlacement(puzzle, row, col, value);
    const isRegionValid = solver.checkRegionPlacement(puzzle, row, col, value);

    if (isRowValid && isColValid && isRegionValid) {
      return res.json({valid: true});
    }

    const conflicts = [];
    if (!isRowValid) conflicts.push('row');
    if (!isColValid) conflicts.push('column');
    if (!isRegionValid) conflicts.push('region');

    return res.json({valid: false, conflict: conflicts});
  });
};
