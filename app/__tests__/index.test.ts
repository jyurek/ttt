import 'mocha'
import { app } from './setup.test'

import { ResponseCode } from '../lib/http'
import { expect } from 'chai'

describe('index', () => {
    it('returns empty when brand new', async () => {
        return app().get('/').then((response) => {
            expect(response.body).to.eql({})
            expect(response).to.have.status(ResponseCode.OK)
        })
    })
})

describe('create', () => {
    it('generates a new game with new id', () => {
        return app().post('/').then(() =>
            app().post('/').then((response) => {
                expect(response.body).to.eql({
                    board: [
                        [null, null, null],
                        [null, null, null],
                        [null, null, null]
                    ],
                    id: '101',
                    nextPlayer: 'X',
                    winner: false
                })
                expect(response).to.have.status(ResponseCode.Created)
            })
        )
    })
})

describe('show', () => {
    it('returns the game we asked for', () => {
        return app().get('/101').then((response) => {
            expect(response.body).to.eql({
                board: [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ],
                id: '101',
                nextPlayer: 'X',
                winner: false
            })
            expect(response).to.have.status(ResponseCode.OK)
        })
    })

    it('returns a 404 if the game does not yet exist', () => {
        return app().get('/102').then((response) => {
            expect(response.body).to.eql({})
            expect(response).to.have.status(ResponseCode.NotFound)
        })
    })
})

describe('move', () => {
    it('makes a move for X first', () => {
        return app()
            .post('/100')
            .send({ x: 1, y: 1 })
            .then((response) => {
                expect(response.body).to.eql({
                    board: [
                        [null, null, null],
                        [null, 'X', null],
                        [null, null, null]
                    ],
                    id: '100',
                    nextPlayer: 'O',
                    winner: false
                })
                expect(response).to.have.status(ResponseCode.OK)
            })
    })

    it('then a move for O', () => {
        return app()
            .post('/100')
            .send({ x: 0, y: 0 })
            .then((response) => {
                expect(response.body).to.eql({
                    board: [
                        ['O', null, null],
                        [null, 'X', null],
                        [null, null, null]
                    ],
                    id: '100',
                    nextPlayer: 'X',
                    winner: false
                })
                expect(response).to.have.status(ResponseCode.OK)
            })
    })
})
