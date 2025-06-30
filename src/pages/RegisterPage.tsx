import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from "@mui/material";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        
        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        // Validate password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset API error
        setApiError(null);
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            // Register user
            await userService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: "user"
            });
            
            // Navigate to login page after successful registration
            navigate("/login", { state: { message: "Registration successful! Please login with your new account." } });
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
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
                    Register
                </Typography>
                
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Name"
                        name="name"
                        variant="outlined"
                        fullWidth
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                    </Button>
                    
                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        onClick={() => navigate("/login")}
                        sx={{ mt: 1 }}
                    >
                        Already have an account? Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegisterPage;