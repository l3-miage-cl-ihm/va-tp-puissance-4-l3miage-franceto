import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Board, genBoard, Token, winnerReturns } from './puissance4.data';
import { Puissance4Service } from './puissance4.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly board: Observable<Board>;
  current: Token = 'RED';
  message: Object = {};

  constructor(private p4s: Puissance4Service) {
    this.board = p4s.boardObs;
    const winR4_2_7x5 = genBoard(`|   Y
                                  |RYYY
                                  |RYRYRYR
                                  |YRYRYRY
                                  |RYRYRRR
                                  |-------
    `);
    if (winR4_2_7x5.error === undefined) {
      this.message = p4s.init(winR4_2_7x5.board);
    }
  }

  /**
   * Display a board as a matrix of tokens and empty strings.
   * @param b The board to display
   * @returns A matrix composed of tokens and ''
   */
  matrix(b: Board): (Token | '')[][] {
    const D = b.data;
    return Array(b.height).fill(0).map(
      (_, j) => D.map( (_, i) => D[i][j] ?? '' )
    ).reverse();
  }

  play(i: number): void {
    this.message = this.p4s.play(this.current, i);
  }

  winner(n: number): winnerReturns {
    return this.p4s.winner(n);
  }
}
