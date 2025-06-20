import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Image,
  Video,
  FileText,
  X,
  Check,
  AlertCircle,
  Folder,
  Trash2,
  Edit3,
  Eye,
  Download
} from 'lucide-react'
import { useAdDemo } from '../../contexts/AdDemoContext'

const ContentUploadManager = () => {
  const { isAdminAuthenticated, uploadDemoContent, switchDemoCompany, enableDemoMode } = useAdDemo()
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadType, setUploadType] = useState('banner')
  const [companyName, setCompanyName] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [adHeadline, setAdHeadline] = useState('')
  const [adDescription, setAdDescription] = useState('')
  const [ctaText, setCtaText] = useState('Learn More')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  
  const fileInputRef = useRef(null)

  // Load existing uploads from localStorage
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customDemoAds') || '[]')
    setUploadedFiles(saved)
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const file = files[0]
    
    // Validate file type
    const validTypes = {
      banner: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'],
      sidebar: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'],
      video: ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'],
      sponsored: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'text/plain', 'application/json']
    }

    if (!validTypes[uploadType] || !validTypes[uploadType].includes(file.type)) {
      setUploadStatus({
        type: 'error',
        message: `Invalid file type for ${uploadType} ad. Please select a ${uploadType === 'video' ? 'video' : 'image'} file.`
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size too large. Maximum size is 10MB.'
      })
      return
    }

    // Simulate file upload
    simulateUpload(file)
  }

  const simulateUpload = (file) => {
    // Validate company name before upload
    if (!companyName.trim()) {
      setUploadStatus({
        type: 'error',
        message: 'Please enter a company name before uploading.'
      })
      return
    }

    setUploadStatus({ type: 'uploading', message: 'Uploading file...' })

    // Convert file to base64 data URL for persistent storage
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileUrl = e.target.result // This is a data URL that persists

      setTimeout(() => {
        const newUpload = {
          id: `upload_${Date.now()}`,
          company: companyName.trim(),
          type: uploadType,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl: fileUrl, // Now using persistent data URL
          targetUrl: targetUrl.trim() || 'https://example.com',
          adHeadline: adHeadline.trim() || `${companyName.trim()} - Professional Solutions`,
          adDescription: adDescription.trim() || 'Discover innovative solutions for your business',
          ctaText: ctaText.trim() || 'Learn More',
          uploadDate: new Date().toISOString(),
          status: 'ready'
        }

        const updated = [...uploadedFiles, newUpload]
        setUploadedFiles(updated)
        localStorage.setItem('customDemoAds', JSON.stringify(updated))

        // Automatically enable demo mode and switch to the uploaded company
        enableDemoMode()
        switchDemoCompany(companyName.trim())

        setUploadStatus({
          type: 'success',
          message: `File uploaded successfully for ${companyName.trim()}! Ad system activated - check the dashboard to see your ad!`
        })

        // Clear form AFTER successful upload
        setCompanyName('')
        setAdHeadline('')
        setAdDescription('')
        setCtaText('Learn More')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        // Clear status after 5 seconds (longer to show the switch message)
        setTimeout(() => setUploadStatus(null), 5000)
      }, 1000)
    }

    reader.onerror = () => {
      setUploadStatus({
        type: 'error',
        message: 'Failed to process file. Please try again.'
      })
    }

    reader.readAsDataURL(file)
  }

  const deleteUpload = (id) => {
    const updated = uploadedFiles.filter(file => file.id !== id)
    setUploadedFiles(updated)
    localStorage.setItem('customDemoAds', JSON.stringify(updated))
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Content Upload Manager
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Admin authentication required to upload ad content
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Demo Content Manager</h2>
        <p className="text-purple-100">Upload and manage demo ad content for client presentations</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'upload', label: 'Upload Content', icon: Upload },
          { id: 'manage', label: 'Manage Files', icon: Folder }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Current Selection Display */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Current Selection</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Ad Type:</span> {
                      uploadType === 'banner' ? 'Banner Ad (728x90)' :
                      uploadType === 'sidebar' ? 'Sidebar Ad (300x250)' :
                      uploadType === 'video' ? 'Video Ad' : 'Sponsored Content'
                    }
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Accepts: {
                      uploadType === 'banner' || uploadType === 'sidebar' ? 'Images (PNG, JPG, GIF, WebP)' :
                      uploadType === 'video' ? 'Videos (MP4, WebM, MOV, AVI)' : 'Images and Text files'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Boeing, Airbus, Shell"
                  autoComplete="off"
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target URL
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com"
                  autoComplete="off"
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad Type
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="banner">Banner Ad (728x90) - Images</option>
                  <option value="sidebar">Sidebar Ad (300x250) - Images</option>
                  <option value="video">Video Ad - Videos</option>
                  <option value="sponsored">Sponsored Content - Images/Text</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Learn More, Get Started, Shop Now"
                  autoComplete="off"
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Custom Ad Text Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad Headline
                </label>
                <input
                  type="text"
                  value={adHeadline}
                  onChange={(e) => setAdHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Revolutionary Aviation Technology, Sustainable Flight Solutions"
                  autoComplete="off"
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Main headline that will appear on your ad
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad Description
                </label>
                <textarea
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="e.g., Discover cutting-edge solutions that reduce emissions and improve efficiency"
                  autoComplete="off"
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supporting text that describes your product or service
                </p>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                accept={
                  uploadType === 'banner' || uploadType === 'sidebar'
                    ? 'image/jpeg,image/png,image/gif,image/webp,image/jpg'
                    : uploadType === 'video'
                    ? 'video/mp4,video/webm,video/mov,video/avi,video/quicktime'
                    : 'image/*,video/*'
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {uploadType === 'banner' || uploadType === 'sidebar'
                      ? 'Images: PNG, JPG, GIF, WebP up to 10MB'
                      : uploadType === 'video'
                      ? 'Videos: MP4, WebM, MOV, AVI up to 10MB'
                      : 'Images, videos, or text files up to 10MB'
                    }
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Selected: {uploadType === 'banner' ? 'Banner Ad (728x90)' :
                              uploadType === 'sidebar' ? 'Sidebar Ad (300x250)' :
                              uploadType === 'video' ? 'Video Ad' : 'Sponsored Content'}
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Status */}
            <AnimatePresence>
              {uploadStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg flex items-center space-x-3 ${
                    uploadStatus.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : uploadStatus.type === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {uploadStatus.type === 'success' && <Check className="w-5 h-5" />}
                  {uploadStatus.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {uploadStatus.type === 'uploading' && (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{uploadStatus.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-4">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No uploaded files
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload some ad content to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {uploadedFiles.map(file => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(file.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.fileName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {file.company} • {file.type} • {formatFileSize(file.fileSize)}
                      </p>
                      {file.targetUrl && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                          Target: {file.targetUrl}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUpload(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentUploadManager
