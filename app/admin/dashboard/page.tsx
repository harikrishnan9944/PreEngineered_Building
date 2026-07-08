'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Info,
  Briefcase,
  Wrench,
  FolderGit,
  Image as ImageIcon,
  FileText,
  MailQuestion,
  MessageSquareQuote,
  Users,
  Settings,
  Globe,
  User,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Upload,
  UploadCloud,
  Copy,
  Check,
  CheckSquare,
  FileDown,
  X,
  Star,
  Sliders,
  Play,
  Eye,
  AlertCircle,
  TrendingUp,
  FileUp,
  FileBadge2,
  Loader2,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Bold,
  Menu,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface ImageUploadZoneProps {
  value: string;
  onChange: (url: string) => void;
  onOpenMedia: () => void;
  label?: string;
  previewHeight?: string;
}

function ImageUploadZone({
  value,
  onChange,
  onOpenMedia,
  label = "Upload Image",
  previewHeight = "h-36"
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: data
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Upload failed');

      if (resData.media && resData.media.length > 0) {
        onChange(resData.media[0].url);
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await uploadFile(file);
      } else {
        alert('Please drop an image file.');
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 bg-[#0f172a]/40 ${
          isDragging ? 'border-[#f97316] bg-[#f97316]/5 scale-[1.01]' : 'border-[#334155] hover:border-slate-500'
        } ${previewHeight}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Uploading...</span>
          </div>
        ) : value ? (
          <div className="relative w-full h-full group rounded-lg overflow-hidden flex items-center justify-center bg-slate-950/20">
            <img
              src={value}
              alt="Preview"
              className="max-h-full max-w-full object-contain rounded"
            />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="px-3 py-1.5 bg-[#f97316] hover:bg-[#ea580c] rounded-lg text-[10px] font-bold uppercase text-white cursor-pointer transition-all">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1.5 bg-red-650 hover:bg-red-700 rounded-lg text-[10px] font-bold uppercase text-white transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1 cursor-pointer w-full h-full py-4">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wide text-center">
              Drag & Drop Image Here
            </span>
            <span className="text-[9px] text-slate-500 text-center">
              or click to browse your files
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      <div className="flex justify-between items-center px-1">
        <button
          type="button"
          onClick={onOpenMedia}
          className="text-[9px] font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
        >
          <Image className="w-3.5 h-3.5 text-slate-400" />
          Select from Media Library
        </button>
        {value && (
          <span className="text-[8px] font-mono text-slate-500 max-w-[200px] truncate" title={value}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export default function UserFriendlyDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Collections Data
  const [items, setItems] = useState<any[]>([]);
  const [singleData, setSingleData] = useState<any>({});
  const [mediaList, setMediaList] = useState<any[]>([]);
  
  // Modals & UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewDetailItem, setViewDetailItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Custom Delete Confirmation Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  
  // Editor View Mode ('write' or 'preview')
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('displayOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Media Selector Modal (Allows picking image from Media Library into form fields)
  const [mediaSelectField, setMediaSelectField] = useState<string | null>(null);
  const [mediaSelectTarget, setMediaSelectTarget] = useState<any>(null);

  // Status & Feedback toasts
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 1. Session check on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        const data = await res.json();
        setAdmin(data.admin);
        setLoading(false);
        // Load initial tab data
        loadTabContent('dashboard');
      } catch (err) {
        router.replace('/admin/login');
      }
    }
    checkAuth();
  }, [router]);

  // Autosave simulation to reassure non-technical client
  useEffect(() => {
    if (isFormOpen) {
      const interval = setInterval(() => {
        const now = new Date();
        setDraftSavedTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }, 15000);
      return () => clearInterval(interval);
    } else {
      setDraftSavedTime(null);
    }
  }, [isFormOpen]);

  // Show status toasts
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 2. Fetch data based on selected tab
  const loadTabContent = async (tab: string) => {
    setItems([]);
    setSingleData({});
    setSearchQuery('');
    setStatusFilter('all');

    // Default sorts for tabs
    if (tab === 'blogs') { setSortField('date'); setSortOrder('desc'); }
    else if (tab === 'projects') { setSortField('completionYear'); setSortOrder('desc'); }
    else if (tab === 'quotes' || tab === 'applications') { setSortField('timestamp'); setSortOrder('desc'); }
    else { setSortField('displayOrder'); setSortOrder('asc'); }

    try {
      if (tab === 'dashboard') {
        // Load dashboard stats
        const [servicesRes, projectsRes, quotesRes] = await Promise.all([
          fetch('/api/admin/services'),
          fetch('/api/admin/projects'),
          fetch('/api/admin/quotes'),
        ]);

        const services = servicesRes.ok ? await servicesRes.json() : [];
        const projects = projectsRes.ok ? await projectsRes.json() : [];
        const quotes = quotesRes.ok ? await quotesRes.json() : [];

        setSingleData({
          servicesCount: services.length,
          projectsCount: projects.length,
          quotesCount: quotes.length,
          quotesPending: quotes.filter((q: any) => q.status === 'unread').length,
          recentQuotes: quotes.slice(0, 5),
        });
        return;
      }

      // Check single doc tabs
      const isSingleDoc = ['hero', 'about', 'company', 'settings', 'contact-settings', 'profile'].includes(tab);
      const url = isSingleDoc 
        ? (tab === 'profile' ? '/api/admin/auth/me' : `/api/admin/${tab}`)
        : `/api/admin/${tab}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();

      if (isSingleDoc) {
        setSingleData(tab === 'profile' ? data.admin : data);
      } else {
        setItems(data);
      }

      // Also pre-fetch media list for image select modals
      if (tab === 'media' || ['hero', 'about', 'company', 'services', 'projects', 'gallery', 'testimonials', 'settings'].includes(tab)) {
        const mediaRes = await fetch('/api/admin/media');
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setMediaList(mediaData);
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error fetching data.');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    loadTabContent(tab);
    setIsSidebarOpen(false);
  };

  // 3. Logout handler
  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of the CMS panel?')) {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
    }
  };

  // 4. Save Single Document Tabs (Hero, Company, SEO, Contact Settings, Website Settings)
  const saveSingleDocSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = activeTab === 'profile' ? '/api/admin/auth/profile' : `/api/admin/${activeTab}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleData)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save changes.');

      if (activeTab === 'profile') {
        setAdmin(resData.admin);
        setSingleData((prev: any) => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
      showToast('success', '✅ Saved Successfully');
    } catch (err: any) {
      showToast('error', '❌ Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // 5. CRUD List Modals & Form Submission (Services, Projects, Gallery, Careers, Blogs, Testimonials, Clients)
  const openAddForm = () => {
    setEditingItem(null);
    setEditorMode('write');
    // Initialize form schemas
    let initialForm: any = { status: 'active' };
    if (activeTab === 'services') initialForm = { title: '', description: '', icon: 'Building', image: '', features: [''], details: '', displayOrder: items.length, status: 'active', seo: { title: '', description: '', keywords: '' } };
    else if (activeTab === 'projects') initialForm = { title: '', client: '', category: '', location: '', completionYear: new Date().getFullYear().toString(), description: '', image: '', gallery: [''], features: [''], featured: false, status: 'active' };
    else if (activeTab === 'gallery') initialForm = { title: '', category: '', image: '', size: 'medium', displayOrder: items.length, status: 'active' };
    else if (activeTab === 'careers') initialForm = { title: '', category: '', department: '', location: '', type: 'Full-Time', experience: '', salary: 'Negotiable', description: '', requirements: [''], responsibilities: [''], status: 'active' };
    else if (activeTab === 'blogs') initialForm = { title: '', summary: '', category: '', image: '', banner: '', content: '', author: admin?.name || 'Admin', tags: [''], featured: false, status: 'draft', seo: { title: '', description: '', keywords: '' } };
    else if (activeTab === 'testimonials') initialForm = { name: '', role: '', company: '', rating: 5, quote: '', image: '', status: 'active' };
    else if (activeTab === 'clients') initialForm = { name: '', industry: '', logo: '', website: '#', displayOrder: items.length, status: 'active' };
    
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    setEditorMode('write');
    // Deep clone item data to prevent state mutating directly
    setFormData(JSON.parse(JSON.stringify(item)));
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isEdit = !!editingItem;
      const url = isEdit ? `/api/admin/${activeTab}/${editingItem._id || editingItem.id}` : `/api/admin/${activeTab}`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save form.');

      showToast('success', '✅ Saved Successfully');
      setIsFormOpen(false);
      loadTabContent(activeTab);
    } catch (err: any) {
      showToast('error', '❌ Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (id: string) => {
    setDeleteTargetId(id);
  };

  const executeDeleteItem = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/admin/${activeTab}/${deleteTargetId}`, { method: 'DELETE' });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to delete item.');

      showToast('success', '🗑 Deleted Successfully');
      loadTabContent(activeTab);
    } catch (err: any) {
      showToast('error', '❌ Something went wrong');
    } finally {
      setDeleteTargetId(null);
    }
  };

  // 6. Action specific triggers (quotes/applications)
  const handleMarkRead = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('Failed to update status.');
      showToast('success', '✅ Saved Successfully');
      loadTabContent(activeTab);
      // Close detail view if open
      if (viewDetailItem) setViewDetailItem((prev: any) => ({ ...prev, status: nextStatus }));
    } catch (err: any) {
      showToast('error', '❌ Something went wrong');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admin/quotes/export');
    showToast('success', '📤 Download Started');
  };

  // 7. Media Library Upload
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement> | any, droppedFiles?: FileList) => {
    const files = droppedFiles || e.target?.files;
    if (!files || files.length === 0) return;

    setSubmitting(true);
    const mediaData = new FormData();
    for (let i = 0; i < files.length; i++) {
      mediaData.append('file', files[i]);
    }

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: mediaData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');

      showToast('success', '📤 Uploaded Successfully');
      loadTabContent(activeTab);
    } catch (err: any) {
      showToast('error', '❌ Something went wrong');
    } finally {
      setSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleMediaUpload(null, files);
    }
  };

  const handleCopyLink = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    showToast('success', '✅ Copy Link Success');
  };

  // 8. Media Select Helper (Fills a form input field from Media Selection modal)
  const openMediaSelector = (field: string, targetType: 'single' | 'formData' = 'formData') => {
    setMediaSelectField(field);
    setMediaSelectTarget(targetType);
  };

  const selectMediaForField = (url: string) => {
    if (!mediaSelectField) return;
    
    if (mediaSelectTarget === 'single') {
      setSingleData((prev: any) => {
        const updated = { ...prev };
        if (mediaSelectField.includes('.')) {
          const parts = mediaSelectField.split('.');
          if (!updated[parts[0]]) updated[parts[0]] = {};
          updated[parts[0]][parts[1]] = url;
        } else {
          updated[mediaSelectField] = url;
        }
        return updated;
      });
    } else {
      setFormData((prev: any) => {
        const updated = { ...prev };
        if (mediaSelectField.includes('.')) {
          const parts = mediaSelectField.split('.');
          if (!updated[parts[0]]) updated[parts[0]] = {};
          updated[parts[0]][parts[1]] = url;
        } else if (mediaSelectField.startsWith('gallery[')) {
          const idx = parseInt(mediaSelectField.match(/\d+/)![0]);
          if (!updated.gallery) updated.gallery = [];
          updated.gallery[idx] = url;
        } else {
          updated[mediaSelectField] = url;
        }
        return updated;
      });
    }

    setMediaSelectField(null);
    setMediaSelectTarget(null);
    showToast('success', '✅ Selected Image Applied');
  };

  // Helper to format blog content via text editing toolbar
  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('rich-text-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = '';
    if (tag === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (tag === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (tag === 'underline') replacement = `<u>${selected || 'underlined text'}</u>`;
    else if (tag === 'heading2') replacement = `\n## ${selected || 'Section Title'}\n`;
    else if (tag === 'heading3') replacement = `\n### ${selected || 'Subsection Title'}\n`;
    else if (tag === 'list') replacement = `\n- ${selected || 'List item'}`;
    else if (tag === 'numlist') replacement = `\n1. ${selected || 'Numbered item'}`;
    else if (tag === 'link') {
      const url = prompt('Enter Web Link URL:', 'https://');
      if (!url) return;
      replacement = `[${selected || 'Link Title'}](${url})`;
    } else if (tag === 'image') {
      // Open media picker instead
      openMediaSelector('content');
      return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setFormData({ ...formData, content: newText });

    // Focus back to editor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + (selected || '').length);
    }, 50);
  };

  // Form Fields Array Helpers
  const handleArrayFieldChange = (index: number, value: string, fieldName: 'features' | 'requirements' | 'responsibilities' | 'tags' | 'gallery') => {
    setFormData((prev: any) => {
      const arr = [...(prev[fieldName] || [])];
      arr[index] = value;
      return { ...prev, [fieldName]: arr };
    });
  };

  const addArrayField = (fieldName: 'features' | 'requirements' | 'responsibilities' | 'tags' | 'gallery') => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), '']
    }));
  };

  const removeArrayField = (index: number, fieldName: 'features' | 'requirements' | 'responsibilities' | 'tags' | 'gallery') => {
    setFormData((prev: any) => {
      const arr = [...(prev[fieldName] || [])];
      arr.splice(index, 1);
      return { ...prev, [fieldName]: arr };
    });
  };

  // 9. Sorting & Filtering Helper
  const sortedItems = [...items]
    .filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#f97316] animate-spin" />
        <p className="text-xs font-mono tracking-widest text-[#cbd5e1] uppercase">Verifying Security Session...</p>
      </div>
    );
  }

  // Sidebar navigation options (Simplified language, no technical jargon)
  const navItems = [
    { id: 'dashboard', label: 'Control Panel Overview', icon: LayoutDashboard },
    { id: 'hero', label: 'Home Page Banner', icon: Sliders },
    { id: 'about', label: 'About Company Story', icon: Info },
    { id: 'services', label: 'Services We Offer', icon: Wrench },
    { id: 'projects', label: 'Projects & Works', icon: FolderGit },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Client Reviews', icon: MessageSquareQuote },
    { id: 'contact-settings', label: 'Contact Details', icon: Home },
    { id: 'quotes', label: 'Customer Quote Requests', icon: MailQuestion, badge: singleData.quotesPending },
    { id: 'media', label: 'Uploaded Images & Files', icon: Upload },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'profile', label: 'My Profile Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex font-sans text-sm antialiased relative overflow-x-hidden">
      {/* Toast Alert popup */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce ${
          toast.type === 'success' ? 'bg-[#1e293b] border-green-500/50 text-green-400' : 'bg-[#1e293b] border-red-500/50 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 text-green-450" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-450" />}
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR PANEL: Dark theme layout */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 lg:w-68 border-r border-[#334155] bg-[#070c18] flex flex-col justify-between shrink-0 transform transition-transform duration-300 lg:translate-x-0 lg:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#334155] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f97316] to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-lg">
              SN
            </div>
            <div>
              <h2 className="font-extrabold text-sm uppercase text-white tracking-widest leading-none">Shree Nivi</h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control</span>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 flex flex-col gap-1 overflow-y-auto max-h-[75vh]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-lg shadow-orange-650/15'
                      : 'text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-orange-500/80'}`} />
                    <span className="tracking-wide text-left">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-650 text-white font-bold leading-none">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Block at bottom */}
        <div className="p-4 border-t border-[#334155] bg-[#0f172a]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={admin?.profilePhoto || '/images/default-avatar.png'}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/20"
            />
            <div className="overflow-hidden w-28">
              <h4 className="font-bold text-xs text-white leading-tight truncate">{admin?.name}</h4>
              <span className="text-[10px] text-slate-500 font-semibold block">Store Manager</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-[#1e293b] rounded-xl transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL CONTENT SCREEN */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] w-full">
        {/* Header toolbar */}
        <header className="h-16 border-b border-[#334155] bg-[#070c18]/30 px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-[#1e293b] border border-[#334155] rounded-xl lg:hidden text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm lg:text-base font-extrabold text-white tracking-wide truncate">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-bold rounded-xl transition-all border border-[#334155] flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-orange-500" />
              Preview Live Website
            </a>
          </div>
        </header>

        {/* Content body layout */}
        <div className="p-8 overflow-y-auto flex-1 max-h-[calc(100vh-4rem)]">
          {/* TAB CONTENT: 1. OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8">
              {/* Large beginner explanation card */}
              <div className="p-6 bg-gradient-to-r from-[#1e293b]/70 to-[#0f172a] border border-[#334155] rounded-2xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Welcome to Shree Nivi Buildtech Admin Panel!</span>
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed font-medium">
                  This page allows you to change the photos, details, texts, and blogs displayed on your website without editing any code.
                  Simply click on the options on the left to edit specific sections, upload images, or review messages sent by customers.
                </p>
              </div>

              {/* Stat Cards Grid (Large, with icons and simple labels) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Projects & Works Done', val: singleData.projectsCount || 0, icon: FolderGit, color: 'from-blue-650/15 to-blue-500/5 border-blue-500/20 text-blue-400' },
                  { label: 'Services Offered on Website', val: singleData.servicesCount || 0, icon: Wrench, color: 'from-orange-650/15 to-orange-500/5 border-orange-500/20 text-orange-400' },
                  { label: 'Unread Customer Quote Requests', val: singleData.quotesPending || 0, icon: MailQuestion, color: 'from-yellow-650/15 to-yellow-500/5 border-yellow-500/20 text-yellow-400', sub: `${singleData.quotesCount || 0} total requests` },
                ].map((stat, idx) => {
                  const IconComp = stat.icon;
                  return (
                    <div key={idx} className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[140px] relative overflow-hidden group`}>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</span>
                        <IconComp className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-4xl font-black">{stat.val}</h3>
                        {stat.sub && <span className="text-[10px] opacity-60 font-bold block mt-1">{stat.sub}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action grid (Recent enquiries) */}
              <div className="w-full">
                {/* Recent Quote Enquiries */}
                <div className="bg-[#1e293b]/30 border border-[#334155] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-white flex items-center gap-2">
                      <MailQuestion className="w-4 h-4 text-orange-500" />
                      Recent Customer Quote Requests
                    </h3>
                    <button onClick={() => handleTabChange('quotes')} className="text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-wider transition-colors cursor-pointer">
                      View All
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {singleData.recentQuotes && singleData.recentQuotes.length > 0 ? (
                      singleData.recentQuotes.map((q: any) => (
                        <div key={q._id} className="p-4 rounded-xl bg-[#0f172a]/50 border border-[#334155] flex items-center justify-between hover:border-orange-500/30 transition-all">
                          <div>
                            <h4 className="font-bold text-xs text-white">{q.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{q.serviceInterest || 'General Inquiry'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              q.status === 'unread' ? 'bg-red-500/10 text-red-405 border border-red-500/20' : 'bg-green-500/10 text-green-405 border border-green-500/20'
                            }`}>
                              {q.status === 'unread' ? 'New Message' : 'Read'}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              {new Date(q.timestamp).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 font-mono text-center py-6">No quote requests received yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. HERO SETTINGS */}
          {activeTab === 'hero' && (
            <form onSubmit={saveSingleDocSettings} className="bg-[#1e293b]/30 border border-[#334155] rounded-2xl p-8 max-w-4xl flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-[#f97316]">Edit Home Page Banner Text & Banner Image</h3>
                <p className="text-xs text-slate-400 mt-1">This banner appears at the very top of your home page.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#334155] pb-6 mb-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase text-[#f97316]">Website Logo Brand Text / Title</label>
                  <input
                    type="text"
                    required
                    value={singleData.logoText || ''}
                    placeholder="SHREE NIVI BUILDTECH"
                    onChange={(e) => setSingleData({ ...singleData, logoText: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-500">The main brand text displayed in the header and footer.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase text-[#f97316]">Website Logo Image (Replaces Default Icon)</label>
                  <ImageUploadZone
                    value={singleData.logoUrl || ''}
                    onChange={(url) => setSingleData({ ...singleData, logoUrl: url })}
                    onOpenMedia={() => openMediaSelector('logoUrl', 'single')}
                  />
                  <span className="text-[10px] text-slate-500">Upload a custom logo image (replaces default construction icon).</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Main Headline Title</label>
                  <input
                    type="text"
                    required
                    value={singleData.title || ''}
                    placeholder="e.g. Engineering Tomorrow's Steel Structures"
                    onChange={(e) => setSingleData({ ...singleData, title: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                  <span className="text-[10px] text-slate-500">Example: "Engineering Tomorrow's Steel Structures" (Short and impactful)</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Headline Description Subtitle</label>
                  <textarea
                    rows={3}
                    required
                    value={singleData.subtitle || ''}
                    placeholder="e.g. Delivering world-class Pre-Engineered Buildings with over 25+ years of excellence."
                    onChange={(e) => setSingleData({ ...singleData, subtitle: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                  <span className="text-[10px] text-slate-500">Keep it to 2-3 sentences max. Summarizes company value.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Primary Button Button Text</label>
                  <input
                    type="text"
                    value={singleData.ctaText1 || ''}
                    placeholder="e.g. Explore Projects"
                    onChange={(e) => setSingleData({ ...singleData, ctaText1: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                  <span className="text-[10px] text-slate-500">Example: "View Projects" or "Explore Our Work"</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Primary Button Link URL</label>
                  <input
                    type="text"
                    value={singleData.ctaLink1 || ''}
                    placeholder="e.g. /projects"
                    onChange={(e) => setSingleData({ ...singleData, ctaLink1: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Web link target. Standard: "/projects" or "/services"</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Secondary Button Button Text</label>
                  <input
                    type="text"
                    value={singleData.ctaText2 || ''}
                    placeholder="e.g. Contact Us"
                    onChange={(e) => setSingleData({ ...singleData, ctaText2: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Secondary Button Link URL</label>
                  <input
                    type="text"
                    value={singleData.ctaLink2 || ''}
                    placeholder="e.g. /contact"
                    onChange={(e) => setSingleData({ ...singleData, ctaLink2: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Banner Background Image</label>
                  <ImageUploadZone
                    value={singleData.imageUrl || ''}
                    onChange={(url) => setSingleData({ ...singleData, imageUrl: url })}
                    onOpenMedia={() => openMediaSelector('imageUrl', 'single')}
                  />
                  <span className="text-[10px] text-slate-500">Upload an image or pick from library. Recommended dimensions: 1920x1080.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Background Video Embed URL (Optional)</label>
                  <input
                    type="text"
                    value={singleData.videoUrl || ''}
                    placeholder="e.g. https://youtube.com/embed/..."
                    onChange={(e) => setSingleData({ ...singleData, videoUrl: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Embed link of a YouTube or Vimeo clip. If added, it will run in the background.</span>
                </div>
              </div>

              {/* Statistics subform */}
              <div className="flex flex-col gap-4 border-t border-[#334155] pt-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Home Page counter metrics (Max 4 cards)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">These numbers display key business highlights like years in business, clients, etc.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const stat = (singleData.stats || [])[idx] || { value: '', label: '' };
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-[#0f172a]/40 border border-[#334155] grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 uppercase font-bold">Counter Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 25+"
                            value={stat.value}
                            onChange={(e) => {
                              const updatedStats = [...(singleData.stats || [])];
                              updatedStats[idx] = { ...stat, value: e.target.value };
                              setSingleData({ ...singleData, stats: updatedStats });
                            }}
                            className="px-3 py-2 text-xs rounded-lg border border-[#334155] bg-[#0f172a]/90 text-white outline-none focus:border-[#f97316]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 uppercase font-bold">Counter Description</label>
                          <input
                            type="text"
                            placeholder="e.g. Years Experience"
                            value={stat.label}
                            onChange={(e) => {
                              const updatedStats = [...(singleData.stats || [])];
                              updatedStats[idx] = { ...stat, label: e.target.value };
                              setSingleData({ ...singleData, stats: updatedStats });
                            }}
                            className="px-3 py-2 text-xs rounded-lg border border-[#334155] bg-[#0f172a]/90 text-white outline-none focus:border-[#f97316]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#334155] pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => loadTabContent('hero')}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel / Revert Changes
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: 3. ABOUT SETTINGS */}
          {activeTab === 'about' && (
            <form onSubmit={saveSingleDocSettings} className="bg-[#1e293b]/30 border border-[#334155] rounded-2xl p-8 max-w-4xl flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-[#f97316]">Edit About Us Details & Managing Director Message</h3>
                <p className="text-xs text-slate-400 mt-1">This controls the text description and founder quote on your company about page.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Company Corporate Name</label>
                  <input
                    type="text"
                    required
                    value={singleData.name || ''}
                    placeholder="Shree Nivi Buildtech"
                    onChange={(e) => setSingleData({ ...singleData, name: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                  <span className="text-[10px] text-slate-500">Legal Company Name used throughout page headers.</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Logo Brand Header Name</label>
                  <input
                    type="text"
                    required
                    value={singleData.logoText || ''}
                    placeholder="SHREE NIVI BUILDTECH"
                    onChange={(e) => setSingleData({ ...singleData, logoText: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">About Us Main Title</label>
                  <input
                    type="text"
                    required
                    value={singleData.aboutTitle || ''}
                    placeholder="e.g. Engineered for Strength. Designed for Scale."
                    onChange={(e) => setSingleData({ ...singleData, aboutTitle: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">About Us Company Story text</label>
                  <textarea
                    rows={4}
                    required
                    value={singleData.aboutStory || ''}
                    placeholder="Tell your company story here..."
                    onChange={(e) => setSingleData({ ...singleData, aboutStory: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Our Company Mission</label>
                  <textarea
                    rows={3}
                    placeholder="What is your mission statement?"
                    value={singleData.mission || ''}
                    onChange={(e) => setSingleData({ ...singleData, mission: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Our Company Vision</label>
                  <textarea
                    rows={3}
                    placeholder="What is your future vision?"
                    value={singleData.vision || ''}
                    onChange={(e) => setSingleData({ ...singleData, vision: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* MD info block */}
              <div className="flex flex-col gap-4 border-t border-[#334155] pt-6">
                <div>
                  <h4 className="text-xs font-bold text-[#f97316] uppercase tracking-widest">Managing Director Message Settings</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">This edits the quote and photo of the Managing Director displayed in the About section.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-200 font-bold">MD Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. K. N. Viswanathan"
                      value={singleData.mdName || ''}
                      onChange={(e) => setSingleData({ ...singleData, mdName: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-200 font-bold">MD Corporate Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Founder & Managing Director"
                      value={singleData.mdTitle || ''}
                      onChange={(e) => setSingleData({ ...singleData, mdTitle: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-200 font-bold">MD Profile Photo</label>
                    <ImageUploadZone
                      value={singleData.mdImage || ''}
                      onChange={(url) => setSingleData({ ...singleData, mdImage: url })}
                      onOpenMedia={() => openMediaSelector('mdImage', 'single')}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">MD Message Content</label>
                  <textarea
                    rows={4}
                    placeholder="Enter message quote here..."
                    value={singleData.mdMessage || ''}
                    onChange={(e) => setSingleData({ ...singleData, mdMessage: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#334155] pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => loadTabContent('about')}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel / Revert Changes
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: CRUD LIST CHUNKS (Services, Projects, Gallery, Testimonials) */}
          {['services', 'projects', 'gallery', 'testimonials'].includes(activeTab) && (
            <div className="flex flex-col gap-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1e293b]/30 p-4 border border-[#334155] rounded-xl">
                {/* Search & Filter */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder={`Search listings by name...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none focus:border-[#f97316] text-white"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none text-[#cbd5e1] focus:border-[#f97316] cursor-pointer"
                  >
                    <option value="all">Show All Status</option>
                    <option value="active">Show Active Items Only</option>
                    <option value="inactive">Show Hidden Items Only</option>
                    {activeTab === 'blogs' && <option value="draft">Show Drafts Only</option>}
                    {activeTab === 'blogs' && <option value="published">Show Published Only</option>}
                  </select>
                </div>

                {/* Add New Button */}
                <button
                  onClick={openAddForm}
                  className="px-5 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  + Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-[#1e293b]/20 border border-[#334155] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full border-collapse text-left text-xs text-[#cbd5e1]">
                  <thead className="bg-[#070c18]/60 border-b border-[#334155] text-white font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Listing Name</th>
                      {activeTab === 'services' && <th className="p-4">Sort Order</th>}
                      {activeTab === 'projects' && (
                        <>
                          <th className="p-4">Project Category</th>
                          <th className="p-4">Client Partner Name</th>
                          <th className="p-4">Completion Year</th>
                        </>
                      )}
                      {activeTab === 'gallery' && (
                        <>
                          <th className="p-4">Gallery Category</th>
                          <th className="p-4">Layout Size</th>
                        </>
                      )}
                      {activeTab === 'careers' && (
                        <>
                          <th className="p-4">Department</th>
                          <th className="p-4">Job Location</th>
                          <th className="p-4">Job Type</th>
                        </>
                      )}
                      {activeTab === 'blogs' && (
                        <>
                          <th className="p-4">Web Address Page Name</th>
                          <th className="p-4">Writer/Author</th>
                          <th className="p-4">Date Published</th>
                        </>
                      )}
                      {activeTab === 'testimonials' && (
                        <>
                          <th className="p-4">Company Name</th>
                          <th className="p-4">Rating Stars</th>
                        </>
                      )}

                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Edit/Delete Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item: any) => (
                        <tr key={item._id || item.id} className="hover:bg-[#1e293b]/30 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            {(item.image || item.logo || item.photo) && (
                              <img
                                src={item.image || item.logo || item.photo}
                                alt="preview"
                                className="w-10 h-8 rounded object-cover bg-slate-900 border border-[#334155]"
                              />
                            )}
                            <div>
                              <h4 className="font-bold text-white text-xs">{item.title || item.name || 'No Name'}</h4>
                              {item.description && <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 max-w-xs">{item.description}</p>}
                            </div>
                          </td>

                          {activeTab === 'services' && <td className="p-4 font-mono">{item.displayOrder}</td>}
                          {activeTab === 'projects' && (
                            <>
                              <td className="p-4 font-semibold uppercase">{item.category}</td>
                              <td className="p-4">{item.client}</td>
                              <td className="p-4 font-mono">{item.completionYear}</td>
                            </>
                          )}
                          {activeTab === 'gallery' && (
                            <>
                              <td className="p-4 font-semibold uppercase">{item.category}</td>
                              <td className="p-4 capitalize">{item.size}</td>
                            </>
                          )}
                          {activeTab === 'careers' && (
                            <>
                              <td className="p-4">{item.department}</td>
                              <td className="p-4">{item.location}</td>
                              <td className="p-4 font-semibold text-orange-400">{item.type}</td>
                            </>
                          )}
                          {activeTab === 'blogs' && (
                            <>
                              <td className="p-4 font-mono text-[10px] text-slate-400">{item.slug}</td>
                              <td className="p-4">{item.author}</td>
                              <td className="p-4 font-mono">{item.date}</td>
                            </>
                          )}
                          {activeTab === 'testimonials' && (
                            <>
                              <td className="p-4">{item.company}</td>
                              <td className="p-4 flex text-yellow-400 font-bold items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {item.rating}
                              </td>
                            </>
                          )}


                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              item.status === 'active' || item.status === 'published'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {item.status === 'active' || item.status === 'published' ? 'Show / Live' : 'Hide / Hidden'}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => openEditForm(item)}
                                className="p-2 bg-[#1e293b] hover:bg-[#334155] text-blue-400 rounded-lg cursor-pointer transition-all"
                                title="Edit / Change"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => triggerDeleteConfirm(item._id || item.id)}
                                className="p-2 bg-[#1e293b] hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer transition-all"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                          No items match the current search or filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. CONTACT ENQUIRIES (QUOTES) */}
          {activeTab === 'quotes' && (
            <div className="flex flex-col gap-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1e293b]/30 p-4 border border-[#334155] rounded-xl">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search quote requests by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none focus:border-[#f97316] text-white"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none text-[#cbd5e1] focus:border-[#f97316] cursor-pointer"
                  >
                    <option value="all">Show All Requests</option>
                    <option value="unread">Show Unread Only</option>
                    <option value="read">Show Read Only</option>
                  </select>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-5 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Quotes to Excel/CSV
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-[#1e293b]/20 border border-[#334155] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full border-collapse text-left text-xs text-[#cbd5e1]">
                  <thead className="bg-[#070c18]/60 border-b border-[#334155] text-white font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Message Subject</th>
                      <th className="p-4">Interested Service</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">View Detail / Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item: any) => (
                        <tr key={item._id} className="hover:bg-[#1e293b]/30 transition-colors">
                          <td className="p-4">
                            <h4 className="font-bold text-white text-xs">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.email}</p>
                          </td>
                          <td className="p-4 truncate max-w-xs">{item.subject || 'No Subject'}</td>
                          <td className="p-4 font-semibold text-orange-400">{item.serviceInterest}</td>
                          <td className="p-4 font-mono">{new Date(item.timestamp).toLocaleString('en-IN')}</td>
                          
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleMarkRead(item._id, item.status)}
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border cursor-pointer hover:scale-105 transition-transform ${
                                item.status === 'unread'
                                  ? 'bg-red-500/10 text-red-405 border-red-500/20'
                                  : 'bg-green-500/10 text-green-405 border-green-500/20'
                              }`}
                            >
                              {item.status === 'unread' ? 'New Message' : 'Read'}
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => setViewDetailItem(item)}
                                className="p-2 bg-[#1e293b] hover:bg-[#334155] text-blue-400 rounded-lg cursor-pointer transition-all"
                                title="Open Message details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => triggerDeleteConfirm(item._id)}
                                className="p-2 bg-[#1e293b] hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer transition-all"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                          No inquiries received.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. JOB APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="flex flex-col gap-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between bg-[#1e293b]/30 p-4 border border-[#334155] rounded-xl">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-64">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search job applications by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none focus:border-[#f97316] text-white"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none text-[#cbd5e1] focus:border-[#f97316] cursor-pointer"
                  >
                    <option value="all">Show All Applications</option>
                    <option value="unread">Show Unread Only</option>
                    <option value="read">Show Read Only</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#1e293b]/20 border border-[#334155] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full border-collapse text-left text-xs text-[#cbd5e1]">
                  <thead className="bg-[#070c18]/60 border-b border-[#334155] text-white font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Applicant details</th>
                      <th className="p-4">Applied Job Position</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Resume File</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">View Detail / Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item: any) => (
                        <tr key={item._id} className="hover:bg-[#1e293b]/30 transition-colors">
                          <td className="p-4">
                            <h4 className="font-bold text-white text-xs">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.email} | {item.phone}</p>
                          </td>
                          <td className="p-4 font-semibold text-orange-400 uppercase">{item.jobTitle}</td>
                          <td className="p-4 font-mono">{new Date(item.timestamp).toLocaleString('en-IN')}</td>
                          
                          <td className="p-4">
                            {item.resumeUrl ? (
                              <a
                                href={item.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-blue-405 hover:text-blue-300 font-bold"
                              >
                                <FileDown className="w-4 h-4" />
                                Download Resume
                              </a>
                            ) : (
                              <span className="text-slate-500 font-semibold">Not Provided</span>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleMarkRead(item._id, item.status)}
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border cursor-pointer hover:scale-105 transition-transform ${
                                item.status === 'unread'
                                  ? 'bg-red-500/10 text-red-405 border-red-500/20'
                                  : 'bg-green-500/10 text-green-405 border-green-500/20'
                              }`}
                            >
                              {item.status === 'unread' ? 'New CV' : 'Read'}
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => setViewDetailItem(item)}
                                className="p-2 bg-[#1e293b] hover:bg-[#334155] text-blue-400 rounded-lg cursor-pointer transition-all"
                                title="Open CV application details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => triggerDeleteConfirm(item._id)}
                                className="p-2 bg-[#1e293b] hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer transition-all"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                          No job applications received.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 6. MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="flex flex-col gap-6">
              {/* Modern drag and drop area */}
              <div 
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-[#f97316] bg-orange-500/10 text-[#f97316]' 
                    : 'border-[#334155] bg-[#1e293b]/30 text-slate-300 hover:border-slate-400 hover:bg-[#1e293b]/50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
                
                <div className="w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center border border-[#334155]">
                  <Upload className="w-8 h-8 text-orange-500" />
                </div>
                
                <div className="text-center">
                  <h4 className="font-bold text-sm text-white">Drag and Drop Images Here</h4>
                  <p className="text-xs text-slate-400 mt-1">Or click to select files from your computer</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase">JPG, PNG, GIF, SVG, WEBP, PDF (Max file size: 10MB)</p>
                </div>
              </div>

              {/* Media search */}
              <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search uploaded files by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none focus:border-[#f97316] text-white"
                />
              </div>

              {/* Media Files grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {mediaList.length > 0 ? (
                  mediaList
                    .filter(m => m.filename.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((media) => (
                      <div key={media._id} className="bg-[#1e293b]/40 border border-[#334155] rounded-xl overflow-hidden flex flex-col justify-between group shadow relative">
                        {/* File preview */}
                        <div className="aspect-square bg-slate-950 flex items-center justify-center relative overflow-hidden">
                          {media.type.startsWith('image/') ? (
                            <img
                              src={media.url}
                              alt={media.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <FileText className="w-12 h-12 text-slate-500" />
                          )}
                          <div className="absolute inset-0 bg-[#0f172a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleCopyLink(media.url)}
                              className="p-2 bg-[#f97316] text-white rounded-lg hover:scale-105 transition-transform cursor-pointer font-bold text-xs"
                              title="Copy URL link"
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => triggerDeleteConfirm(media._id)}
                              className="p-2 bg-red-655 text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* File details */}
                        <div className="p-3 border-t border-[#334155] bg-[#070c18]/25">
                          <h4 className="text-[10px] font-bold text-white truncate" title={media.filename}>
                            {media.filename}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-500 mt-1 block">
                            {(media.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 font-mono">
                    No images or files uploaded yet. Use the drag & drop area to upload.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 7. CONTACT SETTINGS FORM */}
          {activeTab === 'contact-settings' && (
            <form onSubmit={saveSingleDocSettings} className="bg-[#1e293b]/30 border border-[#334155] rounded-2xl p-8 max-w-4xl flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-[#f97316]">Edit Company Contact details & Social Links</h3>
                <p className="text-xs text-slate-400 mt-1">This edits phone numbers, email addresses, office map coordinates, and social media handles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Corporate Office Address</label>
                  <textarea
                    rows={3}
                    required
                    value={singleData.address || ''}
                    placeholder="Enter office address..."
                    onChange={(e) => setSingleData({ ...singleData, address: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Google Map Embed Link</label>
                  <textarea
                    rows={3}
                    required
                    value={singleData.mapEmbedUrl || ''}
                    placeholder="<iframe src='...'></iframe>"
                    onChange={(e) => setSingleData({ ...singleData, mapEmbedUrl: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Paste the &lt;iframe&gt; code generated from Google Maps sharing option.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Primary Inquiry Email Address</label>
                  <input
                    type="email"
                    required
                    value={singleData.email || ''}
                    placeholder="info@shreenivibuildtech.com"
                    onChange={(e) => setSingleData({ ...singleData, email: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Business / Working Hours</label>
                  <input
                    type="text"
                    required
                    value={singleData.businessHours || ''}
                    placeholder="e.g. Mon - Sat: 9:00 AM - 6:05 PM"
                    onChange={(e) => setSingleData({ ...singleData, businessHours: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">WhatsApp Call Number (e.g. 919876543210)</label>
                  <input
                    type="text"
                    required
                    value={singleData.whatsappNumber || ''}
                    placeholder="e.g. 919876543210"
                    onChange={(e) => setSingleData({ ...singleData, whatsappNumber: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Include country code. No spaces or symbols like "+". Example: 91 for India + 10-digit number.</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Office Phone Numbers (Separated by commas)</label>
                  <input
                    type="text"
                    value={singleData.phoneNumbers ? singleData.phoneNumbers.join(', ') : ''}
                    placeholder="+91 44 2220 1900, +91 98765 43210"
                    onChange={(e) => setSingleData({ ...singleData, phoneNumbers: e.target.value.split(',').map((p: string) => p.trim()) })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-[#334155] pt-6">
                <h4 className="text-xs font-bold text-[#f97316] uppercase tracking-widest">Social Media Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                    <div key={platform} className="flex flex-col gap-2">
                      <label className="text-xs text-slate-200 capitalize font-bold">{platform} Web Page Link</label>
                      <input
                        type="text"
                        value={(singleData.socialLinks || {})[platform] || ''}
                        placeholder="https://..."
                        onChange={(e) => {
                          const links = { ...(singleData.socialLinks || {}) };
                          links[platform] = e.target.value;
                          setSingleData({ ...singleData, socialLinks: links });
                        }}
                        className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#334155] pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => loadTabContent('contact-settings')}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel / Revert Changes
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Save Changes'}
                </button>
              </div>
            </form>
          )}



          {/* TAB CONTENT: 9. WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={saveSingleDocSettings} className="bg-[#1e293b]/30 border border-[#334155] rounded-2xl p-8 max-w-4xl flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-[#f97316]">Edit Website branding & Footer info</h3>
                <p className="text-xs text-slate-400 mt-1">This settings menu controls the logo headings, copyrights, and branding settings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Website Top Header Logo Brand Text</label>
                  <input
                    type="text"
                    required
                    value={singleData.logoText || ''}
                    placeholder="SHREE NIVI BUILDTECH"
                    onChange={(e) => setSingleData({ ...singleData, logoText: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Browser Tab Favicon Photo Link</label>
                  <ImageUploadZone
                    value={singleData.faviconUrl || ''}
                    onChange={(url) => setSingleData({ ...singleData, faviconUrl: url })}
                    onOpenMedia={() => openMediaSelector('faviconUrl', 'single')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Footer Logo Brand Description</label>
                  <textarea
                    rows={3}
                    required
                    value={singleData.footerDescription || ''}
                    placeholder="Engineered for Strength. Designed for Scale. Since 2001."
                    onChange={(e) => setSingleData({ ...singleData, footerDescription: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Footer Copyright Text</label>
                  <textarea
                    rows={3}
                    required
                    value={singleData.copyrightText || ''}
                    placeholder="© 2026 Shree Nivi Buildtech. All rights reserved."
                    onChange={(e) => setSingleData({ ...singleData, copyrightText: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#334155] pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => loadTabContent('settings')}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel / Revert Changes
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: 10. ADMIN PROFILE EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={saveSingleDocSettings} className="bg-[#1e293b]/30 border border-[#334155] rounded-2xl p-8 max-w-4xl flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-[#f97316]">Edit My Profile Settings & security password</h3>
                <p className="text-xs text-slate-400 mt-1">This edits your login name, profile avatar photo, email address, and changes security password.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">My Full Name</label>
                  <input
                    type="text"
                    required
                    value={singleData.name || ''}
                    placeholder="Administrator"
                    onChange={(e) => setSingleData({ ...singleData, name: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Login Email address</label>
                  <input
                    type="email"
                    required
                    value={singleData.email || ''}
                    placeholder="admin@shreenivibuildtech.com"
                    onChange={(e) => setSingleData({ ...singleData, email: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-200 font-bold uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={singleData.phone || ''}
                    placeholder="+91..."
                    onChange={(e) => setSingleData({ ...singleData, phone: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <label className="text-xs text-slate-200 font-bold uppercase">Profile Avatar Photo</label>
                <ImageUploadZone
                  value={singleData.profilePhoto || ''}
                  onChange={(url) => setSingleData({ ...singleData, profilePhoto: url })}
                  onOpenMedia={() => openMediaSelector('profilePhoto', 'single')}
                />
              </div>

              {/* Password subform */}
              <div className="flex flex-col gap-4 border-t border-[#334155] pt-6 max-w-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Change security login Password</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Leave blank if you do not want to change your current login password.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-200 font-bold">Current Security Password</label>
                    <input
                      type="password"
                      placeholder="Type current password"
                      value={singleData.currentPassword || ''}
                      onChange={(e) => setSingleData({ ...singleData, currentPassword: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white font-mono text-xs placeholder:text-slate-600"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-200 font-bold">New Security Password</label>
                    <input
                      type="password"
                      placeholder="Type new password"
                      value={singleData.newPassword || ''}
                      onChange={(e) => setSingleData({ ...singleData, newPassword: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white font-mono text-xs placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#334155] pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => loadTabContent('profile')}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel / Revert Changes
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* POPUP MODAL: DYNAMIC CREATION & EDIT FORM DRAWERS */}
      {isFormOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 relative flex flex-col justify-between shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-6">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#f97316]">
                  {editingItem ? '✏️ Edit Listing Details' : '➕ Create New Listing'} - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </h3>
                {draftSavedTime && (
                  <span className="text-[10px] text-green-400 font-bold block mt-1">✓ Draft auto-saved at {draftSavedTime}</span>
                )}
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 bg-[#0f172a]/60 hover:bg-slate-900 border border-[#334155] text-slate-400 hover:text-white rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-xs font-semibold">
              {/* services Form FIELDS */}
              {activeTab === 'services' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Web Address Page name (URL ID)</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingItem}
                        value={formData.id || ''}
                        placeholder="e.g. factory-sheds"
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] disabled:opacity-50"
                      />
                      <span className="text-[10px] text-slate-500 font-medium">Use only letters, numbers, and dashes (no spaces). Example: 'factory-sheds' creates 'shreenivibuildtech.com/services/factory-sheds'.</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Service Title / Name</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        placeholder="e.g. Pre-Engineered Warehouses"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-200 uppercase tracking-widest">Short description card subtitle (Max 150 characters)</label>
                    <input
                      type="text"
                      required
                      value={formData.description || ''}
                      placeholder="e.g. Design and fabrication of industrial warehouse storage steel sheds."
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                    />
                    <span className="text-[10px] text-slate-500">Character Counter: {(formData.description || '').length} / 150</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Service card image photo</label>
                      <ImageUploadZone
                        value={formData.image || ''}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onOpenMedia={() => openMediaSelector('image')}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Lucide Icon Name</label>
                      <input
                        type="text"
                        required
                        value={formData.icon || 'Building'}
                        placeholder="e.g. Building, Home, Factory, HardHat"
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Display Sort Order Number</label>
                      <input
                        type="number"
                        required
                        value={formData.displayOrder === undefined || formData.displayOrder === null || Number.isNaN(formData.displayOrder) ? '' : formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value === '' ? 0 : (parseInt(e.target.value) || 0) })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                      <span className="text-[10px] text-slate-500">Lower numbers appear first on the list. (e.g. 0, 1, 2)</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Status (Show or Hide on site)</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-[#cbd5e1] outline-none focus:border-[#f97316]"
                      >
                        <option value="active">Show Listing (Live)</option>
                        <option value="inactive">Hide Listing (Draft)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-200 uppercase tracking-widest">Detailed Content Page Description</label>
                    <textarea
                      rows={4}
                      value={formData.details || ''}
                      placeholder="Type details of this service..."
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] resize-none"
                    />
                  </div>

                  {/* Bullet features list */}
                  <div className="flex flex-col gap-2 border-t border-[#334155] pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 uppercase tracking-wider text-[10px]">Bullet Highlight Features List</label>
                      <button
                        type="button"
                        onClick={() => addArrayField('features')}
                        className="px-2 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded text-[9px] font-bold cursor-pointer"
                      >
                        + Add Bullet item
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(formData.features || []).map((feat: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            required
                            value={feat}
                            placeholder="e.g. Safe and modular design plans"
                            onChange={(e) => handleArrayFieldChange(idx, e.target.value, 'features')}
                            className="flex-1 px-3 py-2 text-[10px] rounded border border-[#334155] bg-[#0f172a]/80 text-white outline-none focus:border-[#f97316]"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayField(idx, 'features')}
                            className="p-2 bg-red-650/10 text-red-400 border border-red-500/20 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* projects Form FIELDS */}
              {activeTab === 'projects' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Web Link URL Name</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingItem}
                        value={formData.id || ''}
                        placeholder="e.g. aerospace-hangar"
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-slate-200 uppercase tracking-widest">Project Name</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        placeholder="e.g. Steel Aerospace Hangar Construction"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Client Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TATA Steel"
                        value={formData.client || ''}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Category Type</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Warehouse, Heavy Industrial"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Project Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chennai, TN"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Completion Year</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026"
                        value={formData.completionYear || ''}
                        onChange={(e) => setFormData({ ...formData, completionYear: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-slate-200 uppercase tracking-widest">Project Thumbnail Photo</label>
                      <ImageUploadZone
                        value={formData.image || ''}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onOpenMedia={() => openMediaSelector('image')}
                      />
                    </div>
                    <div className="flex flex-row gap-6 items-center justify-around border border-[#334155] bg-[#0f172a]/40 rounded-lg p-2.5">
                      <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.featured || false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-orange-500 focus:ring-0 focus:ring-offset-0 border-[#334155]"
                        />
                        <span>Pin to Featured?</span>
                      </label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="px-2 py-1.5 rounded bg-[#0f172a] text-[#cbd5e1] border border-[#334155]"
                      >
                        <option value="active">Live (Show)</option>
                        <option value="inactive">Hidden (Draft)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-200 uppercase tracking-widest">Project Summary Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description || ''}
                      placeholder="Type details of the construction project, client needs and solutions..."
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] resize-none"
                    />
                  </div>

                  {/* Multi-images gallery grid */}
                  <div className="flex flex-col gap-2 border-t border-[#334155] pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 uppercase tracking-wider text-[10px]">Project Gallery Attachment Images</label>
                      <button
                        type="button"
                        onClick={() => addArrayField('gallery')}
                        className="px-2 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded text-[9px] font-bold cursor-pointer"
                      >
                        + Add Image URL
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {(formData.gallery || []).map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative p-3 border border-[#334155] rounded-xl bg-[#0f172a]/20 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Photo #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeArrayField(idx, 'gallery')}
                              className="p-1 text-red-400 hover:text-red-500 rounded transition-colors"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <ImageUploadZone
                            value={imgUrl}
                            onChange={(url) => handleArrayFieldChange(idx, url, 'gallery')}
                            onOpenMedia={() => openMediaSelector(`gallery[${idx}]`)}
                            previewHeight="h-28"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* gallery Form FIELDS */}
              {activeTab === 'gallery' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Photo ID URL Name</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingItem}
                        value={formData.id || ''}
                        placeholder="e.g. fabrication-site-welding"
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Photo Title Caption</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        placeholder="e.g. Precision CNC Steel Cutting Work"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Photo URL Link</label>
                      <ImageUploadZone
                        value={formData.image || ''}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onOpenMedia={() => openMediaSelector('image')}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Gallery Category Filter</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. peb-construction, structural-steel"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Grid Display Size (aspect)</label>
                      <select
                        value={formData.size || 'medium'}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-[#cbd5e1] outline-none focus:border-[#f97316]"
                      >
                        <option value="small">Small (Square Ratio)</option>
                        <option value="medium">Medium (Standard Wide)</option>
                        <option value="large">Large (High Vertical)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Sort Display Order</label>
                      <input
                        type="number"
                        required
                        value={formData.displayOrder === undefined || formData.displayOrder === null || Number.isNaN(formData.displayOrder) ? '' : formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value === '' ? 0 : (parseInt(e.target.value) || 0) })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Show or Hide</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-[#cbd5e1] outline-none focus:border-[#f97316]"
                      >
                        <option value="active">Live (Show)</option>
                        <option value="inactive">Hidden (Draft)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* careers Form FIELDS */}
              {activeTab === 'careers' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Job Link ID name</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingItem}
                        value={formData.id || ''}
                        placeholder="e.g. design-engineer"
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-slate-200 uppercase tracking-widest">Job Position Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        placeholder="e.g. Senior PEB Structural Engineer"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Department</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Design / Engineering"
                        value={formData.department || ''}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Job Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chennai Office"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Employment Type</label>
                      <select
                        value={formData.type || 'Full-Time'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-[#cbd5e1] outline-none focus:border-[#f97316]"
                      >
                        <option value="Full-Time">Full-Time Job</option>
                        <option value="Part-Time">Part-Time Job</option>
                        <option value="Contract">Contractual Basis</option>
                        <option value="Internship">Internship Period</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Engineering"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Required Experience</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5+ Years"
                        value={formData.experience || ''}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Offered Salary Package</label>
                      <input
                        type="text"
                        value={formData.salary || 'Negotiable'}
                        placeholder="e.g. ₹6,00,000 - ₹8,00,000 PA"
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Listing Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-[#cbd5e1] outline-none focus:border-[#f97316]"
                      >
                        <option value="active">Active Listing (Accepting CVs)</option>
                        <option value="inactive">Hidden Listing (Closed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-200 uppercase tracking-widest">Short Job description Summary</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description || ''}
                      placeholder="Enter a brief summary overview of this role..."
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] resize-none"
                    />
                  </div>

                  {/* Requirements list */}
                  <div className="flex flex-col gap-2 border-t border-[#334155] pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 uppercase tracking-wider text-[10px]">Job requirements list</label>
                      <button
                        type="button"
                        onClick={() => addArrayField('requirements')}
                        className="px-2 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded text-[9px] font-bold cursor-pointer"
                      >
                        + Add Requirement
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(formData.requirements || []).map((reqItem: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            required
                            value={reqItem}
                            placeholder="e.g. Degree in Civil Engineering, AutoCAD skills"
                            onChange={(e) => handleArrayFieldChange(idx, e.target.value, 'requirements')}
                            className="flex-1 px-3 py-2 text-[10px] rounded border border-[#334155] bg-[#0f172a]/80 text-white outline-none focus:border-[#f97316]"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayField(idx, 'requirements')}
                            className="p-2 bg-red-650/10 text-red-400 border border-red-500/20 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* blogs Form FIELDS (with Microsoft Word-style toolbar) */}
              {activeTab === 'blogs' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Blog Web Link URL name (No spaces)</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingItem}
                        value={formData.slug || ''}
                        placeholder="e.g. design-calculations-peb-structures"
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] disabled:opacity-50"
                      />
                      <span className="text-[10px] text-slate-500">Example: 'design-calculations' creates 'shreenivibuildtech.com/blog/design-calculations'.</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Article/Blog Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        placeholder="e.g. How Pre-Engineered Steel Structures Save Construction Costs"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Feature Thumbnail Image</label>
                      <ImageUploadZone
                        value={formData.image || ''}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onOpenMedia={() => openMediaSelector('image')}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Author Writer Name</label>
                      <input
                        type="text"
                        required
                        value={formData.author || ''}
                        placeholder="e.g. Viswanathan K. N."
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Blog Category Tag</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Design, Construction Tips"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Read Time (minutes)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 mins"
                        value={formData.readTime || '4 mins'}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Publish Date</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026-06-20"
                        value={formData.date || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Publication Status</label>
                      <select
                        value={formData.status || 'draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-[#cbd5e1] outline-none focus:border-[#f97316]"
                      >
                        <option value="draft">Save as Draft (Hidden)</option>
                        <option value="published">Publish (Show Live on Site)</option>
                      </select>
                    </div>
                    <div className="flex flex-row items-center justify-around border border-[#334155] bg-[#0f172a]/40 rounded-lg p-2.5 mt-4">
                      <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.featured || false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-orange-500 border-[#334155]"
                        />
                        <span>Pin to Featured?</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-200 uppercase tracking-widest">Brief article Summary Text</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A comprehensive guide on how pre-engineered steel buildings reduce structure costs and build time."
                      value={formData.summary || ''}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                    />
                    <span className="text-[10px] text-slate-500">Character Counter: {(formData.summary || '').length}</span>
                  </div>

                  {/* Microsoft Word Style Content Editor */}
                  <div className="flex flex-col gap-2 border border-[#334155] rounded-xl overflow-hidden bg-[#0f172a]/50">
                    {/* Microsoft Word styling Toolbar */}
                    <div className="bg-[#1e293b] px-4 py-2.5 border-b border-[#334155] flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => insertFormatting('bold')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Bold Text"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('italic')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Italic Text"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('underline')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Underline Text"
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                        <span className="h-6 w-px bg-slate-650 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('heading2')}
                          className="px-2 py-1 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] font-bold text-[10px] cursor-pointer"
                          title="Heading 2"
                        >
                          H2 Title
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('heading3')}
                          className="px-2 py-1 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] font-bold text-[10px] cursor-pointer"
                        >
                          H3 Subtitle
                        </button>
                        <span className="h-6 w-px bg-slate-650 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('list')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Bullet List"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('numlist')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <span className="h-6 w-px bg-slate-650 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('link')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Insert Link"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('image')}
                          className="p-1.5 bg-[#0f172a] hover:bg-[#334155] text-slate-200 hover:text-white rounded border border-[#334155] cursor-pointer"
                          title="Add Image from Media Library"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* View Mode buttons */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setEditorMode('write')}
                          className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            editorMode === 'write' ? 'bg-[#f97316] text-white' : 'bg-[#0f172a] text-slate-350 border border-[#334155]'
                          }`}
                        >
                          Write Article
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode('preview')}
                          className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            editorMode === 'preview' ? 'bg-[#f97316] text-white' : 'bg-[#0f172a] text-slate-350 border border-[#334155]'
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>
                    </div>

                    {/* Content text block */}
                    {editorMode === 'write' ? (
                      <textarea
                        id="rich-text-content-area"
                        rows={8}
                        required
                        value={formData.content || ''}
                        placeholder="Write blog content here..."
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0f172a]/80 outline-none text-white text-xs resize-none font-mono placeholder:text-slate-650"
                      />
                    ) : (
                      <div className="p-4 bg-[#0f172a] max-h-56 overflow-y-auto text-xs leading-relaxed prose prose-invert font-sans select-text">
                        {formData.content ? (
                          <div className="whitespace-pre-wrap font-sans text-slate-300 font-medium">
                            {formData.content}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono italic">No content written yet. Write content in the tab above.</span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* testimonials Form FIELDS */}
              {activeTab === 'testimonials' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Client Reviewer Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Client Role / Position</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Project Director"
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Company Partner Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rane Infrastructure"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Client Photo</label>
                      <ImageUploadZone
                        value={formData.image || ''}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onOpenMedia={() => openMediaSelector('image')}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-200 uppercase tracking-widest">Rating Stars (1 to 5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        required
                        value={formData.rating === undefined || formData.rating === null || Number.isNaN(formData.rating) ? '' : formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value === '' ? 5 : (parseInt(e.target.value) || 5) })}
                        className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-200 uppercase tracking-widest">Customer Quote / Review Message</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Paste review description here..."
                      value={formData.quote || ''}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-[#334155] bg-[#0f172a]/70 text-white outline-none focus:border-[#f97316] resize-none"
                    />
                  </div>
                </>
              )}



              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end border-t border-[#334155] pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-[#cbd5e1] text-xs font-bold uppercase rounded-lg cursor-pointer"
                >
                  Cancel / Close Form
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ENQUIRY / APPLICATION DETAIL READ DRAWER */}
      {viewDetailItem && (
        <div className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-xl p-8 relative flex flex-col justify-between shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-[#f97316]">
                {activeTab === 'quotes' ? 'Quote Inquiry details' : 'Job Application Details'}
              </h3>
              <button
                onClick={() => setViewDetailItem(null)}
                className="p-1.5 bg-[#0f172a]/60 hover:bg-slate-900 border border-[#334155] text-slate-400 hover:text-white rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contents */}
            <div className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#0f172a]/30 p-4 border border-[#334155] rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Full Name</span>
                  <h4 className="font-bold text-white text-xs mt-0.5">{viewDetailItem.name}</h4>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Email Address</span>
                  <h4 className="font-bold text-white text-xs mt-0.5"><a href={`mailto:${viewDetailItem.email}`} className="text-[#f97316]">{viewDetailItem.email}</a></h4>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Phone Number</span>
                  <h4 className="font-bold text-white text-xs mt-0.5">{viewDetailItem.phone || 'Not provided'}</h4>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Submission Date</span>
                  <h4 className="font-bold text-white text-xs mt-0.5 font-mono">{new Date(viewDetailItem.timestamp).toLocaleString('en-IN')}</h4>
                </div>
              </div>

              {activeTab === 'quotes' ? (
                <div className="grid grid-cols-2 gap-4 bg-[#0f172a]/30 p-4 border border-[#334155] rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Service of Interest</span>
                    <h4 className="font-bold text-orange-400 text-xs mt-0.5">{viewDetailItem.serviceInterest || 'General Inquiry'}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Subject Line</span>
                    <h4 className="font-bold text-white text-xs mt-0.5">{viewDetailItem.subject || 'No Subject'}</h4>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0f172a]/30 p-4 border border-[#334155] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Applied Position</span>
                    <h4 className="font-bold text-orange-400 text-xs mt-0.5">{viewDetailItem.jobTitle}</h4>
                  </div>
                  {viewDetailItem.resumeUrl && (
                    <a
                      href={viewDetailItem.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30 rounded-lg text-[10px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Download Resume CV File
                    </a>
                  )}
                </div>
              )}

              {/* Message block */}
              <div className="p-4 rounded-xl bg-[#0f172a]/50 border border-[#334155] flex flex-col gap-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  {activeTab === 'quotes' ? 'Project Specifications / Message Details' : 'Cover Letter Message'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold whitespace-pre-wrap select-text">
                  {activeTab === 'quotes' ? viewDetailItem.message : (viewDetailItem.coverLetter || 'No cover letter submitted.')}
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 justify-end border-t border-[#334155] pt-4 mt-6">
              <button
                onClick={() => handleMarkRead(viewDetailItem._id, viewDetailItem.status)}
                className={`px-4 py-2.5 border text-xs font-bold uppercase rounded-lg cursor-pointer transition-colors ${
                  viewDetailItem.status === 'unread'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-750 hover:bg-slate-750'
                }`}
              >
                Mark as {viewDetailItem.status === 'unread' ? 'Read' : 'Unread'}
              </button>
              <button
                onClick={() => {
                  triggerDeleteConfirm(viewDetailItem._id);
                  setViewDetailItem(null);
                }}
                className="px-4 py-2.5 bg-red-655 hover:bg-red-600 border border-red-650/10 text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Delete Request
              </button>
              <button
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-[#cbd5e1] text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: MEDIA SELECTION DRAWER */}
      {mediaSelectField && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-8 relative flex flex-col justify-between shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-6">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#f97316]">Select Image from Uploads Library</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Click on an image card below to insert its link url into the editor.</p>
              </div>
              <button
                onClick={() => {
                  setMediaSelectField(null);
                  setMediaSelectTarget(null);
                }}
                className="p-1.5 bg-[#0f172a]/60 hover:bg-slate-900 border border-[#334155] text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Search */}
            <div className="relative max-w-sm mb-6">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#334155] bg-[#0f172a]/80 outline-none focus:border-[#f97316] text-white"
              />
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[50vh] p-2">
              {mediaList.length > 0 ? (
                mediaList
                  .filter(m => m.type.startsWith('image/') && m.filename.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((media) => (
                    <button
                      key={media._id}
                      type="button"
                      onClick={() => selectMediaForField(media.url)}
                      className="bg-[#0f172a]/55 border border-[#334155] rounded-xl overflow-hidden hover:border-[#f97316] focus:border-[#f97316] text-left flex flex-col justify-between group shadow transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="aspect-square bg-slate-950 flex items-center justify-center relative overflow-hidden">
                        <img
                          src={media.url}
                          alt={media.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2.5 bg-[#070c18]/10 text-[9px] font-bold text-[#cbd5e1] truncate border-t border-[#334155]">
                        {media.filename}
                      </div>
                    </button>
                  ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
                  No images found. Please upload them in the Media Library first.
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-[#334155] pt-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setMediaSelectField(null);
                  setMediaSelectTarget(null);
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-[#cbd5e1] text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Cancel Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL: BEFORE DELETING */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 animate-pulse">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">⚠️ Are you sure you want to delete this?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-semibold">
                Deleting this item will permanently remove it from your website. This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-colors border border-[#334155]"
              >
                No, Keep it
              </button>
              <button
                onClick={executeDeleteItem}
                className="py-3 bg-red-600 hover:bg-red-750 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Yes, Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
