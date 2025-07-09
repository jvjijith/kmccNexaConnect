# Blackblaze B2 Integration with Signed URLs

This implementation uses the signed URL approach for file uploads to Blackblaze B2 storage, exactly as requested.

## API Endpoints Used

- `/media/generateSignedUrl` - Generates a pre-signed URL for file upload
- `/media/update/${mediaId}` - Updates media status after successful upload

## Key Features

1. **Signed URL Upload Flow**:
   - Generate signed URL with file metadata
   - Upload file directly to signed URL
   - Update media status to "completed"

2. **File Upload Functions**:
   - `uploadFileWithSignedUrl()` - Single file upload
   - `uploadMultipleFilesWithSignedUrl()` - Multiple files upload
   - `uploadSignature()` - Canvas signature upload

3. **Form Submissions**:
   - `submitMembershipApplication()` - Membership form submission
   - `submitContactForm()` - Contact form submission

4. **File Validation**:
   - `validateFile()` - Single file validation
   - `validateFiles()` - Multiple files validation

5. **Contact Form Popup**:
   - Separate popup component for contact inquiries
   - Integrated with the membership form
   - File upload support with progress tracking

## Usage

The membership form now uses the signed URL approach for all file uploads:
- Photo uploads
- Document uploads  
- Signature uploads (from canvas)

The contact form popup can be opened via the "Contact Us" button in the membership form.

## File Structure

- `apps/web/src/services/api.js` - Main API service layer
- `apps/web/src/components/ContactFormPopup.jsx` - Contact form popup component
- `apps/web/app/membership/page.tsx` - Updated membership form with integration

## Environment Variables

Make sure to set the following environment variables:
- `NEXT_PUBLIC_API_BASE_URL` - Base URL for your API endpoints