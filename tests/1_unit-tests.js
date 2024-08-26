const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');

let solver = new Solver();

suite('Unit Tests', () => {

  suite('SudokuSolver.validate()', () => {

    test('Logic handles a valid puzzle string of 81 characters', function() {
      let validPuzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.equal(solver.validate(validPuzzle), process.env.IS_VALID);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
      let invalidPuzzle =
          'XXXXXXXXX' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.equal(solver.validate(invalidPuzzle), 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function() {
      let shortPuzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37';
      let longPuzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37..';
      let zeroPuzzle =
          '';
      assert.equal(solver.validate(shortPuzzle), 'Expected puzzle to be 81 characters long');
      assert.equal(solver.validate(longPuzzle), 'Expected puzzle to be 81 characters long');
      assert.equal(solver.validate(zeroPuzzle), 'Expected puzzle to be 81 characters long');
    });
  });

  suite('SudokuSolver.checkRowPlacement()', () => {

    test('Logic handles a valid row placement', function() {
      let puzzle =
          '..5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 1, 1));
    });

    test('Logic handles an invalid row placement', function() {
      let puzzle =
          '.15..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 1, 1));
    });

    test('Logic handles an invalid row placement (space already taken)', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 1, 3));
    });

    test('Logic handles an invalid row placement (space already taken by the same value)', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 1, 1));
    });
  });

  suite('SudokuSolver.checkColPlacement()', () => {

    test('Logic handles a valid column placement', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isTrue(solver.checkColPlacement(puzzle, 'C', 1, 7));
    });

    test('Logic handles an invalid column placement', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkColPlacement(puzzle, 'B', 1, 8));
    });

    test('Logic handles an invalid column placement (space already taken)', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkColPlacement(puzzle, 'A', 1, 6));
    });

    test('Logic handles an invalid column placement (space already taken by the same value)', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkColPlacement(puzzle, 'A', 1, 1));
    });
  });

  suite('SudokuSolver.checkRegionPlacement()', () => {

    test('Logic handles a valid region (3x3 grid) placement', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isTrue(solver.checkRegionPlacement(puzzle, 'B', 2, 3));
    });

    test('Logic handles an invalid region (3x3 grid) placement', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkRegionPlacement(puzzle, 'B', 2, 5));
    });

    test('Logic handles an invalid region (3x3 grid) placement (space already taken)', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', 1, 6));
    });

    test('Logic handles an invalid region (3x3 grid) placement (space already taken by the same value)', function() {
      let puzzle =
          '1.5..2.84' +
          '..63.12.7' +
          '.2..5....' +
          '.9..1....' +
          '8.2.3674.' +
          '3.7.2..9.' +
          '47...8..1' +
          '..16....9' +
          '26914.37.';
      assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', 1, 1));
    });

    suite('SudokuSolver.solve()', () => {

      test('Valid puzzle strings pass the solver', function() {
        let puzzle =
            '2183967.5' +
            '753284196' +
            '496157832' +
            '5316.2984' +
            '649831257' +
            '827549613' +
            '962415378' +
            '.85763429' +
            '374928561';
        let solution =
            '218396745' +
            '753284196' +
            '496157832' +
            '531672984' +
            '649831257' +
            '827549613' +
            '962415378' +
            '185763429' +
            '374928561';
        assert.equal(solver.solve(puzzle), solution);
      });

      test('Invalid puzzle strings fail the solver', function() {
        let puzzle =
            '1.5..2.84' +
            '..63.12.7' +
            '.2..5....' +
            'X..1....8' +
            '.2.3674.3' +
            '.7.2..9.4' +
            '7...8..1.' +
            '.16....92' +
            '6914.37.';
        assert.isFalse(solver.solve(puzzle));
      });

      test('Unsolvable puzzle strings fail the solver', function() {
        this.timeout(60000);
        let puzzle =
            '2..9.....' +
            '.......6.' +
            '.....1...' +
            '5.26..4.7' +
            '.....41..' +
            '....98.23' +
            '.....3.8.' +
            '..5.1....' +
            '..7......';
        assert.isFalse(solver.solve(puzzle));
      });

      test('Solver returns the expected solution for an incomplete puzzle', function() {
        let puzzle =
            '..839.7.5' +
            '75.....96' +
            '4..1.....' +
            '..16.2984' +
            '6.9.312.7' +
            '..754....' +
            '.62..5.78' +
            '.8...3.2.' +
            '..492...1';
        let solution =
            '218396745' +
            '753284196' +
            '496157832' +
            '531672984' +
            '649831257' +
            '827549613' +
            '962415378' +
            '185763429' +
            '374928561';
        assert.equal(solver.solve(puzzle), solution);
      });

      test('Solver returns the expected solution for an incomplete puzzle 2', function() {
        let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        assert.equal(solver.solve(puzzle), solution);
      });

      test('Solver returns the expected solution for an incomplete puzzle 3', function() {
        let puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
        let solution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
        assert.equal(solver.solve(puzzle), solution);
      });

      test('Solver returns the expected solution for an incomplete puzzle 4', function() {
        let puzzle = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
        let solution = '473891265851726394926345817568913472342687951197254638734162589685479123219538746';
        assert.equal(solver.solve(puzzle), solution);
      });

      test('Solver returns the expected solution for an incomplete puzzle 5', function() {
        let puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
        let solution = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
        assert.equal(solver.solve(puzzle), solution);
      });
    });
  });
});
