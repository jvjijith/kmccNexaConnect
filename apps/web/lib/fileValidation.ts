// File validation utilities
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}

export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export const validateFile = (file: File, allowedTypes: string[] = FILE_TYPES.ALL): FileValidationResult => {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 2MB limit`
    }
  }

  return { isValid: true }
}

export const validateFiles = (files: File[], allowedTypes: string[] = FILE_TYPES.ALL) => {
  const results = files.map(file => ({
    file,
    validation: validateFile(file, allowedTypes)
  }))

  const validFiles = results.filter(r => r.validation.isValid).map(r => r.file)
  const invalidFiles = results.filter(r => !r.validation.isValid)

  return {
    validFiles,
    invalidFiles: invalidFiles.map(r => ({
      file: r.file,
      error: r.validation.error!
    }))
  }
}