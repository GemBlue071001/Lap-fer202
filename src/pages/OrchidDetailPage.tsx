import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Toast, Spinner } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import Layout from '../Layout/Layout';
import OrchidFormModal from '../component/OrchidCard/OrchidFormModal';
import { useEffect, useState, useCallback } from 'react';
import { OrchidService } from '../services/orchidService';
import { Orchid } from '../model.ts/orchids';
import appLocalStorage from '../util/appLocalStorage';
import { User } from '../model.ts/user';
import { localKeyItem } from '../util/localKeyItem';

const OrchidDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLightTheme } = useTheme();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'danger'>('success');
    const [orchid, setOrchid] = useState<Orchid | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    const userInfoString: User = appLocalStorage.getItem(localKeyItem.userInfo);

    const getOrchidDetail = useCallback(async () => {
        setIsLoading(true);
        try {
            const orchidDetail = await OrchidService.getOrchidById(id!);
            setOrchid(orchidDetail);
        } catch (error) {
            console.error('Error fetching orchid details:', error);
            setOrchid(undefined);
            setToastType('danger');
            setToastMessage('Failed to load orchid details');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    }, [id, setToastType, setToastMessage, setShowToast]);

    useEffect(() => {
        getOrchidDetail();
    }, [getOrchidDetail]);

    if (isLoading) {
        return (
            <Layout>
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="text-center">
                        <Spinner animation="border" role="status" variant={isLightTheme ? "dark" : "light"}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className={`mt-3 ${!isLightTheme && 'text-white'}`}>Loading orchid details...</p>
                    </div>
                </Container>
            </Layout>
        );
    }

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
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: '20px' }}>
                            <Button
                                variant={isLightTheme ? 'secondary' : 'light'}
                                onClick={() => navigate('/')}
                                className="mt-3"
                            >
                                Back to Home
                            </Button>
                            {userInfoString.role === "admin" && (<>
                                <Button
                                    variant={isLightTheme ? 'secondary' : 'light'}
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    className="mt-3"
                                >
                                    Update
                                </Button></>)}


                            {userInfoString.role === "admin" && (<>
                                <Button
                                    variant="danger"
                                    onClick={async () => {
                                        try {
                                            await OrchidService.deleteOrchids(orchid.id);
                                            setToastType('success');
                                            setToastMessage('Orchid successfully deleted');
                                            setShowToast(true);
                                            setTimeout(() => navigate('/'), 2000);
                                        } catch (error) {
                                            setToastType('danger');
                                            setToastMessage('Failed to delete orchid');
                                            setShowToast(true);
                                        }
                                    }}
                                    className="mt-3"
                                >
                                    Delete
                                </Button></>)}
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
                        setToastType('success');
                        setToastMessage('Orchid successfully updated');
                        setShowToast(true);
                        setTimeout(() => window.location.reload(), 2000);
                    }}
                    initialData={orchid}
                    mode="update"
                />
            )}

            <div
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999
                }}
            >
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastType}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastType === 'success' ? 'Success' : 'Error'}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className={toastType === 'success' ? 'text-white' : ''}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </div>
        </Layout>
    );
};

export default OrchidDetailPage;
