import 'mocha'
import { app, create, move } from './setup'

import { ResponseCode } from '../lib/http'
import { expect } from 'chai'

describe('invalid move when', () => {
    it('out of bounds for X', () => {
        return create()
            .then((r) => move(r.body.id, 3, 0))
            .then((response) => {
                expect(response).to.have.status(422)
                expect(response.body.error).to.equal(true)
            })
    })

    it('is out of bounds for Y', () => {
        return create()
            .then((r) => move(r.body.id, 0, 3))
            .then((response) => {
                expect(response).to.have.status(422)
                expect(response.body.error).to.equal(true)
            })
    })

    it('has already been taken', () => {
        return create()
            .then((r) => move(r.body.id, 0, 0))
            .then((r) => move(r.body.id, 0, 0))
            .then((response) => {
                expect(response).to.have.status(422)
                expect(response.body.error).to.equal(true)
            })
    })

    it('the game is over', () => {
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
            .then((r) => move(r.body.id, 0, 0))
            .then((response) => {
                expect(response).to.have.status(422)
                expect(response.body.error).to.equal(true)
            })
    })
})
