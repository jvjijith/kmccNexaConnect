"use client"

import { useState, useCallback } from "react"
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
} from "@mui/icons-material"
import { theme } from "../../../../packages/ui/src/theme"
import { submitMembershipApplication, createMemberPayment } from "../../src/data/loader" 

interface FormData {
  supportKMCC: boolean | null
  readBylaw: boolean | null
  byLaw: string
  applicationFor: string
  amountTobePaid: number
  firstName: string
  lastName: string
  dob: string
  email: string
  address: string
  mobileNumber: string
  whatsappNumber: string
  visaStatus: string
  partnerFirstName: string
  partnerLastName: string
  partnerDob: string
  partnerEmail: string
  partnerMobile: string
  partnerWhatsapp: string
  emergencyContactName: string
  emergencyContactMobile: string
  addressInKerala: string
  assemblyName: string
  district: string
  emergencyContactNameKerala: string
  emergencyContactMobileKerala: string
  IUMLContact: string
  queryType: string
  supportDocuments: Array<{ docuName: string; docuUrl: string }>
  query: string
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
  stripeId: string
}

interface ContactFormData {
  fullName: string
  email: string
  mobile: string
  address: string
  queryType: string
  queryDetail: string
  supportDocuments: File[]
}

interface FormErrors {
  [key: string]: string
}

const steps = [
  "Initial Questions",
  "Personal Information",
  "Partner Details",
  "Emergency Contacts",
  "IUML References",
  "Documents & Final",
]

const initialFormData: FormData = {
  supportKMCC: null,
  readBylaw: null,
  byLaw: "",
  applicationFor: "",
  amountTobePaid: 25,
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  address: "",
  mobileNumber: "",
  whatsappNumber: "",
  visaStatus: "",
  partnerFirstName: "",
  partnerLastName: "",
  partnerDob: "",
  partnerEmail: "",
  partnerMobile: "",
  partnerWhatsapp: "",
  emergencyContactName: "",
  emergencyContactMobile: "",
  addressInKerala: "",
  assemblyName: "",
  district: "",
  emergencyContactNameKerala: "",
  emergencyContactMobileKerala: "",
  IUMLContact: "",
  queryType: "",
  supportDocuments: [],
  query: "",
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
  stripeId: "",
}

export default function MembershipApplication() {
  const [activeStep, setActiveStep] = useState(0)
  const [showBylaw, setShowBylaw] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [contactForm, setContactForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    queryType: "",
    queryDetail: "",
    supportDocuments: [],
  })

  const bylawText = `Objectives: Melbourne KMCC aims to foster unity among its members, support charitable activities, promote cultural heritage, and assist in the welfare and development of the community. The association organizes social, cultural, and educational events to enrich the lives of its members.

Membership: Open to individuals of Kerala origin, aged 18 and above, residing in Melbourne. Members are categorized as Ordinary, Life, or Honorary. Life Members have permanent status, while membership fees and renewal procedures are clearly defined.

Organizational Structure: KMCC operates under a structured framework that includes the General Body, Executive Committee, Office Bearers, and various subcommittees. The General Body, comprising all members, is the supreme authority, and the Executive Committee manages daily operations.

Note: Once your application is final, we will provide you detailed bylaw via digital means.`

  // New state for better user feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  })
  const [submissionStep, setSubmissionStep] = useState<"idle" | "submitting" | "payment" | "success">("idle")

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [errors],
  )

  const handleContactFormChange = useCallback((field: string, value: any) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleFileUpload = useCallback((files: FileList | null, isContactForm = false) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      const isValidType = ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)
      const isValidSize = file.size <= 2 * 1024 * 1024 // 2MB
      return isValidType && isValidSize
    })

    if (isContactForm) {
      setContactForm((prev) => ({
        ...prev,
        supportDocuments: [...prev.supportDocuments, ...validFiles],
      }))
    } else {
      const newDocs = validFiles.map((file) => ({
        docuName: file.name,
        docuUrl: URL.createObjectURL(file),
      }))
      setFormData((prev) => ({
        ...prev,
        supportDocuments: [...prev.supportDocuments, ...newDocs],
      }))
    }
  }, [])

  const removeDocument = useCallback((index: number, isContactForm = false) => {
    if (isContactForm) {
      setContactForm((prev) => ({
        ...prev,
        supportDocuments: prev.supportDocuments.filter((_, i) => i !== index),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        supportDocuments: prev.supportDocuments.filter((_, i) => i !== index),
      }))
    }
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 0:
        if (formData.supportKMCC === null) newErrors.supportKMCC = "This field is required"
        if (formData.readBylaw === null) newErrors.readBylaw = "This field is required"
        if (!formData.applicationFor) newErrors.applicationFor = "This field is required"
        break
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required"
        if (!formData.lastName) newErrors.lastName = "Last name is required"
        if (!formData.dob) newErrors.dob = "Date of birth is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.address) newErrors.address = "Address is required"
        if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required"
        if (!formData.whatsappNumber) newErrors.whatsappNumber = "WhatsApp number is required"
        if (!formData.visaStatus) newErrors.visaStatus = "Visa status is required"
        break
      case 3:
        if (!formData.emergencyContactName) newErrors.emergencyContactName = "Emergency contact name is required"
        if (!formData.emergencyContactMobile) newErrors.emergencyContactMobile = "Emergency contact mobile is required"
        if (!formData.addressInKerala) newErrors.addressInKerala = "Kerala address is required"
        if (!formData.assemblyName) newErrors.assemblyName = "Assembly name is required"
        if (!formData.district) newErrors.district = "District is required"
        if (!formData.emergencyContactNameKerala)
          newErrors.emergencyContactNameKerala = "Kerala emergency contact name is required"
        if (!formData.emergencyContactMobileKerala)
          newErrors.emergencyContactMobileKerala = "Kerala emergency contact mobile is required"
        break
      case 4:
        if (!formData.IUMLContact) newErrors.IUMLContact = "IUML contact selection is required"
        if (formData.IUMLContact && formData.IUMLContact !== "Not able to provide any") {
          if (!formData.iuMLContactName) newErrors.iuMLContactName = "Contact name is required"
          if (!formData.iuMLContactPosition) newErrors.iuMLContactPosition = "Contact position is required"
          if (!formData.iuMLLocation) newErrors.iuMLLocation = "Contact location is required"
          if (!formData.iuMLContactNumber) newErrors.iuMLContactNumber = "Contact phone number is required"
        }
        break
      case 5:
        if (!formData.acceptKmcc) newErrors.acceptKmcc = "You must accept the terms"
        if (formData.shareInfoNorka === null) newErrors.shareInfoNorka = "This field is required"
        if (!formData.signatureURL) newErrors.signatureURL = "Digital signature is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSubmit = async () => {
    if (formData.IUMLContact === "Not able to provide any") {
      setShowContactDialog(true)
      return
    }

    setLoading(true)
    setSubmissionStep("submitting")

    try {
      // Prepare the data according to the API format
      const membershipData = {
        supportKMCC: formData.supportKMCC,
        readBylaw: formData.readBylaw,
        byLaw: formData.byLaw,
        applicationFor: formData.applicationFor,
        amountTobePaid: formData.amountTobePaid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        email: formData.email,
        address: formData.address,
        mobileNumber: formData.mobileNumber,
        whatsappNumber: formData.whatsappNumber,
        visaStatus: formData.visaStatus,
        partnerFirstName: formData.partnerFirstName,
        partnerLastName: formData.partnerLastName,
        partnerDob: formData.partnerDob,
        partnerEmail: formData.partnerEmail,
        partnerMobile: formData.partnerMobile,
        partnerWhatsapp: formData.partnerWhatsapp,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactMobile: formData.emergencyContactMobile,
        addressInKerala: formData.addressInKerala,
        assemblyName: formData.assemblyName,
        district: formData.district,
        emergencyContactNameKerala: formData.emergencyContactNameKerala,
        emergencyContactMobileKerala: formData.emergencyContactMobileKerala,
        IUMLContact: formData.IUMLContact,
        queryType: formData.queryType,
        supportDocuments: formData.supportDocuments,
        query: formData.query,
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
        stripeId: formData.stripeId
      }

      // Submit membership application
      const membershipResponse = await submitMembershipApplication(membershipData) as any

      setSnackbar({
        open: true,
        message: "Membership application submitted successfully!",
        severity: "success"
      })

      // If membership submission is successful, proceed with payment
      if (membershipResponse && membershipResponse.id) {
        setSubmissionStep("payment")

        try {
          const paymentResponse = await createMemberPayment(membershipResponse.id) as any

          if (paymentResponse && paymentResponse.url) {
            setSnackbar({
              open: true,
              message: "Redirecting to payment...",
              severity: "info"
            })

            // Redirect to payment URL
            window.location.href = paymentResponse.url
          } else {
            throw new Error("Payment URL not received")
          }
        } catch (paymentError) {
          console.error("Payment error:", paymentError)
          setSnackbar({
            open: true,
            message: "Application submitted but payment setup failed. Please contact support.",
            severity: "warning"
          })
          setSubmissionStep("success")
        }
      } else {
        throw new Error("Member ID not received from application submission")
      }

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

  const handleContactSubmit = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Contact form submitted:", contactForm)
      setShowContactDialog(false)
      alert("Contact form submitted! We will get back to you soon.")
    } catch (error) {
      alert("Error submitting contact form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const renderStep1 = () => (
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography variant="h5" component="h2" color="primary">
            Initial Questions
          </Typography>
        }
        subheader="Please answer these preliminary questions to begin your application"
      />
      <CardContent>
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
                if (boolValue) {
                  handleInputChange("byLaw", bylawText)
                }
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
                <Info />
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
            icon={<CheckCircle />}
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
                </Typography>
              </Box>
              
              {!(formData.applicationFor === "couple")&&
              <Chip label="$25 AUD" color="success" size="medium" sx={{ fontSize: "1.1rem", fontWeight: "bold" }} />
            }
            {(formData.applicationFor === "couple")&&
              <Chip label="$50 AUD" color="success" size="medium" sx={{ fontSize: "1.1rem", fontWeight: "bold" }} />
            }
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
                startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
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
                startAdornment: <LocationOn sx={{ mr: 1, color: "action.active", alignSelf: "flex-start", mt: 1 }} />,
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
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Partner Last Name"
              value={formData.partnerLastName}
              onChange={(e) => handleInputChange("partnerLastName", e.target.value)}
              required={formData.applicationFor === "couple"}
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
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Partner Mobile Number"
              value={formData.partnerMobile}
              onChange={(e) => handleInputChange("partnerMobile", e.target.value)}
              required={formData.applicationFor === "couple"}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Partner WhatsApp Number"
              value={formData.partnerWhatsapp}
              onChange={(e) => handleInputChange("partnerWhatsapp", e.target.value)}
              required={formData.applicationFor === "couple"}
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
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
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
                startAdornment: <LocationOn sx={{ mr: 1, color: "action.active", alignSelf: "flex-start", mt: 1 }} />,
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
              value={formData.emergencyContactMobileKerala}
              onChange={(e) => handleInputChange("emergencyContactMobileKerala", e.target.value)}
              error={!!errors.emergencyContactMobileKerala}
              helperText={errors.emergencyContactMobileKerala}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
          </Grid>
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
                      startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
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
                    handleInputChange("photoURL", URL.createObjectURL(file))
                  }
                }}
              />
              <label htmlFor="photo-upload" style={{ cursor: "pointer", display: "block" }}>
                <CloudUpload sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2">PNG, JPG, JPEG up to 2MB</Typography>
              </label>
            </Paper>
            {formData.photoURL && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Chip label="Photo uploaded successfully" color="success" icon={<CheckCircle />} />
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
                <AttachFile sx={{ fontSize: 48, mb: 2 }} />
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
                      <Delete />
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

          <TextField
            required
            fullWidth
            label="Digital Signature"
            placeholder="Type your full name as digital signature"
            value={formData.signatureURL}
            onChange={(e) => handleInputChange("signatureURL", e.target.value)}
            error={!!errors.signatureURL}
            helperText={errors.signatureURL || "This serves as your digital signature for the application"}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "grey.50",
              },
            }}
          />

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
    <Card elevation={3}>
      <CardHeader
        title={
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            color="primary"
          >
            <Visibility />
            Application Preview
          </Typography>
        }
        subheader="Please review your application carefully before submission"
      />
      <CardContent>
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
                Application Type
              </Typography>
              <Typography variant="body2">{formData.applicationFor}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Full Name
              </Typography>
              <Typography variant="body2">
                {formData.firstName} {formData.lastName}
              </Typography>
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
                Mobile
              </Typography>
              <Typography variant="body2">{formData.mobileNumber}</Typography>
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
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Assembly
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
                IUML Contact
              </Typography>
              <Typography variant="body2">{formData.IUMLContact}</Typography>
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
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "center" }}>
          <Button variant="outlined" onClick={() => setShowPreview(false)} size="large" startIcon={<NavigateBefore />}>
            Edit Application
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> :
              submissionStep === "payment" ? <Payment /> : <Send />
            }
            size="large"
            disabled={loading}
            sx={{
              minWidth: 200,
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

  const ContactDialog = () => (
    <Dialog
      open={showContactDialog}
      onClose={() => setShowContactDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography variant="h5" color="primary">
          Contact Us
        </Typography>
        <IconButton onClick={() => setShowContactDialog(false)} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          Let us know how can we help you. All your general queries go to our contact us page.
        </Typography>

        <Paper elevation={2} sx={{ p: 3, bgcolor: "primary.light", borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }} color="white">
            <Phone /> You can contact KMCC Australia via phone:
          </Typography>
          <Typography variant="h6" color="white" sx={{ fontWeight: "bold" }}>
            +61 426 748 871 / +61 433 520 001
          </Typography>
        </Paper>

        <Typography variant="h6" gutterBottom color="primary">
          General Enquiry Form
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={contactForm.fullName}
              onChange={(e) => handleContactFormChange("fullName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={contactForm.email}
              onChange={(e) => handleContactFormChange("email", e.target.value)}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={contactForm.mobile}
              onChange={(e) => handleContactFormChange("mobile", e.target.value)}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              value={contactForm.address}
              onChange={(e) => handleContactFormChange("address", e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Query Type</InputLabel>
              <Select
                value={contactForm.queryType}
                label="Query Type"
                onChange={(e) => handleContactFormChange("queryType", e.target.value)}
              >
                <MenuItem value="Accommodation">Accommodation</MenuItem>
                <MenuItem value="Airport Pickup">Airport Pickup</MenuItem>
                <MenuItem value="Career Guide">Career Guide</MenuItem>
                <MenuItem value="Funeral Service">Funeral Service</MenuItem>
                <MenuItem value="Islamic Schools">Islamic Schools</MenuItem>
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
            <Typography variant="h6" gutterBottom color="primary">
              Further Evidence
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Providing the correct evidence of your enquires ensures a speedy application processing time. Use the
              evidence upload guide to assist you with the requirements of each documents. (JPEG, JPG, PNG, PDF, files
              accepted). No larger than 2MB per file. You can add multiple files if scanned individual pages.
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
                id="contact-doc-upload"
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, true)}
              />
              <label htmlFor="contact-doc-upload" style={{ cursor: "pointer", display: "block" }}>
                <CloudUpload sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drop files here or click to upload
                </Typography>
              </label>
            </Paper>
            {contactForm.supportDocuments.length > 0 && (
              <List dense sx={{ mt: 2 }}>
                {contactForm.supportDocuments.map((file, index) => (
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
                    <ListItemText primary={file.name} />
                    <IconButton edge="end" onClick={() => removeDocument(index, true)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Please describe your queries in detail"
              value={contactForm.queryDetail}
              onChange={(e) => handleContactFormChange("queryDetail", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setShowContactDialog(false)} variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleContactSubmit} disabled={loading} startIcon={<Send />}>
          {loading ? "Submitting..." : "Submit Query"}
        </Button>
      </DialogActions>
      {loading && <LinearProgress />}
    </Dialog>
  )

  if (showPreview) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}>
          {renderPreview()}
          <ContactDialog />
        </Container>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}>
        <Paper elevation={1} sx={{ p: 4, mb: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Melbourne KMCC Membership Application
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Join our community and be part of something meaningful
          </Typography>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mb: 4 }}>
          {activeStep === 0 && renderStep1()}
          {activeStep === 1 && renderStep2()}
          {activeStep === 2 && renderStep3()}
          {activeStep === 3 && renderStep4()}
          {activeStep === 4 && renderStep5()}
          {activeStep === 5 && renderStep6()}
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              startIcon={<NavigateBefore />}
              size="large"
            >
              Previous
            </Button>

            <Typography variant="body2" color="text.secondary">
              Step {activeStep + 1} of {steps.length}
            </Typography>

            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} variant="contained" endIcon={<NavigateNext />} size="large">
                Next
              </Button>
            ) : (
              <Button onClick={() => setShowPreview(true)} variant="contained" startIcon={<Visibility />} size="large">
                Preview & Submit
              </Button>
            )}
          </Box>
        </Paper>

        <ContactDialog />

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
  )
}
