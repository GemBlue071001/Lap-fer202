import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { User } from '../model.ts/user';
import appLocalStorage from '../util/appLocalStorage';
import { localKeyItem } from '../util/localKeyItem';
import { userService } from '../services/userService';
import styles from './ProfilePage.module.css';

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

  // Set CSS variables based on theme
  const themeStyle = {
    '--profile-bg': isLightTheme ? 'white' : '#343a40',
    '--text-color': isLightTheme ? '#333' : '#fff',
    '--border-color': isLightTheme ? 'rgba(0,0,0,0.125)' : 'rgba(255,255,255,0.2)',
  } as React.CSSProperties;

  return (
    <Layout>
      <div 
        className={`d-flex justify-content-center align-items-center min-vh-100 ${isLightTheme ? 'bg-light' : 'bg-dark'}`}
        style={themeStyle}
      >
        <Container className="py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className={`${styles['profile-container']} p-4 rounded shadow ${isLightTheme ? 'bg-white' : 'bg-dark text-white'}`}>
                <h2 className="text-center mb-4">Edit Profile</h2>
                
                {error && <Alert variant="danger" className={styles['alert-animated']}>{error}</Alert>}
                {success && <Alert variant="success" className={`${styles['alert-animated']} ${styles['success-pulse']}`}>{success}</Alert>}
                
                <div className="d-flex mb-4">
                  <div className={`${styles['profile-avatar']} mx-auto text-center mb-3`}>
                    <div 
                      className={`${styles['profile-avatar-circle']} rounded-circle d-flex justify-content-center align-items-center mx-auto ${isLightTheme ? 'bg-primary text-white' : 'bg-light text-dark'}`} 
                      style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="mt-2 text-muted">{email}</div>
                  </div>
                </div>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={`${styles['form-control-animated']} ${isLightTheme ? '' : 'bg-dark text-white border-secondary'}`}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`${styles['form-control-animated']} ${isLightTheme ? '' : 'bg-dark text-white border-secondary'}`}
                    />
                  </Form.Group>
                  
                  <hr className="my-4" />
                  <h5 className="mb-3">Change Password</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className={`${styles['form-control-animated']} ${isLightTheme ? '' : 'bg-dark text-white border-secondary'}`}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`${styles['form-control-animated']} ${isLightTheme ? '' : 'bg-dark text-white border-secondary'}`}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button 
                      variant={isLightTheme ? 'primary' : 'light'} 
                      type="submit" 
                      disabled={isLoading}
                      size="lg"
                      className={`${styles['btn-animated']} px-4`}
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                    <Button 
                      variant={isLightTheme ? 'outline-secondary' : 'outline-light'} 
                      onClick={() => navigate('/')}
                      size="lg"
                      className={styles['btn-animated']}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default ProfilePage;
