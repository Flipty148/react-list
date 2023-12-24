import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { isLogin } from "../helpers/isLogin";

export default function NavBar() {
    const isAuth = isLogin();
    console.log(isAuth);
    return (
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
                        Список фильмов
                    </Typography>
                    {isAuth ? (
                        <Button color="inherit" href="/users/logout">Выйти</Button>
                    ) : (
                        <Button color="inherit" href="/users/login">Войти</Button>
                    )}
                </Toolbar>
            </AppBar>
    );
}
