/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState, useMemo, useRef } from "react"
import OrchidsCard from "../../component/OrchidCard/OrchidCard"
import styles from "./OrichidViewList.module.css"
import { OrchidService } from "../../services/orchidService"
import { Orchid } from "../../model.ts/orchids"
import CreateOrchidModal from "../../component/OrchidCard/CreateOrchidModal"
import { Form, InputGroup, Spinner, Dropdown, Badge, Button } from "react-bootstrap"
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import appLocalStorage from "../../util/appLocalStorage"
import { localKeyItem } from "../../util/localKeyItem"
import { User } from "../../model.ts/user"

const OrichidViewList = () => {
    const [orchids, setOrchids] = useState<Orchid[]>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);

    // For debouncing search
    const searchTimeoutRef = useRef<number | null>(null);
    
    const userInfoString: User = appLocalStorage.getItem(localKeyItem.userInfo);
    
    // Extract unique categories
    const categories = useMemo(() => {
        if (!orchids) return [];
        
        // Create a Set to store unique categories
        const categorySet = new Set<string>();
        
        // Add all categories to the set
        orchids.forEach(orchid => {
            if (orchid.category) {
                categorySet.add(orchid.category);
            }
        });
        
        // Convert Set to array and sort alphabetically
        return Array.from(categorySet).sort();
    }, [orchids]);
    
    const fetchOrchids = useCallback(async (search: string = "") => {
        setIsSearching(true);
        try {
            const orchidData = await OrchidService.getOrchids(search);
            if (selectedCategory) {
                const filteredData = orchidData.filter(orchid => orchid.category === selectedCategory);
                setOrchids(filteredData);
            } else {
                setOrchids(orchidData);
            }
        } catch (error) {
            console.error("Error fetching orchids:", error);
        } finally {
            setIsSearching(false);
            setLoading(false);
        }
    }, [selectedCategory]);
    
    const handleOnClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = window.setTimeout(() => {
            fetchOrchids(value);
        }, 500); // 500ms delay
    };
    
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        fetchOrchids(searchTerm);
    };
    
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        fetchOrchids("");
    };

    // Initial load
    useEffect(() => {
        fetchOrchids();
        return () => {
            if (searchTimeoutRef.current) {
                window.clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [fetchOrchids]);

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
                                    disabled={isSearching}
                                />
                                <InputGroup.Text
                                    style={{ cursor: isSearching ? 'default' : 'pointer' }}
                                >
                                    {isSearching ? <Spinner size="sm" animation="border" /> : <FiSearch />}
                                </InputGroup.Text>
                            </InputGroup>
                            {/* {userInfoString.role === "admin" &&
                                (<>
                                    <button
                                        className={styles['create-button']}
                                        onClick={() => handleOnClick()}
                                    >
                                        Create New Orchid
                                    </button>
                                </>)} */}

                        </div>
                        
                        <div className={styles['filters-container']}>
                            <span className={styles['filters-section-title']}>
                                <FiFilter />
                                Filter orchids:
                            </span>
                            <div className={styles['category-filter']}>
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant="outline-secondary" 
                                        id="dropdown-category"
                                        disabled={isSearching}
                                    >
                                        {selectedCategory || 'All Categories'}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {categories.length > 0 ? (
                                            <>
                                                <Dropdown.Item 
                                                    onClick={() => handleCategorySelect('')}
                                                    active={selectedCategory === ''}
                                                >
                                                    All Categories
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                {categories.map(category => (
                                                    <Dropdown.Item 
                                                        key={category}
                                                        onClick={() => handleCategorySelect(category)}
                                                        active={selectedCategory === category}
                                                    >
                                                        {category}
                                                    </Dropdown.Item>
                                                ))}
                                            </>
                                        ) : (
                                            <Dropdown.Item disabled>No categories available</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            
                            {(searchTerm || selectedCategory) && (
                                <Button 
                                    variant="link" 
                                    onClick={clearFilters}
                                    className={styles['filter-clear-all']}
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                        
                        {(searchTerm || selectedCategory) && (
                            <div className={styles['active-filters']}>
                                <span>Active filters:</span>
                                {searchTerm && (
                                    <span className={styles['filter-badge']}>
                                        Search: {searchTerm}
                                        <button onClick={() => setSearchTerm('')}>
                                            <FiX />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className={styles['filter-badge']}>
                                        Category: {selectedCategory}
                                        <button onClick={() => setSelectedCategory('')}>
                                            <FiX />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                        
                        <div className={`${styles['list-view-container']} ${styles['grid-alignment-fix']}`}>
                            {isSearching ? (
                                <div className={styles['empty-state']}>
                                    <Spinner animation="border" role="status" />
                                    <p className="mt-3">Searching...</p>
                                </div>
                            ) : orchids?.length ? (
                                orchids.map((orchid: Orchid) => (
                                    <div className={styles['card-wrapper']} key={orchid.id}>
                                        <OrchidsCard {...orchid} />
                                    </div>
                                ))
                            ) : (
                                <div className={styles['empty-state']}>
                                    <h3>No orchids found</h3>
                                    <p>Try adjusting your filters or search term</p>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={clearFilters}
                                        className="mt-3"
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </div>
                        <CreateOrchidModal
                            isOpen={isCreateModalOpen}
                            onClose={() => setIsCreateModalOpen(false)}
                            onOrchidCreated={() => fetchOrchids(searchTerm)}
                        />
                    </div>
                )}
        </>

    )
}

export default OrichidViewList