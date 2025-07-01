import { Orchid } from "../../model.ts/orchids";
import { useTheme } from "../../context/ThemeContext";
import styles from "./OrchidCard.module.css";
import { useNavigate } from "react-router-dom";

const OrchidsCard = (prop: Orchid) => {
    const { isLightTheme } = useTheme();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/orchid/${prop.id}`);
    };

    return (
        <div
            className={styles['card-container']}
            style={{
                background: isLightTheme ? '#fff' : '#23272b',
                color: isLightTheme ? '#333' : '#fff',
                border: isLightTheme ? '1px solid #e0e0e0' : '1px solid #444',
                cursor: 'pointer'
            }}
            onClick={handleClick}
        >
            <div className={styles['image-container']}>
                <img className={styles['orchid-image']} src={prop.image} alt={prop.name} />
            </div>
            <div className={styles['content']}>
                <h3 className={styles['name']} style={{ color: isLightTheme ? '#333' : '#fff' }}>Name: {prop.name}</h3>                <div className={styles['likes']}>
                    <span>Likes:❤️ {prop.numberOfLikes}</span>
                </div>
                <div>
                    <span>Category: {prop.category}</span>
                </div>
                <div className={styles['badges-container']}>
                    {prop.isSpecial && <span className={`${styles['badge']} ${styles['special']}`}>Special</span>}
                    {prop.isNatural && <span className={`${styles['badge']} ${styles['natural']}`}>Natural</span>}
                </div>
            </div>
        </div>
    );
}

export default OrchidsCard;