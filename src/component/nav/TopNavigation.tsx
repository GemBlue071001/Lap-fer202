import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCredential } from "../../hooks/useCredential";

const TopNavigation = () => {
    const { isLightTheme, toggleTheme } = useTheme();
    const { credential, updateCredential } = useCredential();

    const handleOnLoginSuccess = (credentialResponse: CredentialResponse) => {
        updateCredential(credentialResponse.credential);
    }

    const handleOnLogout = () => {
        updateCredential(undefined);
    }

    return (
        <Navbar bg={isLightTheme ? "light" : "dark"} data-bs-theme={isLightTheme ? "light" : "dark"} expand="lg" className="mb-3">
            <Container>
                <Navbar.Brand as={Link} to="/">Orchids</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={toggleTheme} style={{ marginTop: '8px' }}>
                            {isLightTheme ? (<CiLight size={24} />) : (<MdDarkMode size={24} />)}
                        </Nav.Link>
                        <Nav.Link>
                            {credential ? 
                            (<>
                                <Nav.Link onClick={handleOnLogout}>
                                    Logout
                                </Nav.Link>
                            </>)
                                :
                                (<>
                                   {/* <GoogleLogin onSuccess={(credentialResponse) => { handleOnLoginSuccess(credentialResponse) }} onError={() => { }} /> */}
                                   <Nav.Link as={Link} to="/login">
                                    Login
                                </Nav.Link>
                                </>)
                            }

                        </Nav.Link>


                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopNavigation;