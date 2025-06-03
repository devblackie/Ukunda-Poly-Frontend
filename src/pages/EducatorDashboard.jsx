import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import TeachingIllustration from "../assets/illustration/TeachingIllustration.svg";
import BASE_API_URL from "../config/config";
import {
  SearchSvg,
  AllSvg,
  TextSvg,
  ImageSvg,
  VideoSvg,
  DocumentSvg,
  ChevronSvg,
  MenuSvg,
} from "../components/ui/SvgComponents";
import {
  AddButton,
  EditButton,
  FilterButton,
  ShowMoreButton,
  ToggleButton,
} from "../components/ui/ButtonComponents";
import {
  LabeledFileInput,
  LabeledInput,
  LabeledTextarea,
  SearchInput,
} from "../components/ui/InputComponents";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const EducatorDashboard = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  const [selectedContent, setSelectedContent] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ws, setWs] = useState(null);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    type: "text",
    file: null,
  });
  const [filePreview, setFilePreview] = useState(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [pdfPageNumbers, setPdfPageNumbers] = useState({}); // Track PDF page numbers

  // Sorting function to prioritize lastUpdated or createdAt
  const sortContent = (a, b) => {
    const aTime = a.lastUpdated
      ? new Date(a.lastUpdated).getTime()
      : a.createdAt
      ? new Date(a.createdAt).getTime()
      : a.contentId;
    const bTime = b.lastUpdated
      ? new Date(b.lastUpdated).getTime()
      : b.createdAt
      ? new Date(b.createdAt).getTime()
      : b.contentId;
    return bTime - aTime; // Descending order
  };

  const filterOptions = [
    { type: "all", label: "All", svg: <AllSvg /> },
    { type: "text", label: "Text", svg: <TextSvg /> },
    { type: "image", label: "Images", svg: <ImageSvg /> },
    { type: "video", label: "Videos", svg: <VideoSvg /> },
    { type: "document", label: "Docs", svg: <DocumentSvg /> },
  ];

  // Determine file type for icon and preview
  const getFileTypeInfo = (fileUrl) => {
    if (!fileUrl) return { icon: "file", label: "Unknown" };
    const extension = fileUrl.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return { icon: "file-pdf", label: "PDF" };
      case "doc":
      case "docx":
        return { icon: "file-word", label: "Word" };
      case "xls":
      case "xlsx":
        return { icon: "file-excel", label: "Excel" };
      default:
        return { icon: "file", label: "Document" };
    }
  };

  // WebSocket Setup
  useEffect(() => {
    const wsUrl = BASE_API_URL.replace("https://", "wss://").replace(
      "http://",
      "ws://"
    );
    const websocket = new WebSocket(wsUrl);
    websocket.onmessage = (event) => {
      try {
        const { contentId, action, data } = JSON.parse(event.data);
        console.log(`Received ${action} for content ${contentId}:`, data);
        if (action === "edit") {
          setContents((prev) =>
            prev
              .map((item) =>
                item.contentId === contentId ? { ...item, ...data } : item
              )
              .sort(sortContent)
          );
          setFilteredContents((prev) =>
            prev
              .map((item) =>
                item.contentId === contentId ? { ...item, ...data } : item
              )
              .sort(sortContent)
          );
        } else if (action === "add") {
          setContents((prev) => [data, ...prev].sort(sortContent));
          setFilteredContents((prev) => [data, ...prev].sort(sortContent));
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };
    websocket.onerror = (err) => console.error("WebSocket error:", err);
    websocket.onclose = () => console.log("WebSocket disconnected");
    setWs(websocket);
    return () => websocket.close();
  }, []);

  // Fetch Content
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get(`${BASE_API_URL}/api/content`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format: Expected an array");
        }

        const sortedContents = response.data.sort(sortContent);
        setContents(sortedContents);
        setFilteredContents(sortedContents);

        const savedHistory =
          JSON.parse(localStorage.getItem("educatorHistory")) || [];
        setHistory(savedHistory);
      } catch (error) {
        const errorMessage =
          error.response?.status === 404
            ? "Content endpoint not found. Please contact support."
            : error.response?.data?.error ||
              error.message ||
              "Failed to load content. Please try again.";
        console.error("Content fetch error:", errorMessage, error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContents();
  }, []);

  // Search and Filter
  useEffect(() => {
    let filtered = [...contents];
    if (searchQuery) {
      filtered = filtered.filter(
        (content) =>
          content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          content.createdBy?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    if (contentType !== "all") {
      filtered = filtered.filter((content) => content.type === contentType);
    }
    setFilteredContents(filtered.sort(sortContent));
  }, [searchQuery, contentType, contents]);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setSelectedContent(null);
    setIsAddingContent(false);
    setEditingContent(null);
  }, []);

  const handleTypeFilter = useCallback((type) => {
    setContentType(type);
    setSelectedContent(null);
    setIsAddingContent(false);
    setEditingContent(null);
  }, []);

  const handleShowMore = useCallback(
    (content) => {
      setSelectedContent(content);
      setSearchQuery("");
      setContentType("all");
      setIsAddingContent(false);
      setEditingContent(null);
      const newHistory = [
        {
          contentId: content.contentId,
          title: content.title,
          type: content.type,
          action: "viewed",
          timestamp: new Date().toISOString(),
        },
        ...history.filter(
          (item) =>
            item.contentId !== content.contentId || item.action !== "viewed"
        ),
      ].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("educatorHistory", JSON.stringify(newHistory));
      if (isSidebarOpen) setIsSidebarOpen(false);
    },
    [history, isSidebarOpen]
  );

  const handleEditContent = useCallback(
    (content) => {
      setEditingContent(content);
      setSelectedContent(null);
      setIsAddingContent(false);
      setSearchQuery("");
      setContentType("all");
      setFilePreview(
        content.fileUrl && content.type !== "document" ? content.fileUrl : null
      );
      if (isSidebarOpen) setIsSidebarOpen(false);
    },
    [isSidebarOpen]
  );

  const handleAddContent = useCallback(() => {
    setIsAddingContent(true);
    setSelectedContent(null);
    setEditingContent(null);
    setSearchQuery("");
    setContentType("all");
    setNewContent({ title: "", description: "", type: "text", file: null });
    setFilePreview(null);
    if (isSidebarOpen) setIsSidebarOpen(false);
  }, [isSidebarOpen]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    setNewContent((prev) => ({ ...prev, file }));
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit. Please upload a smaller file.");
        setFilePreview("");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (newContent.file) {
      if (
        newContent.type === "video" &&
        !newContent.file.type.startsWith("video/")
      ) {
        setError('Please upload a video file (e.g., MP4) for type "video"');
        setIsLoading(false);
        return;
      }
      if (newContent.file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit. Please upload a smaller file.");
        setIsLoading(false);
        return;
      }
    }

    if (!newContent.title || !newContent.description) {
      setError("Title and description are required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", newContent.title);
    formData.append("description", newContent.description);
    formData.append("type", newContent.type);
    if (newContent.file) {
      formData.append("file", newContent.file);
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Uploading with token:", token);
      console.log("FormData:", {
        title: newContent.title,
        description: newContent.description,
        type: newContent.type,
        file: newContent.file ? newContent.file.name : null,
      });

      const response = await axios.post(
        `${BASE_API_URL}/api/content`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);
      const newItem = response.data.content;
      // Update state with new content
      setContents((prev) => {
        const updated = [newItem, ...prev].sort(sortContent);
        return updated;
      });
      setFilteredContents((prev) => {
        const updated = [newItem, ...prev].sort(sortContent);
        return updated;
      });

      // Send WebSocket message
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            contentId: newItem.contentId,
            userId: "educator-id", // Replace with actual user ID
            action: "add",
            data: newItem,
          })
        );
      }

      // Update history
      const newHistory = [
        {
          contentId: newItem.contentId,
          title: newItem.title,
          type: newItem.type,
          action: "added",
          timestamp: new Date().toISOString(),
        },
        ...history.filter(
          (item) =>
            item.contentId !== newItem.contentId || item.action !== "added"
        ),
      ].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("educatorHistory", JSON.stringify(newHistory));

      alert("Content uploaded successfully");
      setNewContent({ title: "", description: "", type: "text", file: null });
      setFilePreview(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      } else {
        console.warn("File input not found during reset");
      }
      // Reset UI state
      setIsAddingContent(false);
      setSearchQuery("");
      setContentType("all");
      setSelectedContent(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to upload content";
      console.error("Upload error:", errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!editingContent.title || !editingContent.description) {
      setError("Title and description are required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", editingContent.title);
    formData.append("description", editingContent.description);
    formData.append("type", editingContent.type);
    if (editingContent.file) {
      formData.append("file", editingContent.file);
    }

    try {
      const response = await axios.put(
        `${BASE_API_URL}/api/content/${editingContent.contentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedItem = response.data.content;
      // Update state with updated content
      setContents((prev) => {
        const updated = prev
          .map((item) =>
            item.contentId === updatedItem.contentId ? updatedItem : item
          )
          .sort(sortContent);
        return updated;
      });
      setFilteredContents((prev) => {
        const updated = prev
          .map((item) =>
            item.contentId === updatedItem.contentId ? updatedItem : item
          )
          .sort(sortContent);
        return updated;
      });

      // Send WebSocket message
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            contentId: updatedItem.contentId,
            userId: "educator-id", // Replace with actual user ID
            action: "edit",
            data: updatedItem,
          })
        );
      }

      // Update history
      const newHistory = [
        {
          contentId: updatedItem.contentId,
          title: updatedItem.title,
          type: updatedItem.type,
          action: "edited",
          timestamp: new Date().toISOString(),
        },
        ...history.filter(
          (item) =>
            item.contentId !== updatedItem.contentId || item.action !== "edited"
        ),
      ].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("educatorHistory", JSON.stringify(newHistory));

      alert("Content updated successfully");
      setEditingContent(null);
      setFilePreview(null);
      // Reset UI state
      setSearchQuery("");
      setContentType("all");
      setSelectedContent(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update content";
      console.error("Update error:", errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        {/* Sidebar (Left Bar) */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`lg:w-56 bg-blue-50/80 backdrop-blur-sm p-4 pt-0 rounded-xl shadow-lg h-[80vh] overflow-y-auto scrollbar-custom lg:sticky lg:top-4 ${
            isSidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="sticky top-0 z-10 bg-blue-50/80 backdrop-blur-sm pt-4 pb-2">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              All Content
            </h2>
          </div>
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm" role="alert">
              {error}
            </p>
          ) : contents.length === 0 ? (
            <p className="text-gray-600 text-sm">No content available.</p>
          ) : (
            <div className="space-y-2">
              {contents.map((content) => (
                <motion.div
                  key={content.contentId}
                  whileHover={{ backgroundColor: "#E5E7EB" }}
                  className="p-3 rounded-lg bg-white/80 hover:bg-gray-100 transition"
                >
                  <div className="flex items-start">
                    {content.type === "text" ? (
                      <TextSvg />
                    ) : content.type === "image" ? (
                      <ImageSvg />
                    ) : content.type === "video" ? (
                      <VideoSvg />
                    ) : content.type === "document" ? (
                      <DocumentSvg />
                    ) : (
                      <AllSvg />
                    )}
                    <div className="flex-1 text-left">
                      <h3 className="text-[0.71rem] font-bold text-blue-900 capitalize">
                        {content.title}
                      </h3>
                      <p className="text-gray-600 text-[0.7rem] line-clamp-2">
                        {content.description || "No description"}
                      </p>
                      <p className="text-blue-500 text-[0.65rem]">
                        By: {content.createdBy?.name || "Unknown"}
                      </p>
                      <div className="flex justify-end gap-2 mt-1">
                        <ShowMoreButton
                          onClick={() => handleShowMore(content)}
                          className="text-yellow-400 text-shadow-md/50 text-shadow-yellow-900 text-xs mt-1 text-right font-styled italic"
                          aria-label={`View full content: ${content.title}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-4">
          <ToggleButton
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          />
        </div>

        {/* Middle Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 lg:max-w-2xl bg-white/80 backdrop-blur-sm p-6 pt-0 rounded-xl shadow-lg h-screen overflow-y-auto scrollbar-custom relative"
        >
          <div className="relative z-10">
            {/* Middle bar header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm pt-6 pb-4">
              <img
                src={TeachingIllustration}
                alt="Studying illustration"
                className="absolute top-0 right-0 h-16 object-cover opacity-50 z-30"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                }}
              />
              <h1 className="text-2xl font-bold text-blue-900 text-center mb-4">
                Educator Dashboard
              </h1>
              <div className="flex justify-evenly items-center mb-4">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearch}
                  ariaLabel="Search content"
                  className="w-full"
                />
                <AddButton onClick={handleAddContent} />
              </div>
              <div className="flex justify-center flex-wrap gap-2 mb-4">
                {filterOptions.map(({ type, label, svg }) => (
                  <FilterButton
                    key={type}
                    onClick={() => handleTypeFilter(type)}
                    isActive={contentType === type}
                    svg={svg}
                    aria-label={`Filter by ${label}`}
                  >
                    {label}
                  </FilterButton>
                ))}
              </div>
            </div>
            {/* Middle bar header ends */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center" role="alert">
                {error}
              </p>
            )}
            {isLoading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : isAddingContent ? (
              // content uploading form starts
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-gray-700 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-blue-900 mb-4">
                  Add New Content
                </h2>
                <form onSubmit={handleUpload}>
                  <div className="mb-5">
                    <div className="relative">
                      <LabeledInput
                        label="Content Title"
                        type="text"
                        placeholder="Enter content title"
                        value={newContent.title}
                        onChange={(e) =>
                          setNewContent({
                            ...newContent,
                            title: e.target.value,
                          })
                        }
                      />
                      <svg
                        className="absolute left-3 top-7.5 h-5 w-5 text-gray-400"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                          stroke-linejoin="round"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mb-5">
                    <LabeledTextarea
                      value={newContent.description}
                      onChange={(e) =>
                        setNewContent({
                          ...newContent,
                          description: e.target.value,
                        })
                      }
                      label="Description"
                      id="content-description"
                      name="description"
                      placeholder="Describe the content"
                      rows={4}
                      ariaLabel="Enter description"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="mb-5 flex flex-col w-full static">
                    <label className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-2 bg-gray-50 w-fit">
                      Content Type
                    </label>
                    <select
                      value={newContent.type}
                      onChange={(e) =>
                        setNewContent({ ...newContent, type: e.target.value })
                      }
                      className="border-gray-200 p-3 pl-10 text-gray-700 text-sm bg-gray-50 border rounded-lg w-full focus:outline-0 focus:ring-1 focus:ring-blue-500 placeholder:text-black/25"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  <div className="mb-6 flex flex-col w-full static">
                    <label className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-gray-50 w-fit">
                      Upload File (Optional, max 10MB)
                    </label>
                    <div className="w-full border-gray-200 px-2 text-gray-700 text-sm bg-gray-50 border rounded-lg focus:outline-0 focus:ring-1 focus:ring-blue-500 placeholder:text-black/25">
                      <input
                        type="file"
                        accept={
                          newContent.type === "video"
                            ? "video/mp4"
                            : newContent.type === "image"
                            ? "image/*"
                            : newContent.type === "document"
                            ? ".pdf,.doc,.docx,.xls,.xlsx"
                            : "*/*"
                        }
                        onChange={handleFileChange}
                        className="w-full p-3 bg-gray-50 file:mr-4 file:py-2 file:px-7 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-blue-900 file:hover:bg-yellow-300 text-xs"
                      />
                    </div>
                    {filePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          File Preview:
                        </p>
                        {newContent.type === "video" ? (
                          <video
                            src={filePreview}
                            controls
                            className="w-full h-40 rounded-lg"
                          />
                        ) : (
                          <img
                            src={filePreview}
                            alt="File Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 bg-yellow-400 text-blue-900 p-3 rounded-lg font-semibold text-sm transition-all ${
                        isLoading
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-yellow-300"
                      }`}
                    >
                      {isLoading ? "Uploading..." : "Upload Content"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setIsAddingContent(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-gray-500 text-white p-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : // content uploading form ends
            editingContent ? (
              // content editing form starts
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-semibold text-blue-900 mb-4">
                  Edit Content
                </h2>
                <form onSubmit={handleSaveEdit}>
                  <div className="mb-5">
                    <div className="relative">
                      <LabeledInput
                        label="Content Title"
                        type="text"
                        placeholder="Enter content title"
                        value={editingContent.title}
                        onChange={(e) =>
                          setEditingContent({
                            ...editingContent,
                            title: e.target.value,
                          })
                        }
                      />
                      <svg
                        className="absolute left-3 top-7.5 h-5 w-5 text-gray-400"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                          stroke-linejoin="round"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mb-5">
                    <LabeledTextarea
                      value={editingContent.description}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          description: e.target.value,
                        })
                      }
                      label="Description"
                      id="content-description"
                      name="description"
                      placeholder="Describe the content"
                      rows={4}
                      ariaLabel="Enter description"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="mb-5 flex flex-col w-full static">
                    <label className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-2 bg-gray-50 w-fit">
                      Content Type
                    </label>
                    <select
                      value={editingContent.type}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          type: e.target.value,
                        })
                      }
                      className="border-gray-200 p-3 pl-10 text-gray-700 text-sm bg-gray-50 border rounded-lg w-full focus:outline-0 focus:ring-1 focus:ring-blue-500 placeholder:text-black/25"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  <div className="mb-6 flex flex-col w-full static">
                    <label className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-gray-50 w-fit">
                      Upload File (Optional, max 10MB)
                    </label>
                    <div className="w-full border-gray-200 px-2 text-gray-700 text-sm bg-gray-50 border rounded-lg focus:outline-0 focus:ring-1 focus:ring-blue-500 placeholder:text-black/25">
                      <input
                        type="file"
                        accept={
                          editingContent.type === "video"
                            ? "video/mp4"
                            : editingContent.type === "image"
                            ? "image/*"
                            : editingContent.type === "document"
                            ? ".pdf,.doc,.docx,.xls,.xlsx"
                            : "*/*"
                        }
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setEditingContent({ ...editingContent, file });
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setFilePreview(previewUrl);
                          } else {
                            setFilePreview(editingContent.fileUrl);
                          }
                        }}
                        className="w-full p-3 bg-gray-50 file:mr-4 file:py-2 file:px-7 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-blue-900 file:hover:bg-yellow-300 text-xs"
                      />
                    </div>
                    {filePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          File Preview:
                        </p>
                        {editingContent.type === "video" ? (
                          <video
                            src={filePreview}
                            controls
                            className="w-full h-40 rounded-lg"
                          />
                        ) : (
                          <img
                            src={filePreview}
                            alt="File Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 bg-green-500 text-white p-3 rounded-lg font-semibold text-sm transition-all ${
                        isLoading
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-green-600"
                      }`}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setEditingContent(null)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-gray-500 text-white p-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : // content editing form ends
            selectedContent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-gray-700 shadow-lg"
              >
                <div className="flex items-start">
                  {selectedContent.type === "text" ? (
                    <TextSvg />
                  ) : selectedContent.type === "image" ? (
                    <ImageSvg />
                  ) : selectedContent.type === "video" ? (
                    <VideoSvg />
                  ) : selectedContent.type === "document" ? (
                    <DocumentSvg />
                  ) : (
                    <AllSvg />
                  )}
                  <div className="flex-1 flex flex-col items-center w-full p-3">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">
                      {selectedContent.title}
                    </h2>
                    <p className="text-gray-600 mb-2 text-left text-sm">
                      {selectedContent.description || "No description"}
                    </p>
                    <p className="text-blue-500 text-xs mb-4  text-right">
                     Study By:{" "} 
                      {selectedContent.createdBy?.name || "Unknown"}
                    </p>
                    {selectedContent.fileUrl ? (
                      selectedContent.type === "image" ? (
                        <img
                          src={selectedContent.fileUrl}
                          alt={selectedContent.title}
                          className="w-48 h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Image+Not+Found";
                            e.target.alt = "Image not available";
                          }}
                          loading="lazy"
                        />
                      ) : selectedContent.type === "video" ? (
                        <div className="relative mb-4">
                          <video
                            src={selectedContent.fileUrl}
                            controls
                            className="w-full h-48 rounded-lg"
                            onError={(e) => {
                              e.target.nextSibling.classList.remove("hidden");
                            }}
                            aria-label={`Video: ${selectedContent.title}`}
                          >
                            <p className="text-red-500 hidden">
                              Video not available
                            </p>
                          </video>
                        </div>
                      ) : selectedContent.type === "document" ? (
                        <div className="mb-4 w-full">
                          <div className="flex items-center mb-2">
                            <svg
                              className={`mr-2 h-12 w-5 ${
                                getFileTypeInfo(selectedContent.fileUrl)
                                  .icon === "file-pdf"
                                  ? "text-red-500"
                                  : getFileTypeInfo(selectedContent.fileUrl)
                                      .icon === "file-word"
                                  ? "text-blue-500"
                                  : getFileTypeInfo(selectedContent.fileUrl)
                                      .icon === "file-excel"
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {getFileTypeInfo(selectedContent.fileUrl).icon ===
                                "file-pdf" && (
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 11h-2.5v2.5H10v-2.5H7.5V12H10v-2.5h1.5V12H14v2zm-2.5-7H7v2h4.5V7zm6 10h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z" />
                              )}
                              {getFileTypeInfo(selectedContent.fileUrl).icon ===
                                "file-word" && (
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.5 12h-1.5l-1-3.5-1 3.5H8.5L6 9h1.5l1.5 4.5 1-3.5h1.5l1 3.5 1.5-4.5H15l-2.5 6z" />
                               
                              )}
                              {getFileTypeInfo(selectedContent.fileUrl).icon ===
                                "file-excel" && (
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.5 12h-1.5l-1-3.5-1 3.5H9.5L7 9h1.5l1.5 4.5 1-3.5h1.5l1 3.5 1.5-4.5H15l-2.5 6z" />
                               
                              )}
                              {getFileTypeInfo(selectedContent.fileUrl).icon ===
                                "file" && (
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h7v5h5v11H6z" />
                              )}
                            </svg>
                            <a
                              href={selectedContent.fileUrl}
                              className="inline-flex items-center text-yellow-400 hover:text-yellow-500 font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${selectedContent.title} (${
                                getFileTypeInfo(selectedContent.fileUrl).label
                              })`}
                            >
                              View{" "}
                              {getFileTypeInfo(selectedContent.fileUrl).label}{" "}
                              
                              <svg
                                className="ml-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </a>
                          </div>
                          {getFileTypeInfo(selectedContent.fileUrl).label ===
                          "PDF" ? (
                            <div className="relative">
                              <Document
                                file={selectedContent.fileUrl}
                                onLoadSuccess={({ numPages }) => {
                                  setPdfPageNumbers((prev) => ({
                                    ...prev,
                                    [selectedContent.contentId]: {
                                      current: 1,
                                      total: numPages,
                                    },
                                  }));
                                }}
                                onLoadError={(error) => {
                                  console.error("PDF load error:", error);
                                  document
                                    .getElementById(
                                      `pdf-error-${selectedContent.contentId}`
                                    )
                                    .classList.remove("hidden");
                                }}
                                className="w-full"
                              >
                                <Page
                                  pageNumber={
                                    pdfPageNumbers[selectedContent.contentId]
                                      ?.current || 1
                                  }
                                  width={400}
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                />
                              </Document>
                              <p
                                id={`pdf-error-${selectedContent.contentId}`}
                                className="text-red-500 hidden mt-2"
                              >
                                Failed to load PDF preview
                              </p>
                              {pdfPageNumbers[selectedContent.contentId]
                                ?.total > 1 && (
                                <div className="flex justify-between mt-2">
                                  <button
                                    onClick={() =>
                                      setPdfPageNumbers((prev) => ({
                                        ...prev,
                                        [selectedContent.contentId]: {
                                          ...prev[selectedContent.contentId],
                                          current: Math.max(
                                            1,
                                            prev[selectedContent.contentId]
                                              .current - 1
                                          ),
                                        },
                                      }))
                                    }
                                    disabled={
                                      pdfPageNumbers[selectedContent.contentId]
                                        ?.current === 1
                                    }
                                    className="px-3 py-1 bg-blue-900 text-white rounded disabled:opacity-50"
                                  >
                                    Previous
                                  </button>
                                  <span>
                                    Page{" "}
                                    {
                                      pdfPageNumbers[selectedContent.contentId]
                                        ?.current
                                    }{" "}
                                    of{" "}
                                    {
                                      pdfPageNumbers[selectedContent.contentId]
                                        ?.total
                                    }
                                  </span>
                                  <button
                                    onClick={() =>
                                      setPdfPageNumbers((prev) => ({
                                        ...prev,
                                        [selectedContent.contentId]: {
                                          ...prev[selectedContent.contentId],
                                          current: Math.min(
                                            prev[selectedContent.contentId]
                                              .total,
                                            prev[selectedContent.contentId]
                                              .current + 1
                                          ),
                                        },
                                      }))
                                    }
                                    disabled={
                                      pdfPageNumbers[selectedContent.contentId]
                                        ?.current ===
                                      pdfPageNumbers[selectedContent.contentId]
                                        ?.total
                                    }
                                    className="px-3 py-1 bg-blue-900 text-white rounded disabled:opacity-50"
                                  >
                                    Next
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <iframe
                              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                                selectedContent.fileUrl
                              )}&embedded=true`}
                              className="w-full  h-64 mt-4 rounded-xl"
                              title={selectedContent.title}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.classList.remove("hidden");
                              }}
                            >
                              <p className="text-red-500 hidden mt-2">
                                Preview not available
                              </p>
                            </iframe>
                          )}
                        </div>
                      ) : (
                        <a
                          href={selectedContent.fileUrl}
                          className="inline-flex items-center text-yellow-400 hover:text-yellow-500 font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${selectedContent.title} (${selectedContent.type})`}
                        >
                          View{" "}
                          {selectedContent.type.charAt(0).toUpperCase() +
                            selectedContent.type.slice(1)}
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </a>
                      )
                    ) : (
                      <p className="text-gray-500 italic">No file attached</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : filteredContents.length === 0 ? (
              <p className="text-gray-600 text-center">
                {searchQuery || contentType !== "all"
                  ? "No content matches your search or filter."
                  : "Enter a search query or select content."}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredContents.map((content) => (
                  <motion.div
                    key={content.contentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <div className="flex items-start">
                      {content.type === "text" ? (
                        <TextSvg />
                      ) : content.type === "image" ? (
                        <ImageSvg />
                      ) : content.type === "video" ? (
                        <VideoSvg />
                      ) : content.type === "document" ? (
                        <DocumentSvg />
                      ) : (
                        <AllSvg />
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-blue-900">
                          {content.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {content.description || "No description"}
                        </p>
                        <p className="text-gray-500 text-[0.65rem] capitalize">
                          {content.createdBy?.name || "Unknown"}
                        </p>
                        <div className="flex justify-end gap-2 mt-1">
                          <ShowMoreButton
                            onClick={() => handleShowMore(content)}
                            className="text-yellow-400 text-shadow-md/50 text-shadow-yellow-900 text-xs mt-1 text-right font-styled italic"
                            aria-label={`View full content: ${content.title}`}
                          />
                          <EditButton
                            onClick={() => handleEditContent(content)}
                            className="text-green-500 hover:text-green-600 text-xs mt-1 text-right font-styled"
                            aria-label={`Edit content: ${content.title}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Bar (History) */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-80 bg-blue-50/80 backdrop-blur-sm p-4 pt-0 rounded-xl shadow-lg h-[80vh] overflow-y-auto scrollbar-custom lg:sticky lg:top-4 hidden lg:block"
        >
          <div className="sticky top-0 z-10 bg-blue-50/80 backdrop-blur-sm pt-4 pb-2">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              History
            </h2>
          </div>
          {history.length === 0 ? (
            <p className="text-gray-600 text-sm">No history yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <motion.div
                  key={`${item.contentId}-${item.action}-${item.timestamp}`}
                  whileHover={{ backgroundColor: "#E5E7EB" }}
                  className="p-3 rounded-lg bg-white/80 hover:bg-gray-200 transition"
                >
                  <h3 className="text-sm font-medium text-blue-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs capitalize">
                    {item.type}
                  </p>
                  <p className="text-gray-600 text-[0.6rem]">
                    {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                    : {new Date(item.timestamp).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EducatorDashboard;
