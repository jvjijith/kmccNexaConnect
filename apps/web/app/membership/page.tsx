"use client"

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

import React, { useState, useCallback, useEffect, useRef, Suspense } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  LinearProgress,
  ThemeProvider,
  Snackbar,
  CircularProgress,
} from "@mui/material"
import {
  CloudUpload,
  Visibility,
  Send,
  AttachFile,
  Phone,
  Close,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Info,
  Delete,
  Email,
  LocationOn,
  Payment,
  Edit,
  Clear,
} from "@mui/icons-material"
import { createDynamicTheme } from "@repo/ui/theme"
import { getColor, submitMembershipApplication, createMemberPayment, updateMembershipApplication } from "../../src/data/loader"
import {
  uploadFileWithSignedUrl,
  uploadMultipleFilesWithSignedUrl,
  uploadSignature,
  canvasToBlob,
  validateFile,
  validateFiles
} from "../../src/services/api"

// JWT decoding utility function
function decodeJWT(token: string) {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Decode the payload (second part)
    const payload = parts[1];

    if (!payload) {
      throw new Error('Invalid JWT payload');
    }

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

    // Decode base64 and parse JSON
    const decodedPayload = JSON.parse(atob(paddedPayload));

    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

interface FormData {
  id?: string
  supportKMCC: boolean | null
  readBylaw: boolean | null
  byLaw: string
  applicationFor: string
  amountTobePaid: number
  firstName: string
  lastName: string
  partnerFirstName: string
  partnerLastName: string
  partnerEmail: string
  partnerDob: string
  partnerMobileNumber: string
  partnerWhatsappNumber: string
  dob: string
  email: string
  address: string
  rejectionNotes: string
  mobileNumber: string
  whatsappNumber: string
  visaStatus: string
  emergencyContactName: string
  emergencyContactMobile: string
  addressInKerala: string
  assemblyName: string
  district: string
  emergencyContactNameKerala: string
  emergencyContactNumberKerala: string
  validTill?: string
  validOn?: string
  IUMLContact: string
  queryType: string
  supportDocuments: Array<{ docuName: string; docuUrl: string }>
  query: string
  queryFullName: string
  queryEmail: string
  queryAddress: string
  queryMobileNumber: string
  customer: string
  iuMLContactName: string
  iuMLContactPosition: string
  iuMLContactNumber: string
  iuMLLocation: string
  photoURL: string
  acceptKmcc: boolean
  shareInfoNorka: boolean
  signatureURL: string
  paymentStatus: string
  memberStatus: string
  stripeId: string
}



interface FormErrors {
  [key: string]: string
}



const initialFormData: FormData = {
  supportKMCC: null,
  readBylaw: null,
  byLaw: "",
  applicationFor: "",
  amountTobePaid: 25, // Default to single membership amount
  firstName: "",
  lastName: "",
  partnerFirstName: "",
  partnerLastName: "",
  partnerEmail: "",
  partnerDob: "",
  partnerMobileNumber: "",
  partnerWhatsappNumber: "",
  dob: "",
  email: "",
  address: "",
  rejectionNotes: "",
  mobileNumber: "",
  whatsappNumber: "",
  visaStatus: "",
  emergencyContactName: "",
  emergencyContactMobile: "",
  addressInKerala: "",
  assemblyName: "",
  district: "",
  emergencyContactNameKerala: "",
  emergencyContactNumberKerala: "",
  IUMLContact: "",
  queryType: "Others",
  supportDocuments: [],
  query: "",
  queryFullName: "",
  queryEmail: "",
  queryAddress: "",
  queryMobileNumber: "",
  customer: "",
  iuMLContactName: "",
  iuMLContactPosition: "",
  iuMLContactNumber: "",
  iuMLLocation: "",
  photoURL: "",
  acceptKmcc: false,
  shareInfoNorka: false,
  signatureURL: "",
  paymentStatus: "unpaid",
  memberStatus: "pending",
  stripeId: "",
}

export default function MembershipApplication({ members }: { members?: FormData }) {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [showBylaw, setShowBylaw] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showQueryDialog, setShowQueryDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [color, setColor] = useState<any>(null)
  const [colorLoading, setColorLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isDrawing, setIsDrawing] = useState(false)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  })
  const [submissionStep, setSubmissionStep] = useState<"idle" | "submitting" | "payment" | "success">("idle")

  // Initialize form data with members prop if provided
  useEffect(() => {
    if (members) {
      setFormData(members)
    }
  }, [members])

  // Color system integration - fetch colors on component mount (exactly like product page)
  useEffect(() => {
    async function fetchColors() {
      try {
        setColorLoading(true)
        const colorData = await getColor("light");
        if (colorData?.theme?.palette?.primary?.main) {
          setColor(colorData);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setColorLoading(false)
      }
    }
    fetchColors();
  }, []);

  // Extract customer information from access token on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = decodeJWT(accessToken);
      if (decodedToken) {
        // Extract customer information from the decoded token
        const customer = decodedToken.customer || decodedToken.sub || decodedToken.user_id || decodedToken.id;
        console.log("Decoded token on mount:", decodedToken);
        console.log("Extracted customer on mount:", customer);

        // Update form data with customer information if available
        if (customer) {
          setFormData(prev => ({
            ...prev,
            customer: customer
          }));
        }
      }
    }
  }, []);

    // Create dynamic steps array based on application type
    const getSteps = () => {
      const allSteps = [
        "Initial Questions",
        "Personal Information",
        "Partner Details",
        "Emergency Contacts",
        "IUML References",
        "Documents & Final",
      ]
  
      // Remove "Partner Details" step for single membership
      if (formData.applicationFor === "single") {
        return allSteps.filter(step => step !== "Partner Details")
      }
  
      return allSteps
    }
  
    const currentSteps = getSteps()

  const bylawText = `Objectives: Melbourne KMCC aims to foster unity among its members, support charitable activities, promote cultural heritage, and assist in the welfare and development of the community. The association organizes social, cultural, and educational events to enrich the lives of its members.

Membership: Open to individuals of Kerala origin, aged 18 and above, residing in Melbourne. Members are categorized as Ordinary, Life, or Honorary. Life Members have permanent status, while membership fees and renewal procedures are clearly defined.

Organizational Structure: KMCC operates under a structured framework that includes the General Body, Executive Committee, Office Bearers, and various subcommittees. The General Body, comprising all members, is the supreme authority, and the Executive Committee manages daily operations.

Note: Once your application is final, we will provide you detailed bylaw via digital means.`

  // New state for better user feedback - already declared above

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value }

        // Update amount based on application type
        if (field === "applicationFor") {
          newData.amountTobePaid = value === "couple" ? 50 : 25
        }

        return newData
      })

      // Show query dialog immediately when user selects "No" for supportKMCC
      if (field === "supportKMCC" && value === false) {
        setTimeout(() => {
          setShowQueryDialog(true)
        }, 100) // Small delay to ensure state is updated
      }

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [errors],
  )



  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)

    // Validate files using the API service
    const validationResult = validateFiles(fileArray, 2 * 1024 * 1024) // 2MB
    if (validationResult.invalidFiles.length > 0) {
      const errorMessages = validationResult.invalidFiles.map(item => item.error)
      setSnackbar({
        open: true,
        message: errorMessages.join(', '),
        severity: "error"
      })
      return
    }

    try {
      setLoading(true)

      // Upload files using signed URL approach
      const uploadPromises = validationResult.validFiles.map(async (file, index) => {
        const progressKey = `file_${Date.now()}_${index}`

        const onProgress = (progress: number) => {
          setUploadProgress(prev => ({
            ...prev,
            [progressKey]: progress
          }))
        }

        try {
          const uploadResult = await uploadFileWithSignedUrl(file, 'doc', onProgress as any)

          // Clean up progress tracking
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[progressKey]
            return newProgress
          })

          return {
            docuName: file.name,
            docuUrl: uploadResult.url
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          setSnackbar({
            open: true,
            message: `Failed to upload ${file.name}`,
            severity: "error"
          })
          return null
        }
      })

      const uploadResults = await Promise.all(uploadPromises)
      const successfulUploads = uploadResults.filter(result => result !== null)

      setFormData((prev) => ({
        ...prev,
        supportDocuments: [...prev.supportDocuments, ...successfulUploads],
      }))

      if (successfulUploads.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully uploaded ${successfulUploads.length} file(s)`,
          severity: "success"
        })
      }
    } catch (error) {
      console.error('File upload error:', error)
      setSnackbar({
        open: true,
        message: "File upload failed. Please try again.",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const removeDocument = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      supportDocuments: prev.supportDocuments.filter((_, i) => i !== index),
    }))
  }, [])

  // Handle photo upload
  const handlePhotoUpload = useCallback(async (file: File) => {
    const validationResult = validateFile(file, 2 * 1024 * 1024)
    if (!validationResult.isValid) {
      setSnackbar({
        open: true,
        message: validationResult.error || "Invalid photo file",
        severity: "error"
      })
      return
    }

    try {
      setLoading(true)
      const onProgress = (progress: number) => {
        setUploadProgress(prev => ({
          ...prev,
          photo: progress
        }))
      }

      const uploadResult = await uploadFileWithSignedUrl(file, 'image', onProgress as any)

      setFormData((prev) => ({
        ...prev,
        photoURL: uploadResult.url
      }))

      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress.photo
        return newProgress
      })

      setSnackbar({
        open: true,
        message: "Photo uploaded successfully",
        severity: "success"
      })
    } catch (error) {
      console.error('Photo upload error:', error)
      setSnackbar({
        open: true,
        message: "Photo upload failed. Please try again.",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Signature canvas functionality
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
    }
  }, [])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }, [isDrawing])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setSignatureDataUrl("")
  }, [])

  const saveSignature = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      setLoading(true)

      const onProgress = (progress: number) => {
        setUploadProgress(prev => ({
          ...prev,
          signature: progress
        }))
      }

      const uploadResult = await uploadSignature(canvas, 'signature.png', onProgress as any)

      setFormData((prev) => ({
        ...prev,
        signatureURL: uploadResult.url
      }))

      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress.signature
        return newProgress
      })

      setSignatureDataUrl(canvas.toDataURL())
      setShowSignatureDialog(false)

      setSnackbar({
        open: true,
        message: "Signature saved successfully",
        severity: "success"
      })
    } catch (error) {
      console.error('Signature upload error:', error)
      setSnackbar({
        open: true,
        message: "Failed to save signature. Please try again.",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle signature file upload as alternative
  const handleSignatureFileUpload = useCallback(async (file: File) => {
    const validationResult = validateFile(file, 2 * 1024 * 1024)
    if (!validationResult.isValid) {
      setSnackbar({
        open: true,
        message: validationResult.error || "Invalid signature file",
        severity: "error"
      })
      return
    }

    try {
      setLoading(true)
      const onProgress = (progress: number) => {
        setUploadProgress(prev => ({
          ...prev,
          signature: progress
        }))
      }

      const uploadResult = await uploadFileWithSignedUrl(file, 'image', onProgress as any)

      setFormData((prev) => ({
        ...prev,
        signatureURL: uploadResult.url
      }))

      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress.signature
        return newProgress
      })

      setSnackbar({
        open: true,
        message: "Signature uploaded successfully",
        severity: "success"
      })
    } catch (error) {
      console.error('Signature upload error:', error)
      setSnackbar({
        open: true,
        message: "Signature upload failed. Please try again.",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Snackbar handler
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    const currentSteps = getSteps()
    const stepName = currentSteps[step]

    switch (stepName) {
      case "Initial Questions":
        if (formData.supportKMCC === null) newErrors.supportKMCC = "This field is required"
        if (formData.readBylaw === null) newErrors.readBylaw = "This field is required"
        if (!formData.applicationFor) newErrors.applicationFor = "This field is required"
        break
      case "Personal Information":
        if (!formData.firstName) newErrors.firstName = "First name is required"
        if (!formData.lastName) newErrors.lastName = "Last name is required"
        if (!formData.dob) newErrors.dob = "Date of birth is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.address) newErrors.address = "Address is required"
        if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required"
        if (!formData.whatsappNumber) newErrors.whatsappNumber = "WhatsApp number is required"
        if (!formData.visaStatus) newErrors.visaStatus = "Visa status is required"
        break
      case "Partner Details":
        // Partner details validation - only appears for couple membership
        if (!formData.partnerFirstName) newErrors.partnerFirstName = "Partner first name is required"
        if (!formData.partnerLastName) newErrors.partnerLastName = "Partner last name is required"
        if (!formData.partnerDob) newErrors.partnerDob = "Partner date of birth is required"
        if (!formData.partnerEmail) newErrors.partnerEmail = "Partner email is required"
        if (!formData.partnerMobileNumber) newErrors.partnerMobileNumber = "Partner mobile number is required"
        if (!formData.partnerWhatsappNumber) newErrors.partnerWhatsappNumber = "Partner WhatsApp number is required"
        break
      case "Emergency Contacts":
        if (!formData.emergencyContactName) newErrors.emergencyContactName = "Emergency contact name is required"
        if (!formData.emergencyContactMobile) newErrors.emergencyContactMobile = "Emergency contact mobile is required"
        if (!formData.addressInKerala) newErrors.addressInKerala = "Kerala address is required"
        if (!formData.assemblyName) newErrors.assemblyName = "Assembly name is required"
        if (!formData.district) newErrors.district = "District is required"
        if (!formData.emergencyContactNameKerala)
          newErrors.emergencyContactNameKerala = "Kerala emergency contact name is required"
        if (!formData.emergencyContactNumberKerala)
          newErrors.emergencyContactNumberKerala = "Kerala emergency contact mobile is required"
        break
      case "IUML References":
        if (!formData.IUMLContact) newErrors.IUMLContact = "IUML contact selection is required"
        if (formData.IUMLContact && formData.IUMLContact !== "Not able to provide any") {
          if (!formData.iuMLContactName) newErrors.iuMLContactName = "Contact name is required"
          if (!formData.iuMLContactPosition) newErrors.iuMLContactPosition = "Contact position is required"
          if (!formData.iuMLLocation) newErrors.iuMLLocation = "Contact location is required"
          if (!formData.iuMLContactNumber) newErrors.iuMLContactNumber = "Contact phone number is required"
        }
        break
      case "Documents & Final":
        if (!formData.acceptKmcc) newErrors.acceptKmcc = "You must accept the terms"
        if (formData.shareInfoNorka === null) newErrors.shareInfoNorka = "This field is required"
        if (!formData.signatureURL) newErrors.signatureURL = "Digital signature is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    // If we're on step 0 and supportKMCC is false, show query dialog instead of proceeding
    if (activeStep === 0 && formData.supportKMCC === false) {
      setShowQueryDialog(true)
      return
    }

    if (validateStep(activeStep)) {
      const currentSteps = getSteps()
      const nextStep = activeStep + 1

      // Check if we have a next step
      if (nextStep < currentSteps.length) {
        setActiveStep(nextStep)
      }
    }
  }

  const handleBack = () => {
    const prevStep = activeStep - 1

    if (prevStep >= 0) {
      setActiveStep(prevStep)
    }
  }

  // Handle query submission when supportKMCC is false
  const handleQuerySubmit = async () => {
    setLoading(true)

    try {
      // Prepare query data
      const queryData = {
        queryType: formData.queryType,
        query: formData.query,
        queryFullName: formData.queryFullName,
        queryEmail: formData.queryEmail,
        queryAddress: formData.queryAddress,
        queryMobileNumber: formData.queryMobileNumber,
        customer: formData.customer
      }

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Submit query (using the same API endpoint but with query-only data)
      const queryResponse = accessToken
        ? await submitMembershipApplication(queryData, {
            "Authorization": `Bearer ${accessToken}`
          })
        : await submitMembershipApplication(queryData)

      setSnackbar({
        open: true,
        message: "Your query has been received and KMCC will contact you!",
        severity: "success"
      })

      setShowQueryDialog(false)

      // Redirect to home page after successful query submission
      setTimeout(() => {
        router.push("/home")
      }, 2000)

    } catch (error) {
      console.error("Query submission error:", error)
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Error submitting query. Please try again.",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Check if supportKMCC is false, show query dialog instead
    if (formData.supportKMCC === false) {
      setShowQueryDialog(true)
      return
    }

    setLoading(true)
    setSubmissionStep("submitting")

    try {
      // Prepare the data according to the API format
      const membershipData = {
        ...(members?.id && { id: members.id }), // Include ID if updating existing member
        supportKMCC: formData.supportKMCC,
        readBylaw: formData.readBylaw,
        byLaw: formData.byLaw,
        applicationFor: formData.applicationFor,
        amountTobePaid: formData.amountTobePaid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        partnerFirstName: formData.partnerFirstName,
        partnerLastName: formData.partnerLastName,
        partnerEmail: formData.partnerEmail,
        partnerDob: formData.partnerDob,
        partnerMobileNumber: formData.partnerMobileNumber,
        partnerWhatsappNumber: formData.partnerWhatsappNumber,
        dob: formData.dob,
        email: formData.email,
        address: formData.address,
        rejectionNotes: formData.rejectionNotes,
        mobileNumber: formData.mobileNumber,
        whatsappNumber: formData.whatsappNumber,
        visaStatus: formData.visaStatus,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactMobile: formData.emergencyContactMobile,
        addressInKerala: formData.addressInKerala,
        assemblyName: formData.assemblyName,
        district: formData.district,
        emergencyContactNameKerala: formData.emergencyContactNameKerala,
        emergencyContactNumberKerala: formData.emergencyContactNumberKerala,
        IUMLContact: formData.IUMLContact,
        queryType: formData.queryType,
        supportDocuments: formData.supportDocuments,
        query: formData.query,
        queryFullName: formData.queryFullName,
        queryEmail: formData.queryEmail,
        queryAddress: formData.queryAddress,
        queryMobileNumber: formData.queryMobileNumber,
        customer: formData.customer,
        iuMLContactName: formData.iuMLContactName,
        iuMLContactPosition: formData.iuMLContactPosition,
        iuMLContactNumber: formData.iuMLContactNumber,
        iuMLLocation: formData.iuMLLocation,
        photoURL: formData.photoURL,
        acceptKmcc: formData.acceptKmcc,
        shareInfoNorka: formData.shareInfoNorka,
        signatureURL: formData.signatureURL,
        paymentStatus: formData.paymentStatus,
        memberStatus: formData.memberStatus,
        stripeId: formData.stripeId || ""
      }

      console.log("membershipData", membershipData);

      // Get access token from localStorage and decode it to get customer info
      const accessToken = localStorage.getItem("accessToken");
      let customer = null;

      if (accessToken) {
        const decodedToken = decodeJWT(accessToken);
        if (decodedToken) {
          // Extract customer information from the decoded token
          customer = decodedToken.customer || decodedToken.sub || decodedToken.user_id || decodedToken.id;
          console.log("Decoded token:", decodedToken);
          console.log("Extracted customer:", customer);

          // Update membershipData with customer information if available
          if (customer) {
            membershipData.customer = customer;
          }
        }
      }

      // Submit membership application or update existing member
      const membershipResponse = members?.id
        ? accessToken
          ? await updateMembershipApplication(membershipData, {
              "Authorization": `Bearer ${accessToken}`
            })
          : await updateMembershipApplication(membershipData)
        : accessToken
        ? await submitMembershipApplication(membershipData, {
            "Authorization": `Bearer ${accessToken}`
          })
        : await submitMembershipApplication(membershipData)

      setSnackbar({
        open: true,
        message: members?.id
          ? "Membership information updated successfully!"
          : "Membership application submitted successfully!",
        severity: "success"
      })

      setSubmissionStep("success")

      // Redirect to home page after successful submission
      setTimeout(() => {
        router.push("/home")
      }, 2000) // Wait 2 seconds to show the success message before redirecting)

    } catch (error) {
      console.error("Submission error:", error)
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Error submitting application. Please try again.",
        severity: "error"
      })
      setSubmissionStep("idle")
    } finally {
      setLoading(false)
    }
  }





  const renderStep1 = () => (
    <Card elevation={3} sx={{ mb: { xs: 2, sm: 4 } }}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600
          }}>
            Initial Questions
          </Typography>
        }
        subheader="Please answer these preliminary questions to begin your application"
        sx={{ pb: { xs: 1, sm: 2 } }}
      />
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <FormControl component="fieldset" error={!!errors.supportKMCC}>
            <FormLabel component="legend" required sx={{ mb: 2, fontWeight: 500 }}>
              Are you ready to support the procedure of IUML and KMCC and act according to the ideals of the
              Constitution of IUML and KMCC?
            </FormLabel>
            <RadioGroup
              value={formData.supportKMCC?.toString() || ""}
              onChange={(e) => handleInputChange("supportKMCC", e.target.value === "true")}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes, I am ready to support" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.supportKMCC && <FormHelperText>{errors.supportKMCC}</FormHelperText>}
          </FormControl>

          <FormControl component="fieldset" error={!!errors.readBylaw}>
            <FormLabel component="legend" required sx={{ mb: 2, fontWeight: 500 }}>
              Would you like to read the Melbourne KMCC ByLaw overview?
            </FormLabel>
            <RadioGroup
              value={formData.readBylaw?.toString() || ""}
              onChange={(e) => {
                const boolValue = e.target.value === "true"
                handleInputChange("readBylaw", boolValue)
                setShowBylaw(boolValue)
                // if (boolValue) {
                  handleInputChange("byLaw", bylawText)
                // }
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes, show me the bylaw overview" />
              <FormControlLabel value="false" control={<Radio />} label="No, I'll read it later" />
            </RadioGroup>
            {errors.readBylaw && <FormHelperText>{errors.readBylaw}</FormHelperText>}
          </FormControl>

          {showBylaw && (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                bgcolor: "primary.light",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Info color="primary" />
                Melbourne KMCC ByLaw Overview
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {bylawText}
              </Typography>
            </Paper>
          )}

          <FormControl fullWidth required error={!!errors.applicationFor}>
            <InputLabel>Application For</InputLabel>
            <Select
              value={formData.applicationFor}
              label="Application For"
              onChange={(e) => handleInputChange("applicationFor", e.target.value)}
            >
              <MenuItem value="single">Single Membership</MenuItem>
              <MenuItem value="couple">Couple Membership</MenuItem>
            </Select>
            {errors.applicationFor && <FormHelperText>{errors.applicationFor}</FormHelperText>}
          </FormControl>

          <Alert
            severity="info"
            icon={<CheckCircle color="primary" />}
            sx={{
              borderRadius: 2,
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Membership Fee Information
                </Typography>
                <Typography variant="body2">
                  The amount to be paid is for a two-year period upon approval of your application
                  {formData.applicationFor === "couple" ? " (Couple Membership)" : formData.applicationFor === "single" ? " (Single Membership)" : ""}
                </Typography>
              </Box>
              <Chip
                label={`$${formData.amountTobePaid} AUD`}
                color="success"
                size="medium"
                sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
              />
            </Box>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" color="primary">
            Personal Information
          </Typography>
        }
        subheader="Please provide your personal details accurately"
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type="date"
              label="Date of Birth"
              InputLabelProps={{ shrink: true }}
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>
          <Grid item xs={12}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
            }}
          />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Address in Australia (Victoria)"
              placeholder="Street Address, City, State, Postal Code, Country"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              InputProps={{
                startAdornment: <LocationOn  sx={{ mr: 1, color: "primary.main", alignSelf: "flex-start", mt: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Mobile Number (Australia)"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="WhatsApp Number"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
              error={!!errors.whatsappNumber}
              helperText={errors.whatsappNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.visaStatus}>
              <InputLabel>Visa Status</InputLabel>
              <Select
                value={formData.visaStatus}
                label="Visa Status"
                onChange={(e) => handleInputChange("visaStatus", e.target.value)}
              >
                <MenuItem value="Permanent Resident">Permanent Resident</MenuItem>
                <MenuItem value="Citizen">Australian Citizen</MenuItem>
                <MenuItem value="Job">Work Visa</MenuItem>
                <MenuItem value="Student">Student Visa</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.visaStatus && <FormHelperText>{errors.visaStatus}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" color="primary">
            Partner Details
          </Typography>
        }
        subheader={
          formData.applicationFor === "couple"
            ? "Please provide your partner's details (Required for couple membership)"
            : "Partner details (Optional for single membership)"
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Partner First Name"
              value={formData.partnerFirstName}
              onChange={(e) => handleInputChange("partnerFirstName", e.target.value)}
              required={formData.applicationFor === "couple"}
              error={!!errors.partnerFirstName}
              helperText={errors.partnerFirstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Partner Last Name"
              value={formData.partnerLastName}
              onChange={(e) => handleInputChange("partnerLastName", e.target.value)}
              required={formData.applicationFor === "couple"}
              error={!!errors.partnerLastName}
              helperText={errors.partnerLastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Partner Date of Birth"
              InputLabelProps={{ shrink: true }}
              value={formData.partnerDob}
              onChange={(e) => handleInputChange("partnerDob", e.target.value)}
              required={formData.applicationFor === "couple"}
              error={!!errors.partnerDob}
              helperText={errors.partnerDob}
            />
          </Grid>
          <Grid item xs={12}>
          <TextField
            fullWidth
            type="email"
            label="Partner Email"
            value={formData.partnerEmail}
            onChange={(e) => handleInputChange("partnerEmail", e.target.value)}
            required={formData.applicationFor === "couple"}
            error={!!errors.partnerEmail}
            helperText={errors.partnerEmail}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Partner Mobile Number"
            value={formData.partnerMobileNumber}
            onChange={(e) => handleInputChange("partnerMobileNumber", e.target.value)}
            required={formData.applicationFor === "couple"}
            error={!!errors.partnerMobileNumber}
            helperText={errors.partnerMobileNumber}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Partner WhatsApp Number"
              value={formData.partnerWhatsappNumber}
              onChange={(e) => handleInputChange("partnerWhatsappNumber", e.target.value)}
              required={formData.applicationFor === "couple"}
              error={!!errors.partnerWhatsappNumber}
              helperText={errors.partnerWhatsappNumber}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" color="primary">
            Emergency Contacts & Kerala Details
          </Typography>
        }
        subheader="Please provide emergency contact information for both Australia and Kerala"
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Emergency Contact in Australia
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Emergency Contact Name in Australia"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
              error={!!errors.emergencyContactName}
              helperText={errors.emergencyContactName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Emergency Contact Mobile in Australia"
            value={formData.emergencyContactMobile}
            onChange={(e) => handleInputChange("emergencyContactMobile", e.target.value)}
            error={!!errors.emergencyContactMobile}
            helperText={errors.emergencyContactMobile}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
            }}
          />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Kerala Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={3}
            label="Address in Kerala"
            placeholder="Street Address, City, State, Zip Code, Country"
            value={formData.addressInKerala}
            onChange={(e) => handleInputChange("addressInKerala", e.target.value)}
            error={!!errors.addressInKerala}
            helperText={errors.addressInKerala}
            InputProps={{
              startAdornment: <LocationOn sx={{ mr: 1, color: "primary.main", alignSelf: "flex-start", mt: 1 }} />, // Changed from "action.active"
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Name of Your Assembly"
              value={formData.assemblyName}
              onChange={(e) => handleInputChange("assemblyName", e.target.value)}
              error={!!errors.assemblyName}
              helperText={errors.assemblyName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="District"
              value={formData.district}
              onChange={(e) => handleInputChange("district", e.target.value)}
              error={!!errors.district}
              helperText={errors.district}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Emergency Contact Name in Kerala"
              value={formData.emergencyContactNameKerala}
              onChange={(e) => handleInputChange("emergencyContactNameKerala", e.target.value)}
              error={!!errors.emergencyContactNameKerala}
              helperText={errors.emergencyContactNameKerala}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Emergency Contact Mobile in Kerala"
            value={formData.emergencyContactNumberKerala}
            onChange={(e) => handleInputChange("emergencyContactNumberKerala", e.target.value)}
            error={!!errors.emergencyContactNumberKerala}
            helperText={errors.emergencyContactNumberKerala}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
            }}
          />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Emergency Contact Mobile in Kerala"
              value={formData.emergencyContactNumberKerala}
              onChange={(e) => handleInputChange("emergencyContactNumberKerala", e.target.value)}
              error={!!errors.emergencyContactNumberKerala}
              helperText={errors.emergencyContactNumberKerala}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  )

  const renderStep5 = () => (
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" color="primary">
            IUML Contact References
          </Typography>
        }
        subheader="Please provide IUML contact references for verification purposes"
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl fullWidth required error={!!errors.IUMLContact}>
            <InputLabel>Choose one option IUML contact who we can contact for your reference check</InputLabel>
            <Select
              value={formData.IUMLContact}
              label="Choose one option IUML contact who we can contact for your reference check"
              onChange={(e) => handleInputChange("IUMLContact", e.target.value)}
            >
              <MenuItem value="Panachayath office Bears">Panchayath Office Bears</MenuItem>
              <MenuItem value="Mandalam Office Bears">Mandalam Office Bears</MenuItem>
              <MenuItem value="District Office Bears">District Office Bears</MenuItem>
              <MenuItem value="State office Bears">State Office Bears</MenuItem>
              <MenuItem value="Any KMCC Officer Bears in World other than Australia">
                Any KMCC Officer Bears in World other than Australia
              </MenuItem>
              <MenuItem value="Not able to provide any">Not able to provide any</MenuItem>
            </Select>
            {errors.IUMLContact && <FormHelperText>{errors.IUMLContact}</FormHelperText>}
          </FormControl>

          {formData.IUMLContact && formData.IUMLContact !== "Not able to provide any" && (
            <Paper elevation={2} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Contact Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Name of Contact"
                    value={formData.iuMLContactName}
                    onChange={(e) => handleInputChange("iuMLContactName", e.target.value)}
                    error={!!errors.iuMLContactName}
                    helperText={errors.iuMLContactName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Position"
                    value={formData.iuMLContactPosition}
                    onChange={(e) => handleInputChange("iuMLContactPosition", e.target.value)}
                    error={!!errors.iuMLContactPosition}
                    helperText={errors.iuMLContactPosition}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Where"
                    value={formData.iuMLLocation}
                    onChange={(e) => handleInputChange("iuMLLocation", e.target.value)}
                    error={!!errors.iuMLLocation}
                    helperText={errors.iuMLLocation}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  value={formData.iuMLContactNumber}
                  onChange={(e) => handleInputChange("iuMLContactNumber", e.target.value)}
                  error={!!errors.iuMLContactNumber}
                  helperText={errors.iuMLContactNumber}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />, // Changed from "action.active"
                  }}
                />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </CardContent>
    </Card>
  )

  const renderStep6 = () => (
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" color="primary">
            Documents & Final Details
          </Typography>
        }
        subheader="Upload your photo, documents and provide final information"
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Your Photo
            </Typography>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                border: "2px dashed",
                borderColor: "primary.main",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "primary.light",
                  color: "white",
                },
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handlePhotoUpload(file)
                  }
                }}
              />
              <label htmlFor="photo-upload" style={{ cursor: "pointer", display: "block" }}>
                <CloudUpload color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2">PNG, JPG, JPEG up to 2MB</Typography>
              </label>
            </Paper>
            {formData.photoURL && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Chip label="Photo uploaded successfully" color="success" icon={<CheckCircle color="primary" />} />
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Support Documents
            </Typography>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                border: "2px dashed",
                borderColor: "secondary.main",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "secondary.dark",
                  bgcolor: "secondary.light",
                  color: "white",
                },
              }}
            >
              <input
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                id="doc-upload"
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <label htmlFor="doc-upload" style={{ cursor: "pointer", display: "block" }}>
                <AttachFile color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Click to upload documents
                </Typography>
                <Typography variant="body2">PDF, PNG, JPG, JPEG up to 2MB per file</Typography>
              </label>
            </Paper>
            {formData.supportDocuments.length > 0 && (
              <List dense sx={{ mt: 2 }}>
                {formData.supportDocuments.map((doc, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 1,
                      mb: 1,
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    <ListItemIcon>
                      <AttachFile color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={doc.docuName} />
                    <IconButton edge="end" onClick={() => removeDocument(index)} size="small" color="error">
                      <Delete color="error" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptKmcc}
                onChange={(e) => handleInputChange("acceptKmcc", e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I hereby give Melbourne KMCC Inc (Melbourne KMCC Australia) permission to use my personal information
                provided for the purpose of internal use including conducting a reference check *
              </Typography>
            }
            sx={{ alignItems: "flex-start" }}
          />
          {errors.acceptKmcc && (
            <Typography variant="body2" color="error" sx={{ mt: -2, ml: 4 }}>
              {errors.acceptKmcc}
            </Typography>
          )}

          <FormControl component="fieldset" required error={!!errors.shareInfoNorka}>
            <FormLabel component="legend" sx={{ fontWeight: 500 }}>
              Do you give permission to share your personal information with NORKA ROOTS / Loka Kerala Sabha?
            </FormLabel>
            <RadioGroup
              value={formData.shareInfoNorka.toString()}
              onChange={(e) => handleInputChange("shareInfoNorka", e.target.value === "true")}
              sx={{ mt: 1 }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes, I give permission" />
              <FormControlLabel value="false" control={<Radio />} label="No, I do not give permission" />
            </RadioGroup>
            {errors.shareInfoNorka && <FormHelperText>{errors.shareInfoNorka}</FormHelperText>}
          </FormControl>

          {/* Signature Section - Direct Canvas Integration */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Digital Signature *
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please draw your signature in the box below or upload an image
            </Typography>

            {/* Canvas for drawing signature */}
            <Box sx={{ mb: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  textAlign: 'center',
                  bgcolor: 'grey.50'
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Draw your signature below:
                </Typography>
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'crosshair',
                    backgroundColor: 'white',
                    maxWidth: '100%'
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    size="small"
                    onClick={clearSignature}
                    variant="outlined"
                    startIcon={<Clear color="primary" />}
                  >
                    Clear
                  </Button>
                  <Button
                    size="small"
                    onClick={saveSignature}
                    variant="contained"
                    startIcon={<CheckCircle color="primary" />}
                    disabled={loading}
                  >
                    Save Signature
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Alternative: Upload signature */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
              Or upload a signature image:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="signature-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleSignatureFileUpload(file)
                  }
                }}
              />
              <label htmlFor="signature-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Upload Signature
                </Button>
              </label>
            </Box>

            {uploadProgress.signature && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Processing signature... {Math.round(uploadProgress.signature)}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress.signature} />
              </Box>
            )}

            {formData.signatureURL && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Chip
                  label="Signature saved successfully"
                  color="success"
                  icon={<CheckCircle color="primary" />}
                  onDelete={() => handleInputChange("signatureURL", "")}
                  deleteIcon={<Clear color="primary" />}
                />
              </Box>
            )}

            {errors.signatureURL && (
              <FormHelperText error>{errors.signatureURL}</FormHelperText>
            )}
          </Box>

         


          <Paper elevation={2} sx={{ p: 3, bgcolor: "info.light", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="info.contrastText">
              Data Collection Terms and Conditions
            </Typography>
            <Typography variant="body2" component="div" color="info.contrastText">
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>We follow standard data collection guidelines for organisations as mentioned in OAIC guide.</li>
                <li>We will use the data collected strictly for office purpose.</li>
                <li>
                  If you check YES to give permission to share your personal information with NORKA ROOTS / Loka Kerala
                  Sabha, we will be sharing your details with the authorities.
                </li>
                <li>
                  The NORKA ROOTS and Loka Kerala Sabha body have contacted KMCC as they are collecting data of overseas
                  Malayalees.
                </li>
                <li>
                  All the data collected will be securely stored and operated in our cloud partner environment and won't
                  be shared without your consent.
                </li>
              </Box>
            </Typography>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  )

  const renderPreview = () => (
    <Card elevation={3} sx={{ mt: { xs: 2, sm: 4 } }}> 
      <CardHeader
        title={
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            color="primary"
          >
            <Visibility color="primary" />
            Application Preview
          </Typography>
        }
        subheader="Please review your application carefully before submission"
      />
      <CardContent>
        {/* Basic Information Section */}
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2, mb: 2 }}>
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Support KMCC
              </Typography>
              <Typography variant="body2">{formData.supportKMCC ? "Yes" : "No"}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Read Bylaw
              </Typography>
              <Typography variant="body2">{formData.readBylaw ? "Yes" : "No"}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Application Type
              </Typography>
              <Typography variant="body2">{formData.applicationFor}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Amount to be Paid
              </Typography>
              <Typography variant="body2">${formData.amountTobePaid}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Personal Information Section */}
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                First Name
              </Typography>
              <Typography variant="body2">{formData.firstName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Last Name
              </Typography>
              <Typography variant="body2">{formData.lastName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Date of Birth
              </Typography>
              <Typography variant="body2">{formData.dob}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body2">{formData.email}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Mobile Number
              </Typography>
              <Typography variant="body2">{formData.mobileNumber}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                WhatsApp Number
              </Typography>
              <Typography variant="body2">{formData.whatsappNumber}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Address
              </Typography>
              <Typography variant="body2">{formData.address}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Visa Status
              </Typography>
              <Typography variant="body2">{formData.visaStatus}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Partner Details Section */}
        {(formData.partnerFirstName || formData.partnerLastName || formData.partnerEmail) && (
          <>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Partner Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Partner First Name
                  </Typography>
                  <Typography variant="body2">{formData.partnerFirstName}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Partner Last Name
                  </Typography>
                  <Typography variant="body2">{formData.partnerLastName}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Partner Email
                  </Typography>
                  <Typography variant="body2">{formData.partnerEmail}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Partner Date of Birth
                  </Typography>
                  <Typography variant="body2">{formData.partnerDob}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Partner Mobile Number
                  </Typography>
                  <Typography variant="body2">{formData.partnerMobileNumber}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Partner WhatsApp Number
                  </Typography>
                  <Typography variant="body2">{formData.partnerWhatsappNumber}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Emergency Contacts Section */}
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Emergency Contacts
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Emergency Contact Name
              </Typography>
              <Typography variant="body2">{formData.emergencyContactName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Emergency Contact Mobile
              </Typography>
              <Typography variant="body2">{formData.emergencyContactMobile}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Address in Kerala
              </Typography>
              <Typography variant="body2">{formData.addressInKerala}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Assembly Name
              </Typography>
              <Typography variant="body2">{formData.assemblyName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                District
              </Typography>
              <Typography variant="body2">{formData.district}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Emergency Contact Name (Kerala)
              </Typography>
              <Typography variant="body2">{formData.emergencyContactNameKerala}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Emergency Contact Number (Kerala)
              </Typography>
              <Typography variant="body2">{formData.emergencyContactNumberKerala}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* IUML References Section */}
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
          IUML References
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                IUML Contact
              </Typography>
              <Typography variant="body2">{formData.IUMLContact}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                IUML Contact Name
              </Typography>
              <Typography variant="body2">{formData.iuMLContactName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                IUML Contact Position
              </Typography>
              <Typography variant="body2">{formData.iuMLContactPosition}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                IUML Contact Number
              </Typography>
              <Typography variant="body2">{formData.iuMLContactNumber}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                IUML Location
              </Typography>
              <Typography variant="body2">{formData.iuMLLocation}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Contact Information for Queries Section - Only show if IUML Contact References is not able to provide any */}
        {formData.IUMLContact === "not able to provide any" && (
          <>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Contact Information for Queries
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Query Type
                  </Typography>
                  <Typography variant="body2">{formData.queryType}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Query
                  </Typography>
                  <Typography variant="body2">{formData.query}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Query Full Name
                  </Typography>
                  <Typography variant="body2">{formData.queryFullName}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Query Email
                  </Typography>
                  <Typography variant="body2">{formData.queryEmail}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Query Address
                  </Typography>
                  <Typography variant="body2">{formData.queryAddress}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Query Mobile Number
                  </Typography>
                  <Typography variant="body2">{formData.queryMobileNumber}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Documents & Final Section */}
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Documents & Final
        </Typography>
        <Grid container spacing={3}>
          {formData.supportDocuments.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Support Documents
                </Typography>
                {formData.supportDocuments.map((doc, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {doc.docuName}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          )}
          {formData.photoURL && (
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Photo
                </Typography>
                <Typography variant="body2">Photo uploaded</Typography>
              </Paper>
            </Grid>
          )}
          {formData.signatureURL && (
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Signature
                </Typography>
                <Typography variant="body2">Signature provided</Typography>
              </Paper>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Accept KMCC
              </Typography>
              <Typography variant="body2">{formData.acceptKmcc ? "Yes" : "No"}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Share with NORKA
              </Typography>
              <Typography variant="body2">{formData.shareInfoNorka ? "Yes" : "No"}</Typography>
            </Paper>
          </Grid>
          {formData.customer && (
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Customer ID
                </Typography>
                <Typography variant="body2">{formData.customer}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "center", flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            onClick={() => setShowPreview(false)}
            size="large"
            startIcon={<NavigateBefore color="primary" />}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '8px 16px', sm: '10px 22px' },
              minWidth: { xs: '100%', sm: 'auto' }
            }}
          >
            Edit Application
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> :
              submissionStep === "payment" ? <Payment color="primary" /> : <Send color="primary" />
            }
            size="large"
            disabled={loading}
            sx={{
              minWidth: { xs: '100%', sm: 200 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '8px 16px', sm: '10px 22px' },
              '& .MuiCircularProgress-root': {
                marginRight: 1
              }
            }}
          >
            {loading ? (
              submissionStep === "submitting" ? "Submitting Application..." :
              submissionStep === "payment" ? "Setting up Payment..." :
              "Processing..."
            ) : "Submit Application"}
          </Button>
        </Box>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </CardContent>
    </Card>
  )

  // Signature Dialog Component
  const SignatureDialog = () => (
    <Dialog
      open={showSignatureDialog}
      onClose={() => setShowSignatureDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Draw Your Signature</Typography>
          <IconButton onClick={() => setShowSignatureDialog(false)} size="small">
            <Close color="primary" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please draw your signature in the box below using your mouse or touch device
        </Typography>

        <Box sx={{
          border: '2px dashed #ccc',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
          bgcolor: 'grey.50'
        }}>
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'crosshair',
              backgroundColor: 'white'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </Box>

        {uploadProgress.signature && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Saving signature... {Math.round(uploadProgress.signature)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress.signature} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={clearSignature}
          variant="outlined"
          startIcon={<Clear color="primary" />}
        >
          Clear
        </Button>
        <Button
          onClick={() => setShowSignatureDialog(false)}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={saveSignature}
          variant="contained"
          startIcon={<CheckCircle color="primary" />}
          disabled={loading}
        >
          Save Signature
        </Button>
      </DialogActions>
      {loading && <LinearProgress />}
    </Dialog>
  )



  // Show loading state while colors are being fetched
  if (colorLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading membership application...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (showPreview) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider theme={createDynamicTheme(color || {})}>
          <Container maxWidth="lg" sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}>
            {renderPreview()}
            {/* ContactDialog removed - now integrated into step 6 */}
            <SignatureDialog />
          </Container>
        </ThemeProvider>
      </Suspense>
    )
  }

  console.log("formData", formData);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={createDynamicTheme(color || {})}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 }, bgcolor: "background.default", minHeight: "100vh" }}>
        <Paper elevation={1} sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 4 },
          mt: { xs: 4, sm: 6, md: 8 },
          textAlign: "center",
          borderRadius: 3
        }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            mb: { xs: 1, sm: 2 }
          }}>
            Melbourne KMCC Membership Application
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            Join our community and be part of something meaningful
          </Typography>
        </Paper>

        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              display: { xs: 'none', sm: 'block' }
            },
            '& .MuiStepLabel-iconContainer': {
              padding: { xs: '4px', sm: '8px' }
            }
          }}>
            {currentSteps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mb: 4 }}>
          {(() => {
            const currentSteps = getSteps()
            const stepIndex = activeStep

            // Map step names to render functions
            const stepRenderers: { [key: string]: () => JSX.Element } = {
              "Initial Questions": renderStep1,
              "Personal Information": renderStep2,
              "Partner Details": renderStep3,
              "Emergency Contacts": renderStep4,
              "IUML References": renderStep5,
              "Documents & Final": renderStep6
            }

            const currentStepName = currentSteps[stepIndex]
            if (!currentStepName) return null

            const renderFunction = stepRenderers[currentStepName]

            return renderFunction ? renderFunction() : null
          })()}
        </Box>

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              startIcon={<NavigateBefore  />}
              sx={{
                order: { xs: 2, sm: 1 },
                minWidth: { xs: '120px', sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '8px 16px', sm: '10px 22px' }
              }}
            >
              Previous
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                order: { xs: 1, sm: 2 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Step {activeStep + 1} of {currentSteps.length}
            </Typography>

            {activeStep < currentSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={<NavigateNext />}
                size="large"
                sx={{
                  order: { xs: 3, sm: 3 },
                  minWidth: { xs: '120px', sm: 'auto' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '8px 16px', sm: '10px 22px' }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => setShowPreview(true)}
                variant="contained"
                startIcon={<Visibility color="primary" />}
                size="large"
                sx={{
                  order: { xs: 3, sm: 3 },
                  minWidth: { xs: '140px', sm: 'auto' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '8px 16px', sm: '10px 22px' }
                }}
              >
                Preview & Submit
              </Button>
            )}
          </Box>
        </Paper>

        {/* ContactDialog removed - now integrated into step 6 */}
        <SignatureDialog />

        {/* Query Dialog */}
        <Dialog
          open={showQueryDialog}
          onClose={() => setShowQueryDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: 2 },
              margin: { xs: 0, sm: 2 },
              maxHeight: { xs: '100vh', sm: '90vh' }
            },
          }}
        >
          <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Submit Your Query
              </Typography>
              <IconButton onClick={() => setShowQueryDialog(false)} size="small">
                <Close color="primary" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="body2" color="text.secondary" sx={{
              mb: 3,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Since you don't wish to support KMCC at this time, please provide your query details and we'll get back to you.
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  value={formData.queryFullName}
                  onChange={(e) => handleInputChange("queryFullName", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={formData.queryEmail}
                  onChange={(e) => handleInputChange("queryEmail", e.target.value)}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: "primary.main" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.queryMobileNumber}
                  onChange={(e) => handleInputChange("queryMobileNumber", e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.queryAddress}
                  onChange={(e) => handleInputChange("queryAddress", e.target.value)}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: "primary.main" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Query Type</InputLabel>
                  <Select
                    value={formData.queryType}
                    label="Query Type"
                    onChange={(e) => handleInputChange("queryType", e.target.value)}
                  >
                    <MenuItem value="Accomodation">Accommodation</MenuItem>
                    <MenuItem value="Airport Pickup">Airport Pickup</MenuItem>
                    <MenuItem value="Carrer Guide">Career Guide</MenuItem>
                    <MenuItem value="funeral Service">Funeral Service</MenuItem>
                    <MenuItem value="ISlamic Schools">Islamic Schools</MenuItem>
                    <MenuItem value="Membership">Membership</MenuItem>
                    <MenuItem value="Mosque or Musallahs">Mosque or Musallahs</MenuItem>
                    <MenuItem value="Visa">Visa</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Choosing the right query type would direct to the right person
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Query Details"
                  value={formData.query}
                  onChange={(e) => handleInputChange("query", e.target.value)}
                  placeholder="Please provide details about your query..."
                />
              </Grid>
            </Grid>
          </DialogContent>

          {/* <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setShowQueryDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuerySubmit}
              variant="contained"
              startIcon={<Send />}
              disabled={loading || !formData.queryFullName || !formData.queryEmail || !formData.query}
            >
              {loading ? <CircularProgress size={20} /> : "Submit Query"}
            </Button> */}
          <DialogActions sx={{
            p: { xs: 2, sm: 3 },
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              onClick={() => setShowQueryDialog(false)}
              variant="outlined"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                order: { xs: 2, sm: 1 }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuerySubmit}
              variant="contained"
              startIcon={<Send />}
              disabled={loading || !formData.queryFullName || !formData.queryEmail || !formData.query}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                order: { xs: 1, sm: 2 }
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Submit Query"}
            </Button>
          {/* </DialogActions> */}
          </DialogActions>
        </Dialog>

        {/* Snackbar for user feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
    </Suspense>
  )
}
