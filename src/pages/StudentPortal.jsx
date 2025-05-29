import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import StudyingIllustration from "../assets/illustration/StudyingIllustration.svg";
import BASE_API_URL from "../config/config";
import {
  SearchSvg,
  AllSvg,
  TextSvg,
  ImageSvg,
  VideoSvg,
  DocumentSvg,
  ChevronSvg,
} from "../components/ui/SvgComponents";
import {
  FilterButton,
  ShowMoreButton,
  ToggleButton,
} from "../components/ui/ButtonComponents";
import { SearchInput } from "../components/ui/InputComponents";



// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StudentPortal = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  const [selectedContent, setSelectedContent] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pdfPageNumbers, setPdfPageNumbers] = useState({}); // Track PDF page numbers

  // Filter Options
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

  // Fetch content data from API
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

        const sortedContents = response.data.sort((a, b) => {
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
        });

        setContents(sortedContents);
        setFilteredContents(sortedContents);

        const savedHistory =
          JSON.parse(localStorage.getItem("contentHistory")) || [];
        setHistory(savedHistory);

        sortedContents.forEach((content) => {
          console.log(
            `Content ID: ${content.contentId}, Description Length: ${
              content.description?.length || 0
            }`
          );
        });
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
    setFilteredContents(
      filtered.sort((a, b) => {
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
        return bTime - aTime;
      })
    );
  }, [searchQuery, contentType, contents]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedContent(null);
  };

  const handleTypeFilter = (type) => {
    setContentType(type);
    setSelectedContent(null);
  };

  const handleShowMore = (content) => {
    setSelectedContent(content);
    setSearchQuery("");
    setContentType("all");
    const newHistory = [
      {
        contentId: content.contentId,
        title: content.title,
        type: content.type,
        viewedAt: new Date().toISOString(),
      },
      ...history.filter((item) => item.contentId !== content.contentId),
    ].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("contentHistory", JSON.stringify(newHistory));
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        {/* Sidebar (Left Bar) */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`lg:w-60 bg-white backdrop-blur-lg p-4 pt-0 rounded-2xl h-[80vh] overflow-y-auto scrollbar-custom lg:sticky lg:top-4 shadow-[0_-8px_16px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.1)] ${
            isSidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="sticky top-0 z-10 text-blue-900 font-semibold rounded-b-3xl bg-white/20 backdrop-blur-lg pt-4 pb-2">
            All Content
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
                  className="p-3 border-b border-dashed border-gray-500 hover:bg-gray-100 transition"
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

        {/* Middle Bar (Search Results or Selected Content) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 lg:max-w-2xl bg-white backdrop-blur-sm p-6 pt-0 rounded-2xl h-[80vh] overflow-y-auto scrollbar-custom relative shadow-[0_-8px_16px_rgba(255,255Filename: StudentPortal.jsx
255,255,0.8),0_8px_16px_rgba(0,0,0,0.1)]"
        >
          <div className="relative z-10">
            {/* Header section */}
            <div className="sticky top-0 z-10 text-blue-900 font-semibold bg-white/20 backdrop-blur-lg pb-2">
              <img
                src={StudyingIllustration}
                alt="Studying illustration"
                className="absolute top-0 right-0 h-24 object-cover opacity-50 z-30"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                }}
              />
              <h1 className="text-xl font-bold text-blue-900 text-center mb-4">
                Student Portal
              </h1>
              <div className="mb-4">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearch}
                  ariaLabel="Search content"
                />
              </div>
              <div className="flex justify-center flex-wrap gap-2 mb-2">
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
            {/* Header Section ends */}

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center" role="alert">
                {error}
              </p>
            )}
            {isLoading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : selectedContent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg"
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
                  {/* Content view page */}
                  <div className="flex-1 flex flex-col items-center w-full p-3">
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">
                      {selectedContent.title}
                    </h2>
                    <p className="text-gray-600 mb-2 text-left text-sm">
                      {selectedContent.description || "No description"}
                    </p>
                    <p className="text-blue-500 text-xs mb-4  text-right">
                      Study By: {selectedContent.createdBy?.name || "Unknown"}
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
                              className={`mr-2 h-5 w-5 ${
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
                              Document
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
                              className="w-full h-64 mt-4 rounded-lg"
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
                  {/* Content view page ends */}
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
          className="lg:w-80 bg-blue-50/80 backdrop-blur-sm p-4 pt-0 rounded-xl h-[80vh] overflow-y-auto scrollbar-custom lg:sticky lg:top-4 hidden lg:block shadow-[0_-8px_16px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.1)]"
        >
          <div className="sticky top-0 z-10 text-blue-900 font-semibold rounded-b-3xl bg-blue-50/80 backdrop-blur-lg pt-4 pb-3 mb-2">
            History
          </div>
          {history.length === 0 ? (
            <p className="text-gray-600 text-sm">No history yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <motion.div
                  key={item.contentId}
                  whileHover={{ backgroundColor: "#E5E7EB" }}
                  className="p-3 border-gray-300 border-b border-dashed hover:bg-gray-200 transition"
                >
                  <h3 className="text-sm font-medium text-blue-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs capitalize">
                    {item.type}
                  </p>
                  <p className="text-gray-500 text-[0.6rem]">
                    Viewed: {new Date(item.viewedAt).toLocaleString()}
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

export default StudentPortal;
