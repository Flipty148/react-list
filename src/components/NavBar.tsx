import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { isLogin } from "../helpers/isLogin";

export default function NavBar() {
    const isAuth = isLogin();
    return (
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
                        Список фильмов
                    </Typography>
                    {isAuth ? (
                        <Box component={"form"}
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetch("http://localhost:3000/users/logout", {
                                method: "POST",
                                credentials: "include",
                            }).then((resposne) => {
                                if (resposne.ok) {
                                    window.location.href = "/";
                                }
                            });
                        }}>
                            <Button color="inherit" type="submit">Выйти</Button>
                        </Box>
                    ) : (
                        <Button color="inherit" href="/users/login">Войти</Button>
                    )}
                </Toolbar>
            </AppBar>
    );
}
