'use strict';
const IS_VALID = process.env.IS_VALID;
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {

  });

  app.route('/api/solve').post((req, res) => {

  });
};
