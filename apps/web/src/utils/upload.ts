import { generateSignedUrl, updateMediaStatus } from '../data/loader';

export interface UploadProgress {
  [fileName: string]: number;
}

export interface UploadResult {
  url: string;
  mediaId: string;
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

// Upload file with progress tracking
export const uploadFile = async (
  file: File,
  mediaType: 'image' | 'document' | 'signature',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    const fileExtension = file.name.split('.').pop() || '';
    const headers = getAuthHeaders();

    // Step 1: Generate signed URL
    const signedUrlResponse = await generateSignedUrl({
      title: file.name,
      mediaType,
      ext: fileExtension,
      active: true,
      uploadStatus: 'progressing',
      uploadProgress: 0
    }, headers) as any;

    if (!signedUrlResponse?.signedUrl || !signedUrlResponse?.media?._id) {
      throw new Error('Failed to generate signed URL');
    }

    const { signedUrl, media } = signedUrlResponse;
    const mediaId = media._id;

    // Step 2: Upload file to signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    // Step 3: Update media status to completed
    await updateMediaStatus(mediaId, {
      title: file.name,
      mediaType,
      ext: fileExtension,
      active: true,
      uploadStatus: 'completed',
      uploadProgress: 100
    }, headers);

    // Step 4: Return the final URL
    const finalUrl = `https://media.nexalogics.in/${mediaId}.${fileExtension}`;
    
    if (onProgress) {
      onProgress(100);
    }

    return {
      url: finalUrl,
      mediaId,
      fileName: file.name
    };

  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  mediaType: 'image' | 'document' | 'signature',
  onProgress?: (fileName: string, progress: number) => void
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => 
    uploadFile(file, mediaType, (progress) => {
      if (onProgress) {
        onProgress(file.name, progress);
      }
    })
  );

  return Promise.all(uploadPromises);
};

// Convert canvas to blob for signature upload
export const canvasToBlob = (canvas: HTMLCanvasElement, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        throw new Error('Failed to convert canvas to blob');
      }
    }, 'image/png', quality);
  });
};

// Upload signature from canvas
export const uploadSignature = async (
  canvas: HTMLCanvasElement,
  fileName: string = 'signature.png',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], fileName, { type: 'image/png' });
    
    return await uploadFile(file, 'signature', onProgress);
  } catch (error) {
    console.error('Signature upload error:', error);
    throw error;
  }
};