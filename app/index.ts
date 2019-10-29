import dotenv from 'dotenv'
import express from 'express'
import * as Games from './games'

dotenv.config()
const port = process.env.PORT
export const app = express()
app.use(express.json())

app.get('/', Games.viewAll)
app.post('/', Games.create)
app.get('/:id', Games.viewOne)
app.post('/:id', Games.makeMove)
app.delete('/:id', Games.cancel)

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
