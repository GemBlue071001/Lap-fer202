import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import { listOfOrchids } from "../../data/ListOfOrchids"
import styles from "./OrichidViewList.module.css"

const OrichidViewList = () => {
    return (
        <div className={styles['list-view-container']} >
            {listOfOrchids.map((orchid) => (
                <div className={styles['card-wrapper']} key={orchid.id}>
                    <OrchidsCard {...orchid} />
                </div>
            ))}
        </div>
    )
}

export default OrichidViewList