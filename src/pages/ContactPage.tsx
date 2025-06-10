import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import Layout from '../Layout/Layout';

const ContactPage = () => {
    const { isLightTheme } = useTheme();

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToTerms: false
    };

    return (
        <Layout>
            <Container className="py-5">
                <h2 className={`mb-4 ${!isLightTheme && 'text-white'}`}>Contact Us</h2>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label 
                                    htmlFor="name" 
                                    className={`form-label ${!isLightTheme && 'text-white'}`}
                                >
                                    Name
                                </label>
                                <Field
                                    type="text"
                                    name="name"
                                    className={`form-control ${!isLightTheme ? 'bg-dark text-white' : ''}`}
                                    placeholder="Enter your name"
                                />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label 
                                    htmlFor="email" 
                                    className={`form-label ${!isLightTheme && 'text-white'}`}
                                >
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    className={`form-control ${!isLightTheme ? 'bg-dark text-white' : ''}`}
                                    placeholder="Enter your email"
                                />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label 
                                    htmlFor="phone" 
                                    className={`form-label ${!isLightTheme && 'text-white'}`}
                                >
                                    Phone
                                </label>
                                <Field
                                    type="tel"
                                    name="phone"
                                    className={`form-control ${!isLightTheme ? 'bg-dark text-white' : ''}`}
                                    placeholder="Enter your phone number"
                                />
                                <ErrorMessage name="phone" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label 
                                    htmlFor="subject" 
                                    className={`form-label ${!isLightTheme && 'text-white'}`}
                                >
                                    Subject
                                </label>
                                <Field
                                    as="select"
                                    name="subject"
                                    className={`form-select ${!isLightTheme ? 'bg-dark text-white' : ''}`}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Support</option>
                                    <option value="business">Business</option>
                                    <option value="other">Other</option>
                                </Field>
                                <ErrorMessage name="subject" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label 
                                    htmlFor="message" 
                                    className={`form-label ${!isLightTheme && 'text-white'}`}
                                >
                                    Message
                                </label>
                                <Field
                                    as="textarea"
                                    name="message"
                                    className={`form-control ${!isLightTheme ? 'bg-dark text-white' : ''}`}
                                    rows={5}
                                    placeholder="Enter your message"
                                />
                                <ErrorMessage name="message" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <div className="form-check">
                                    <Field
                                        type="checkbox"
                                        name="agreeToTerms"
                                        className="form-check-input"
                                    />
                                    <label 
                                        className={`form-check-label ${!isLightTheme && 'text-white'}`}
                                        htmlFor="agreeToTerms"
                                    >
                                        I agree to the terms and conditions
                                    </label>
                                </div>
                                <ErrorMessage name="agreeToTerms" component="div" className="text-danger" />
                            </div>

                            <Button 
                                type="submit" 
                                variant={isLightTheme ? 'primary' : 'light'} 
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        </Layout>
    );
};

export default ContactPage;
