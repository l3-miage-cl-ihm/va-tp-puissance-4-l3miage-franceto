import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  Board,
  emptyBoard,
  initReturns,
  playReturns,
  Puissance4Interface,
  Token,
  winnerReturns,
} from './puissance4.data';

@Injectable({
  providedIn: 'root',
})
export class Puissance4Service implements Puissance4Interface {
  private readonly _boardSubj = new BehaviorSubject<Board>(emptyBoard);
  public readonly boardObs = this._boardSubj.asObservable();

  /** The current board managed by the service \
   * board[i][j] is the position at column i, line j \
   * For each column, lines begins at the "bottom" \
   * Exemple with a 4 x 3 board \
   * 2          \
   * 1          \
   * 0 1 2 3 4
   */
  get board(): Board {
    return this._boardSubj.value;
  }
  set board(b: Board) {
    this._boardSubj.next(b);
  }
  /**
   * Initialize the board.
   * Errors should be considered in order (if several errors are possible, returns the first one in the following list)
   * @param board The new board
   * @returns \{error: undefined, board: Board} if the board is valid
   * @returns \{error: 'invalid magnitudes'} if width or height are not valid magnitude (i.e. strictly positive integers)
   * @returns \{error: 'invalid data'} if data contains invalid number of tokens (#RED should be equals to #YELLOW or #YELLOW+1)
   *                                   or if data has different magnitudes than width and height (if they are valid ones).
   */
  init(board: Board): initReturns {
    if (board.height < 1 || board.width < 1) {
      console.log('Init : ', { error: 'invalid magnitudes' });
      return { error: 'invalid magnitudes' };
    }

    if (!board.data.every((col) => col.length <= board.height)) {
      console.log('Init : ', { error: 'invalid data' });
      return { error: 'invalid data' };
    }

    let nbRed: number = 0;
    let nbYellow: number = 0;
    board.data.forEach((row) =>
      row.forEach((c) => {
        if (c === 'RED') {
          nbRed++;
        } else {
          nbYellow++;
        }
      })
    );

    if (nbRed !== nbYellow && nbRed !== nbYellow + 1) {
      console.log('Init : ', { error: 'invalid data' });
      return { error: 'invalid data' };
    }

    this.board = board;
    console.log('Init : ', { error: undefined, board });
    return { error: undefined, board };
  }

  /**
   * Play token at column \
   * PRECONDITION : the board is correct.
   * Errors should be considered in order (if several errors are possible, returns the first one in the following list)
   * @param token The token to play
   * @param column The column where to play, must be an integer
   * @returns \{error: undefined, board: the new board} with token t at column in case of success. The new board is then set to the board attribute
   * @returns \{error: 'out of range'} in case column is not a valid column index :
   * @returns \{error: 'column is full'} in case column is ALREADY full.
   * @returns \{error: 'not your turn'} As RED begins, then #RED should be equals to #YELLOW or #YELLOW + 1.
   */
  play(token: Token, column: number): playReturns {
    if (column >= this.board.width || column < 0) {
      return { error: 'out of range' };
    }

    if (this.board.data[column][this.board.height - 1] !== undefined) {
      return { error: 'column is full' };
    }

    var nbRed: number = 0;
    var nbYellow: number = 0;
    this.board.data.forEach((row) =>
      row.forEach((c) => {
        if (c === 'RED') {
          nbRed++;
        } else {
          nbYellow++;
        }
      })
    );
    if (token === 'RED') {
      nbRed++;
    } else if (token === 'YELLOW') {
      nbYellow++;
    }
    if (nbRed !== nbYellow && nbRed != nbYellow + 1) {
      return { error: 'not your turn' };
    }
    var i = 0;
    while (i < this.board.height && this.board.data[column] !== undefined) {
      i++;
    }
    var nBoard: Board = {
      ...this.board,
      data: this.board.data.map((L, i) => i != column ? L : [...L, token])
    };
    return { error: undefined, board: nBoard };
  }

  /**
   * Identify who is the winner, if there is any. NONE otherwise. \
   * The winner has got at least nb tokens aligned.
   * nb should be >= 3, if it is not, result should be set to NONE.\
   * If two winners are possible, then choose the one that has a winning token
   * at the lower column index or the lower line index if columns are the same. \
   * PRECONDITION : the board is correct.
   * @param nb Minimal number of token that have to be aligned (in any of 8 directions) to declare a winner
   * @returns the token of the winner if any, NONE otherweise
   */
   winner(nb: number): winnerReturns {

    if(this.init(this.board).error !== undefined || nb < 3){
      console.log("unvalid board")
      return 'NONE'
    }

    let winner: winnerReturns = 'NONE';

    this.board.data.forEach((column, x) => column.forEach((token, y) => {
      console.log("token", token, "x", x, "y", y, winner);
      [[0, 1], [1, 1], [1, 0], [1, -1]].forEach(([xMove, yMove]) => {
        let x2 = x;
        let y2 = y;
        let nbToken = 0;
        while (winner === 'NONE' && x2 >= 0 && x2 < this.board.width && y2 >= 0 && y2 < this.board.data[x2].length && this.board.data[x2][y2] === token) {
          nbToken++;
          console.log("  -  token", token, "x2", x2, "y2", y2, "nbToken", nbToken);
          if (nbToken === nb) {
            winner = token;
            console.log("WINNER");
          } else {
            x2 += xMove;
            y2 += yMove;
          }
        }
      })
    }));

    return winner;
  }
}
