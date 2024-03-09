const express = require('express')
const cors = require('cors')
const app = express()
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.use(express.json())

app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }

})
const generateID = () => {
    const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxID + 1;

}

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({ error: "missing content" })
    }

    else {
        const note = {
            id: generateID(),
            content: body.content,
            important: Boolean(body.important) || false
        }

        notes = notes.concat(note)

        response.json(note)
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const reformedNote = request.body

    if (notes.some(note => note.id === reformedNote.id)) {
        notes = notes.filter(note => note.id !== id)
        notes = notes.concat(reformedNote)
        response.json(reformedNote)
    }

    else {
        response.status(400).end()
    }
})

app.use((request, response) => {
    response.status(404).send('Error: Endpoint not found')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})