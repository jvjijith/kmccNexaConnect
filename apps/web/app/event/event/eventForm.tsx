"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  FormLabel,
  InputAdornment,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { Event, RegistrationField, Option, Formula } from "../../../types/event"

interface EventFormProps {
  onEventCreated: (event: Event) => void
}

export default function EventForm({ onEventCreated }: EventFormProps) {
  const [activeStep, setActiveStep] = useState(0)
  const steps = ["Basic Information", "Location & Access", "Registration & Payment"]

  const [formData, setFormData] = useState<Partial<Event>>({
    name: "",
    description: "",
    type: "public",
    metadata: {
      name: "",
      description: "",
      imageUrl: ""
    },
    location: "",
    GeoAllow: {
      location: "",
      coordinates: [0, 0],
    },
    allowGuest: false,
    allowLogin: true,
    allowMemberLogin: false,
    customAttendance: false,
    eventType: "regular",
    seatsAvailable: 0,
    totalregisteredSeats: 0,
    registrationFields: [],
    eventStatus: "Draft",
    startingDate: "",
    endingDate: "",
    paymentType: "Free",
    priceConfig: {
      type: "fixed",
      amount: 0,
    },
    registrationStartDate: "",
    registrationEndDate: "",
  })

  // Store user input values for registration fields
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({})

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newField, setNewField] = useState<Partial<RegistrationField>>({
    name: "",
    displayName: "",
    type: "text",
    valueType: "userInput",
    options: [],
    formula: []
  })
  const [newOption, setNewOption] = useState<Partial<Option>>({
    fieldName: "",
    parentName: "",
    labelName: "",
  })
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null)
  const [newFormula, setNewFormula] = useState<Partial<Formula>>({
    type: "customField",
    fieldName: "",
    operationName: ""
  })

  // Check if this is a donation or fundraiser event based on eventType
  const isDonationEvent = formData.eventType === "donation" || formData.eventType === "fundraiser"

  // Calculate dynamic fields when field values change
  useEffect(() => {
    if (formData.registrationFields && formData.registrationFields.length > 0) {
      calculateDynamicFields()
    }
  }, [fieldValues, formData.registrationFields])

  const calculateDynamicFields = () => {
    const calculatedValues: Record<string, number> = {}
    
    formData.registrationFields?.forEach(field => {
      if (field.valueType === "dynamic" && field.formula && field.formula.length > 0) {
        calculatedValues[field.name] = evaluateFormula(field.formula, fieldValues)
      }
    })
    
    // Update field values with calculated values
    setFieldValues(prev => ({
      ...prev,
      ...calculatedValues
    }))
  }

  const evaluateFormula = (formula: Formula[], values: Record<string, any>): number => {
    let result = 0
    let currentOperation = "add"
    
    formula.forEach(item => {
      let value = 0
      
      if (item.type === "number") {
        // Handle direct number values
        value = Number(item.fieldName) || 0
      } else if (item.type === "customField" && item.fieldName) {
        value = getFieldValue(item.fieldName, values)
      } else if (item.type === "operation" && item.operationName) {
        currentOperation = item.operationName
        return
      }
      
      switch (currentOperation) {
        case "add":
          result += value
          break
        case "subtract":
          result -= value
          break
        case "multiply":
          result *= value
          break
        case "divide":
          if (value !== 0) result /= value
          break
        default:
          result += value
      }
    })
    
    return result
  }

  const getFieldValue = (fieldName: string, values: Record<string, any>): number => {
    const value = values[fieldName]
    
    if (typeof value === "number") {
      return value
    }
    
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value)
      return Number.isNaN(parsed) ? 0 : parsed
    }
    
    if (typeof value === "boolean") {
      // For boolean fields, check if they have truth/false values defined
      const field = formData.registrationFields?.find(f => f.name === fieldName)
      if (field && field.type === "boolean") {
        return value ? (field.truthValue || 1) : (field.falseValue || 0)
      }
      return value ? 1 : 0
    }
    
    return 0
  }

  // Fixed input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name && name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        
        if (parent && child) {
          if (parent in formData) {
            const parentObj = formData[parent as keyof Event];
            
            if (parentObj && typeof parentObj === 'object' && !Array.isArray(parentObj)) {
              setFormData({
                ...formData,
                [parent]: {
                  ...parentObj,
                  [child]: value,
                },
              });
            }
          }
        }
      }
    } else if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Fixed select change handler
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name && name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        
        if (parent && child) {
          if (parent in formData) {
            const parentObj = formData[parent as keyof Event];
            
            if (parentObj && typeof parentObj === 'object' && !Array.isArray(parentObj)) {
              setFormData({
                ...formData,
                [parent]: {
                  ...parentObj,
                  [child]: value,
                },
              });
            }
          }
        }
      }
    } else if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle change for registration field values
  const handleFieldValueChange = (fieldName: string, value: any) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle radio button change
  const handleRadioChange = (fieldName: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (fieldName: string, optionFieldName: string, checked: boolean) => {
    const currentValues = fieldValues[fieldName] || [];
    let newValues;
    
    if (checked) {
      // Add the value if checked
      newValues = [...currentValues, optionFieldName];
    } else {
      // Remove the value if unchecked
      newValues = currentValues.filter((v: string) => v !== optionFieldName);
    }
    
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: newValues
    }));
  };

  // Handle boolean field change
  const handleBooleanChange = (fieldName: string, checked: boolean) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: checked
    }));
  };

  const handleCoordinateChange = (index: number, value: string) => {
    // Ensure GeoAllow exists (note the capital G in GeoAllow)
    const GeoAllow = formData.GeoAllow || { location: "", coordinates: [0, 0] }
    const newCoordinates = [...(GeoAllow.coordinates || [0, 0])]
    newCoordinates[index] = Number.parseFloat(value)

    setFormData({
      ...formData,
      GeoAllow: {
        ...GeoAllow,
        coordinates: newCoordinates as [number, number],
      },
    })
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  // Fixed new field change handler
  const handleNewFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewField({
      ...newField,
      [name]: value,
    });
  };

  // Fixed new field select change handler
  const handleNewFieldSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewField({
      ...newField,
      [name]: value,
    });
  };

  const handleNewOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name) {
      setNewOption({
        ...newOption,
        [name]: value,
      })
    }
  }

  // Fixed new formula change handler
  const handleNewFormulaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewFormula({
      ...newFormula,
      [name]: value,
    });
  };

  // Fixed new formula select change handler
  const handleNewFormulaSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewFormula({
      ...newFormula,
      [name]: value,
    });
  };

  const addRegistrationField = () => {
    if (newField.name && newField.displayName && newField.type) {
      const field: RegistrationField = {
        name: newField.name,
        displayName: newField.displayName,
        type: newField.type || "text",
        valueType: newField.valueType || "userInput",
        options: newField.options || [],
        formula: newField.formula || []
      }

      setFormData({
        ...formData,
        registrationFields: [...(formData.registrationFields || []), field]
      })

      // Reset new field form
      setNewField({
        name: "",
        displayName: "",
        type: "text",
        valueType: "userInput",
        options: [],
        formula: []
      })
    }
  }

  const addOptionToField = () => {
    if (selectedFieldIndex !== null && newOption.fieldName && newOption.labelName) {
      const updatedFields = [...(formData.registrationFields || [])]
      if (updatedFields[selectedFieldIndex]) {
        const currentOptions = updatedFields[selectedFieldIndex].options || []
        updatedFields[selectedFieldIndex].options = [
          ...currentOptions,
          {
            fieldName: newOption.fieldName,
            parentName: newOption.parentName || updatedFields[selectedFieldIndex].name,
            labelName: newOption.labelName
          }
        ]
        
        setFormData({
          ...formData,
          registrationFields: updatedFields
        })
        
        // Reset new option form
        setNewOption({
          fieldName: "",
          parentName: "",
          labelName: "",
        })
      }
    }
  }

  const addFormulaToField = (fieldIndex: number) => {
    if (newFormula.type) {
      const updatedFields = [...(formData.registrationFields || [])]
      if (updatedFields[fieldIndex]) {
        const currentFormulas = updatedFields[fieldIndex].formula || []
        updatedFields[fieldIndex].formula = [
          ...currentFormulas,
          {
            type: newFormula.type,
            fieldName: newFormula.fieldName,
            operationName: newFormula.operationName
          } as Formula
        ]
        
        setFormData({
          ...formData,
          registrationFields: updatedFields
        })
        
        // Reset new formula form
        setNewFormula({
          type: "customField",
          fieldName: "",
          operationName: ""
        })
      }
    }
  }

  const removeRegistrationField = (index: number) => {
    const updatedFields = [...(formData.registrationFields || [])]
    updatedFields.splice(index, 1)
    setFormData({
      ...formData,
      registrationFields: updatedFields
    })
  }

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...(formData.registrationFields || [])]
    if (updatedFields[fieldIndex] && updatedFields[fieldIndex].options) {
      updatedFields[fieldIndex].options!.splice(optionIndex, 1)
      setFormData({
        ...formData,
        registrationFields: updatedFields
      })
    }
  }

  const removeFormula = (fieldIndex: number, formulaIndex: number) => {
    const updatedFields = [...(formData.registrationFields || [])]
    if (updatedFields[fieldIndex] && updatedFields[fieldIndex].formula) {
      updatedFields[fieldIndex].formula!.splice(formulaIndex, 1)
      setFormData({
        ...formData,
        registrationFields: updatedFields
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Basic Information
        if (!formData.name) newErrors.name = "Event name is required"
        if (!formData.description) newErrors.description = "Event description is required"
        if (!formData.startingDate) newErrors.startingDate = "Starting date is required"
        if (!formData.endingDate) newErrors.endingDate = "Ending date is required"
        break
      case 1: // Location & Access
        if (!formData.location) newErrors.location = "Location is required"
        break
      case 2: // Registration & Payment
        if (!formData.registrationStartDate) newErrors.registrationStartDate = "Registration start date is required"
        if (!formData.registrationEndDate) newErrors.registrationEndDate = "Registration end date is required"
        if (formData.paymentType === "Fixed Price" && (!formData.priceConfig?.amount || formData.priceConfig.amount <= 0)) {
          newErrors.amount = "Price amount is required for fixed price events"
        }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateStep(activeStep)) {
      const eventData = { ...formData } as Event
      onEventCreated(eventData)
    }
  }

  // Render field for preview/testing
  const renderFieldPreview = (field: RegistrationField): JSX.Element | null => {
    const dynamicValue = field.valueType === "dynamic" ? fieldValues[field.name] : undefined;

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
            variant="outlined"
            size="small"
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
            variant="outlined"
            size="small"
            slotProps={{
              htmlInput: {
                startAdornment: field.name === "totalPrice" || field.name.toLowerCase().includes("price") ||
                  field.name === "subtotal" || field.name === "discount_amount" ?
                  <InputAdornment position="start">$</InputAdornment> : undefined,
                readOnly: field.valueType === "dynamic",
                min: field.valueType === "attendanceInput" ? 1 : undefined,
                step: field.valueType === "attendanceInput" ? 1 : undefined
              }
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
          <FormControl margin="normal" fullWidth>
            <FormLabel component="legend">{field.displayName}</FormLabel>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 1 }}>
              <FormGroup>
                {(field.options || []).map((option) => (
                  <FormControlLabel
                    key={option.fieldName}
                    control={
                      <Checkbox
                        checked={fieldValues[field.name]?.includes(option.fieldName) || false}
                        onChange={(e) => handleCheckboxChange(field.name, option.fieldName || "", e.target.checked)}
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
          </FormControl>
        );
      case "radioButtonGroup":
      case "option":
        return (
          <FormControl margin="normal" fullWidth>
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
                  />
                ))}
              </RadioGroup>
            </Paper>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Event Name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Event Type</InputLabel>
          <Select
            name="type"
            value={formData.type || "public"}
            onChange={handleSelectChange}
            label="Event Type"
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="members">Members Only</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Event Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Metadata Name"
          name="metadata.name"
          value={formData.metadata?.name || ""}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Metadata Description"
          name="metadata.description"
          value={formData.metadata?.description || ""}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Image URL"
          name="metadata.imageUrl"
          value={formData.metadata?.imageUrl || ""}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Starting Date"
          name="startingDate"
          type="datetime-local"
          value={formData.startingDate || ""}
          onChange={handleInputChange}
          error={!!errors.startingDate}
          helperText={errors.startingDate}
          required
          slotProps={{
            htmlInput: {
              shrink: true,
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Ending Date"
          name="endingDate"
          type="datetime-local"
          value={formData.endingDate || ""}
          onChange={handleInputChange}
          error={!!errors.endingDate}
          helperText={errors.endingDate}
          required
          slotProps={{
            htmlInput: {
              shrink: true,
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Event Status</InputLabel>
          <Select
            name="eventStatus"
            value={formData.eventStatus || "Draft"}
            onChange={handleSelectChange}
            label="Event Status"
          >
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Live">Live</MenuItem>
            <MenuItem value="Staging">Staging</MenuItem>
            <MenuItem value="Prestaging">Prestaging</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      {isDonationEvent && (
        <>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Donation Settings
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  )

  const renderLocationAndAccess = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location || ""}
          onChange={handleInputChange}
          error={!!errors.location}
          helperText={errors.location}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Geo Location Name"
          name="GeoAllow.location"
          value={formData.GeoAllow?.location || ""}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Longitude"
          type="number"
          value={formData.GeoAllow?.coordinates?.[0] || 0}
          onChange={(e) => handleCoordinateChange(0, e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Latitude"
          type="number"
          value={formData.GeoAllow?.coordinates?.[1] || 0}
          onChange={(e) => handleCoordinateChange(1, e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Access Settings
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.allowGuest || false}
              onChange={handleSwitchChange}
              name="allowGuest"
            />
          }
          label="Allow Guests"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.allowLogin || false}
              onChange={handleSwitchChange}
              name="allowLogin"
            />
          }
          label="Allow Login"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.allowMemberLogin || false}
              onChange={handleSwitchChange}
              name="allowMemberLogin"
            />
          }
          label="Allow Member Login"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.customAttendance || false}
              onChange={handleSwitchChange}
              name="customAttendance"
            />
          }
          label="Custom Attendance Tracking"
        />
      </Grid>
    </Grid>
  )

  const renderRegistrationAndPayment = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Seats Available"
          name="seatsAvailable"
          type="number"
          value={formData.seatsAvailable || 0}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Total Registered Seats"
          name="totalregisteredSeats"
          type="number"
          value={formData.totalregisteredSeats || 0}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Registration Start Date"
          name="registrationStartDate"
          type="datetime-local"
          value={formData.registrationStartDate || ""}
          onChange={handleInputChange}
          error={!!errors.registrationStartDate}
          helperText={errors.registrationStartDate}
          required
          slotProps={{
            htmlInput: {
              shrink: true,
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Registration End Date"
          name="registrationEndDate"
          type="datetime-local"
          value={formData.registrationEndDate || ""}
          onChange={handleInputChange}
          error={!!errors.registrationEndDate}
          helperText={errors.registrationEndDate}
          required
          slotProps={{
            htmlInput: {
              shrink: true,
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Event Type</InputLabel>
          <Select
            name="eventType"
            value={formData.eventType || "regular"}
            onChange={handleSelectChange}
            label="Event Type"
          >
            <MenuItem value="regular">Regular Event</MenuItem>
            <MenuItem value="donation">Donation Event</MenuItem>
            <MenuItem value="fundraiser">Fundraiser Event</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Payment Type</InputLabel>
          <Select
            name="paymentType"
            value={formData.paymentType || "Free"}
            onChange={handleSelectChange}
            label="Payment Type"
          >
            <MenuItem value="Free">Free</MenuItem>
            <MenuItem value="Fixed Price">Fixed Price</MenuItem>
            <MenuItem value="registration Payment">Registration Payment</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {formData.paymentType === "Fixed Price" && (
        <>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Price Type</InputLabel>
              <Select
                name="priceConfig.type"
                value={formData.priceConfig?.type || "fixed"}
                onChange={handleSelectChange}
                label="Price Type"
              >
                <MenuItem value="fixed">Fixed</MenuItem>
                <MenuItem value="dynamic">Dynamic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              name="priceConfig.amount"
              type="number"
              value={formData.priceConfig?.amount || 0}
              onChange={handleInputChange}
              error={!!errors.amount}
              helperText={errors.amount}
              slotProps={{
                htmlInput: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }
              }}
            />
          </Grid>
        </>
      )}

      {/* Registration Fields Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Registration Fields
        </Typography>
      </Grid>

      {/* Add New Field Form */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add New Registration Field
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field Name"
                name="name"
                value={newField.name || ""}
                onChange={handleNewFieldChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Display Name"
                name="displayName"
                value={newField.displayName || ""}
                onChange={handleNewFieldChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Field Type</InputLabel>
                <Select
                  name="type"
                  value={newField.type || "text"} 
                  onChange={handleNewFieldSelectChange}
                  label="Field Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="boolean">Boolean</MenuItem>
                  <MenuItem value="option">Option (Radio)</MenuItem>
                  <MenuItem value="checkBoxGroup">Checkbox Group</MenuItem>
                  <MenuItem value="radioButtonGroup">Radio Button Group</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Value Type</InputLabel>
                <Select
                  name="valueType"
                  value={newField.valueType || "userInput"}
                  onChange={handleNewFieldSelectChange}
                  label="Value Type"
                >
                  <MenuItem value="userInput">User Input</MenuItem>
                  <MenuItem value="attendanceInput">Attendance Input</MenuItem>
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="dynamic">Dynamic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={addRegistrationField}
                startIcon={<AddIcon />}
                disabled={!newField.name || !newField.displayName}
              >
                Add Field
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Display Existing Fields */}
      {formData.registrationFields && formData.registrationFields.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Current Registration Fields
          </Typography>
          {formData.registrationFields.map((field, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2">
                  {field.displayName} ({field.name}) - 
                  Type: {field.type}, Value Type: {field.valueType}
                </Typography>
                <IconButton
                  onClick={() => removeRegistrationField(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Field Preview */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Field Preview:
                </Typography>
                {renderFieldPreview(field)}
              </Box>

              {/* Field Configuration */}
              <Grid container spacing={2}>
                {/* Fixed Value Input */}
                {field.valueType === "fixed" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fixed Value"
                      type={field.type === "number" ? "number" : "text"}
                      value={field.fixedValue || (field.type === "number" ? 0 : "")}
                      onChange={(e) => {
                        const updatedFields = [...(formData.registrationFields || [])];
                        if (updatedFields[index]) {
                          updatedFields[index].fixedValue = field.type === "number" ? Number(e.target.value) : e.target.value;
                          setFormData({
                            ...formData,
                            registrationFields: updatedFields
                          });
                        }
                      }}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                )}

                {/* Boolean field specific settings */}
                {field.type === "boolean" && (
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="True Value"
                        type="number"
                        size="small"
                        value={field.truthValue || 0}
                        onChange={(e) => {
                          const updatedFields = [...(formData.registrationFields || [])];
                          if (updatedFields[index]) {
                            updatedFields[index].truthValue = Number(e.target.value);
                            setFormData({
                              ...formData,
                              registrationFields: updatedFields
                            });
                          }
                        }}
                      />
                      <TextField
                        label="False Value"
                        type="number"
                        size="small"
                        value={field.falseValue || 0}
                        onChange={(e) => {
                          const updatedFields = [...(formData.registrationFields || [])];
                          if (updatedFields[index]) {
                            updatedFields[index].falseValue = Number(e.target.value);
                            setFormData({
                              ...formData,
                              registrationFields: updatedFields
                            });
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Options for select/radio/checkbox fields */}
                {(field.type === "checkBoxGroup" || field.type === "radioButtonGroup" || field.type === "option") && (
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      Options:
                    </Typography>
                    {field.options && field.options.map((option, optIndex) => (
                      <Box key={optIndex} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          label="Field Name"
                          value={option.fieldName || ""}
                          onChange={(e) => {
                            const updatedFields = [...(formData.registrationFields || [])];
                            if (updatedFields[index] && updatedFields[index].options && updatedFields[index].options![optIndex]) {
                              updatedFields[index].options![optIndex].fieldName = e.target.value;
                              setFormData({
                                ...formData,
                                registrationFields: updatedFields
                              });
                            }
                          }}
                        />
                        <TextField
                          size="small"
                          label="Label"
                          value={option.labelName || ""}
                          onChange={(e) => {
                            const updatedFields = [...(formData.registrationFields || [])];
                            if (updatedFields[index] && updatedFields[index].options && updatedFields[index].options![optIndex]) {
                              updatedFields[index].options![optIndex].labelName = e.target.value;
                              setFormData({
                                ...formData,
                                registrationFields: updatedFields
                              });
                            }
                          }}
                        />
                        <IconButton
                          onClick={() => removeOption(index, optIndex)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    {/* Add new option */}
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <TextField
                        size="small"
                        label="New Option Field Name"
                        name="fieldName"
                        value={newOption.fieldName || ""}
                        onChange={handleNewOptionChange}
                      />
                      <TextField
                        size="small"
                        label="New Option Label"
                        name="labelName"
                        value={newOption.labelName || ""}
                        onChange={handleNewOptionChange}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedFieldIndex(index);
                          addOptionToField();
                        }}
                        disabled={!newOption.fieldName || !newOption.labelName}
                      >
                        Add Option
                      </Button>
                    </Box>
                  </Grid>
                )}

                {/* Formula for dynamic fields */}
                {field.valueType === "dynamic" && (
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      Formula:
                    </Typography>
                    {field.formula && field.formula.map((formula, formulaIndex) => (
                      <Box key={formulaIndex} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          label="Type"
                          value={formula.type || ""}
                          disabled
                        />
                        <TextField
                          size="small"
                          label="Field/Operation"
                          value={formula.fieldName || formula.operationName || ""}
                          disabled
                        />
                        <IconButton
                          onClick={() => removeFormula(index, formulaIndex)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    {/* Add new formula */}
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          name="type"
                          value={newFormula.type || "customField"}
                          onChange={handleNewFormulaSelectChange}
                          label="Type"
                        >
                          <MenuItem value="customField">Custom Field</MenuItem>
                          <MenuItem value="operation">Operation</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        label={newFormula.type === "operation" ? "Operation" : "Field Name"}
                        name={newFormula.type === "operation" ? "operationName" : "fieldName"}
                        value={newFormula.type === "operation" ? newFormula.operationName || "" : newFormula.fieldName || ""}
                        onChange={handleNewFormulaChange}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => addFormulaToField(index)}
                        disabled={!newFormula.type || (!newFormula.fieldName && !newFormula.operationName)}
                      >
                        Add Formula
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))}
        </Grid>
      )}
    </Grid>
  )

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation()
      case 1:
        return renderLocationAndAccess()
      case 2:
        return renderRegistrationAndPayment()
      default:
        return "Unknown step"
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" color="primary">
              Create Event
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}