import 'mocha'
import { app, create, move } from './setup'

import { ResponseCode } from '../lib/http'
import { expect } from 'chai'

describe('draw', () => {
    it('happens when the board fills up', () => {
        return create()
            .then((r) => move(r.body.id, 0, 0))
            .then((r) => move(r.body.id, 0, 1))
            .then((r) => move(r.body.id, 0, 2))
            .then((r) => move(r.body.id, 2, 0))
            .then((r) => move(r.body.id, 2, 1))
            .then((r) => move(r.body.id, 2, 2))
            .then((r) => move(r.body.id, 1, 0))
            .then((r) => move(r.body.id, 1, 1))
            .then((r) => move(r.body.id, 1, 2))
            .then((response) => {
                expect(response.body.board).to.eql([
                    ['X', 'X', 'O'],
                    ['O', 'O', 'X'],
                    ['X', 'X', 'O']
                ])
                expect(response.body.winner).to.equal('draw')
            })
    })
})

describe('winning', () => {
    describe('horizontally', () => {
        it('works 1st row', () => {
            return create()
                .then((r) => move(r.body.id, 0, 0))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 1, 0))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 2, 0))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        ['X', 'X', 'X'],
                        ['O', 'O', null],
                        [null, null, null]
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })

        it('works 2nd row', () => {
            return create()
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 0, 2))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 1, 2))
                .then((r) => move(r.body.id, 2, 1))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        [null, null, null],
                        ['X', 'X', 'X'],
                        ['O', 'O', null]
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })

        it('works 3rd row', () => {
            return create()
                .then((r) => move(r.body.id, 0, 2))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 1, 2))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 2, 2))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        [null, null, null],
                        ['O', 'O', null],
                        ['X', 'X', 'X']
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })
    })

    describe('vertically', () => {
        it('works 1st column', () => {
            return create()
                .then((r) => move(r.body.id, 0, 0))
                .then((r) => move(r.body.id, 1, 0))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 0, 2))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        ['X', 'O', null],
                        ['X', 'O', null],
                        ['X', null, null]
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })

        it('works 2nd column', () => {
            return create()
                .then((r) => move(r.body.id, 1, 0))
                .then((r) => move(r.body.id, 0, 0))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 1, 2))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        ['O', 'X', null],
                        ['O', 'X', null],
                        [null, 'X', null]
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })

        it('works 3rd column', () => {
            return create()
                .then((r) => move(r.body.id, 2, 0))
                .then((r) => move(r.body.id, 0, 0))
                .then((r) => move(r.body.id, 2, 1))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 2, 2))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        ['O', null, 'X'],
                        ['O', null, 'X'],
                        [null, null, 'X']
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })
    })

    describe('diagonally', () => {
        it('works one way', () => {
            return create()
                .then((r) => move(r.body.id, 0, 0))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 2, 1))
                .then((r) => move(r.body.id, 2, 2))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        ['X', null, null],
                        ['O', 'X', 'O'],
                        [null, null, 'X']
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })

        it('works the other', () => {
            return create()
                .then((r) => move(r.body.id, 0, 2))
                .then((r) => move(r.body.id, 0, 1))
                .then((r) => move(r.body.id, 1, 1))
                .then((r) => move(r.body.id, 2, 1))
                .then((r) => move(r.body.id, 2, 0))
                .then((response) => {
                    expect(response.body.board).to.eql([
                        [null, null, 'X'],
                        ['O', 'X', 'O'],
                        ['X', null, null]
                    ])
                    expect(response.body.winner).to.equal('X')
                })
        })
    })
})
