import { IconButton } from "@mui/material";
import {useState, useEffect} from 'react';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

export function ScrollButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }}
    );

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
            <IconButton
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    boxSizing: 'content-box',
                    width: 64,
                    height: 64,
                    display: showButton ? 'block' : 'none',
                }}
            >
                <ArrowCircleUpIcon sx={{width:64, height:64, mt:'auto', mb:'auto'}} />
            </IconButton>
    );
}
