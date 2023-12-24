import {useState, useEffect} from 'react';

function getCookie(name: string) {
    const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`));
        if (cookie) {
            return cookie.split('=')[1];
        }

        return '';
}

export function isLogin() {
    const id = getCookie('id');
    const [status, setStatus] = useState(false);

    useEffect(() => {
        

        fetch(`http://localhost:3000/users/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((resposne) => {
            setStatus(resposne.ok);
        })
        .catch((error) => console.log(error));
    }, []);
    return status;
};
