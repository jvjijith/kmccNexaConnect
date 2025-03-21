"use client"

import type React from "react"

import { useState } from "react"
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
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import type { Event, RegistrationField, Option } from "./event"

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
    },
    location: "",
    geoAllow: {
      location: "",
      coordinates: [0, 0],
    },
    allowGuest: false,
    allowLogin: true,
    allowMemberLogin: false,
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

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newField, setNewField] = useState<Partial<RegistrationField>>({
    name: "",
    displayName: "",
    type: "text",
    valueType: "userInput",
  })
  const [newOption, setNewOption] = useState<Partial<Option>>({
    fieldName: "",
    parentName: "",
    labelName: "",
  })
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    
    if (name && name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        
        // Make sure both parent and child are defined
        if (parent && child) {
          // Check if parent exists in formData
          if (parent in formData) {
            const parentObj = formData[parent as keyof Event];
            
            // Make sure parentObj is a valid object for spreading
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

  const handleCoordinateChange = (index: number, value: string) => {
    // Ensure geoAllow exists
    const geoAllow = formData.geoAllow || { location: "", coordinates: [0, 0] }
    const newCoordinates = [...(geoAllow.coordinates || [0, 0])]
    newCoordinates[index] = Number.parseFloat(value)

    setFormData({
      ...formData,
      geoAllow: {
        ...geoAllow,
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

  const handleNewFieldChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target
    if (name) {
      setNewField({
        ...newField,
        [name]: value,
      })
    }
  }

  const handleNewOptionChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setNewOption({
        ...newOption,
        [name]: value,
      })
    }
  }

  const addRegistrationField = () => {
    if (!newField.name || !newField.displayName) {
      return
    }

    const updatedFields = [...(formData.registrationFields || [])]
    updatedFields.push({
      name: newField.name,
      displayName: newField.displayName,
      type: newField.type || "text",
      valueType: newField.valueType || "userInput",
      options: [],
    })

    setFormData({
      ...formData,
      registrationFields: updatedFields,
    })

    setNewField({
      name: "",
      displayName: "",
      type: "text",
      valueType: "userInput",
    })
  }

  const addOptionToField = () => {
    if (!newOption.fieldName || !newOption.labelName || selectedFieldIndex === null) {
      return
    }

    const updatedFields = [...(formData.registrationFields || [])]
    // Make sure updatedFields[selectedFieldIndex] exists
    if (!updatedFields[selectedFieldIndex]) {
      return
    }
    
    const field = updatedFields[selectedFieldIndex]

    // Ensure field.options exists
    if (!field.options) {
      field.options = []
    }

    field.options.push({
      fieldName: newOption.fieldName,
      parentName: field.name || "",
      labelName: newOption.labelName,
    })

    setFormData({
      ...formData,
      registrationFields: updatedFields,
    })

    setNewOption({
      fieldName: "",
      parentName: "",
      labelName: "",
    })
  }

  const removeRegistrationField = (index: number) => {
    const updatedFields = [...(formData.registrationFields || [])]
    updatedFields.splice(index, 1)

    setFormData({
      ...formData,
      registrationFields: updatedFields,
    })

    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(null)
    }
  }

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...(formData.registrationFields || [])]
    // Make sure updatedFields[fieldIndex] exists
    if (!updatedFields[fieldIndex]) {
      return;
    }
    
    const field = updatedFields[fieldIndex]

    if (field.options) {
      field.options.splice(optionIndex, 1)

      setFormData({
        ...formData,
        registrationFields: updatedFields,
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (step === 0) {
      // Validate basic information
      if (!formData.name) {
        newErrors.name = "Event name is required"
        isValid = false
      }
      if (!formData.description) {
        newErrors.description = "Event description is required"
        isValid = false
      }
      if (!formData.startingDate) {
        newErrors.startingDate = "Starting date is required"
        isValid = false
      }
      if (!formData.endingDate) {
        newErrors.endingDate = "Ending date is required"
        isValid = false
      }
    } else if (step === 1) {
      // Validate location
      if (!formData.location) {
        newErrors.location = "Location is required"
        isValid = false
      }
      if (!formData.geoAllow?.location) {
        newErrors["geoAllow.location"] = "Geo location is required"
        isValid = false
      }
    } else if (step === 2) {
      // Validate registration
      if (formData.seatsAvailable === undefined || formData.seatsAvailable < 0) {
        newErrors.seatsAvailable = "Seats available must be a positive number"
        isValid = false
      }
      if (!formData.registrationStartDate) {
        newErrors.registrationStartDate = "Registration start date is required"
        isValid = false
      }
      if (!formData.registrationEndDate) {
        newErrors.registrationEndDate = "Registration end date is required"
        isValid = false
      }
      if (formData.paymentType !== "Free" && (!formData.priceConfig?.amount || formData.priceConfig.amount <= 0)) {
        newErrors["priceConfig.amount"] = "Price amount is required for paid events"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
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
      // Submit the form
      onEventCreated(formData as Event)
    }
  }

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Event Name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          multiline
          rows={4}
          label="Event Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          error={!!errors.description}
          helperText={errors.description}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Event Type</InputLabel>
          <Select name="type" value={formData.type || "public"} onChange={handleInputChange as any} label="Event Type">
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="members">Members Only</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Event Status</InputLabel>
          <Select
            name="eventStatus"
            value={formData.eventStatus || "Draft"}
            onChange={handleInputChange as any}
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
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Starting Date"
          name="startingDate"
          type="datetime-local"
          value={formData.startingDate || ""}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.startingDate}
          helperText={errors.startingDate}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Ending Date"
          name="endingDate"
          type="datetime-local"
          value={formData.endingDate || ""}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.endingDate}
          helperText={errors.endingDate}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Metadata
        </Typography>
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
    </Grid>
  )

  const renderLocationAndAccess = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Event Location"
          name="location"
          value={formData.location || ""}
          onChange={handleInputChange}
          error={!!errors.location}
          helperText={errors.location}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Geo Location
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Geo Location Name"
          name="geoAllow.location"
          value={formData.geoAllow?.location || ""}
          onChange={handleInputChange}
          error={!!errors["geoAllow.location"]}
          helperText={errors["geoAllow.location"]}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Longitude"
          type="number"
          inputProps={{ step: "0.000001", min: -180, max: 180 }}
          value={formData.geoAllow?.coordinates?.[0] || 0}
          onChange={(e) => handleCoordinateChange(0, e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Latitude"
          type="number"
          inputProps={{ step: "0.000001", min: -90, max: 90 }}
          value={formData.geoAllow?.coordinates?.[1] || 0}
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
          control={<Switch checked={formData.allowGuest || false} onChange={handleSwitchChange} name="allowGuest" />}
          label="Allow Guest Access"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={<Switch checked={formData.allowLogin || true} onChange={handleSwitchChange} name="allowLogin" />}
          label="Allow Login Access"
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
    </Grid>
  )

  const renderRegistrationAndPayment = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Seats Available"
          name="seatsAvailable"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.seatsAvailable || 0}
          onChange={handleInputChange}
          error={!!errors.seatsAvailable}
          helperText={errors.seatsAvailable}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Total Registered Seats"
          name="totalregisteredSeats"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.totalregisteredSeats || 0}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Registration Start Date"
          name="registrationStartDate"
          type="datetime-local"
          value={formData.registrationStartDate || ""}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.registrationStartDate}
          helperText={errors.registrationStartDate}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Registration End Date"
          name="registrationEndDate"
          type="datetime-local"
          value={formData.registrationEndDate || ""}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.registrationEndDate}
          helperText={errors.registrationEndDate}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Payment Settings
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Payment Type</InputLabel>
          <Select
            name="paymentType"
            value={formData.paymentType || "Free"}
            onChange={handleInputChange as any}
            label="Payment Type"
          >
            <MenuItem value="Free">Free</MenuItem>
            <MenuItem value="Fixed Price">Fixed Price</MenuItem>
            <MenuItem value="registration Payment">Registration Payment</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {formData.paymentType !== "Free" && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Price Configuration</InputLabel>
            <Select
              name="priceConfig.type"
              value={formData.priceConfig?.type || "fixed"}
              onChange={handleInputChange as any}
              label="Price Configuration"
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="dynamic">Dynamic</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      {formData.paymentType !== "Free" && formData.priceConfig?.type === "fixed" && (
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Price Amount"
            name="priceConfig.amount"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={formData.priceConfig?.amount || 0}
            onChange={handleInputChange}
            error={!!errors["priceConfig.amount"]}
            helperText={errors["priceConfig.amount"]}
          />
        </Grid>
      )}
      {formData.paymentType !== "Free" && formData.priceConfig?.type === "dynamic" && (
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dependent Field"
            name="priceConfig.dependantField"
            value={formData.priceConfig?.dependantField || ""}
            onChange={handleInputChange}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Registration Fields
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add New Registration Field
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Field Name"
                name="name"
                value={newField.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e)}
                placeholder="e.g., fullName"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Display Name"
                name="displayName"
                value={newField.displayName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e)}
                placeholder="e.g., Full Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select 
                  name="type" 
                  value={newField.type || "text"} 
                  onChange={handleNewFieldChange}
                  label="Field Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="boolean">Boolean</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="option">Option</MenuItem>
                  <MenuItem value="checkBoxGroup">Checkbox Group</MenuItem>
                  <MenuItem value="radioButtonGroup">Radio Button Group</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Value Type</InputLabel>
                <Select
                  name="valueType"
                  value={newField.valueType || "userInput"}
                  onChange={handleNewFieldChange}
                  label="Value Type"
                >
                  <MenuItem value="dynamic">Dynamic</MenuItem>
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="userInput">User Input</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={addRegistrationField}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add Field
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* List of Registration Fields */}
      {formData.registrationFields && formData.registrationFields.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Registration Fields
          </Typography>
          {formData.registrationFields.map((field, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="subtitle2">
                    {field.displayName} ({field.name})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {field.type}, Value Type: {field.valueType}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "right" }}>
                  <IconButton color="error" onClick={() => removeRegistrationField(index)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Grid>

                {/* Options for checkbox or radio button groups */}
                {(field.type === "checkBoxGroup" || field.type === "radioButtonGroup" || field.type === "option") && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" gutterBottom>
                        Options:
                      </Typography>
                      {field.options && field.options.length > 0 ? (
                        field.options.map((option, optionIndex) => (
                          <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                              {option.labelName} ({option.fieldName})
                            </Typography>
                            <IconButton color="error" onClick={() => removeOption(index, optionIndex)} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No options added yet.
                        </Typography>
                      )}

                      {/* Add option form */}
                      <Box sx={{ mt: 2, display: "flex", alignItems: "flex-end", gap: 1 }}>
                        <TextField
                          label="Option Field Name"
                          name="fieldName"
                          value={newOption.fieldName || ""}
                          onChange={handleNewOptionChange}
                          size="small"
                          sx={{ flexGrow: 1 }}
                        />
                        <TextField
                          label="Option Label"
                          name="labelName"
                          value={newOption.labelName || ""}
                          onChange={handleNewOptionChange}
                          size="small"
                          sx={{ flexGrow: 1 }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedFieldIndex(index)
                            addOptionToField()
                          }}
                        >
                          Add
                        </Button>
                      </Box>
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
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Event
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" color="primary" type="submit">
                Create Event
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}