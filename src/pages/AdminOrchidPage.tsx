/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import styles from "./AdminOrchidPage.module.css";
import { OrchidService } from "../services/orchidService";
import { Orchid } from "../model.ts/orchids";
import CreateOrchidModal from "../component/OrchidCard/CreateOrchidModal";
import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import { FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";
import appLocalStorage from "../util/appLocalStorage";
import { localKeyItem } from "../util/localKeyItem";
import { User } from "../model.ts/user";
import { useNavigate } from "react-router-dom";
import OrchidFormModal from "../component/OrchidCard/OrchidFormModal";
import { Toast } from "react-bootstrap";
import Layout from "../Layout/Layout";

const AdminOrchidPage = () => {
    const [orchids, setOrchids] = useState<Orchid[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedOrchid, setSelectedOrchid] = useState<Orchid | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "danger">("success");

    const navigate = useNavigate();
    const userInfoString: User = appLocalStorage.getItem(localKeyItem.userInfo);

    // Redirect if not admin
    useEffect(() => {
        if (!userInfoString || userInfoString.role !== "admin") {
            navigate("/");
        }
    }, [userInfoString, navigate]);

    const getListOfOrchidsAsync = useCallback(async () => {
        try {
            setLoading(true);
            const orchids = await OrchidService.getOrchids(searchTerm);
            setOrchids(orchids);
        } catch (error) {
            console.error("Error fetching orchids:", error);
            setToastType("danger");
            setToastMessage("Failed to load orchids");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this orchid?")) {
            try {
                await OrchidService.deleteOrchids(id);
                setToastType("success");
                setToastMessage("Orchid successfully deleted");
                setShowToast(true);
                getListOfOrchidsAsync();
            } catch (error) {
                setToastType("danger");
                setToastMessage("Failed to delete orchid");
                setShowToast(true);
            }
        }
    };

    const handleEdit = (orchid: Orchid) => {
        setSelectedOrchid(orchid);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateModalOpen(false);
        setToastType("success");
        setToastMessage("Orchid successfully updated");
        setShowToast(true);
        getListOfOrchidsAsync();
    };

    useEffect(() => {
        getListOfOrchidsAsync();
    }, [getListOfOrchidsAsync]);

    return (
        <Layout>
            <div className={styles["admin-container"]}>
                <div className={styles["admin-header"]}>
                    <h1>Orchid Administration</h1>

                    <div className={styles["controls-container"]}>
                        <InputGroup className={styles["search-container"]}>
                            <Form.Control
                                aria-label="Search"
                                placeholder="Search orchids"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <InputGroup.Text
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSearch(searchTerm)}
                            >
                                <FiSearch />
                            </InputGroup.Text>
                        </InputGroup>

                        <Button
                            variant="primary"
                            className={styles["create-button"]}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create New Orchid
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className={styles["loading-container"]}>
                        <Spinner animation="border" />
                        <p>Loading orchids...</p>
                    </div>
                ) : (
                    <div className={styles["table-container"]}>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Origin</th>
                                    <th>Rating</th>
                                    <th>Likes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orchids.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            No orchids found
                                        </td>
                                    </tr>
                                ) : (
                                    orchids.map((orchid) => (
                                        <tr key={orchid.id}>
                                            <td>{orchid.id}</td>
                                            <td>
                                                <img
                                                    src={orchid.image}
                                                    alt={orchid.name}
                                                    className={styles["thumbnail"]}
                                                />
                                            </td>
                                            <td>{orchid.name}</td>
                                            <td>{orchid.category}</td>
                                            <td>{orchid.origin}</td>
                                            <td>{orchid.rating}/5</td>
                                            <td>{orchid.numberOfLikes}</td>
                                            <td>
                                                <div className={styles["action-buttons"]}>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleEdit(orchid)}
                                                        title="Edit"
                                                    >
                                                        <FiEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(orchid.id)}
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => navigate(`/orchid/${orchid.id}`)}
                                                        title="View Details"
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <CreateOrchidModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onOrchidCreated={() => {
                    setIsCreateModalOpen(false);
                    setToastType("success");
                    setToastMessage("Orchid successfully created");
                    setShowToast(true);
                    getListOfOrchidsAsync();
                }}
            />

            {/* Update Modal */}
            {selectedOrchid && (
                <OrchidFormModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onSubmitSuccess={handleUpdateSuccess}
                    initialData={selectedOrchid}
                    mode="update"
                />
            )}

            {/* Toast notification */}
            <div
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                }}
            >
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastType}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastType === "success" ? "Success" : "Error"}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className={toastType === "success" ? "text-white" : ""}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </div>
        </Layout>
    );
};

export default AdminOrchidPage;
