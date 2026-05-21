import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FileSharingContainer = styled.div`
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
`;

const UploadButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
`;

const DropZone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#007bff' : '#ddd'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.isDragging ? '#f8f9fa' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #007bff;
    background: #f8f9fa;
  }
`;

const DropZoneText = styled.div`
  color: #666;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const DropZoneIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: white;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
  }
`;

const FileIcon = styled.div<{ fileType: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  background: ${props => {
    switch (props.fileType) {
      case 'pdf': return '#dc3545';
      case 'doc': case 'docx': return '#007bff';
      case 'xls': case 'xlsx': return '#28a745';
      case 'ppt': case 'pptx': return '#fd7e14';
      case 'img': return '#6f42c1';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const FileDetails = styled.div`
  font-size: 0.875rem;
  color: #666;
  display: flex;
  gap: 1rem;
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'danger' ? `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  ` : `
    background: #007bff;
    color: white;
    &:hover { background: #0056b3; }
  `}
`;

const CategoryTabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.25rem;
`;

const CategoryTab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#333' : '#666'};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    color: #333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #007bff;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'materials' | 'assignments' | 'resources';
  url?: string;
}

interface FileSharingProps {
  sessionId: string;
  userId: string;
  userType: 'teacher' | 'learner';
}

const FileSharing: React.FC<FileSharingProps> = ({ sessionId, userId, userType }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeCategory, setActiveCategory] = useState<'materials' | 'assignments' | 'resources'>('materials');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadFiles();
  }, [sessionId, activeCategory]);

  const loadFiles = async () => {
    // Mock data - replace with API call
    const mockFiles: FileData[] = [
      {
        id: '1',
        name: 'Lesson_Plan_Guitar_Basics.pdf',
        size: 1024 * 1024 * 2.5, // 2.5MB
        type: 'pdf',
        uploadedAt: '2024-01-20T10:00:00Z',
        uploadedBy: 'teacher',
        category: 'materials'
      },
      {
        id: '2',
        name: 'Practice_Exercises.docx',
        size: 1024 * 512, // 512KB
        type: 'docx',
        uploadedAt: '2024-01-20T10:15:00Z',
        uploadedBy: 'teacher',
        category: 'assignments'
      },
      {
        id: '3',
        name: 'Chord_Chart.png',
        size: 1024 * 256, // 256KB
        type: 'img',
        uploadedAt: '2024-01-20T10:30:00Z',
        uploadedBy: 'teacher',
        category: 'resources'
      }
    ];
    
    setFiles(mockFiles.filter(file => file.category === activeCategory));
  };

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload
    const file = selectedFiles[0];
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Add file to list
          const newFile: FileData = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: getFileType(file.name),
            uploadedAt: new Date().toISOString(),
            uploadedBy: userType,
            category: activeCategory
          };
          
          setFiles(prev => [newFile, ...prev]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc': case 'docx': return 'doc';
      case 'xls': case 'xlsx': return 'xls';
      case 'ppt': case 'pptx': return 'ppt';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'img';
      default: return 'file';
    }
  };

  const getFileIcon = (fileType: string): string => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'img': return '🖼️';
      default: return '📁';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUploadTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (file: FileData) => {
    // Simulate file download
    alert(`Downloading ${file.name}...`);
  };

  const handleDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const filteredFiles = files.filter(file => file.category === activeCategory);

  return (
    <FileSharingContainer>
      <Header>
        <Title>Files & Materials</Title>
        <UploadButton onClick={() => document.getElementById('file-input')?.click()}>
          📁 Upload File
        </UploadButton>
        <input
          id="file-input"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files)}
          multiple
        />
      </Header>

      <CategoryTabs>
        <CategoryTab 
          active={activeCategory === 'materials'} 
          onClick={() => setActiveCategory('materials')}
        >
          📚 Materials
        </CategoryTab>
        <CategoryTab 
          active={activeCategory === 'assignments'} 
          onClick={() => setActiveCategory('assignments')}
        >
          📝 Assignments
        </CategoryTab>
        <CategoryTab 
          active={activeCategory === 'resources'} 
          onClick={() => setActiveCategory('resources')}
        >
          🔗 Resources
        </CategoryTab>
      </CategoryTabs>

      <DropZone
        isDragging={isDragging}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <DropZoneIcon>📁</DropZoneIcon>
        <DropZoneText>
          Drag & drop files here or click to browse
        </DropZoneText>
        {uploading && (
          <ProgressBar>
            <ProgressFill progress={uploadProgress} />
          </ProgressBar>
        )}
      </DropZone>

      <FileList>
        {filteredFiles.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <div>No {activeCategory} uploaded yet</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#999' }}>
              Upload files to share with your {userType === 'teacher' ? 'student' : 'teacher'}
            </div>
          </EmptyState>
        ) : (
          filteredFiles.map(file => (
            <FileItem key={file.id}>
              <FileIcon fileType={file.type}>
                {getFileIcon(file.type)}
              </FileIcon>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileDetails>
                  <span>{formatFileSize(file.size)}</span>
                  <span>Uploaded {formatUploadTime(file.uploadedAt)}</span>
                  <span>by {file.uploadedBy === userType ? 'you' : file.uploadedBy}</span>
                </FileDetails>
              </FileInfo>
              <FileActions>
                <ActionButton onClick={() => handleDownload(file)}>
                  Download
                </ActionButton>
                {file.uploadedBy === userType && (
                  <ActionButton 
                    variant="danger" 
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </ActionButton>
                )}
              </FileActions>
            </FileItem>
          ))
        )}
      </FileList>
    </FileSharingContainer>
  );
};

export default FileSharing;