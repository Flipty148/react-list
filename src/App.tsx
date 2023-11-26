import './App.css'
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home';
import Edit from './pages/Edit';
import { Film } from './types';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={function() {
            const film = getFilmById(Number(window.location.pathname.split('/')[2]))
            if (!film) return (<Navigate to="/" />)
            else return (<Edit film={film} />)}()
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

function getFilmById(id: number) {
    const films = localStorage.getItem('films')
    if (!films) return null
    const json = JSON.parse(films)
    return json.find((film:Film) => film.id === id)
}

export default App
