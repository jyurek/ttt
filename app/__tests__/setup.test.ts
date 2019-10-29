import { app as application } from '../'
import chai from 'chai'
import chaiHttp from 'chai-http'
import 'mocha'

chai.use(chaiHttp)
export const app = () => chai.request(application)
