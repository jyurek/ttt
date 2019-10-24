import { Either, Err } from './lib/types'

type Blank = undefined
const Blank: Blank = undefined
export type Player = 'X' | 'O'
export const Player = {
    O: 'O' as Player,
    X: 'X' as Player,
    after: { X: 'O' as Player, O: 'X' as Player }
}
type Draw = 'draw'
const Draw = 'draw'
type Continue = false
const Continue = false
export type WinState = Player | Draw | Continue
type Space = Player | Blank
type Row = [Space, Space, Space]
type Board = [Row, Row, Row]

export interface Game {
    board: Board
    nextPlayer: Player
    winner: WinState
    id: string
}

export interface Games {
    [id: string]: Game
}

export interface Move {
    player: Player
    x: number
    y: number
}

const newBoard = (): Board => [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
]

let currentGameId = 100
const newGameId = () => (currentGameId++).toString()

export const newGame = () => ({
    board: newBoard(),
    id: newGameId(),
    nextPlayer: 'X' as Player,
    winner: false as WinState
})

export const makeValidMove = (game: Game, move: Move): Either<Err, Game> => {
    if (!inProgress(game)) {
        const winner = game.winner === Draw ? 'no one' : game.winner
        return Either.left({
            error: true,
            message: `Game ${game.id} has been finished and ${winner} won.`
        })
    }

    if (!withinBounds(move)) {
        return Either.left({
            error: true,
            message: 'Both X and Y must be between 0 and 2'
        })
    }

    if (!emptySpot(game, move)) {
        return Either.left({
            error: true,
            message: `Move { x: ${move.x}, y: ${move.y} } has already been taken`
        })
    }

    game.board[move.y][move.x] = move.player
    game.nextPlayer = Player.after[move.player]
    game.winner = winState(game.board)
    return Either.right(game)
}

const withinBounds = (move: Move) =>
    move.x >= 0 && move.x <= 2 && move.y >= 0 && move.y <= 2

const emptySpot = (game: Game, move: Move) => !game.board[move.y][move.x]

const inProgress = (game: Game) => game.winner === Continue

const winState = (board: Board): WinState =>
    // Horizontal
    same(board[0][0], board[0][1], board[0][2]) ||
    same(board[1][0], board[1][1], board[1][2]) ||
    same(board[2][0], board[2][1], board[2][2]) ||
    // Vertical
    same(board[0][0], board[1][0], board[2][0]) ||
    same(board[0][1], board[1][1], board[2][1]) ||
    same(board[0][2], board[1][2], board[2][2]) ||
    // Diagonal
    same(board[0][0], board[1][1], board[2][2]) ||
    same(board[2][0], board[1][1], board[0][2]) ||
    // None, check for Draw
    isDraw(board)

const same = (a: Space, b: Space, c: Space): Space =>
    (a === b && b === c && a) || Blank

const isDraw = (board: Board): WinState =>
    board.find((row: Row) => row.includes(Blank)) ? Continue : Draw
