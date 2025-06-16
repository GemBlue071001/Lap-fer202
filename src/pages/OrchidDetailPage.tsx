import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { listOfOrchids } from '../data/ListOfOrchids';
import Layout from '../Layout/Layout';
import OrchidFormModal from '../component/OrchidCard/OrchidFormModal';
import { useState } from 'react';
import { OrchidService } from '../services/orchidService';

const OrchidDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLightTheme } = useTheme();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const orchid = listOfOrchids.find(o => o.id === (id));

    if (!orchid) {
        return (
            <Layout>
                <Container>
                    <h2>Orchid not found</h2>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container className={`py-4 ${isLightTheme ? 'bg-light' : 'bg-dark text-white'}`}>
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
                        <h2>{orchid.name}</h2>
                        <div className="mt-4">
                            <h4>Details</h4>
                            <p><strong>Name:</strong> {orchid.name}</p>
                            <p><strong>Likes:</strong> {orchid.numberOfLikes} ❤️</p>
                            <p><strong>Description:</strong> Beautiful {orchid.name} orchid species</p>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'start' , gap: '20px'}}>
                            <Button
                                variant={isLightTheme ? 'secondary' : 'light'}
                                onClick={() => navigate('/')}
                                className="mt-3"
                            >
                                Back to Home
                            </Button>
                            <Button
                                variant={isLightTheme ? 'secondary' : 'light'}
                                onClick={() => setIsUpdateModalOpen(true)}
                                className="mt-3"
                            >
                                Update
                            </Button>
                            <Button
                                variant={isLightTheme ? 'secondary' : 'light'}
                                onClick={() => OrchidService.deleteOrchids(orchid.id)}
                                className="mt-3"
                            >
                                Delete
                            </Button>
                        </div>

                    </div>
                </div>
            </Container>
            {orchid && (
                <OrchidFormModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onSubmitSuccess={() => {
                        setIsUpdateModalOpen(false);
                        // You might want to refresh the data here
                        window.location.reload();
                    }}
                    initialData={orchid}
                    mode="update"
                />
            )}
        </Layout>
    );
};

export default OrchidDetailPage;
