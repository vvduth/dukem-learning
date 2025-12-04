/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link, data } from "react-router-dom";
import documentService from "../../services/documentService";
import Spiner from "../../components/common/Spiner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { ApiResponse, Document } from "../../types";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ReactMarkdown from "react-markdown"
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashCardManager from "../../components/flashcards/FlashCardManager";
const DocumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<ApiResponse<Document> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      setLoading(true);
      try {
        const data = await documentService.getDocumentById(id!);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to load document details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  // helper function to get the full pdf url
  const getPdfUrl = () => {
  
    if (!document?.data.filePath) return null;
    const filePath = document.data.filePath;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    const baseUrl =  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return `${baseUrl}/${filePath.startsWith("/") ? '': '/'}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spiner />;
    }
    if (!document || !document.data || !document.data.filePath) {
      return <div className="text-center p-8">No document found.</div>;
    }
    const filePath = document.data.filePath;
    const pdfUrl = getPdfUrl();
    console.log("pdfUrl:", pdfUrl);
     const isPdf = filePath.toLowerCase().endsWith(".pdf");
  const isMd = filePath.toLowerCase().endsWith(".md");
    return (
      <div className="bg-white border border-gray-300 rounded-lg
      overflow-hidden shadow-md">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">Document Viewer</span>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1,5 text-sm text-blue-600 hover:text-blue-800
          font-medium transition-color">
            <ExternalLink size={16}  />
            Open in new tab
          </a>
        </div>
        <div className="bg-gray-100 p-1">
          {isPdf && (
            <iframe
            src={pdfUrl}
            className="w-full h-[70vh] bg-white rounded border border-gray-300"
            title="Document Viewer"
            frameBorder={"0"}
            style={{
              colorScheme : "light"
            }}
          />
          )}
          {isMd && (
             <div className="prose max-w-full bg-white p-4 rounded border border-gray-300 overflow-y-auto h-[70vh]">
              <iframe
            src={pdfUrl}
            className="w-full h-[70vh] bg-white rounded border border-gray-300"
            title="Document Viewer"
            frameBorder={"0"}
            style={{
              colorScheme : "light"
            }}
          />
          </div>
          )}
        </div>
      </div>
    )
  }
  const renderChat = () => {
    return (
      <ChatInterface />
    )
  }

  const renderAIActions = () => {
    return <AIActions />;
  }

  const renderFlashcards = () => {
    return <FlashCardManager documentId ={id} />
  }

  const renderQuizzesTab = () => {
    return <div>Quizzes Feature Coming Soon!</div>;
  }

  const tabs= [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcards() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ]

  if (loading) {
    return <Spiner />;
  }

  if (!document) {
    return <div className="text-center p-8">No document found.</div>;
  }
  return <div>
    <div className="mb-4">
      <Link to="/documents" className="inline-flex items-center gap-2
      text-sm text-neutral-600 hover:text-neutral-900 transition-colors" >
        <ArrowLeft size={16} />
        Back to documents
      </Link>
    </div>
    <PageHeader title={document.data.title} />
    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>;
};

export default DocumentDetailsPage;
