export type Token = 'RED' | 'YELLOW';
export interface Board {
  /** An immutable array of array of tokens */
  readonly data: readonly Readonly<Token[]>[];
  /** Number of columns of the board */
  readonly width: number;
  /** Number of lines of the board */
  readonly height: number;
}

/** An empty board (width=height=0, data=[]) */
export const emptyBoard: Board = {data: [], width: 0, height: 0};

/**
 * Returns true if a and b are similar boards (same magnitudes, same data values)
 * @param a A board
 * @param b A board
 * @returns a and b have same width, same length and same data values
 */
export function similarBoard(a: Board, b: Board): boolean {
  return a.width  === b.width
      && a.height === b.height
      && a.data.length === b.data.length
      && !a.data.find( (LA, i) => LA.length !== b.data[i].length || LA.find( (v, j) => v !== b.data[i][j]) );
}


/**
 * Interface for Puissance4
 */
export type initReturns   = {error: undefined, board: Board} | {error: 'invalid magnitudes' | 'invalid data'};
export type playReturns   = {error: undefined, board: Board} | {error: 'out of range' | 'not your turn' | 'column is full'};
export type winnerReturns = Token | 'NONE';
export interface Puissance4Interface {
  readonly board: Board;
  init(board: Board): initReturns;
  play(token: Token, column: number): playReturns;
  winner(nb: number): winnerReturns;
}

export type genBoardResult = {error: undefined, board: Board} | {error: "string non parsable to a Board"}
/**
 * Parse a string and returns a board.
 *   First column is made of '|'.
 *   The cases must be R, Y or ' ' \
 *   |R  R \
 *   |YR R \
 *   |----    <= bottom line, defines the width
 * @param str The string to be parsed
 * @returns an error or a board
 */
export function genBoard(str: string): genBoardResult {
  const L = str.trim().split("\n").map(s => s.trim()).reverse();
  const height = L.length - 1;
  //if (height >= 1) {
    if (  L.slice(1).find( l => l.charAt(0) !== '|' )
       ||!/^\|\-*$/.exec( L[0] )
       ) {
      return {error: 'string non parsable to a Board'}
    } else {
      const [base, ...LD] = L.map( s => s.slice(1) );
      const D = base.split('').map( (_, i) => LD.map( lc => {
        switch(lc[i]) {
          case 'R': case 'Y': return lc[i];
          case undefined: case ' ': return ' ';
          default: return 'X';
        }
      } ).join('').trimRight() );
      if (D.find( C => !/^[R|Y]*$/.exec(C) ) ) {
        return {error: 'string non parsable to a Board'}
      } else {
        const width = base.length;
        return {
          error: undefined,
          board: {width, height, data: D.map( c => c.split('').map( v => v==='R'?'RED':'YELLOW' ) ) }
        };
      }
    }
  //} else {
  //  return {error: 'string non parsable to a Board'}
  //}
}
