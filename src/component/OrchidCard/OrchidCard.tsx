import { Orchid } from "../../model.ts/orchids";
import styles from "./OrchidCard.module.css";


const OrchidsCard = (prop: Orchid) => {
    return (
        <div className={styles['card-container']}>
            <div className={styles['image-container']}>
                <img className={styles['orchid-image']} src={prop.image} alt={prop.name} />
            </div>
            <div className={styles['content']}>
                <h3 className={styles['name']}>{prop.name}</h3>
                <div className={styles['likes']}>
                    <span>❤️ {prop.numberOfLikes}</span>
                </div>
            </div>
        </div>
    );
}

export default OrchidsCard;