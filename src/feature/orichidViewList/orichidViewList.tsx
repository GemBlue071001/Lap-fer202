import { use, useEffect, useState } from "react"
import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import { listOfOrchids } from "../../data/ListOfOrchids"
import styles from "./OrichidViewList.module.css"
import { OrchidService } from "../../services/orchidService"
import { Orchid } from "../../model.ts/orchids"
import CreateOrchidModal from "../../component/OrchidCard/CreateOrchidModal"

const OrichidViewList = () => {
    const [orchids, setOrchids] = useState<Orchid[]>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const getListOfOrchidsAsync = async () => {
        const orchids = await OrchidService.getOrchids();
        setOrchids(orchids);
    }

    useEffect(() => {
        getListOfOrchidsAsync()
    }, [])

    return (
        <>
            <div>
                <div className={styles['list-header']}>
                    <h1>Orchid Collection</h1>
                    <button
                        className={styles['create-button']}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create New Orchid
                    </button>
                </div>
                <div className={styles['list-view-container']}>
                    {orchids?.map((orchid) => (
                        <div className={styles['card-wrapper']} key={orchid.id}>
                            <OrchidsCard {...orchid} />
                        </div>
                    ))}
                </div>
                <CreateOrchidModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onOrchidCreated={getListOfOrchidsAsync}
                />
            </div>
        </>

    )
}

export default OrichidViewList