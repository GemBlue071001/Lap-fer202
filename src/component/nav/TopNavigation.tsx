import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import appLocalStorage from "../../util/appLocalStorage";
import { useEffect, useState } from "react";
import { localKeyItem } from "../../util/localKeyItem";

const TopNavigation = () => {
    const { isLightTheme, toggleTheme } = useTheme();
    const [credential, setCredential] = useState<string | undefined>(undefined);

    useEffect(() => {
        const storedCredential = appLocalStorage.getItem(localKeyItem.userCredential);
        if (storedCredential) {
            setCredential(storedCredential);
        } else {
            setCredential(undefined);
        }
    }, []);

    const handleOnLoginSuccess = (credentialResponse: CredentialResponse) => {
        appLocalStorage.setItem(localKeyItem.userCredential, credentialResponse.credential);
        setCredential(credentialResponse.credential);
    }

    const handleOnLogout = () => {
        appLocalStorage.removeItem(localKeyItem.userCredential);
        setCredential(undefined);
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
                                    Log out
                                </Nav.Link>
                            </>)
                                :
                                (<>
                                   <GoogleLogin onSuccess={(credentialResponse) => { handleOnLoginSuccess(credentialResponse) }} onError={() => { }} />
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