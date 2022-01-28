import { TestBed } from '@angular/core/testing';
import { Board, genBoard, genBoardResult, initReturns, similarBoard, winnerReturns } from './puissance4.data';
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

  it("should init an empty 7x5", () => {
    const b: Board = {width: 7, height: 5, data: [[], [], [], [], [], [], []]};
    const R = service.init(b);
    expect( R.error ).toBeUndefined();
    expect( service.board ).toBe( b );
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

  it("should not be possible to start with YELLOW", () => {
    service.init(empty7x5);
    const res = service.play('YELLOW', 1);
    expect(res.error).toEqual("not your turn");
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

  it("no winner when starting", () => {
    service.init(empty7x5);
    expect( service.winner(1) ).toEqual("NONE")
    expect( service.winner(2) ).toEqual("NONE")
    expect( service.winner(3) ).toEqual("NONE")
    expect( service.winner(4) ).toEqual("NONE")
    expect( service.winner(5) ).toEqual("NONE")
  });

});
