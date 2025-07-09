# Blackblaze B2 Configuration

This project uses Blackblaze B2 for file storage. To set up Blackblaze B2 integration:

## 1. Create a Blackblaze B2 Account
- Go to [Blackblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
- Create an account and set up a bucket

## 2. Get Your Credentials
- In your Blackblaze B2 dashboard, go to "App Keys"
- Create a new application key with read/write permissions
- Note down:
  - Application Key ID
  - Application Key
  - Bucket ID
  - Bucket Name

## 3. Update Environment Variables
Update your `apps/web/.env.local` file with your actual Blackblaze B2 credentials:

```env
# Blackblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_actual_application_key_id
B2_APPLICATION_KEY=your_actual_application_key
B2_BUCKET_ID=your_actual_bucket_id
B2_BUCKET_NAME=your_actual_bucket_name
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

## 4. Bucket Configuration
Make sure your bucket is configured with:
- Public read access (if you want files to be publicly accessible)
- CORS settings to allow uploads from your domain

## 5. File Upload Features
The integration supports:
- File size limit: 2MB
- Supported formats: Images (JPEG, PNG), PDF, DOC, DOCX
- Automatic unique filename generation
- Organized folder structure (membership/photos, membership/documents, etc.)

## 6. Testing
After configuration, test the upload functionality in the membership form to ensure files are being uploaded correctly to your Blackblaze B2 bucket.