import 'mocha'
import { app, cancel, create, move, show } from './setup'

import { ResponseCode } from '../lib/http'
import { expect } from 'chai'

describe('index', () => {
    it('returns empty when brand new', async () => {
        return app()
            .get('/')
            .then((response) => {
                expect(response.body).to.eql({})
                expect(response).to.have.status(ResponseCode.OK)
            })
    })
})

describe('create', () => {
    it('generates a new game with new id', async () => {
        return create().then(() =>
            create().then((response) => {
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
    it('returns the game we asked for', async () => {
        return app()
            .get('/101')
            .then((response) => {
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

    it('returns a 404 if the game does not yet exist', async () => {
        return app()
            .get('/102')
            .then((response) => {
                expect(response.body).to.eql({})
                expect(response).to.have.status(ResponseCode.NotFound)
            })
    })
})

describe('move', () => {
    it('makes a move for X first', async () => {
        return move('100', 1, 1).then((response) => {
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

    it('then a move for O', async () => {
        return move('100', 0, 0).then((response) => {
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

    it('returns a 404 if the game does not yet exist', async () => {
        return move('lolthiscannotexist', 0, 0).then((response) => {
            expect(response.body.error).to.equal(true)
            expect(response).to.have.status(ResponseCode.NotFound)
        })
    })
})

describe('cancel', () => {
    it('deletes a game in progress', async () => {
        return create().then((r) =>
            cancel(r.body.id)
                .then((cr) => {
                    expect(cr).to.have.status(ResponseCode.NoContent)
                })
                .then(() =>
                    show(r.body.id).then((sr) => {
                        expect(sr.body).to.eql({})
                    })
                )
        )
    })
})
