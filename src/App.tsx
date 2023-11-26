import { useState, useEffect } from 'react'
import './App.css'
import {Film} from './types'
import SetFilmsContext from './context/setFilmsContext'
import FilmList from './components/FilmsList'
import AddFilm from './components/AddFilm'

function App() {
  const [films, setFilms] = useState<Film[]>([])
  useEffect(() => {
    const f = localStorage.getItem('films');
    if (f) {
        setFilms(JSON.parse(f))
    }
    else {
        fetch('/src/src/film.json')
        .then((resposne) => {
            if (resposne.ok) return resposne.json();
            throw new Error('Request failed.');
        })
        .then((json) => {
            json.forEach((film: Film, index: number) => {
                film.id = index;
            });
            setFilms(json)
            localStorage.setItem('films', JSON.stringify(json))
        })
        .catch((error) => console.log(error)); 
    }
  }, [])

  return (
    <SetFilmsContext.Provider value={setFilms}>
        <AddFilm />
        <FilmList films={films} />
    </SetFilmsContext.Provider>
  )
}

export default App
