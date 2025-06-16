import React, { useEffect, useState } from 'react';
import { Orchid } from '../../model.ts/orchids';
import { OrchidService } from '../../services/orchidService';
import styles from './OrchidCard.module.css';

interface OrchidFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    initialData?: Orchid;
    mode: 'create' | 'update';
}

const OrchidFormModal: React.FC<OrchidFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmitSuccess, 
    initialData,
    mode 
}) => {
    const [orchidData, setOrchidData] = useState<Orchid>({
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

    useEffect(() => {
        if (initialData && mode === 'update') {
            setOrchidData(initialData);
        }
    }, [initialData, mode]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (mode === 'create') {
                await OrchidService.createOrchids({ ...orchidData, id: Date.now().toString() });
            } else {
                await OrchidService.updateOrchids(orchidData.id, orchidData);
            }
            onSubmitSuccess();
            onClose();
        } catch (error) {
            console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} orchid:`, error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setOrchidData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{mode === 'create' ? 'Create New Orchid' : 'Update Orchid'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={orchidData.name}
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
                            value={orchidData.image}
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
                            value={orchidData.color}
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
                            value={orchidData.origin}
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
                            value={orchidData.category}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="isSpecial"
                                checked={orchidData.isSpecial}
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
                                checked={orchidData.isNatural}
                                onChange={handleInputChange}
                            />
                            Natural Orchid
                        </label>
                    </div>

                    <div className={styles.modalActions}>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={!orchidData.name || !orchidData.image || !orchidData.color || !orchidData.origin || !orchidData.category}
                        >
                            {mode === 'create' ? 'Create' : 'Update'}
                        </button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrchidFormModal;
