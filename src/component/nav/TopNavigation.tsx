import { Container, Nav, Navbar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";

const TopNavigation = () => {
    const { isLightTheme, toggleTheme } = useTheme();

    return (
        <Navbar bg={isLightTheme ? "light" : "dark"} data-bs-theme={isLightTheme ? "light" : "dark"} expand="lg" className="mb-3">
            <Container>
                <Navbar.Brand href="#home">Orchids</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={toggleTheme}>
                            {isLightTheme ? (<CiLight size={24} />) : (<MdDarkMode size={24} />)}
                        </Nav.Link>
                        <Nav.Link href="#login">Login</Nav.Link>
                        <Nav.Link href="#signup">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopNavigation;