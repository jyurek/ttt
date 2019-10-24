import { Request, Response } from 'express'
import { Games, makeValidMove, newGame } from './model/game'
import { ResponseCode } from './lib/http'

const games: Games = {}

const viewAll = (_request: Request, response: Response) => {
    response.status(ResponseCode.OK).json(games)
}

const create = (_request: Request, response: Response) => {
    const game = newGame()
    games[game.id] = game
    response.status(ResponseCode.Created).json(game)
}

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
        const [tag, data] = makeValidMove(game, move)
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

const cancel = (request: Request, response: Response) => {
    games[request.params.id] = undefined
    response.status(ResponseCode.NoContent).send('OK')
}

export { viewAll, create, viewOne, makeMove, cancel }
