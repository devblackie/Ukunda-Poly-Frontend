import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminIllustration from "../assets/illustration/TeachingIllustration.svg";
import BASE_API_URL from "../config/config";
import { SearchInput } from "../components/ui/InputComponents";

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: "", ids: [] });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const [userSort, setUserSort] = useState({ field: "name", direction: "asc" });
  const [contentSort, setContentSort] = useState({
    field: "title",
    direction: "asc",
  });
  const [userPage, setUserPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const [usersResponse, contentResponse, meResponse] = await Promise.all([
          axios.get(`${BASE_API_URL}/api/admin/users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${BASE_API_URL}/api/admin/content`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${BASE_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersResponse.data);
        setContent(contentResponse.data);
        setCurrentUserId(meResponse.data.user.userId);
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to fetch data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userIds) => {
    setActionLoading((prev) => ({
      ...prev,
      ...Object.fromEntries(userIds.map((id) => [`user-${id}`, true])),
    }));
    setError("");
    try {
      await Promise.all(
        userIds.map((userId) =>
          axios.delete(`${BASE_API_URL}/api/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setUsers(users.filter((user) => !userIds.includes(user.userId)));
      setSelectedUsers(selectedUsers.filter((id) => !userIds.includes(id)));
      alert(`${userIds.length} user(s) deleted successfully`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user(s)");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        ...Object.fromEntries(userIds.map((id) => [`user-${id}`, false])),
      }));
      setModal({ isOpen: false, type: "", ids: [] });
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setActionLoading((prev) => ({ ...prev, [`role-${userId}`]: true }));
    setError("");
    try {
      const response = await axios.put(
        `${BASE_API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(
        users.map((user) =>
          user.userId === userId ? response.data.user : user
        )
      );
      alert("Role updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update role");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`role-${userId}`]: false }));
    }
  };

  const handleDeleteContent = async (contentIds) => {
    setActionLoading((prev) => ({
      ...prev,
      ...Object.fromEntries(contentIds.map((id) => [`content-${id}`, true])),
    }));
    setError("");
    try {
      await Promise.all(
        contentIds.map((contentId) =>
          axios.delete(`${BASE_API_URL}/api/admin/content/${contentId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setContent(
        content.filter((item) => !contentIds.includes(item.contentId))
      );
      setSelectedContent(
        selectedContent.filter((id) => !contentIds.includes(id))
      );
      alert(`${contentIds.length} content item(s) deleted successfully`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete content");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        ...Object.fromEntries(contentIds.map((id) => [`content-${id}`, false])),
      }));
      setModal({ isOpen: false, type: "", ids: [] });
    }
  };

  const handleSort = (type, field) => {
    const setSort = type === "users" ? setUserSort : setContentSort;
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    )
    .sort((a, b) => {
      const field = userSort.field;
      const valueA = a[field]?.toLowerCase() || "";
      const valueB = b[field]?.toLowerCase() || "";
      return userSort.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  const filteredContent = content
    .filter(
      (item) =>
        item.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
        item.createdBy?.name.toLowerCase().includes(contentSearch.toLowerCase())
    )
    .sort((a, b) => {
      const field = contentSort.field;
      const valueA =
        field === "createdBy"
          ? a[field]?.name?.toLowerCase()
          : a[field]?.toLowerCase();
      const valueB =
        field === "createdBy"
          ? b[field]?.name?.toLowerCase()
          : b[field]?.toLowerCase();
      return contentSort.direction === "asc"
        ? (valueA || "").localeCompare(valueB || "")
        : (valueB || "").localeCompare(valueA || "");
    });

  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * ITEMS_PER_PAGE,
    userPage * ITEMS_PER_PAGE
  );
  const paginatedContent = filteredContent.slice(
    (contentPage - 1) * ITEMS_PER_PAGE,
    contentPage * ITEMS_PER_PAGE
  );

  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const totalContentPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);

  const Pagination = ({ currentPage, totalPages, setPage }) => (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-3 py-1 bg-yellow-400 text-blue-900 rounded-lg">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      {/* Confirmation Modal */}
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              {modal.type === "users"
                ? "the selected user(s)"
                : "the selected content item(s)"}
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModal({ isOpen: false, type: "", ids: [] })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <motion.button
                onClick={() =>
                  modal.type === "users"
                    ? handleDeleteUser(modal.ids)
                    : handleDeleteContent(modal.ids)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Image Section */}
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1646705193300-aa2815a15bcd?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.1.0"
            alt="Administrative Workspace"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = AdminIllustration;
            }}
          />
          <div className="absolute inset-0 bg-blue-900/30"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-semibold">Admin Control</h3>
            <p className="text-sm opacity-80">
              Manage Users & Content Seamlessly
            </p>
          </div>
        </div>
        {/* Dashboard Section */}
        <div className="p-8 flex flex-col relative">
          <img
            src={AdminIllustration}
            alt="Admin Illustration"
            className="absolute top-0 right-0 h-24 opacity-10 object-contain"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
            }}
          />
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
            Admin Dashboard
          </h1>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mb-4 text-center text-sm bg-red-100/50 p-2 rounded"
            >
              {error}
            </motion.p>
          )}
          {isLoading ? (
            <div className="text-center text-gray-600">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
              <p className="mt-2">Loading data...</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                </svg>
                Manage Users
              </h2>

              <div className="mb-4 flex justify-between items-center">
              
                <SearchInput value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    placeholder="Search by name or email" />
                {selectedUsers.length > 0 && (
                  <motion.button
                    onClick={() =>
                      setModal({
                        isOpen: true,
                        type: "users",
                        ids: selectedUsers,
                      })
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="currentColor"
                    >
                      <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
                    </svg>
                    Delete Selected ({selectedUsers.length})
                  </motion.button>
                )}
              </div>
              <div className="mb-8 overflow-x-auto">
                {paginatedUsers.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    {userSearch
                      ? "No users match your search."
                      : "No users found."}
                  </p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-sm">
                        <th className="p-3">
                          <input
                            type="checkbox"
                            checked={
                              selectedUsers.length === filteredUsers.length
                            }
                            onChange={(e) =>
                              setSelectedUsers(
                                e.target.checked
                                  ? filteredUsers.map((u) => u.userId)
                                  : []
                              )
                            }
                            className="h-4 w-4 text-yellow-400"
                          />
                        </th>
                        {["name", "email", "role"].map((field) => (
                          <th
                            key={field}
                            className="p-3 text-left text-blue-900 font-semibold cursor-pointer"
                            onClick={() => handleSort("users", field)}
                          >
                            <div className="flex items-center">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                              {userSort.field === field &&
                                (userSort.direction === "asc" ? (
                                  <svg
                                    className="h-4 w-4 ml-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="currentColor"
                                  >
                                    <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-4 w-4 ml-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="currentColor"
                                  >
                                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                  </svg>
                                ))}
                            </div>
                          </th>
                        ))}
                        <th className="p-3 text-left text-blue-900 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, index) => (
                        <motion.tr
                          key={user.userId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="border-b text-xs hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.userId)}
                              onChange={() =>
                                setSelectedUsers((prev) =>
                                  prev.includes(user.userId)
                                    ? prev.filter((id) => id !== user.userId)
                                    : [...prev, user.userId]
                                )
                              }
                              className="h-4 w-4 text-yellow-400"
                            />
                          </td>
                          <td className="p-3 text-gray-700 capitalize  ">
                            {user.name}
                          </td>
                          <td className="p-3 text-gray-700">{user.email}</td>
                          <td className="p-3 text-gray-700 capitalize">
                            {user.role}
                          </td>
                          <td className="p-3 flex space-x-2">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleUpdateRole(user.userId, e.target.value)
                              }
                              disabled={actionLoading[`role-${user.userId}`]}
                              className="p-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                              <option value="student">Student</option>
                              <option value="educator">Educator</option>
                              <option value="admin">Admin</option>
                            </select>
                            <motion.button
                              onClick={() =>
                                setModal({
                                  isOpen: true,
                                  type: "users",
                                  ids: [user.userId],
                                })
                              }
                              disabled={actionLoading[`user-${user.userId}`]}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${
                                actionLoading[`user-${user.userId}`]
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <svg
                                className="h-4 w-4 "
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="currentColor"
                              >
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                              </svg>
                              {actionLoading[`user-${user.userId}`]
                                ? "Deleting..."
                                : ""}
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {totalUserPages > 1 && (
                  <Pagination
                    currentPage={userPage}
                    totalPages={totalUserPages}
                    setPage={setUserPage}
                  />
                )}
              </div>
              {/* Content Section */}
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M200-200h560v-367L567-760H200v560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h400l240 240v400q0 33-23.5 56.5T760-120H200Zm80-160h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h280v-80H280v80Zm-80 400v-560 560Z" />
                </svg>
                Manage Content
              </h2>
              <div className="mb-4 flex justify-between items-center">
               
                <SearchInput
                  value={contentSearch}
                  onChange={(e) => {
                    setContentSearch(e.target.value);
                    setContentPage(1);
                  }}
                  placeholder="Search by title or creator"
                />
                {selectedContent.length > 0 && (
                  <motion.button
                    onClick={() =>
                      setModal({
                        isOpen: true,
                        type: "content",
                        ids: selectedContent,
                      })
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="currentColor"
                    >
                      <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
                    </svg>
                    Delete Selected ({selectedContent.length})
                  </motion.button>
                )}
              </div>
              <div className="overflow-x-auto">
                {paginatedContent.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    {contentSearch
                      ? "No content matches your search."
                      : "No content found."}
                  </p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 ">
                        <th className="p-3">
                          <input
                            type="checkbox"
                            checked={
                              selectedContent.length === filteredContent.length
                            }
                            onChange={(e) =>
                              setSelectedContent(
                                e.target.checked
                                  ? filteredContent.map((c) => c.contentId)
                                  : []
                              )
                            }
                            className="h-4 w-4 text-yellow-400"
                          />
                        </th>
                        {["title", "type", "createdBy"].map((field) => (
                          <th
                            key={field}
                            className="p-3 text-left text-blue-900 font-semibold cursor-pointer"
                            onClick={() => handleSort("content", field)}
                          >
                            <div className="flex items-center">
                              {field === "createdBy"
                                ? "Created By"
                                : field.charAt(0).toUpperCase() +
                                  field.slice(1)}
                              {contentSort.field === field &&
                                (contentSort.direction === "asc" ? (
                                    <svg
                                    className="h-4 w-4 ml-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="currentColor"
                                  >
                                    <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-4 w-4 ml-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="currentColor"
                                  >
                                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                  </svg>
                                ))}
                            </div>
                          </th>
                        ))}
                        <th className="p-3 text-left text-blue-900 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContent.map((item, index) => (
                        <motion.tr
                          key={item.contentId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedContent.includes(item.contentId)}
                              onChange={() =>
                                setSelectedContent((prev) =>
                                  prev.includes(item.contentId)
                                    ? prev.filter((id) => id !== item.contentId)
                                    : [...prev, item.contentId]
                                )
                              }
                              className="h-4 w-4 text-yellow-400"
                            />
                          </td>
                          <td className="p-3 text-gray-600 capitalize">
                            {item.title}
                          </td>
                          <td className="p-3 text-gray-600 capitalize">
                            {item.type}
                          </td>
                          <td className="p-3 text-gray-600 capitalize">
                            {item.createdBy?.name || "Unknown"}
                          </td>
                          <td className="p-3">
                            <motion.button
                              onClick={() =>
                                setModal({
                                  isOpen: true,
                                  type: "content",
                                  ids: [item.contentId],
                                })
                              }
                              disabled={
                                actionLoading[`content-${item.contentId}`]
                              }
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${
                                actionLoading[`content-${item.contentId}`]
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="currentColor"
                              >
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                              </svg>
                              {actionLoading[`content-${item.contentId}`]
                                ? "Deleting..."
                                : ""}
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {totalContentPages > 1 && (
                  <Pagination
                    currentPage={contentPage}
                    totalPages={totalContentPages}
                    setPage={setContentPage}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
