import React from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const LoginPage = () => {
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
                <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        autoComplete="email"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        autoComplete="current-password"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;