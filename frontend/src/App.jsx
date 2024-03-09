import Note from "./components/Note"
import { useState, useEffect } from "react"
import noteServices from "./services/notes"
import Notification from "./components/ErrorMessaje"
import Footer from "./components/Footer"

const App = () => {

  const [notes, setNotes] = useState([]) /* Hook que almacena la lista de notas obtenida desde el servidor */
  const [showAll, setShowAll] = useState(true) /* Hook de estado que maneja la visualizacion de notas segun la importancia */
  const [newNote, setNewNote] = useState('a new note...') /*Hook que almacena una nueva nota creada desde un text imput */
  const [errorMessaje, setErrorMessaje] = useState(null)

  /*Logica para Obtener los Datos del servidor */

  const hook = () => {
    noteServices.getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }

  useEffect(hook, [])

  /*Logica para almacenar los datos ingresados del input de nueva nota en un hook.*/

  const changeInput = (event) => {
    setNewNote(event.target.value)
  }

  /*Logica que manejar la visualizacion de notas segun el valor de ShowAll */
  const showWhat = showAll ? notes : notes.filter(note => note.important === true)


  /*Logica para agregar las notas del hook new note en el servidor. */
  const addNote = event => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteServices.create(noteObject)
      .then(createdNotes => {
        setNotes(notes.concat(createdNotes))
        setNewNote('')
      })
  }

  /* Logica para cambiar la importancia de las notas mediante un boton */

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteServices.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    }).catch(error => {
      setErrorMessaje("some error happened")
      setTimeout(() => {
        setErrorMessaje(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessaje} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>Show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {showWhat.map(note => <Note note={note} key={note.id} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
          onChange={changeInput} />
        <button> Save </button>
      </form>
      <Footer />
    </div>
  )
}

export default App