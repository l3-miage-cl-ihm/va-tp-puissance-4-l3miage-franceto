import { TestBed } from '@angular/core/testing';
//import { inherits } from 'util';
import {
  Board,
  genBoard,
  genBoardResult,
  initReturns,
  similarBoard,
  Token,
  winnerReturns,
} from './puissance4.data';
import { Puissance4Service } from './puissance4.service';
import { assertEqual, Assertion } from './utils.alx';

describe('Puissance4Service test init', () => {
  let service: Puissance4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Puissance4Service);
  });

  it('Puissance4Service should be created', () => {
    expect(service).toBeTruthy();
  });

  // Tests init()

  it('should init an empty 7x5', () => {
    const b: Board = {
      width: 7,
      height: 5,
      data: [[], [], [], [], [], [], []],
    };
    const R = service.init(b);
    expect(R.error).toBeUndefined();
    expect(service.board).toBe(b);
  });

  it('Undefined is expected when the board is valid', () => {
    const b: Board = {
      width: 7,
      height: 5,
      data: [['RED', 'YELLOW'], ['RED'], [], [], [], [], []],
    };
    const R = service.init(b);
    expect(R.error === undefined).toBe(true);
  });

  it('Invalid magnitudes is expected when width or height or > 0', () => {
    const b: Board = {
      width: -7,
      height: 5,
      data: [['RED', 'YELLOW'], ['YELLOW'], [], [], [], [], []],
    };
    const R = service.init(b);
    expect(R.error === 'invalid magnitudes').toBe(true);
  });

  it('Invalid data is expected when the number of token of each color is not egal or +1', () => {
    const b: Board = {
      width: 7,
      height: 5,
      data: [['RED', 'YELLOW'], ['YELLOW'], [], [], [], [], []],
    };
    const R = service.init(b);
    expect(R.error === 'invalid data').toBe(true);
  });

  // Tests play()

  it('should allow the play of the given token to the given column', () => {
    let b: Board;
    const gb = genBoard(` |
                          |
                          |
                          |
                          |  RYR
                          |-------`);
    const token: Token = 'YELLOW';
    const column: number = 2;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error).toBeUndefined();
    }
  });

  it('should allow the play of the given token to the given column', () => {
    let b: Board;
    const gb = genBoard(` |
                          |
                          |
                          |
                          |  RYR
                          |-------`);
    const token: Token = 'YELLOW';
    const column: number = 6;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error).toBeUndefined();
    }
  });

  it('expect out of range error', () => {
    let b: Board;
    const gb = genBoard(` |
                          |
                          |
                          |
                          |  RYR
                          |-------`);
    const token: Token = 'RED'
    const column: number = 7;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'out of range').toBeTrue();
    }
  });

  it('expect out of range error', () => {
    let b: Board;
    const gb = genBoard(` |
                          |
                          |
                          |
                          |  RYR
                          |-------`);
    const token: Token = 'RED'
    const column: number = -1;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'out of range').toBeTrue();
    }
  });

  it('expect column is full error', () => {
    let b: Board;
    const gb = genBoard(` |  R
                          |  Y
                          |  R
                          |  Y
                          |  R
                          |-------`);
    const token: Token = 'YELLOW'
    const column: number = 2;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'column is full').toBeTrue();
    }
  });

  it('expect column is full error', () => {
    let b: Board;
    const gb = genBoard(` |R 
                          |Y
                          |R
                          |Y
                          |R
                          |-------`);
    const token: Token = 'YELLOW'
    const column: number = 0;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'column is full').toBeTrue();
    }
  });

  it('expect column is full error', () => {
    let b: Board;
    const gb = genBoard(` |      R 
                          |      Y
                          |      R
                          |      Y
                          |      R
                          |-------`);
    const token: Token = 'YELLOW'
    const column: number = 6;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'column is full').toBeTrue();
    }
  });

  it('expect not your turn error', () => {
    let b: Board;
    const gb = genBoard(` |
                          |
                          |
                          |
                          |
                          |-------`);
    const token: Token = 'YELLOW'
    const column: number = 4;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'not your turn').toBeTrue();
    }
  });

  it('expect not your turn error', () => {
    let b: Board;
    const gb = genBoard(` |
                          |
                          |
                          |
                          | RY
                          |-------`);
    const token: Token = 'YELLOW'
    const column: number = 4;
    if (gb.error === undefined) {
      b = gb.board;
      const R = service.init(b);
      expect(R.error).toBeUndefined();
      const RP = service.play(token, column);
      expect(RP.error === 'not your turn').toBeTrue();
    }
  });


});



describe('Puissance4Service test play', () => {
  let service: Puissance4Service;
  let empty7x5: Board;

  beforeAll(() => {
    const gb = genBoard(` |
                          |
                          |
                          |
                          |
                          |-------`);
    if (gb.error === undefined) {
      empty7x5 = gb.board;
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Puissance4Service);
  });

  it('should not be possible to start with YELLOW', () => {
    service.init(empty7x5);
    const res = service.play('YELLOW', 1);
    expect(res.error).toEqual('not your turn');
  });
});

describe('Puissance4Service test winner', () => {
  let service: Puissance4Service;
  let empty7x5: Board;

  beforeAll(() => {
    const gb = genBoard(` |
                          |
                          |
                          |
                          |
                          |-------`);
    if (gb.error === undefined) {
      empty7x5 = gb.board;
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Puissance4Service);
  });

  it('no winner when starting', () => {
    service.init(empty7x5);
    expect(service.winner(1)).toEqual('NONE');
    expect(service.winner(2)).toEqual('NONE');
    expect(service.winner(3)).toEqual('NONE');
    expect(service.winner(4)).toEqual('NONE');
    expect(service.winner(5)).toEqual('NONE');
  });
});

