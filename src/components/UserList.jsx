import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import ConfirmModal from "./ConfirmModal";
import "./styles.css";

function UserList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      const response = await axios.get("http://localhost:3000/users");
      console.log(response.data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/users/${deleteUserId}`);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      await fetchUsersAfterDelete(); 
    } catch (error) {
      console.error("Error deleting user:", error);
      setIsDeleting(false);
    }
  };

  const fetchUsersAfterDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay to show loader
      const response = await axios.get("http://localhost:3000/users");
      setData(response.data);
      setIsDeleting(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteUserId(null);
  };

  if (loading) {
    return <Loader />;
  }

  if (isDeleting) {
    return <Loader />;
  }

  return (
    <>
      <div className="users-list-container">
        <h1>Users List</h1>
        <Link to="/add-user" className="add-user-btn">
          + Add User
        </Link>
        <table className="users-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Age</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((user) => (
              <tr key={user.id} className="table-body-row">
                <td className="table-cell">{user.name}</td>
                <td className="table-cell">{user.age}</td>
                <td className="table-cell">
                  <div className="action-cell">
                    <Link
                      to={`/update-user/${user.id}`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmBtnText="Delete"
        cancelBtnText="Cancel"
      />
    </>
  );
}

export default UserList;
