import * as Games from '../games'
import { ResponseCode } from '../lib/http'
import { Game, Player, WinState } from '../model/game'
import { Response } from 'jest-express/lib/response'
import { Request } from 'jest-express/lib/request'

describe('create', () => {
    it('makes a new empty game with the next ID', () => {
        const request = new Request('/', { method: 'POST'})
        const response = new Response()
        const blankGame: Game = {
            board: [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined]
            ],
            id: '100',
            nextPlayer: 'X' as Player,
            winner: false as WinState
        }

        const game = Games.create(request, response)

        expect(response.status).toBeCalledWith(ResponseCode.Created)
        expect(response.json).toBeCalledWith([blankGame])
    })
})
