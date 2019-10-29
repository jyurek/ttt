import { app as application } from '../'
import chai from 'chai'
import chaiHttp from 'chai-http'
import 'mocha'

chai.use(chaiHttp)

export const app = () => chai.request(application)

export const create = () => app().post('/')

export const move = (id: string, x: number, y: number) =>
    app()
        .post(`/${id}`)
        .send({ x, y })

export const show = (id: string) => app().get(`/${id}`)

export const cancel = (id: string) => app().delete(`/${id}`)
