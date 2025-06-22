import { useEffect, useState } from "react"
import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import styles from "./OrichidViewList.module.css"
import { OrchidService } from "../../services/orchidService"
import { Orchid } from "../../model.ts/orchids"
import CreateOrchidModal from "../../component/OrchidCard/CreateOrchidModal"
import appLocalStorage from "../../util/appLocalStorage"
import { localKeyItem } from "../../util/localKeyItem"
import { Form, InputGroup, Spinner } from "react-bootstrap"
import { FiSearch } from "react-icons/fi";

const OrichidViewList = () => {
    const [orchids, setOrchids] = useState<Orchid[]>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrchids, setFilteredOrchids] = useState<Orchid[]>();

    const getListOfOrchidsAsync = async () => {
        const orchids = await OrchidService.getOrchids();
        setOrchids(orchids);
        setLoading(false)
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

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        console.log("Search Term: ", value);
    };

    useEffect(() => {
        getListOfOrchidsAsync()
    }, [])

    return (
        <>
            {loading ?
                (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner />
                    </div>
                ) :
                (
                    <div>
                        <div className={styles['list-header']}>
                            <h1>Orchid Collection</h1>
                            {/* <button
                                className={styles['create-button']}
                                onClick={() => handleOnClick()}
                            >
                                Create New Orchid
                            </button> */}
                            <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
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
                            
                        </div>
                        <div className={styles['list-view-container']}>
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