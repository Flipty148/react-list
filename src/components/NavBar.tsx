import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function NavBar() {
    return (
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
                        Список фильмов
                    </Typography>
                    <Button color="inherit">Войти</Button>
                </Toolbar>
            </AppBar>
    );
}
