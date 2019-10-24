import { Request, Response } from 'express'

type Blank = undefined
const Blank: Blank = undefined
type Player = 'X' | 'O'
const Player = {
    O: 'O' as Player,
    X: 'X' as Player,
    after: { X: 'O' as Player, O: 'X' as Player }
}
type Draw = 'draw'
const Draw = 'draw'
type Continue = false
const Continue = false
type WinState = Player | Draw | Continue
type Space = Player | Blank
type Row = [Space, Space, Space]
type Board = [Row, Row, Row]

interface Game {
    board: Board
    nextPlayer: Player
    winner: WinState
    id: string
}

interface Games {
    [id: string]: Game
}

interface Move {
    player: Player
    x: number
    y: number
}

enum ResponseCode {
    OK = 200,
    Created = 201,
    NoContent = 204,
    NotFound = 404,
    UnprocessableEntity = 422,
    ServerError = 500
}

const games: Games = {}

type Either<E, R> = ['left', E] | ['right', R]
const left = <T>(data: T): Either<T, any> => ['left', data]
const right = <T>(data: T): Either<any, T> => ['right', data]

interface Err {
    error: boolean
    message: string
}

const viewAll = (_request: Request, response: Response) => {
    response.status(ResponseCode.OK).json(games)
}

const create = (_request: Request, response: Response) => {
    const newGame = {
        board: newBoard(),
        id: newGameId(),
        nextPlayer: 'X' as Player,
        winner: false as WinState
    }
    games[newGame.id] = newGame
    response.status(ResponseCode.Created).json(newGame)
}

const newBoard = (): Board => [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
]

let currentGameId = 100
const newGameId = () => (currentGameId++).toString()

const viewOne = (request: Request, response: Response) => {
    const game = games[request.params.id]
    const status = game ? ResponseCode.OK : ResponseCode.NotFound
    response.status(status).json(game || {})
}

const makeMove = (request: Request, response: Response) => {
    const game = games[request.params.id]
    const { x, y } = request.body
    if (game) {
        const { nextPlayer: player } = game
        const move = { player, x, y }
        const [tag, data]: Either<Err, Game> = makeValidMove(game, move)
        switch (tag) {
            case 'left':
                response.status(ResponseCode.UnprocessableEntity).send(data)
                break
            case 'right':
                response.status(ResponseCode.OK).json(data)
                break
        }
    } else {
        response.status(ResponseCode.NotFound).send()
    }
}

const makeValidMove = (game: Game, move: Move): Either<Err, Game> => {
    if (!inProgress(game)) {
        const winner = game.winner === Draw ? 'no one' : game.winner
        return left({
            error: true,
            message: `Game ${game.id} has been finished and ${winner} won.`
        })
    }

    if (!withinBounds(move)) {
        return left({
            error: true,
            message: 'Both X and Y must be between 0 and 2'
        })
    }

    if (!emptySpot(game, move)) {
        return left({
            error: true,
            message: `Move { x: ${move.x}, y: ${move.y} } has already been taken`
        })
    }

    game.board[move.y][move.x] = move.player
    game.nextPlayer = Player.after[move.player]
    game.winner = winState(game.board)
    return right(game)
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

const cancel = (request: Request, response: Response) => {
    games[request.params.id] = undefined
    response.status(ResponseCode.NoContent).send('OK')
}

export { viewAll, create, viewOne, makeMove, cancel }
