import { use, useEffect, useState } from "react"
import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import { listOfOrchids } from "../../data/ListOfOrchids"
import styles from "./OrichidViewList.module.css"
import { OrchidService } from "../../services/orchidService"
import { Orchid } from "../../model.ts/orchids"
import CreateOrchidModal from "../../component/OrchidCard/CreateOrchidModal"
import appLocalStorage from "../../util/appLocalStorage"
import { localKeyItem } from "../../util/localKeyItem"
import { useCredential } from "../../hooks/useCredential"

const OrichidViewList = () => {
    const [orchids, setOrchids] = useState<Orchid[]>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { credential } = useCredential();

    const getListOfOrchidsAsync = async () => {
        const orchids = await OrchidService.getOrchids();
        setOrchids(orchids);
    }

    const handleOnClick = () => {
        var storedCredential = appLocalStorage.getItem(localKeyItem.userCredential);
        console.log("Stored Credential: ", storedCredential);
        
        if (!storedCredential) {
            alert("Please login to create a new orchid.");
            return;
        } else {
            setIsCreateModalOpen(true)
        }
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
                        onClick={() => handleOnClick()}
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