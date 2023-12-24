import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { isLogin } from "../helpers/isLogin";

export default function NavBar() {
    return (
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
                        Список фильмов
                    </Typography>
                    {isLogin() ? (
                        <Button color="inherit">Выйти</Button>
                    ) : (
                        <Button color="inherit">Войти</Button>
                    )}
                </Toolbar>
            </AppBar>
    );
}
