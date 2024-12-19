import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [successMessage, setSuccessMessage] = useState("");  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/admin/users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await axios.delete(`http://127.0.0.1:8000/api/users/admin/users/${userId}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUsers(users.filter((user) => user.id !== userId));
      setSuccessMessage("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-medium">Loading users...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Admin Panel - User Management</h2>

      {/* Success/Error messages */}
      {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg mb-4">{error}</div>}
      {successMessage && <div className="text-green-600 bg-green-100 p-4 rounded-lg mb-4">{successMessage}</div>}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Phone Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone_number}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
