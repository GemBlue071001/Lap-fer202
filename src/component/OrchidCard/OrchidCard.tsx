import { Orchid } from "../../model.ts/orchids";
import { useTheme } from "../../context/ThemeContext";
import styles from "./OrchidCard.module.css";
import { useState } from "react";
import OrchidDetailModal from "./OrchidDetailModal";


const OrchidsCard = (prop: Orchid) => {
    const { isLightTheme } = useTheme();
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <div
                className={styles['card-container']}
                style={{
                    background: isLightTheme ? '#fff' : '#23272b',
                    color: isLightTheme ? '#333' : '#fff',
                    border: isLightTheme ? '1px solid #e0e0e0' : '1px solid #444',
                    cursor: 'pointer'
                }}
                onClick={handleShowModal}
            >
                <div className={styles['image-container']}>
                    <img className={styles['orchid-image']} src={prop.image} alt={prop.name} />
                </div>
                <div className={styles['content']}>
                    <h3 className={styles['name']} style={{ color: isLightTheme ? '#333' : '#fff' }}>{prop.name}</h3>
                    <div className={styles['likes']}>
                        <span>❤️ {prop.numberOfLikes}</span>
                    </div>
                </div>
            </div>

            <OrchidDetailModal 
                show={showModal}
                onHide={handleCloseModal}
                orchid={prop}
            />
        </>
    );
}

export default OrchidsCard;