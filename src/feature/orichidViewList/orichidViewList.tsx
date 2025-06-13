import { use, useEffect, useState } from "react"
import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import { listOfOrchids } from "../../data/ListOfOrchids"
import styles from "./OrichidViewList.module.css"
import { OrchidService } from "../../services/orchidService"
import { Orchid } from "../../model.ts/orchids"

const OrichidViewList = () => {
    const [orchids, setOrchids] = useState<Orchid[]>();

    const getListOfOrchidsAsync = async () => {
        const orchids = await OrchidService.getOrchids();
        setOrchids(orchids);
    }

    useEffect(() => {
        getListOfOrchidsAsync()
    }, [])

    return (
        <div className={styles['list-view-container']} >
            {orchids?.map((orchid) => (
                <div className={styles['card-wrapper']} key={orchid.id}>
                    <OrchidsCard {...orchid} />
                </div>
            ))}
        </div>
    )
}

export default OrichidViewList