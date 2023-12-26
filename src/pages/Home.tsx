import { useState, useEffect } from "react";
import AddFilm from "../components/AddFilm";
import FilmList from "../components/FilmsList";
import SetFilmsContext from "../context/setFilmsContext";
import { Film } from "../types";

export default function Home(){
    const [films, setFilms] = useState<Film[]>([])
        // const f = localStorage.getItem('films');
    useEffect(()=> {
        fetch('http://localhost:3000/films', {
            method: 'GET',
            credentials: 'include',
        })
        .then((resposne) => {
            if (resposne.ok) return resposne.json();
            throw new Error('Request failed.');
        })
        .then((json) => {
            if (json.length > 0) {
                const sorted = json.sort((a,b) => {
                    const nameA = a.russian_name.toLowerCase();
                    const nameB = b.russian_name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                });
                setFilms(sorted)
            }
            else {
                fetch('http://localhost:3004/films')
                .then((resposne) => {
                    if (resposne.ok) return resposne.json();
                    throw new Error('Request failed.');
                })
                .then((json) => {
                    const sorted = json.sort((a,b) => {
                        const nameA = a.russian_name.toLowerCase();
                        const nameB = b.russian_name.toLowerCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });
                    setFilms(sorted)
                    postFilms(json)
                })
                .catch((error) => console.log(error)); 
            }
            
        })
        .catch((error) => console.log(error));
    }, []);
    return (
        <SetFilmsContext.Provider value={setFilms}>
            <AddFilm />
            <FilmList films={films} />
        </SetFilmsContext.Provider>
    )
}

function postFilms(films: Film[]) {
        fetch('http://localhost:3000/films', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(films),
            credentials: 'include'
        })
        .catch((error) => console.log(error));
    
}
