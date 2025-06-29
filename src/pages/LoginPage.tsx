import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import appLocalStorage from "../util/appLocalStorage";
import { localKeyItem } from "../util/localKeyItem";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const users = await userService.login(email, password);
            if (Array.isArray(users) && users.length === 1) {
                appLocalStorage.setItem(localKeyItem.userInfo, users[0])
                navigate("/");
            } else {
                setError("Invalid email or password");
                setOpen(true);
            }
        } catch {
            setError("Login failed. Please try again.");
            setOpen(true);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Login
                </Typography>
                <Box
                    component="form"
                    sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        type="submit"
                    >
                        Login
                    </Button>
                    
                    <Divider sx={{ mt: 2, mb: 2 }}>Or</Divider>
                    
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
                <Alert severity="error" onClose={() => setOpen(false)} sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;