/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react"
import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import styles from "./OrichidViewList.module.css"
import { OrchidService } from "../../services/orchidService"
import { Orchid } from "../../model.ts/orchids"
import CreateOrchidModal from "../../component/OrchidCard/CreateOrchidModal"
import { Form, InputGroup, Spinner } from "react-bootstrap"
import { FiSearch } from "react-icons/fi";
import appLocalStorage from "../../util/appLocalStorage"
import { localKeyItem } from "../../util/localKeyItem"
import { User } from "../../model.ts/user"

const OrichidViewList = () => {
    const [orchids, setOrchids] = useState<Orchid[]>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrchids, setFilteredOrchids] = useState<Orchid[]>();

   

    const userInfoString: User = appLocalStorage.getItem(localKeyItem.userInfo);
    

    const getListOfOrchidsAsync = useCallback(async () => {
        const orchids = await OrchidService.getOrchids(searchTerm);
        setOrchids(orchids);
        setLoading(false)
    }, [searchTerm])

    const handleOnClick = () => {
        setIsCreateModalOpen(true)
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    useEffect(() => {
        getListOfOrchidsAsync()
    }, [getListOfOrchidsAsync, searchTerm])

    return (
        <>
            {loading ?
                (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner />
                    </div>
                ) :
                (
                    <div className={styles['orchid-container']}>
                        <div className={styles['list-header']}>
                            <h1>Orchid Collection</h1>

                            <InputGroup className={`mb-3 ${styles['search-container']}`}>
                                <Form.Control
                                    aria-label="Search"
                                    placeholder="Search orchids"
                                    value={searchTerm}
                                    onChange={e => handleSearch(e.target.value)}
                                />
                                <InputGroup.Text
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSearch(searchTerm)}
                                >
                                    <FiSearch />
                                </InputGroup.Text>
                            </InputGroup>
                            {userInfoString.role === "admin" &&
                                (<>
                                    <button
                                        className={styles['create-button']}
                                        onClick={() => handleOnClick()}
                                    >
                                        Create New Orchid
                                    </button>
                                </>)}

                        </div>
                        <div className={`${styles['list-view-container']} ${styles['grid-alignment-fix']}`}>
                            {(filteredOrchids ?? orchids)?.map((orchid) => (
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
                )}
        </>

    )
}

export default OrichidViewList