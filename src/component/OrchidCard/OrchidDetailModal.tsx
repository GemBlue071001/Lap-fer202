import { Modal, Button } from 'react-bootstrap';
import { Orchid } from '../../model.ts/orchids';
import { useTheme } from '../../context/ThemeContext';

interface OrchidDetailModalProps {
    show: boolean;
    onHide: () => void;
    orchid: Orchid;
}

const OrchidDetailModal = ({ show, onHide, orchid }: OrchidDetailModalProps) => {
    const { isLightTheme } = useTheme();
    
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="orchid-detail-modal"
            centered
        >
            <Modal.Header 
                closeButton
                className={isLightTheme ? 'bg-light' : 'bg-dark text-white'}
            >
                <Modal.Title id="orchid-detail-modal">
                    {orchid.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={isLightTheme ? 'bg-light' : 'bg-dark text-white'}>
                <div className="row">
                    <div className="col-md-6">
                        <img 
                            src={orchid.image} 
                            alt={orchid.name} 
                            className="img-fluid rounded"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h4>Details</h4>
                        <p><strong>Name:</strong> {orchid.name}</p>
                        <p><strong>Likes:</strong> {orchid.numberOfLikes} ❤️</p>
                        <p><strong>Description:</strong> Beautiful {orchid.name} orchid species</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className={isLightTheme ? 'bg-light' : 'bg-dark text-white'}>
                <Button variant={isLightTheme ? 'secondary' : 'light'} onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrchidDetailModal;
