import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { User } from '../model.ts/user';
import appLocalStorage from '../util/appLocalStorage';
import { localKeyItem } from '../util/localKeyItem';
import { userService } from '../services/userService';

const ProfilePage: React.FC = () => {
  const { isLightTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get user info from local storage
    const userInfo = appLocalStorage.getItem(localKeyItem.userInfo);
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setUser(userInfo);
    setName(userInfo.name || '');
    setEmail(userInfo.email || '');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!user || !user.id) {
      setError('User information not found');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare updated user data
      const updatedUser: User = {
        ...user,
        name,
        email,
        ...(password ? { password } : {})
      };

      // Update user in the database
      await userService.updateUser(user.id, updatedUser);
      
      // Update user in local storage
      appLocalStorage.setItem(localKeyItem.userInfo, updatedUser);
      
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      
      // Update the user state
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className={`py-5 ${isLightTheme ? 'bg-light' : 'bg-dark text-white'}`}>
        <h2 className="mb-4">Edit Profile</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Card className={isLightTheme ? '' : 'bg-dark text-white border-secondary'}>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={isLightTheme ? '' : 'bg-dark text-white border-secondary'}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={isLightTheme ? '' : 'bg-dark text-white border-secondary'}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>New Password (leave blank to keep current)</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={isLightTheme ? '' : 'bg-dark text-white border-secondary'}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={isLightTheme ? '' : 'bg-dark text-white border-secondary'}
                />
              </Form.Group>
              
              <div className="d-flex gap-2">
                <Button 
                  variant={isLightTheme ? 'primary' : 'light'} 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
                <Button 
                  variant={isLightTheme ? 'secondary' : 'outline-light'} 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default ProfilePage;
