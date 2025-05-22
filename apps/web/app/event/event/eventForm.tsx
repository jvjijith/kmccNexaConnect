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

  // Calculate dynamic field values whenever fieldValues or registrationFields change
  useEffect(() => {
    if (formData.registrationFields && formData.registrationFields.length > 0) {
      calculateDynamicFields();
    }
  }, [fieldValues, formData.registrationFields]);

  // Function to calculate values for dynamic fields based on formulas
  const calculateDynamicFields = () => {
    if (!formData.registrationFields) return;
    
    // Create a copy of field values to update
    const newFieldValues = { ...fieldValues };
    
    // First pass: calculate all fields with valueType "dynamic"
    formData.registrationFields.forEach(field => {
      if (field.valueType === "dynamic" && field.formula && field.formula.length > 0) {
        newFieldValues[field.name] = evaluateFormula(field.formula, newFieldValues);
      }
    });
    
    // Update field values
    setFieldValues(newFieldValues);
  };

  // Function to evaluate a formula
  const evaluateFormula = (formula: Formula[], values: Record<string, any>): number => {
    let result = 0;
    let currentOperation = "add"; // Default operation
    let tempValue = 0;
    let isFirstValue = true;
    
    for (let i = 0; i < formula.length; i++) {
      const item = formula[i];
      if (item) {
      if (item.type === "operation") {
        currentOperation = item.operationName || "add";
      } else {
        // Get value based on type
        let value = 0;
        
        if (item.type === "customField") {
          // Get value from the field
          const fieldName = item.fieldName || "";
          value = getFieldValue(fieldName, values);
        } else if (item.type === "number") {
          // Parse number from fieldName
          value = parseFloat(item.fieldName || "0");
        }
        
        // Apply operation
        if (isFirstValue) {
          result = value;
          isFirstValue = false;
        } else {
          switch (currentOperation) {
            case "add":
              result += value;
              break;
            case "subtract":
              result -= value;
              break;
            case "multiply":
              result *= value;
              break;
            case "divide":
              if (value !== 0) result /= value;
              break;
            case "modulus":
              if (value !== 0) result %= value;
              break;
          }
        }
      }
    }
  }
    
    return result;
  };

  // Function to get the value of a field
  const getFieldValue = (fieldName: string, values: Record<string, any>): number => {
    if (fieldName in values) {
      return parseFloat(values[fieldName] || 0);
    }
    
    // If field not found in values, check if it's a field in registrationFields
    const field = formData.registrationFields?.find(f => f.name === fieldName);
    
    if (field) {
      if (field.type === "boolean") {
        // For boolean fields, return truthValue or falseValue
        return values[fieldName] ? (field.truthValue || 0) : (field.falseValue || 0);
      } else if (field.valueType === "dynamic" && field.formula && field.formula.length > 0) {
        // For dynamic fields, evaluate the formula
        return evaluateFormula(field.formula, values);
      }
    }
    
    return 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
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

const handleNewFieldChange = (
  e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
) => {
  // Narrow event type by checking if 'target' exists and has 'name' property
  if ("target" in e && e.target.name) {
    const { name, value } = e.target;
    setNewField({
      ...newField,
      [name]: value,
    });
  }
};

  const handleNewOptionChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setNewOption({
        ...newOption,
        [name]: value,
      })
    }
  }

  const handleNewFormulaChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setNewFormula({
        ...newFormula,
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
      formula: [],
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
      options: [],
      formula: []
    })
  }

  const addOptionToField = () => {
    if (!newOption.fieldName || !newOption.labelName || selectedFieldIndex === null) {
      return
    }

    const updatedFields = [...(formData.registrationFields || [])]
    if (!updatedFields[selectedFieldIndex]) {
      return
    }
    
    const field = updatedFields[selectedFieldIndex]

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

  const addFormulaToField = (fieldIndex: number) => {
    if (!newFormula.type || (newFormula.type !== "operation" && !newFormula.fieldName) || 
        (newFormula.type === "operation" && !newFormula.operationName)) {
      return
    }

    const updatedFields = [...(formData.registrationFields || [])]
    if (!updatedFields[fieldIndex]) {
      return
    }
    
    const field = updatedFields[fieldIndex]

    if (!field.formula) {
      field.formula = []
    }

    field.formula.push({
      type: newFormula.type,
      fieldName: newFormula.fieldName,
      operationName: newFormula.operationName,
    })

    setFormData({
      ...formData,
      registrationFields: updatedFields,
    })

    setNewFormula({
      type: "customField",
      fieldName: "",
      operationName: ""
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

  const removeFormula = (fieldIndex: number, formulaIndex: number) => {
    const updatedFields = [...(formData.registrationFields || [])]
    if (!updatedFields[fieldIndex]) {
      return;
    }
    
    const field = updatedFields[fieldIndex]

    if (field.formula) {
      field.formula.splice(formulaIndex, 1)

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
      if (!formData.GeoAllow?.location) {
        newErrors["GeoAllow.location"] = "Geo location is required"
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Image URL"
          name="metadata.imageUrl"
          value={formData.metadata?.imageUrl || ""}
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
          name="GeoAllow.location"
          value={formData.GeoAllow?.location || ""}
          onChange={handleInputChange}
          error={!!errors["GeoAllow.location"]}
          helperText={errors["GeoAllow.location"]}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Longitude"
          type="number"
          inputProps={{ step: "0.000001", min: -180, max: 180 }}
          value={formData.GeoAllow?.coordinates?.[0] || 0}
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
                onChange={(e)=>handleNewFieldChange}
                placeholder="e.g., fullName"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Display Name"
                name="displayName"
                value={newField.displayName || ""}
                onChange={(e)=>handleNewFieldChange}
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

                {/* Field value display for dynamic fields */}
                {field.valueType === "dynamic" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Calculated Value"
                      value={fieldValues[field.name] || 0}
                      disabled
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                )}

                {/* Field input based on type */}
                {field.valueType === "userInput" && (
                  <Grid item xs={12}>
                    {field.type === "text" && (
                      <TextField
                        fullWidth
                        label={field.displayName}
                        value={fieldValues[field.name] || ""}
                        onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    )}
                    
                    {field.type === "number" && (
                      <TextField
                        fullWidth
                        label={field.displayName}
                        type="number"
                        value={fieldValues[field.name] || 0}
                        onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    )}
                    
                    {field.type === "boolean" && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!fieldValues[field.name]}
                            onChange={(e) => handleBooleanChange(field.name, e.target.checked)}
                          />
                        }
                        label={field.displayName}
                      />
                    )}
                    
                    {field.type === "radioButtonGroup" && field.options && field.options.length > 0 && (
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {field.displayName}
                        </Typography>
                        <RadioGroup
                          value={fieldValues[field.name] || ""}
                          onChange={(e) => handleRadioChange(field.name, e.target.value)}
                        >
                          {field.options.map((option, optIndex) => (
                            <FormControlLabel
                              key={optIndex}
                              value={option.fieldName}
                              control={<Radio />}
                              label={option.labelName}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                    
                    {field.type === "checkBoxGroup" && field.options && field.options.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {field.displayName}
                        </Typography>
                        {field.options.map((option: any, optIndex) => (
                          <FormControlLabel
                            key={optIndex}
                            control={
                              <Checkbox
                                checked={fieldValues[field.name]?.includes(option.fieldName) || false}
                                onChange={(e) => handleCheckboxChange(field.name, option.fieldName, e.target.checked)}
                              />
                            }
                            label={option.labelName}
                          />
                        ))}
                      </Box>
                    )}
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
                              registrationFields: updatedFields,
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
                              registrationFields: updatedFields,
                            });
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

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

                {/* Formula section */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Formula:
                    </Typography>
                    {field.formula && field.formula.length > 0 ? (
                      <Box sx={{ mb: 2 }}>
                        {field.formula.map((formulaItem, formulaIndex) => (
                          <Box key={formulaIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                              {formulaItem.type === "customField" && `Field: ${formulaItem.fieldName}`}
                              {formulaItem.type === "operation" && `Operation: ${formulaItem.operationName}`}
                              {formulaItem.type === "number" && `Number: ${formulaItem.fieldName}`}
                              {formulaItem.type === "symbol" && `Symbol: ${formulaItem.fieldName}`}
                            </Typography>
                            <IconButton color="error" onClick={() => removeFormula(index, formulaIndex)} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No formula items added yet.
                      </Typography>
                    )}

                    {/* Add formula form */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "flex-end" }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Formula Type</InputLabel>
                        <Select
                          name="type"
                          value={newFormula.type || "customField"}
                          onChange={(e)=>handleNewFormulaChange}
                          label="Formula Type"
                        >
                          <MenuItem value="customField">Custom Field</MenuItem>
                          <MenuItem value="operation">Operation</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="symbol">Symbol</MenuItem>
                        </Select>
                      </FormControl>

                      {newFormula.type === "operation" ? (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Operation</InputLabel>
                          <Select
                            name="operationName"
                            value={newFormula.operationName || ""}
                            onChange={(e)=>handleNewFormulaChange}
                            label="Operation"
                          >
                            <MenuItem value="add">Add</MenuItem>
                            <MenuItem value="subtract">Subtract</MenuItem>
                            <MenuItem value="multiply">Multiply</MenuItem>
                            <MenuItem value="divide">Divide</MenuItem>
                            <MenuItem value="modulus">Modulus</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          label={newFormula.type === "number" ? "Value" : "Field Name"}
                          name="fieldName"
                          value={newFormula.fieldName || ""}
                          onChange={handleNewFormulaChange}
                          size="small"
                        />
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => addFormulaToField(index)}
                      >
                        Add to Formula
                      </Button>
                    </Box>
                  </Box>
                </Grid>
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