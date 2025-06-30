/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState, useMemo } from "react"
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
    const [filteredOrchids, setFilteredOrchids] = useState<Orchid[]>();

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
    
    const getListOfOrchidsAsync = useCallback(async () => {
        try {
            const orchidData = await OrchidService.getOrchids("");
            setOrchids(orchidData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orchids:", error);
            setLoading(false);
        }
    }, []);
    
    const applyFilters = useCallback(() => {
        if (!orchids) return;
        
        let filtered = [...orchids];
        
        // Apply search term filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(orchid => 
                orchid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                orchid.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                orchid.origin?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(orchid => 
                orchid.category === selectedCategory
            );
        }
        
        setFilteredOrchids(filtered);
    }, [orchids, searchTerm, selectedCategory]);
    
    const handleOnClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };
    
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };
    
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
    };

    useEffect(() => {
        getListOfOrchidsAsync();
    }, [getListOfOrchidsAsync]);
    
    // Apply filters when dependencies change
    useEffect(() => {
        applyFilters();
    }, [applyFilters, orchids, searchTerm, selectedCategory]);

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
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-category">
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
                            {(filteredOrchids ?? orchids)?.length ? (
                                (filteredOrchids ?? orchids)?.map((orchid) => (
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
                            onOrchidCreated={getListOfOrchidsAsync}
                        />
                    </div>
                )}
        </>

    )
}

export default OrichidViewList