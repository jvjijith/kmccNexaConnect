'use client'

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Paper,
  Divider,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  FormLabel,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Lock as LockIcon,
} from "@mui/icons-material"

// Import the API functions
import {
  payment,
  registerEvent,
  registerEventAuthenticated,
  getMembershipByCustomerId,
  decodeAccessToken,
  getAccessToken,
  isAuthenticated,
  checkEventAccess
} from "../../../src/data/loader";

// Import the Event type from your types file
import type { Event } from "../../../types/event";

// Define TypeScript interfaces for the registration form
interface Option {
  fieldName: string;
  parentName: string;
  labelName: string;
  _id?: string;
}

interface FormulaItem {
  type: string;
  fieldName?: string;
  operationName?: string;
  _id?: string;
}

interface RegistrationField {
  name: string;
  displayName: string;
  type: string;
  valueType: "userInput" | "dynamic" | "fixed" | "attendanceInput";
  options?: Option[];
  formula?: FormulaItem[];
  truthValue?: number;
  falseValue?: number;
  _id?: string;
}

interface EventRegistrationFormProps {
  eventData: Event;
  id?: string;
}

interface StepItem {
  label: string;
  icon: React.ReactNode;
}

interface PaymentResult {
  url?: string;
  [key: string]: any;
}

// Styled components for enhanced visuals
const StyledCard = styled(Card)(() => ({
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  overflow: "visible",
  transition: "transform 0.3s ease",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    marginTop: theme.spacing(1),
    fontWeight: 500,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiFormLabel-root": {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
}));

const AnimatedButton = styled(Button)(() => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  },
}));

const EventImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const PriceSummary = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

const SecurePaymentBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  color: theme.palette.success.main,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

export default function EventRegistrationForm({ eventData, id }: EventRegistrationFormProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Check if this is a donation or fundraiser event
  const isDonationEvent = eventData.eventType === "donation" || eventData.eventType === "fundraiser";

  // Determine if this is a free event
  const isFreeEvent = eventData.paymentType === "Free";
  
  // Define steps based on event type - donation events skip Event Details
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps: StepItem[] = isDonationEvent 
    ? [
        { label: "Donor Information", icon: <PersonIcon /> },
        { label: "Donation Summary", icon: <PaymentIcon /> },
        { label: "Confirmation", icon: <CheckCircleIcon /> }
      ]
    : isFreeEvent 
    ? [
        { label: "Event Details", icon: <EventIcon /> },
        { label: "Participant Information", icon: <PersonIcon /> },
        { label: "Confirmation", icon: <CheckCircleIcon /> }
      ]
    : [
        { label: "Event Details", icon: <EventIcon /> },
        { label: "Participant Information", icon: <PersonIcon /> },
        { label: "Order Summary", icon: <PaymentIcon /> },
        { label: "Confirmation", icon: <CheckCircleIcon /> }
      ];

  // Add personal information fields since they're not in the provided data
  const personalInfoFields: RegistrationField[] = [
    {
      name: "fullName",
      displayName: isDonationEvent ? "Full Name" : "Full Name",
      type: "text",
      valueType: "userInput",
      options: [],
      formula: []
    },
    {
      name: "email",
      displayName: "Email Address",
      type: "text",
      valueType: "userInput",
      options: [],
      formula: []
    },
    {
      name: "phone",
      displayName: "Phone Number",
      type: "text",
      valueType: "userInput",
      options: [],
      formula: []
    }
  ];

  // State management and calculation functions
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [calculatedValues, setCalculatedValues] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string>("");
  const [registrationId, setRegistrationId] = useState<string>("");

  // Authentication state
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [membershipStatus, setMembershipStatus] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Calculate dynamic field values whenever fieldValues change
  useEffect(() => {
    calculateDynamicFields();
  }, [fieldValues]);

  // Check authentication status and membership when component mounts
  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      setIsCheckingAuth(true);
      setAuthError("");

      try {
        // Use the helper function to check event access
        const accessCheck = checkEventAccess(eventData);

        if (!accessCheck.canAccess) {
          setAuthError(accessCheck.message || "Access denied");
          setIsCheckingAuth(false);
          return;
        }

        // Check if user is authenticated
        const authenticated = isAuthenticated();
        setIsUserAuthenticated(authenticated);

        if (authenticated) {
          const token = getAccessToken();
          if (token) {
            const decoded = decodeAccessToken(token);
            if (decoded) {
              setUserId(decoded.userId);

              // If membership is required, check membership status
              if (accessCheck.requiresMembership) {
                try {
                  const membershipData = await getMembershipByCustomerId(decoded.userId, {
                    'Authorization': `Bearer ${token}`
                  });

                  if (membershipData && membershipData.memberStatus) {
                    setMembershipStatus(membershipData.memberStatus);

                    // Check if member status allows access
                    if (membershipData.memberStatus !== 'active') {
                      setAuthError("Only active members can register for this event.");
                    }
                  } else {
                    setAuthError("Membership not found. Only members can register for this event.");
                  }
                } catch (error) {
                  console.error("Error checking membership:", error);
                  setAuthError("Unable to verify membership status. Only members can register for this event.");
                }
              }
            }
          }
        } else if (eventData.allowLogin && !eventData.allowGuest) {
          // User must be logged in but isn't
          setAuthError("You must be logged in to register for this event.");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthError("Unable to verify authentication status.");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthenticationStatus();
  }, [eventData.allowLogin, eventData.allowGuest, eventData.allowMemberLogin]);

  // Function to calculate values for dynamic fields based on formulas
  const calculateDynamicFields = (): void => {
    const newCalculatedValues = { ...calculatedValues };
    
    const registrationFields = eventData.registrationFields || [];
    registrationFields.forEach(field => {
      if (field.valueType === "dynamic" && field.formula && field.formula.length > 0) {
        newCalculatedValues[field.name] = evaluateFormula(field.formula, fieldValues, newCalculatedValues);
      }
    });
    
    setCalculatedValues(newCalculatedValues);
  };

  // Function to evaluate a formula
  const evaluateFormula = (
    formula: FormulaItem[], 
    values: Record<string, any>, 
    calculatedVals: Record<string, number>
  ): number => {
    if (!formula || formula.length === 0) return 0;
    
    let result = 0;
    let currentOperation = "+";
    let isFirstValue = true;
    
    for (let i = 0; i < formula.length; i++) {
      const item = formula[i];
      if (!item) continue;
      
      // Handle operations
      if (item.type === "operation") {
        currentOperation = item.operationName || "+";
        continue;
      }
      
      // Extract value from the current item
      let itemValue: number = 0;
      
      if (item.type === "number" && item.fieldName) {
        itemValue = Number.parseFloat(item.fieldName);
      } else if (item.type === "customField" && item.fieldName) {
        if (calculatedVals[item.fieldName] !== undefined) {
          itemValue = calculatedVals[item.fieldName] || 0;
        } else if (values[item.fieldName] !== undefined) {
          // Handle different data types
          if (typeof values[item.fieldName] === "boolean") {
            const registrationFields = eventData.registrationFields || [];
            const field = registrationFields.find(f => f.name === item.fieldName);
            itemValue = values[item.fieldName] ? (field?.truthValue || 1) : (field?.falseValue || 0);
          } else if (typeof values[item.fieldName] === "string") {
            itemValue = parseFloat(values[item.fieldName]) || 0;
          } else if (Array.isArray(values[item.fieldName])) {
            itemValue = values[item.fieldName].reduce((sum: number, val: string) => sum + (parseFloat(val) || 0), 0);
          } else {
            const fieldValue = Number.parseFloat(values[item.fieldName] || "0");
            itemValue = isNaN(fieldValue) ? 0 : fieldValue;
          }
        }
      }
      
      // Apply the operation
      if (isFirstValue) {
        result = itemValue;
        isFirstValue = false;
      } else {
        switch (currentOperation) {
          case "+":
          case "add":
            result += itemValue;
            break;
          case "-":
          case "subtract":
            result -= itemValue;
            break;
          case "*":
          case "multiply":
            result *= itemValue;
            break;
          case "/":
          case "divide":
            if (itemValue !== 0) {
              result /= itemValue;
            }
            break;
          case "%":
          case "modulus":
            // For percentage-based discounts
            result = (result * itemValue) / 100;
            break;
          default:
            result += itemValue;
        }
      }
    }
    
    return result;
  };

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Event handlers
  const handleFieldValueChange = (fieldName: string, value: any): void => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleRadioChange = (fieldName: string, value: string): void => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleCheckboxChange = (fieldName: string, optionFieldName: string, checked: boolean): void => {
    const currentValues = fieldValues[fieldName] || [];
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, optionFieldName];
    } else {
      newValues = currentValues.filter((v: string) => v !== optionFieldName);
    }
    
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: newValues
    }));
  };

  const handleBooleanChange = (fieldName: string, checked: boolean): void => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: checked
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Adjust step validation based on event type
    const participantInfoStep = isDonationEvent ? 0 : 1;
    
    if (step === participantInfoStep) {
      // Validate Participant Information
      personalInfoFields.forEach(field => {
        if (!fieldValues[field.name]) {
          newErrors[field.name] = `${field.displayName} is required`;
          isValid = false;
        } else if (field.name === "email" && !/\S+@\S+\.\S+/.test(fieldValues[field.name])) {
          newErrors[field.name] = "Please enter a valid email address";
          isValid = false;
        } else if (field.name === "phone" && !/^\+?[0-9\s\-()]{10,15}$/.test(fieldValues[field.name])) {
          newErrors[field.name] = "Please enter a valid phone number";
          isValid = false;
        }
      });
      
      // Validate required registration fields
      const registrationFields = eventData.registrationFields || [];
      const requiredFields = registrationFields.filter(
        field => (field.valueType === "userInput" || field.valueType === "attendanceInput") &&
        (field.type === "radioButtonGroup" || field.type === "option" || field.type === "number" || field.type === "text")
      );

      requiredFields.forEach(field => {
        if (!fieldValues[field.name]) {
          newErrors[field.name] = `${field.displayName} is required`;
          isValid = false;
        } else if (field.valueType === "attendanceInput") {
          const value = Number(fieldValues[field.name]);
          if (isNaN(value) || value < 1) {
            newErrors[field.name] = "Please enter a valid number of participants (minimum 1)";
            isValid = false;
          }
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegisterEvent = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Check authentication requirements before proceeding
      if (authError) {
        throw new Error(authError);
      }

      // Determine which registration API to use based on authentication
      const useAuthenticatedAPI = isUserAuthenticated && eventData.allowLogin;

      // Calculate total seats from attendanceInput fields
      let totalSeats = 0;
      if (eventData.customAttendance && eventData.registrationFields) {
        const attendanceFields = eventData.registrationFields.filter(
          field => field.valueType === "attendanceInput"
        );

        attendanceFields.forEach(field => {
          const value = fieldValues[field.name];
          if (value && !isNaN(Number(value))) {
            totalSeats += Number(value);
          }
        });
      }

      // Prepare the registration data according to new schema
      let registrationData: any = {
        eventId: id || (eventData as any)._id,
        eventData: Object.entries(fieldValues).map(([fieldName, fieldValue]) => ({
          fieldName,
          fieldValue: typeof fieldValue === 'object' ? fieldValue : fieldValue
        })),
        price: String(calculatedValues.totalPrice || 0),
        currency: "USD",
        status: isFreeEvent ? "completed" : "pending",
        paymentStatus: isFreeEvent ? "free" : "unpaid"
      };

      // Add attendance-related fields only if customAttendance is true
      if (eventData.customAttendance) {
        registrationData.totalAttendance = 0;
        registrationData.totalSeats = totalSeats;
        registrationData.attendanceStatus = "registered";
      }

      // Add user-specific fields based on authentication status
      if (useAuthenticatedAPI) {
        // For authenticated users, use the /events/register endpoint
        registrationData.userId = userId;
        registrationData.email = fieldValues.email || userEmail;
      } else {
        // For guest users, use the /events/register/guest endpoint
        registrationData.email = fieldValues.email;
        // Remove name and phone from top level as they should be in eventData
      }

      // Debug logging
      console.log("Registration Data being sent:", registrationData);
      console.log("Field Values:", fieldValues);
      console.log("Event ID:", id || (eventData as any)._id);
      console.log("Event Data:", eventData);
      console.log("Using authenticated API:", useAuthenticatedAPI);

      // Validate required fields before sending
      if (!registrationData.eventId) {
        throw new Error("Event ID is missing");
      }
      if (!registrationData.email) {
        throw new Error("Email is required");
      }

      // Additional validation for guest registration
      if (!useAuthenticatedAPI) {
        if (!registrationData.name) {
          throw new Error("Full name is required");
        }
        if (!registrationData.phone) {
          throw new Error("Phone number is required");
        }

        // Validate phone format for guest users
        const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
        if (!phoneRegex.test(registrationData.phone)) {
          throw new Error("Please enter a valid phone number");
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registrationData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Ensure eventData array is not empty and contains valid data
      if (!registrationData.eventData || registrationData.eventData.length === 0) {
        console.warn("No event data fields found, adding basic fields");
        if (useAuthenticatedAPI) {
          registrationData.eventData = [
            { fieldName: "email", fieldValue: registrationData.email }
          ];
        } else {
          registrationData.eventData = [
            { fieldName: "fullName", fieldValue: registrationData.name },
            { fieldName: "email", fieldValue: registrationData.email },
            { fieldName: "phone", fieldValue: registrationData.phone }
          ];
        }
      }

      // Ensure price is a valid number string
      const priceValue = parseFloat(registrationData.price);
      if (isNaN(priceValue) || priceValue < 0) {
        registrationData.price = "0";
      }

      // Prepare headers for authenticated requests
      const headers: HeadersInit = {};
      if (useAuthenticatedAPI) {
        const token = getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Register the event using appropriate API
      const registrationResult = useAuthenticatedAPI
        ? await registerEventAuthenticated(registrationData, headers)
        : await registerEvent(registrationData);

      if (registrationResult && (registrationResult as { _id: string })._id) {
        setRegistrationId((registrationResult as { _id: string })._id);
        setConfirmationNumber((registrationResult as { _id: string })._id);

        if (isFreeEvent) {
          // For free events, skip to confirmation
          setActiveStep(isDonationEvent ? 2 : 2);
        } else {
          // For paid events, go to order/donation summary
          setActiveStep(isDonationEvent ? 1 : 2);
        }
      } else {
        throw new Error("Registration failed. No registration ID received.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fieldValues,
        eventData: eventData,
        eventId: id || (eventData as any)._id
      });
      alert(error instanceof Error ? error.message : "Failed to register for event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessPayment = async (): Promise<void> => {
    setIsSubmitting(true);
    
    try {
      // Call the payment API with the registration ID
      const paymentResult = await payment(registrationId) as PaymentResult;
      
      // Redirect to payment URL if provided
      if (paymentResult && paymentResult.url) {
        window.location.href = paymentResult.url;
        return;
      }
      
      // If no payment URL or this is a free event, show confirmation
      setConfirmationNumber(registrationId);
      setActiveStep(isDonationEvent ? 2 : (isFreeEvent ? 2 : 3));
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert(error instanceof Error ? error.message : "Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async (): Promise<void> => {
    if (validateStep(activeStep)) {
      const participantInfoStep = isDonationEvent ? 0 : 1;
      
      if (activeStep === participantInfoStep) {
        // After Participant Information, register the event
        await handleRegisterEvent();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (validateStep(activeStep)) {
      const summaryStep = isDonationEvent ? 1 : (isFreeEvent ? -1 : 2);
      
      if (activeStep === summaryStep && !isFreeEvent) {
        // Process payment on final confirmation (only for paid events)
        await handleProcessPayment();
      }
    }
  };

  // Render a field based on its type
  const renderField = (field: RegistrationField): JSX.Element | null => {
    // For dynamic fields, use the calculated value
    const dynamicValue = field.valueType === "dynamic" ? calculatedValues[field.name] : undefined;

    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={field.displayName}
            name={field.name}
            value={fieldValues[field.name] || ""}
            onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
            margin="normal"
            required={field.valueType === "userInput" || field.valueType === "attendanceInput"}
            disabled={field.valueType === "fixed" || field.valueType === "dynamic"}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        );
      case "number":
        return (
          <TextField
            fullWidth
            label={field.displayName}
            name={field.name}
            type="number"
            value={dynamicValue !== undefined ? dynamicValue : fieldValues[field.name] || ""}
            onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
            margin="normal"
            required={field.valueType === "userInput" || field.valueType === "attendanceInput"}
            disabled={field.valueType === "fixed" || field.valueType === "dynamic"}
            error={!!errors[field.name]}
            helperText={errors[field.name] || (field.valueType === "attendanceInput" ? "Number of participants" : "")}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
              startAdornment: field.name === "totalPrice" || field.name.toLowerCase().includes("price") ||
                field.name === "subtotal" || field.name === "discount_amount" ?
                <InputAdornment position="start">$</InputAdornment> : undefined,
              readOnly: field.valueType === "dynamic",
            }}
            inputProps={{
              min: field.valueType === "attendanceInput" ? 1 : undefined,
              step: field.valueType === "attendanceInput" ? 1 : undefined
            }}
          />
        );
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!fieldValues[field.name]}
                onChange={(e) => handleBooleanChange(field.name, e.target.checked)}
                name={field.name}
                disabled={field.valueType === "fixed" || field.valueType === "dynamic"}
                color="primary"
              />
            }
            label={
              <Typography variant="body1">
                {field.displayName}
              </Typography>
            }
            sx={{ mb: 1 }}
          />
        );
      case "checkBoxGroup":
        return (
          <StyledFormControl margin="normal" fullWidth>
            <FormLabel component="legend">{field.displayName}</FormLabel>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 1 }}>
              <FormGroup>
                {(field.options || []).map((option) => (
                  <FormControlLabel
                    key={option.fieldName}
                    control={
                      <Checkbox
                        checked={fieldValues[field.name]?.includes(option.fieldName) || false}
                        onChange={(e) => handleCheckboxChange(field.name, option.fieldName, e.target.checked)}
                        name={option.fieldName}
                        disabled={field.valueType === "fixed" || field.valueType === "dynamic"}
                        color="primary"
                      />
                    }
                    label={option.labelName}
                  />
                ))}
              </FormGroup>
            </Paper>
            {errors[field.name] && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors[field.name]}
              </Typography>
            )}
          </StyledFormControl>
        );
      case "radioButtonGroup":
      case "option":
        return (
          <StyledFormControl margin="normal" fullWidth>
            <FormLabel component="legend">{field.displayName}</FormLabel>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 1 }}>
              <RadioGroup
                name={field.name}
                value={fieldValues[field.name] || ""}
                onChange={(e) => handleRadioChange(field.name, e.target.value)}
              >
                {(field.options || []).map((option) => (
                  <FormControlLabel
                    key={option.fieldName}
                    value={option.fieldName}
                    control={<Radio color="primary" />}
                    label={
                      <Typography variant="body1">
                        {option.labelName}
                      </Typography>
                    }
                    disabled={field.valueType === "fixed" || field.valueType === "dynamic"}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </Paper>
            {errors[field.name] && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors[field.name]}
              </Typography>
            )}
          </StyledFormControl>
        );
      default:
        return null;
    }
  };

  // Render step content
  const renderEventDetails = (): JSX.Element => (
    <StyledPaper>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <EventIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5">
          Event Information
        </Typography>
      </Box>
      
      {eventData.metadata?.imageUrl && (
        <EventImage src={eventData.metadata.imageUrl} alt={eventData.name} />
      )}
      
      <Typography variant="h4" gutterBottom>
        {eventData.name}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        {eventData.description}
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Location
          </Typography>
          <Typography variant="body1" gutterBottom>
            {eventData.location}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Date & Time
          </Typography>
          <Typography variant="body1" gutterBottom>
            {formatDate(eventData.startingDate)} {eventData.endingDate && `to ${formatDate(eventData.endingDate)}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Registration Period
          </Typography>
          <Typography variant="body1" gutterBottom>
            {formatDate(eventData.registrationStartDate)} to {formatDate(eventData.registrationEndDate)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Available Seats
          </Typography>
          <Typography variant="body1" gutterBottom>
            {eventData.seatsAvailable - eventData.totalregisteredSeats} of {eventData.seatsAvailable}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Registration Type
          </Typography>
          <Typography variant="body1" gutterBottom>
            {isFreeEvent ? (
              <Chip label="Free Event" color="success" size="small" />
            ) : (
              <Chip label="Paid Event" color="primary" size="small" />
            )}
          </Typography>
        </Grid>
      </Grid>
      
      <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
        Please review the event details and click "Next" to proceed with your registration.
      </Alert>
    </StyledPaper>
  );

  const renderAttendeeInformation = (): JSX.Element => {
    // Use the personal info fields we defined
    const registrationFields = (eventData.registrationFields || []).filter(
      field => field.valueType === "userInput"
    );
    
    return (
      <StyledPaper>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">
            {isDonationEvent ? "Donor Information" : "Participant Information"}
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          {isDonationEvent ? "Your Information" : "Personal Information"}
        </Typography>
        
        {personalInfoFields.map((field) => (
          <Box key={field.name}>
            {renderField(field)}
          </Box>
        ))}
        
        {registrationFields.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              {isDonationEvent ? "Donation Options" : "Registration Options"}
            </Typography>
            
            {registrationFields.map((field: any) => (
              <Box key={field.name}>
                {renderField(field)}
              </Box>
            ))}
          </>
        )}
        
        {/* Show price summary for paid events */}
        {!isFreeEvent && (eventData.registrationFields || []).some(field => field.valueType === "dynamic") && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              {isDonationEvent ? "Donation Summary" : "Price Summary"}
            </Typography>
            
            <PriceSummary>
              <Grid container spacing={1}>
                {(eventData.registrationFields || [])
                  .filter(field => field.valueType === "dynamic")
                  .map((field) => (
                    <Grid item xs={12} key={field.name} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1">
                        {field.displayName}:
                      </Typography>
                      <Typography variant="body1" fontWeight={field.name === "totalPrice" ? "bold" : "normal"}>
                        {formatCurrency(calculatedValues[field.name] || 0)}
                      </Typography>
                    </Grid>
                  ))}
              </Grid>
            </PriceSummary>
          </>
        )}
      </StyledPaper>
    );
  };

  const renderOrderSummary = (): JSX.Element => {
    // This is shown for paid events (both regular and donation)
    return (
      <StyledPaper>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <PaymentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">
            {isDonationEvent ? "Donation Summary" : "Order Summary"}
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          Please review your {isDonationEvent ? "donation" : "order"} details before proceeding to payment.
        </Alert>
        
        <StyledPaper sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                {isDonationEvent ? "Cause" : "Event"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {eventData.name}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                {isDonationEvent ? "Donor" : "Attendee"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {fieldValues.fullName || "N/A"}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {fieldValues.email || "N/A"}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {fieldValues.phone || "N/A"}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {/* Dynamically render selected options */}
            {Object.entries(fieldValues).map(([key, value]) => {
              // Skip personal info fields and empty values
              if (["fullName", "email", "phone"].includes(key) || !value) return null;
              
              const registrationFields = eventData.registrationFields || [];
              const field = registrationFields.find(f => f.name === key);
              if (!field) return null;
              
              return (
                <Grid item xs={12} key={key}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.displayName}
                  </Typography>
                  {typeof value === "boolean" ? (
                    <Typography variant="body1" gutterBottom>
                      {value ? "Yes" : "No"}
                    </Typography>
                  ) : Array.isArray(value) ? (
                    value.map((optionValue: string) => {
                      const option = (field.options || []).find(opt => opt.fieldName === optionValue);
                      return (
                        <Typography key={optionValue} variant="body1" gutterBottom>
                          {option?.labelName || optionValue}
                        </Typography>
                      );
                    })
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      {(field.options || []).find(opt => opt.fieldName === value)?.labelName || value}
                    </Typography>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </StyledPaper>
        
        {(eventData.registrationFields || []).some(field => field.valueType === "dynamic") && (
          <PriceSummary>
            <Grid container spacing={1}>
              {(eventData.registrationFields || [])
                .filter(field => field.valueType === "dynamic" && field.name !== "totalPrice")
                .map((field) => (
                  <Grid item xs={12} key={field.name} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">
                      {field.displayName}:
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(calculatedValues[field.name] || 0)}
                    </Typography>
                  </Grid>
                ))}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">
                  {isDonationEvent ? "Total Donation:" : "Total:"}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(calculatedValues.totalPrice || 0)}
                </Typography>
              </Grid>
            </Grid>
          </PriceSummary>
        )}
        
        <SecurePaymentBadge>
          <LockIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            You'll be redirected to our secure payment gateway after confirming your {isDonationEvent ? "donation" : "order"}
          </Typography>
        </SecurePaymentBadge>
      </StyledPaper>
    );
  };

  const renderConfirmation = (): JSX.Element => (
    <StyledPaper>
      <Box sx={{ textAlign: "center", py: 3 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          {isDonationEvent ? "Donation Complete!" : "Registration Complete!"}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Thank you for {isDonationEvent ? "your generous donation to" : "registering for"} {eventData.name}. 
          Your {isDonationEvent ? "donation" : "registration"} has been confirmed.
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Confirmation Number
        </Typography>
        
        <Chip 
          label={confirmationNumber} 
          color="primary" 
          sx={{ fontSize: "1.2rem", py: 3, px: 2, mb: 3 }} 
        />
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          A confirmation email has been sent to {fieldValues.email} with all the details.
        </Typography>
        
        <StyledPaper sx={{ textAlign: "left", mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isDonationEvent ? "Donation Details" : "Event Details"}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {isDonationEvent ? "Cause" : "Event"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {eventData.name}
              </Typography>
            </Grid>
            
            {!isDonationEvent && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(eventData.startingDate)}
                </Typography>
              </Grid>
            )}
            
            {!isDonationEvent && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {eventData.location}
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {isDonationEvent ? "Donor" : "Attendee"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {fieldValues.fullName}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {!isFreeEvent && (calculatedValues.totalPrice ?? 0) > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {isDonationEvent ? "Total Donated" : "Total Paid"}
                </Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  {formatCurrency(calculatedValues.totalPrice || 0)}
                </Typography>
              </Grid>
            )}
            
            {isFreeEvent && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registration Type
                </Typography>
                <Chip label="Free Event" color="success" size="small" />
              </Grid>
            )}
          </Grid>
        </StyledPaper>
        
        <Box sx={{ mt: 4 }}>
          <AnimatedButton
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, px: 4 }}
            onClick={() => window.print()}
          >
            Print Confirmation
          </AnimatedButton>
        </Box>
      </Box>
    </StyledPaper>
  );

  const getStepContent = (step: number): JSX.Element | string => {
    if (isDonationEvent) {
      // For donation events, we have only 3 steps starting with Donor Information
      switch (step) {
        case 0:
          return renderAttendeeInformation(); // Donor Information
        case 1:
          return renderOrderSummary(); // Donation Summary
        case 2:
          return renderConfirmation();
        default:
          return "Unknown step";
      }
    } else if (isFreeEvent) {
      // For free events, we have only 3 steps
      switch (step) {
        case 0:
          return renderEventDetails();
        case 1:
          return renderAttendeeInformation();
        case 2:
          return renderConfirmation();
        default:
          return "Unknown step";
      }
    } else {
      // For paid events, we have 4 steps
      switch (step) {
        case 0:
          return renderEventDetails();
        case 1:
          return renderAttendeeInformation();
        case 2:
          return renderOrderSummary();
        case 3:
          return renderConfirmation();
        default:
          return "Unknown step";
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <StyledCard elevation={3}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" gutterBottom>
            {isDonationEvent ? "Make a Donation" : "Event Registration"}
          </Typography>

          {/* Authentication Status and Loading */}
          {isCheckingAuth && (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Checking authentication status...
              </Typography>
            </Box>
          )}

          {/* Authentication Error */}
          {authError && !isCheckingAuth && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {authError}
              {!isUserAuthenticated && eventData.allowLogin && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Please log in to continue with registration.
                  </Typography>
                </Box>
              )}
            </Alert>
          )}

          {/* Authentication Success for Member-only Events */}
          {isUserAuthenticated && eventData.allowMemberLogin && membershipStatus === 'active' && !authError && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Welcome! Your membership is active and you can proceed with registration.
            </Alert>
          )}

          {/* Show form only if authentication checks pass */}
          {!isCheckingAuth && !authError && (
            <>
          
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ 
              mb: 4,
              "& .MuiStepConnector-line": {
                minHeight: 12,
              },
              "& .MuiStepIcon-root": {
                fontSize: 28,
              }
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StyledStepLabel icon={step.icon}>
                  {step.label}
                </StyledStepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 4,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider"
          }}>
            <AnimatedButton 
              disabled={activeStep === 0 || activeStep === (isDonationEvent ? 2 : (isFreeEvent ? 2 : 3))} 
              onClick={handleBack} 
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: 2 }}
            >
              Back
            </AnimatedButton>
            
            <Box>
              {activeStep === (isDonationEvent ? 2 : (isFreeEvent ? 2 : 3)) ? (
                <AnimatedButton 
                  variant="contained" 
                  color="primary" 
                  onClick={() => window.location.href = "/"}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Return Home
                </AnimatedButton>
              ) : activeStep === (isDonationEvent ? 1 : (isFreeEvent ? -1 : 2)) && !isFreeEvent ? (
                <AnimatedButton 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                      Processing...
                    </>
                  ) : (
                    isDonationEvent ? "Complete Donation" : "Proceed to Payment"
                  )}
                </AnimatedButton>
              ) : (
                <AnimatedButton 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNext}
                  disabled={(isDonationEvent ? activeStep === 0 : activeStep === 1) && isSubmitting}
                  endIcon={(isDonationEvent ? activeStep === 0 : activeStep === 1) && isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  {(isDonationEvent ? activeStep === 0 : activeStep === 1) && isSubmitting ? "Processing..." : "Next"}
                </AnimatedButton>
              )}
            </Box>
          </Box>
          </>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
}