import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Input,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { 
  submitContactForm, 
  uploadMultipleFilesWithSignedUrl, 
  validateFiles 
} from '../services/api';

const ContactFormPopup = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    supportDocuments: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const { validFiles, invalidFiles } = validateFiles(files);

    if (invalidFiles.length > 0) {
      setSnackbar({
        open: true,
        message: `${invalidFiles.length} file(s) rejected: ${invalidFiles[0].error}`,
        severity: 'warning'
      });
    }

    if (validFiles.length === 0) return;

    try {
      setLoading(true);
      
      // Upload files using signed URL approach
      const uploadedFiles = await uploadMultipleFilesWithSignedUrl(
        validFiles, 
        'document',
        (fileName, progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileName]: progress
          }));
        }
      );

      const newDocuments = uploadedFiles.map(result => ({
        docuName: result.fileName,
        docuUrl: result.url,
        mediaId: result.mediaId
      }));
      
      setFormData(prev => ({
        ...prev,
        supportDocuments: [...prev.supportDocuments, ...newDocuments]
      }));

      setSnackbar({
        open: true,
        message: `${validFiles.length} file(s) uploaded successfully!`,
        severity: 'success'
      });

      // Clear upload progress
      setUploadProgress({});
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({
        open: true,
        message: 'Upload failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      supportDocuments: prev.supportDocuments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await submitContactForm(formData);
      
      setSnackbar({
        open: true,
        message: 'Contact form submitted successfully!',
        severity: 'success'
      });

      // Reset form and close popup after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          supportDocuments: []
        });
        setErrors({});
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit contact form. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      supportDocuments: []
    });
    setErrors({});
    setUploadProgress({});
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="div">
              Contact Us
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                error={!!errors.subject}
                helperText={errors.subject}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                error={!!errors.message}
                helperText={errors.message}
                required
              />
            </Grid>
            
            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Support Documents (Optional)
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  sx={{ display: 'none' }}
                  id="contact-file-upload"
                  inputProps={{
                    accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx'
                  }}
                />
                <label htmlFor="contact-file-upload">
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Click to upload files or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported formats: JPG, PNG, PDF, DOC (Max 2MB each)
                  </Typography>
                </label>
              </Box>
              
              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <Box key={fileName} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Uploading {fileName}...
                      </Typography>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                  ))}
                </Box>
              )}
              
              {/* Display uploaded files */}
              {formData.supportDocuments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Files:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.supportDocuments.map((doc, index) => (
                      <Chip
                        key={index}
                        label={doc.docuName}
                        onDelete={() => removeDocument(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactFormPopup;