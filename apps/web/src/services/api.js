// API service layer with signed URL approach for Blackblaze B2
const API_BASE_URL =  process.env.NEXT_PUBLIC_BASE_URL || '';

// Get auth headers with Bearer token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Generic API request function
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Generate signed URL for file upload
export const generateSignedUrl = async (payload, headers = {}) => {
  const requestPayload = {
    title: payload.title || payload.fileName,
    mediaType: payload.mediaType,
    ext: payload.title.split('.').pop() || payload.fileName.split('.').pop(),
    active: true,
    uploadStatus: "progressing",
    uploadProgress: 0
  };
console.log('Generating signed URL with payload:', requestPayload);
  return apiRequest(`${API_BASE_URL}/media/generateSignedUrl`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      ...headers,
    },
    body: JSON.stringify(requestPayload),
  });
};

// Update media status after upload
export const updateMediaStatus = async (mediaId, payload, headers = {}) => {
  const requestPayload = {
    mediaType: payload.mediaType || "image",
    ext: payload.title.split('.').pop() || payload.fileName.split('.').pop(),
    title: payload.title || "Sample Image",
    active: true,
    uploadStatus: "completed",
    uploadProgress: 100
  };

  return apiRequest(`${API_BASE_URL}/media/update/${mediaId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      ...headers,
    },
    body: JSON.stringify(requestPayload),
  });
};

// Upload file using signed URL approach
export const uploadFileWithSignedUrl = async (file, mediaType = 'document', onProgress = null) => {
  try {
    // Step 1: Generate signed URL
    const signedUrlPayload = {
      title: file.name,
      mediaType: file.type.startsWith('image/') ? 'image' : mediaType,
      fileName: file.name
    };

    const signedUrlResponse = await generateSignedUrl(signedUrlPayload);
    const { signedUrl, media } = signedUrlResponse;
    const mediaId = media._id;

    // Step 2: Upload file to signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString(),
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    // Step 3: Update media status to completed
    await updateMediaStatus(mediaId, {
      mediaType: file.type.startsWith('image/') ? 'image' : mediaType,
      title: file.name,
      status: 'completed',
      uploadedAt: new Date().toISOString(),
    });

    // Progress callback
    if (onProgress) {
      onProgress(100);
    }

    return {
      url: `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${mediaId}.${file.name.split('.').pop()}`,
      mediaId: mediaId,
      fileName: file.name,
    };
  } catch (error) {
    console.error('Upload with signed URL failed:', error);
    throw error;
  }
};

// Upload multiple files using signed URL approach
export const uploadMultipleFilesWithSignedUrl = async (files, mediaType = 'document', onProgress = null) => {
  const results = [];
  const fileArray = Array.from(files);
  
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    try {
      const result = await uploadFileWithSignedUrl(file, mediaType, (progress) => {
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

// Canvas to Blob conversion
export const canvasToBlob = (canvas, quality = 0.8) => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png', quality);
  });
};

// Upload signature from canvas
export const uploadSignature = async (canvas, fileName = 'signature.png', onProgress = null) => {
  try {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], fileName, { type: 'image/png' });
    return await uploadFileWithSignedUrl(file, 'image', onProgress);
  } catch (error) {
    console.error('Signature upload failed:', error);
    throw error;
  }
};

// Membership application submission
export const submitMembershipApplication = async (formData) => {
  return apiRequest(`${API_BASE_URL}/members`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });
};

// Contact form submission
export const submitContactForm = async (formData) => {
  return apiRequest(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });
};

// Get colors/theme
export const getColors = async () => {
  try {
    return apiRequest(`${API_BASE_URL}/colors`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Failed to fetch colors:', error);
    // Return default colors if API fails
    return {
      primary: '#1976d2',
      secondary: '#dc004e',
    };
  }
};

// File validation
export const validateFile = (file, maxSize = 2 * 1024 * 1024) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only images, PDF, and DOC files are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`
    };
  }

  return { isValid: true };
};

// Validate multiple files
export const validateFiles = (files, maxSize = 2 * 1024 * 1024) => {
  const fileArray = Array.from(files);
  const validFiles = [];
  const invalidFiles = [];

  fileArray.forEach(file => {
    const validation = validateFile(file, maxSize);
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      invalidFiles.push({ file, error: validation.error });
    }
  });

  return { validFiles, invalidFiles };
};

export default {
  generateSignedUrl,
  updateMediaStatus,
  uploadFileWithSignedUrl,
  uploadMultipleFilesWithSignedUrl,
  uploadSignature,
  canvasToBlob,
  submitMembershipApplication,
  submitContactForm,
  getColors,
  validateFile,
  validateFiles,
  getAuthHeaders,
};