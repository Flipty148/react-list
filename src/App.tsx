import { useState, useEffect } from 'react'
import './App.css'
import {Film} from './types'

function App() {
  const [films, setFilms] = useState<Film[]>([])
  useEffect(() => {
    fetch('/src/src/film.json')
    .then((resposne) => {
        if (resposne.ok) return resposne.json();
        throw new Error('Request failed.');
    })
    .then((json) => setFilms(json))
    .catch((error) => console.log(error)); 
  }, [])

  return (
    <>
      
    </>
  )
}

export default App
