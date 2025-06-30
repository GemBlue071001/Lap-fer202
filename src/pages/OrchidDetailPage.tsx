import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Toast, Spinner, Form, Card, Alert } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import Layout from '../Layout/Layout';
import OrchidFormModal from '../component/OrchidCard/OrchidFormModal';
import { useEffect, useState, useCallback, useRef } from 'react';
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
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const commentLoaded = useRef(false);
    const [userClearedComment, setUserClearedComment] = useState(false);

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

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userInfoString || !userInfoString.id || !userInfoString.email) {
            setToastType('danger');
            setToastMessage('You must be logged in to comment');
            setShowToast(true);
            return;
        }
        
        if (!comment.trim()) {
            setToastType('danger');
            setToastMessage('Comment cannot be empty');
            setShowToast(true);
            return;
        }
        
        setIsSubmittingComment(true);
        
        try {
            // Get the current orchid data
            const currentOrchid = { ...orchid };
            
            // Add the new comment
            if (!currentOrchid.feedback) {
                currentOrchid.feedback = [];
            }
            
            // Check if user already has a comment
            const existingCommentIndex = currentOrchid.feedback.findIndex(
                feedback => feedback.author === userInfoString.email
            );
            
            const now = new Date().toISOString();
            
            if (existingCommentIndex !== -1) {
                // Update existing comment
                currentOrchid.feedback[existingCommentIndex] = {
                    rating: rating,
                    comment: comment.trim(),
                    author: userInfoString.email,
                    date: now
                };
                setToastMessage('Your comment has been updated');
            } else {
                // Add new comment
                currentOrchid.feedback.push({
                    rating: rating,
                    comment: comment.trim(),
                    author: userInfoString.email,
                    date: now
                });
                setToastMessage('Comment added successfully');
            }
            
            // Update the orchid with the new comment
            if (currentOrchid.id) {
                await OrchidService.updateOrchids(currentOrchid.id, currentOrchid);
            } else {
                throw new Error('Orchid ID is missing');
            }
            
            // Show success message
            setToastType('success');
            setShowToast(true);
            
            // Clear comment input
            setComment('');
            
            // Reset the state to allow loading comments in the future
            commentLoaded.current = false;
            setUserClearedComment(false);
            
            // Refresh orchid details
            getOrchidDetail();
        } catch (error) {
            setToastType('danger');
            setToastMessage('Failed to add comment');
            setShowToast(true);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    useEffect(() => {
        getOrchidDetail();
    }, [getOrchidDetail]);

    // Set comment input value if user has an existing comment (only on initial load)
    useEffect(() => {
        if (orchid && orchid.feedback && userInfoString && userInfoString.email && !commentLoaded.current && !userClearedComment) {
            const existingComment = orchid.feedback.find(f => f.author === userInfoString.email);
            if (existingComment) {
                setComment(existingComment.comment);
                setRating(existingComment.rating);
                commentLoaded.current = true;
            }
        }
    }, [orchid, userInfoString, userClearedComment]);

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
                
                {/* Comments Section */}
                <div className="row mt-5">
                    <div className="col-12">
                        <h3>Comments</h3>
                        
                        {/* Comment List */}
                        <div className="mt-3">
                            {orchid.feedback && orchid.feedback.length > 0 ? (
                                orchid.feedback.map((feedback, index) => {
                                    const isUserComment = userInfoString && userInfoString.email === feedback.author;
                                    return (
                                        <Card 
                                            key={index} 
                                            className={`mb-3 ${isLightTheme ? 'bg-white' : 'bg-dark text-white'} ${isUserComment ? 'border-primary' : ''}`}
                                        >
                                            <Card.Body>
                                                <Card.Title>
                                                    {isUserComment ? (
                                                        <>Your Comment <span className="text-primary">(you)</span></>
                                                    ) : (
                                                        `${feedback.author}`
                                                    )}
                                                </Card.Title>
                                                <div className="mb-2">
                                                    Rating: {Array.from({ length: feedback.rating }).map((_, i) => (
                                                        <span key={i} className="text-warning">★</span>
                                                    ))}
                                                    {Array.from({ length: 5 - feedback.rating }).map((_, i) => (
                                                        <span key={i}>☆</span>
                                                    ))}
                                                </div>
                                                <Card.Text>{feedback.comment}</Card.Text>
                                                <div className="text-muted small">
                                                    {new Date(feedback.date).toLocaleString()}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                            ) : (
                                <p>No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                        
                        {/* Add Comment Form */}
                        <div className="mt-4">
                            <h4>Add a Comment</h4>
                            {userInfoString && userInfoString.email ? (
                                <>
                                    {orchid.feedback && orchid.feedback.find(f => f.author === userInfoString.email) ? (
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <p className="text-info mb-0">You already have a comment. Submitting will update your existing comment.</p>
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm"
                                                onClick={() => {
                                                    setComment('');
                                                    setRating(5);
                                                    setUserClearedComment(true);
                                                }}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    ) : null}
                                    <Form onSubmit={handleCommentSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Rating</Form.Label>
                                            <div>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        style={{ 
                                                            cursor: 'pointer', 
                                                            fontSize: '24px',
                                                            color: star <= rating ? '#ffb700' : '#ccc'
                                                        }}
                                                    >
                                                        {star <= rating ? '★' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your Comment</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Write your comment here..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button 
                                            variant={isLightTheme ? "primary" : "light"} 
                                            type="submit"
                                            disabled={isSubmittingComment}
                                        >
                                            {isSubmittingComment ? 'Submitting...' : (
                                                orchid.feedback && orchid.feedback.find(f => f.author === userInfoString.email) 
                                                ? 'Update Comment' 
                                                : 'Submit Comment'
                                            )}
                                        </Button>
                                    </Form>
                                </>
                            ) : (
                                <Alert variant="info">
                                    Please <Button variant="link" className="p-0" onClick={() => navigate('/login')}>log in</Button> to leave a comment.
                                </Alert>
                            )}
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
