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

    return id !== '';
};
