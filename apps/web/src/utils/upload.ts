export interface UploadProgress {
  [fileName: string]: number;
}

export interface UploadResult {
  url: string;
  fileName: string;
}

// Get auth headers with Bearer token
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Upload file with progress tracking using our Blackblaze B2 API
export const uploadFile = async (
  file: File,
  mediaType: 'image' | 'document' | 'signature',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', mediaType);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (onProgress) {
      onProgress(100);
    }

    return {
      url: result.url,
      fileName: file.name
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Upload multiple files
export const uploadFiles = async (
  files: File[],
  mediaType: 'image' | 'document' | 'signature',
  onProgress?: (fileName: string, progress: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (const file of files) {
    try {
      const result = await uploadFile(file, mediaType, (progress) => {
        if (onProgress) {
          onProgress(file.name, progress);
        }
      });
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw error;
    }
  }
  
  return results;
};