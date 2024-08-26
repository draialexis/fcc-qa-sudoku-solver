const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('POST /api/solve => solution object', () => {

    test('Solve a puzzle with valid puzzle string', (done) => {
      chai.request(server).
          post('/api/solve').
          send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'}).
          end((err, res) => {
            assert.equal(res.body.solution,
                '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
            done();
          });
    });

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server).post('/api/solve').send({}).end((err, res) => {
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
    });

    test('Solve a puzzle with invalid characters', (done) => {
      chai.request(server).
          post('/api/solve').
          send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X'}).
          end((err, res) => {
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      chai.request(server).
          post('/api/solve').
          send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'}).
          end((err, res) => {
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
      chai.request(server).
          post('/api/solve').
          send({puzzle: '2..9............6......1...5.26..4.7.....41......98.23.....3.8...5.1......7......'}).
          end((err, res) => {
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
          });
    });

  });

  suite('POST /api/check => validity object', () => {

    test('Check a puzzle placement with all fields', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle:
            '1.5..2.84' +
            '..63.12.7' +
            '.2..5....' +
            '.9..1....' +
            '8.2.3674.' +
            '3.7.2..9.' +
            '47...8..1' +
            '..16....9' +
            '26914.37.',
        coordinate: 'A2',
        value: '3',
      }).end((err, res) => {
        assert.equal(res.body.valid, true);
        done();
      });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle:
            '1.5..2.84' +
            '..63.12.7' +
            '.2..5....' +
            '.9..1....' +
            '8.2.3674.' +
            '3.7.2..9.' +
            '47...8..1' +
            '..16....9' +
            '26914.37.',
        coordinate: 'A2',
        value: '4',
      }).end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        done();
      });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle:
            '1.5..2.84' +
            '..63.12.7' +
            '.2..5....' +
            '.9..1....' +
            '8.2.3674.' +
            '3.7.2..9.' +
            '47...8..1' +
            '..16....9' +
            '26914.37.',
        coordinate: 'A2',
        value: '2',
      }).end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        done();
      });
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle:
            '1.5..2.84' +
            '..63.12.7' +
            '.2..5....' +
            '.9..1....' +
            '8.2.3674.' +
            '357.2..9.' +
            '47...8..1' +
            '..16....9' +
            '26914.37.',
        coordinate: 'A2',
        value: '5',
      }).end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
      }).end((err, res) => {
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X',
        coordinate: 'A2',
        value: '3',
      }).end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
        coordinate: 'A2',
        value: '3',
      }).end((err, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'Z2',
        value: '3',
      }).end((err, res) => {
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai.request(server).post('/api/check').send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: '10',
      }).end((err, res) => {
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
    });

  });

});
