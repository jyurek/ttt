import { Request, Response } from 'express'

type Blank = undefined
type Player = 'X' | 'O'
type WinState = Player | 'draw' | false
type Space = Player | Blank
type Row = [Space, Space, Space]
type Board = [Row, Row, Row]

interface Game {
    board: Board
    player: Player
    moves: number
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

const viewAll = (_request: Request, response: Response) => {
    response.status(ResponseCode.OK).json(games)
}

const create = (_request: Request, response: Response) => {
    const newGame = {
        board: newBoard(),
        player: 'X' as Player,
        id: newGameId(),
        moves: 0,
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
        const { player } = game
        const move = { player, x, y }
        const [tag, data]: Either<string, Game> = makeValidMove(game, move)
        switch (tag) {
            case 'left':
                response.status(ResponseCode.UnprocessableEntity).send(data)
            case 'right':
                response.status(ResponseCode.OK).json(data)
        }
    } else {
        response.status(ResponseCode.NotFound).send()
    }
}

const makeValidMove = (game: Game, move: Move): Either<string, Game> => {
    if (!withinBounds(move)) {
        return left('Both X and Y must be between 0 and 2')
    }

    if (!emptySpot(game, move)) {
        return left(`Move ${move} has already been taken`)
    }

    game.board[move.y][move.x] = move.player
    return right({
        board: game.board,
        id: game.id,
        moves: game.moves + 1,
        player: game.player === 'X' ? 'O' : 'X',
        winner: checkWinner(game.board)
    })
}

const checkWinner = (board: Board): WinState => {
    let winner: WinState = false
    winner =
        winner && (board[0][0] === board[0][1]) === board[0][2] && board[0][0]
    winner =
        winner && (board[1][0] === board[1][1]) === board[1][2] && board[1][0]
    winner =
        winner && (board[2][0] === board[2][1]) === board[2][2] && board[2][0]

    winner =
        winner && (board[0][0] === board[1][0]) === board[2][0] && board[0][0]
    winner =
        winner && (board[0][1] === board[1][1]) === board[2][1] && board[0][1]
    winner =
        winner && (board[0][2] === board[1][2]) === board[2][2] && board[0][2]

    winner =
        winner && (board[0][0] === board[1][1]) === board[2][2] && board[1][1]
    winner =
        winner && (board[2][0] === board[1][1]) === board[0][2] && board[1][1]

    return winner
}

const cancel = (request: Request, response: Response) => {
    games[request.params.id] = undefined
    response.status(ResponseCode.NoContent).send('OK')
}

export { viewAll, create, viewOne, makeMove, cancel }
