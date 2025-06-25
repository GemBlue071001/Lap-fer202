import React from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const RegisterPage = () => {
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
                    Register
                </Typography>
                <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        autoComplete="name"
                    />
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
                        autoComplete="new-password"
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        autoComplete="new-password"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegisterPage;