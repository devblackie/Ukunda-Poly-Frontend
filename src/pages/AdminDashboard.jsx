import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminIllustration from "../assets/illustration/TeachingIllustration.svg";
import BASE_API_URL from "../config/config";
import {
  UserSvg,
  ContentSvg,
  HistorySvg,
  RoleSvg,
} from "../components/ui/SvgComponents";
import { SearchInput } from "../components/ui/InputComponents";
import { ToggleButton } from "../components/ui/ButtonComponents";

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [deletedContent, setDeletedContent] = useState([]);
  const [roleChanges, setRoleChanges] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: "", data: null });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const [userSort, setUserSort] = useState({ field: "name", direction: "asc" });
  const [contentSort, setContentSort] = useState({
    field: "title",
    direction: "asc",
  });
  const [userPage, setUserPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);
  const [deletedContentPage, setDeletedContentPage] = useState(1);
  const [roleChangesPage, setRoleChangesPage] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     setError("");
  //     try {
  //       const token = localStorage.getItem("token");
  //       const [
  //         usersResponse,
  //         contentResponse,
  //         deletedContentResponse,
  //         roleChangesResponse,
  //         meResponse,
  //       ] = await Promise.all([
  //         axios.get(`${BASE_API_URL}/api/admin/users`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //         axios.get(`${BASE_API_URL}/api/admin/content`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //         axios.get(`${BASE_API_URL}/api/admin/deleted-content`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //         axios.get(`${BASE_API_URL}/api/admin/role-changes`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //         axios.get(`${BASE_API_URL}/api/me`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //       ]);
  //       setUsers(usersResponse.data);
  //       setContent(contentResponse.data);
  //       setDeletedContent(deletedContentResponse.data);
  //       setRoleChanges(roleChangesResponse.data);
  //       setCurrentUserId(meResponse.data.user.userId);
  //     } catch (err) {
  //       setError(err.response?.data?.error || "Failed to fetch data.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const requests = [
          axios.get(`${BASE_API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_API_URL}/api/admin/content`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios
            .get(`${BASE_API_URL}/api/admin/deleted-content`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: [] })),
          axios
            .get(`${BASE_API_URL}/api/admin/role-changes`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: [] })),
          axios.get(`${BASE_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ];
        const [
          usersResponse,
          contentResponse,
          deletedContentResponse,
          roleChangesResponse,
          meResponse,
        ] = await Promise.all(requests);
        setUsers(usersResponse.data);
        setContent(contentResponse.data);
        setDeletedContent(deletedContentResponse.data);
        setRoleChanges(roleChangesResponse.data); // Keep populated data
        setCurrentUserId(meResponse.data.user.userId);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewContent = async (contentId) => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_API_URL}/api/admin/content/${contentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedContent(response.data);
      setModal({ isOpen: true, type: "viewContent", data: null });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch content details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userIds) => {
    setActionLoading((prev) => ({
      ...prev,
      ...Object.fromEntries(userIds.map((id) => [`user-${id}`, true])),
    }));
    setError("");
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        userIds.map((userId) =>
          axios.delete(`${BASE_API_URL}/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setUsers(users.filter((user) => !userIds.includes(user.userId)));
      setSelectedUsers(selectedUsers.filter((id) => !userIds.includes(id)));
      alert(`${userIds.length} user(s) deleted successfully`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user(s).");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        ...Object.fromEntries(userIds.map((id) => [`user-${id}`, false])),
      }));
      setModal({ isOpen: false, type: "", data: null });
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setActionLoading((prev) => ({ ...prev, [`role-${userId}`]: true }));
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((user) =>
          user.userId === userId ? { ...user, role: newRole } : user
        )
      );
      alert("Role updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update role.");
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
      const token = localStorage.getItem("token");
      await Promise.all(
        contentIds.map((contentId) =>
          axios.delete(`${BASE_API_URL}/api/admin/content/${contentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setContent(
        content.filter((item) => !contentIds.includes(item.contentId))
      );
      setSelectedContentIds(
        selectedContentIds.filter((id) => !contentIds.includes(id))
      );
      alert(`${contentIds.length} content item(s) deleted successfully.`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete content.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        ...Object.fromEntries(contentIds.map((id) => [`content-${id}`, false])),
      }));
      setModal({ isOpen: false, type: "", data: null });
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
  const paginatedDeletedContent = deletedContent.slice(
    (deletedContentPage - 1) * ITEMS_PER_PAGE,
    deletedContentPage * ITEMS_PER_PAGE
  );
  const paginatedRoleChanges = roleChanges.slice(
    (roleChangesPage - 1) * ITEMS_PER_PAGE,
    roleChangesPage * ITEMS_PER_PAGE
  );

  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const totalContentPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const totalDeletedContentPages = Math.ceil(
    deletedContent.length / ITEMS_PER_PAGE
  );
  const totalRoleChangesPages = Math.ceil(roleChanges.length / ITEMS_PER_PAGE);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const Pagination = ({ currentPage, totalPages, setPage }) => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <motion.button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        className="px-3 py-1 bg-gradient-to-tr from-indigo-600 to-indigo-300 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
      >
        Previous
      </motion.button>
      <span className="px-4 py-1 bg-gradient-to-tr from-yellow-600 to-yellow-300 text-indigo-900 rounded-lg font-medium">
        {currentPage} / {totalPages}
      </span>
      <motion.button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        className="px-3 py-1 bg-gradient-to-tr from-indigo-900 to-indigo-400 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
      >
        Next
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex">
      {/* Sidebar */}

      <motion.div
        initial={{ x: -100 }}
        animate={{ x: isSidebarOpen ? 0 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        // className="fixed lg:static w-72 bg-gradient-to-b from-indigo-900 to-indigo-950 text-white h-screen p-6 z-50 shadow-2xl lg:shadow-none"
        role="navigation"
        aria-label="Admin Dashboard Sidebar"
        className={`lg:w-56 bg-blue-50/80 bg-gradient-to-b backdrop-blur-sm p-4 pt-0 rounded-xl shadow-2xl h-screen overflow-y-auto scrollbar-custom lg:sticky lg:top-4 ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between mb-8 sticky top-0 bg-blue-50/80 backdrop-blur-sm pt-4  z-10">
          <div className="flex items-center">
            <img
              src={AdminIllustration}
              alt="Admin Panel Logo"
              className="h-10 mr-3 rounded-full "
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
              }}
            />
            <h2 className="text-lg font-semibold tracking-tight text-blue-900">
              Admin Hub
            </h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {[
            {
              id: "users",
              label: "Users",
              icon: <UserSvg className="h-6 w-6" />,
            },
            {
              id: "content",
              label: "Content",
              icon: <ContentSvg className="h-6 w-6" />,
            },
            {
              id: "deletedContent",
              label: "Deleted Content",
              icon: <HistorySvg className="h-6 w-6" />,
            },
            {
              id: "roleChanges",
              label: "Role Changes",
              icon: <RoleSvg className="h-6 w-6" />,
            },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? " bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-full text-indigo-900 font-semibold shadow-md shadow-yellow-500/20"
                  : "cursor-pointer text-gray-700 hover:bg-indigo-800/20 hover:text-gray-600"
              } `}
              aria-current={activeTab === tab.id ? "page" : undefined}
              role="menuitem"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                className="flex-shrink-0"
              >
                {tab.icon}
              </motion.div>
              <span className="ml-4 text-sm">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden mb-4">
        <ToggleButton
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8">
        {/* Mobile Sidebar Toggle */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=" max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-6"
        >
          <h1 className="text-xl font-bold text-indigo-900 mb-6">
            Admin Dashboard
          </h1>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 bg-red-100 p-3 rounded-lg mb-4"
            >
              {error}
            </motion.p>
          )}

          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Search and Filters */}
              {(activeTab === "users" || activeTab === "content") && (
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <SearchInput
                    value={activeTab === "users" ? userSearch : contentSearch}
                    onChange={(e) => {
                      if (activeTab === "users") {
                        setUserSearch(e.target.value);
                        setUserPage(1);
                      } else if (activeTab === "content") {
                        setContentSearch(e.target.value);
                        setContentPage(1);
                      }
                    }}
                    placeholder={
                      activeTab === "users"
                        ? "Search by name or email"
                        : "Search by title or creator"
                    }
                    className="w-full sm:w-64"
                  />
                  {(activeTab === "users" ? selectedUsers : selectedContentIds)
                    .length > 0 && (
                    <motion.button
                      onClick={() =>
                        setModal({
                          isOpen: true,
                          type: activeTab,
                          data:
                            activeTab === "users"
                              ? selectedUsers
                              : selectedContentIds,
                        })
                      }
                      whileHover={{ scale: 1.05 }}
                      className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-tr from-red-900 to-red-500 text-white rounded-full flex items-center"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Delete Selected (
                      {
                        (activeTab === "users"
                          ? selectedUsers
                          : selectedContentIds
                        ).length
                      }
                      )
                    </motion.button>
                  )}
                </div>
              )}

              {/* Users Table */}
              {activeTab === "users" && (
                <>
                  {paginatedUsers.length === 0 ? (
                    <p className="text-gray-600 text-center">
                      {userSearch
                        ? "No users match your search."
                        : "No users found."}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-l from-indigo-200 to-indigo-400 text-indigo-900 rounded-lg">
                            <th className="p-4">
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
                                className="h-4 w-4 text-yellow-400 rounded"
                              />
                            </th>
                            {["name", "email", "role"].map((field) => (
                              <th
                                key={field}
                                className="p-4 text-left font-semibold cursor-pointer"
                                onClick={() => handleSort("users", field)}
                              >
                                <div className="flex items-center">
                                  {field.charAt(0).toUpperCase() +
                                    field.slice(1)}
                                  {userSort.field === field && (
                                    <svg
                                      className="h-4 w-4 ml-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                          userSort.direction === "asc"
                                            ? "M5 15l7-7 7 7"
                                            : "M19 9l-7 7-7-7"
                                        }
                                      />
                                    </svg>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="p-4 text-left font-semibold">
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
                              transition={{ delay: index * 0.1 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-4">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.userId)}
                                  onChange={() =>
                                    setSelectedUsers((prev) =>
                                      prev.includes(user.userId)
                                        ? prev.filter(
                                            (id) => id !== user.userId
                                          )
                                        : [...prev, user.userId]
                                    )
                                  }
                                  className="h-4 w-4 text-yellow-400 rounded"
                                />
                              </td>
                              <td className="p-4 text-sm capitalize text-left text-gray-700">
                                {user.name}
                              </td>
                              <td className="p-4 text-sm text-left text-gray-700">
                                {user.email}
                              </td>
                              <td className="">
                                <select
                                  value={user.role}
                                  onChange={(e) =>
                                    handleUpdateRole(
                                      user.userId,
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    actionLoading[`role-${user.userId}`] ||
                                    user.userId === currentUserId
                                  }
                                  className="p-2 text-gray-700 text-left text-xs border  rounded-lg "
                                >
                                  {["student", "educator", "admin"].map(
                                    (role) => (
                                      <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() +
                                          role.slice(1)}
                                      </option>
                                    )
                                  )}
                                </select>
                              </td>
                              <td className="p-4 flex space-x-2">
                                <motion.button
                                  onClick={() =>
                                    setModal({
                                      isOpen: true,
                                      type: "users",
                                      data: [user.userId],
                                    })
                                  }
                                  disabled={
                                    actionLoading[`user-${user.userId}`] ||
                                    user.userId === currentUserId
                                  }
                                  whileHover={{ scale: 1.05 }}
                                  className="px-3 text-sm py-1 bg-gradient-to-tr from-red-900 to-red-500 text-white rounded-lg flex items-center"
                                >
                                  <svg
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                  {actionLoading[`user-${user.userId}`]
                                    ? "Deleting..."
                                    : "Delete"}
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      {totalUserPages > 1 && (
                        <Pagination
                          currentPage={userPage}
                          totalPages={totalUserPages}
                          setPage={setUserPage}
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Content Table */}
              {activeTab === "content" && (
                <>
                  {paginatedContent.length === 0 ? (
                    <p className="text-gray-600 text-center">
                      {contentSearch
                        ? "No content matches your search."
                        : "No content found."}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-l from-indigo-200 to-indigo-400 text-indigo-900">
                            <th className="p-4">
                              <input
                                type="checkbox"
                                checked={
                                  selectedContentIds.length ===
                                  filteredContent.length
                                }
                                onChange={(e) =>
                                  setSelectedContentIds(
                                    e.target.checked
                                      ? filteredContent.map((c) => c.contentId)
                                      : []
                                  )
                                }
                                className="h-4 w-4 text-yellow-400 rounded"
                              />
                            </th>
                            {["title", "type", "createdBy"].map((field) => (
                              <th
                                key={field}
                                className="p-4 text-left font-semibold cursor-pointer"
                                onClick={() => handleSort("content", field)}
                              >
                                <div className="flex items-center">
                                  {field === "createdBy"
                                    ? "Created By"
                                    : field.charAt(0).toUpperCase() +
                                      field.slice(1)}
                                  {contentSort.field === field && (
                                    <svg
                                      className="h-4 w-4 ml-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                          contentSort.direction === "asc"
                                            ? "M5 15l7-7 7 7"
                                            : "M19 9l-7 7-7-7"
                                        }
                                      />
                                    </svg>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="p-4 text-left font-semibold">
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
                              transition={{ delay: index * 0.1 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-4">
                                <input
                                  type="checkbox"
                                  checked={selectedContentIds.includes(
                                    item.contentId
                                  )}
                                  onChange={() =>
                                    setSelectedContentIds((prev) =>
                                      prev.includes(item.contentId)
                                        ? prev.filter(
                                            (id) => id !== item.contentId
                                          )
                                        : [...prev, item.contentId]
                                    )
                                  }
                                  className="h-4 w-4 text-yellow-400 rounded"
                                />
                              </td>
                              <td className="p-1 text-sm capitalize text-left text-gray-700">
                                {item.title}
                              </td>
                              <td className="p-1 text-sm capitalize text-left text-gray-700">
                                {item.type}
                              </td>
                              <td className="p-1 text-sm capitalize text-left text-gray-700">
                                {item.createdBy?.name || "Unknown"}
                              </td>
                              <td className="p-4 flex space-x-2">
                                <motion.button
                                  onClick={() =>
                                    handleViewContent(item.contentId)
                                  }
                                  whileHover={{ scale: 1.05 }}
                                  className="px-3 py-1 bg-gradient-to-tr from-indigo-900 to-indigo-400 text-white text-xs rounded-lg shadow shadow-lg flex items-center"
                                >
                                  <svg
                                    className="h-3 w-3 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View
                                </motion.button>
                                <motion.button
                                  onClick={() =>
                                    setModal({
                                      isOpen: true,
                                      type: "content",
                                      data: [item.contentId],
                                    })
                                  }
                                  disabled={
                                    actionLoading[`content-${item.contentId}`]
                                  }
                                  whileHover={{ scale: 1.05 }}
                                  className="px-3 text-sm py-1 bg-gradient-to-tr from-red-800 to-red-400 text-white rounded-lg flex items-center"
                                >
                                  <svg
                                    className="h-3 w-3 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                  {actionLoading[`content-${item.contentId}`]
                                    ? "Deleting..."
                                    : "Delete"}
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      {totalContentPages > 1 && (
                        <Pagination
                          currentPage={contentPage}
                          totalPages={totalContentPages}
                          setPage={setContentPage}
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Deleted Content History */}
              {activeTab === "deletedContent" && (
                <>
                  {paginatedDeletedContent.length === 0 ? (
                    <p className="text-gray-600 text-center">
                      No deleted content found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-l from-indigo-200 to-indigo-400 text-indigo-900">
                            <th className="p-4 text-left font-semibold">
                              Title
                            </th>
                            <th className="p-4 text-left font-semibold">
                              Type
                            </th>
                            <th className="p-4 text-left font-semibold">
                              Deleted By
                            </th>
                            <th className="p-4 text-left font-semibold">
                              Deleted At
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedDeletedContent.map((item, index) => (
                            <motion.tr
                              key={item.contentId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-4 text-left text-sm text-gray-700">
                                {item.title}
                              </td>
                              <td className="p-4 text-sm capitalize text-left text-gray-700">
                                {item.type}
                              </td>
                              <td className="p-4 text-sm text-left capitalize text-gray-700">
                                {item.deletedBy?.name || "Unknown"}
                              </td>
                              <td className="p-4 text-xs text-left text-gray-700">
                                {new Date(item.deletedAt).toLocaleString()}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      {totalDeletedContentPages > 1 && (
                        <Pagination
                          currentPage={deletedContentPage}
                          totalPages={totalDeletedContentPages}
                          setPage={setDeletedContentPage}
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Role Changes History */}
              {activeTab === "roleChanges" && (
                <>
                  {paginatedRoleChanges.length === 0 ? (
                    <p className="text-gray-600 text-center">
                      No role changes found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-l from-indigo-200 to-indigo-400 text-indigo-900">
                            <th className="p-4 text-left font-semibold">
                              User
                            </th>
                            <th className="p-4 text-left font-semibold">
                              Old Role
                            </th>
                            <th className="p-4 text-left font-semibold">
                              New Role
                            </th>
                            <th className="p-4 text-left font-semibold">
                              Changed By
                            </th>
                            <th className="p-4 text-left font-semibold">
                              Changed At
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedRoleChanges.map((change, index) => (
                            <motion.tr
                              key={change._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-4 text-sm text-left text-gray-700">
                                {change.userId?.name || "Deleted User"}
                              </td>
                              <td className="p-4 text-sm capitalize text-left text-gray-700">
                                {change.oldRole}
                              </td>
                              <td className="p-4 text-sm capitalize text-left text-gray-700">
                                {change.newRole}
                              </td>
                              <td className="p-4 text-sm capitalize text-left text-gray-700">
                                {change.changedBy?.name || "Deleted User"}
                              </td>
                              <td className="p-4 text-xs text-left text-gray-700">
                                {new Date(change.changedAt).toLocaleString()}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRoleChangesPages > 1 && (
                        <Pagination
                          currentPage={roleChangesPage}
                          totalPages={totalRoleChangesPages}
                          setPage={setRoleChangesPage}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Modal */}
          {modal.isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white text-left p-6 rounded-lg shadow-xl max-w-md w-full"
              >
                {modal.type === "viewContent" && selectedContent ? (
                  <>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                      Content Details
                    </h3>
                    <div className="text-gray-700 text-sm space-y-4">
                      <p>
                        <strong>Title:</strong> {selectedContent.title}
                      </p>
                      <p>
                        <strong>Type:</strong> {selectedContent.type}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedContent.description || "N/A"}
                      </p>
                      <p>
                        <strong>Created By:</strong>{" "}
                        {selectedContent.createdBy?.name || "Unknown"}
                      </p>
                      {selectedContent.fileUrl && (
                        <div>
                          <strong>File:</strong>
                          {selectedContent.type === "image" ? (
                            <img
                              src={selectedContent.fileUrl}
                              alt={selectedContent.title}
                              className="mt-2 max-h-48 rounded"
                            />
                          ) : selectedContent.type === "video" ? (
                            <video controls className="mt-2 max-h-48 rounded">
                              <source
                                src={selectedContent.fileUrl}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <a
                              href={selectedContent.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View File
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end mt-6">
                      <motion.button
                        onClick={() => {
                          setModal({ isOpen: false, type: "", data: null });
                          setSelectedContent(null);
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-tr from-gray-900 to-gray-400 text-white rounded-lg"
                      >
                        Close
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4">
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
                      <motion.button
                        onClick={() =>
                          setModal({ isOpen: false, type: "", data: null })
                        }
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={() =>
                          modal.type === "users"
                            ? handleDeleteUser(modal.data)
                            : handleDeleteContent(modal.data)
                        }
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
