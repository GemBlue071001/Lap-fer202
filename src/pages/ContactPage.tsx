import { useFormik } from 'formik';
import { Container, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import Layout from '../Layout/Layout';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Typography } from '@mui/material';
import * as Yup from 'yup';

const ContactPage = () => {
    const { isLightTheme } = useTheme();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            program: 0,
            message: "",
            agree: false
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required.").min(2, "Must be 2 characters or more"),
            email: Yup.string().required("Required.").email("Invalid email"),
            phone: Yup.number().integer().typeError("Please enter a valid number"),
            program: Yup.number().integer().typeError("Please select a program."),
            message: Yup.string().required("Required.").min(10, "Must be 10 characters or more"),
            agree: Yup.boolean().oneOf([true], "The terms and conditions must be accepted.")
        }),
        onSubmit: (values) => {
            alert(JSON.stringify(values));
        }
    });

    return (
        <Layout>
            <Container className="py-5">
                <h2 className={`mb-4 ${!isLightTheme && 'text-white'}`}>Contact Us</h2>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        fullWidth
                        margin="normal"
                        className={`${!isLightTheme ? 'bg-dark text-white' : ''}`}
                    />
                    {formik.errors.name && (<Typography variant="caption" color="error">{formik.errors.name}</Typography>)}

                    <TextField
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        fullWidth
                        margin="normal"
                        className={`${!isLightTheme ? 'bg-dark text-white' : ''}`}
                    />
                    {formik.errors.email && (<Typography variant="caption" color="error">{formik.errors.email}</Typography>)}

                    <TextField
                        label="Phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        fullWidth
                        margin="normal"
                        className={`${!isLightTheme ? 'bg-dark text-white' : ''}`}
                    />
                    {formik.errors.phone && (<Typography variant="caption" color="error">{formik.errors.phone}</Typography>)}

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="program-label">Program of Study</InputLabel>
                        <Select
                            labelId="program-label"
                            label="Program of Study"
                            name="program"
                            value={formik.values.program}
                            onChange={formik.handleChange}
                            className={`${!isLightTheme ? 'bg-dark text-white' : ''}`}
                        >
                            <MenuItem value={0}><em>Please select</em></MenuItem>
                            <MenuItem value={1}>Software Engineering</MenuItem>
                            <MenuItem value={2}>Information System</MenuItem>
                            <MenuItem value={3}>Information Assurance</MenuItem>
                            <MenuItem value={4}>Internet of Things</MenuItem>
                            <MenuItem value={5}>Artificial Intelligence</MenuItem>
                            <MenuItem value={6}>Digital Art & Design</MenuItem>
                        </Select>
                        {formik.errors.program && (<Typography variant="caption" color="error">{formik.errors.program}</Typography>)}
                    </FormControl>

                    <TextField
                        label="Message"
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        className={`${!isLightTheme ? 'bg-dark text-white' : ''}`}
                    />
                    {formik.errors.message && (<Typography variant="caption" color="error">{formik.errors.message}</Typography>)}

                    <FormControlLabel 
                        control={
                            <Switch
                                name="agree"
                                checked={formik.values.agree}
                                onChange={formik.handleChange}
                            />
                        }
                        label="Agree to terms and conditions"
                        className={`${!isLightTheme ? 'text-white' : ''}`}
                    />
                    {formik.errors.agree && (<Typography variant="caption" color="error">{formik.errors.agree}</Typography>)}

                    <div className="mt-3">
                        <Button
                            type="submit"
                            variant={isLightTheme ? 'primary' : 'light'}
                        >
                            Send
                        </Button>
                    </div>
                </form>
            </Container>
        </Layout>
    );
};

export default ContactPage;
