import React, { useState } from 'react';
import { Orchid } from '../../model.ts/orchids';
import { OrchidService } from '../../services/orchidService';
import styles from './OrchidCard.module.css';

interface CreateOrchidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrchidCreated: () => void;
}

const CreateOrchidModal: React.FC<CreateOrchidModalProps> = ({ isOpen, onClose, onOrchidCreated }) => {
    const [newOrchid, setNewOrchid] = useState<Orchid>({
        name: '',
        rating: 0,
        isSpecial: false,
        isNatural: false,
        image: '',
        color: '',
        numberOfLikes: 0,
        origin: '',
        category: '',
        id: ''
    });

    if (!isOpen) return null; const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await OrchidService.createOrchids({ ...newOrchid, id: Date.now().toString()});
            onOrchidCreated();
            onClose();
        } catch (error) {
            console.error('Error creating orchid:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setNewOrchid(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Create New Orchid</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newOrchid.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="image">Image URL:</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={newOrchid.image}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="color">Color:</label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            value={newOrchid.color}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="origin">Origin:</label>
                        <input
                            type="text"
                            id="origin"
                            name="origin"
                            value={newOrchid.origin}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category:</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={newOrchid.category}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="isSpecial"
                                checked={newOrchid.isSpecial}
                                onChange={handleInputChange}
                            />
                            Special Orchid
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="isNatural"
                                checked={newOrchid.isNatural}
                                onChange={handleInputChange}
                            />
                            Natural Orchid
                        </label>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.submitButton}>Create</button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrchidModal;
