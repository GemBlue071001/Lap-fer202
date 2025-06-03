import { Container, Nav, Navbar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const TopNavigation = () => {
    return (
        <Navbar bg="light" data-bs-theme="light" expand="lg" className="mb-3">
            <Container>
                <Navbar.Brand href="#home">Orchids</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#login">Login</Nav.Link>
                        <Nav.Link href="#signup">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopNavigation;