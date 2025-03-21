"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormGroup,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  InputAdornment,
} from "@mui/material"
import type { Event, RegistrationField, Formula } from "./event"

interface RegistrationFormProps {
  event: Event
}

export default function RegistrationForm({ event }: RegistrationFormProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [calculatedValues, setCalculatedValues] = useState<Record<string, any>>({})

  const steps = ["Personal Information", "Event Options", "Payment & Confirmation"]

  useEffect(() => {
    // Initialize form data with fixed values
    const initialData: Record<string, any> = {}
    event.registrationFields?.forEach((field: any) => {
      if (field.valueType === "fixed" && field.fixedValue !== undefined) {
        initialData[field.name] = field.fixedValue
      }
    })
    setFormData(initialData)
  }, [event.registrationFields])

  useEffect(() => {
    // Calculate dynamic values based on formulas
    const newCalculatedValues: Record<string, any> = {}

    event.registrationFields?.forEach((field) => {
      if (field.valueType === "dynamic" && field.formula) {
        const value = calculateFormulaValue(field.formula)
        newCalculatedValues[field.name] = value
      }
    })

    setCalculatedValues(newCalculatedValues)
  }, [formData, event.registrationFields])

  const calculateFormulaValue = (formula: Formula[]): number => {
    let result = 0
    let currentOperation = "+"
  
    for (let i = 0; i < formula.length; i++) {
      const item = formula[i]
      // Early continue if item is undefined
      if (!item) continue;
      
      let value = 0
  
      if (item.type === "number" && item.operationName) {
        value = Number.parseFloat(item.operationName)
      } else if (item.type === "customField" && item.fieldName) {
        value = Number.parseFloat(formData[item.fieldName] || 0)
      }
  
      if (item.type === "operation") {
        currentOperation = item.operationName || "+"
      } else {
        // Apply operation
        switch (currentOperation) {
          case "+":
            result += value
            break
          case "-":
            result -= value
            break
          case "*":
            result *= value
            break
          case "/":
            if (value !== 0) {
              result /= value
            }
            break
          default:
            result += value
        }
      }
    }
  
    return result
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (step === 0) {
      // Validate personal information fields
      event.registrationFields?.forEach((field: any) => {
        if (field.type === "text" && !formData[field.name]) {
          newErrors[field.name] = `${field.displayName} is required`
          isValid = false
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: RegistrationField, value: any) => {
    setFormData({
      ...formData,
      [field.name]: value,
    })

    // Clear error when field is filled
    if (errors[field.name]) {
      const newErrors = { ...errors }
      delete newErrors[field.name]
      setErrors(newErrors)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(activeStep)) {
      // In a real application, you would submit the form data to your backend here
      console.log("Form submitted:", formData)
      setSubmitted(true)
    }
  }

  const renderField = (field: RegistrationField) => {
    // For dynamic fields, use the calculated value
    const dynamicValue = field.valueType === "dynamic" ? calculatedValues[field.name] : undefined

    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={field.displayName}
            name={field.name}
            value={dynamicValue !== undefined ? dynamicValue : formData[field.name] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            margin="normal"
            required
            disabled={field.valueType === "dynamic" || field.valueType === "fixed"}
          />
        )
      case "number":
        return (
          <TextField
            fullWidth
            label={field.displayName}
            name={field.name}
            type="number"
            value={dynamicValue !== undefined ? dynamicValue : formData[field.name] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            margin="normal"
            required
            disabled={field.valueType === "dynamic" || field.valueType === "fixed"}
            InputProps={
              field.name === "totalPrice"
                ? {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }
                : undefined
            }
          />
        )
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData[field.name]}
                onChange={(e) => handleInputChange(field, e.target.checked)}
                name={field.name}
                disabled={field.valueType === "dynamic" || field.valueType === "fixed"}
              />
            }
            label={field.displayName}
          />
        )
      case "checkBoxGroup":
        return (
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">{field.displayName}</FormLabel>
            <FormGroup>
              {field.options?.map((option: any) => (
                <FormControlLabel
                  key={option.fieldName}
                  control={
                    <Checkbox
                      checked={!!formData[option.fieldName]}
                      onChange={(e) => handleInputChange({ ...field, name: option.fieldName }, e.target.checked)}
                      name={option.fieldName}
                      disabled={field.valueType === "dynamic" || field.valueType === "fixed"}
                    />
                  }
                  label={option.labelName}
                />
              ))}
            </FormGroup>
          </FormControl>
        )
      case "radioButtonGroup":
        return (
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">{field.displayName}</FormLabel>
            <RadioGroup
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
            >
              {field.options?.map((option: any) => (
                <FormControlLabel
                  key={option.fieldName}
                  value={option.fieldName}
                  control={<Radio />}
                  label={option.labelName}
                  disabled={field.valueType === "dynamic" || field.valueType === "fixed"}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )
      default:
        return null
    }
  }

  const renderStepContent = (step: number) => {
    if (submitted) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Registration Complete!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for registering for {event.name}. We have sent a confirmation email with all the details.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Register Another Attendee
          </Button>
        </Box>
      )
    }

    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            {event.registrationFields
              ?.filter((field: any) => field.type === "text")
              .map((field: any) => (
                <Grid item xs={12} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
          </Box>
        )
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Event Options
            </Typography>
            {event.registrationFields
              ?.filter(
                (field: any) =>
                  field.type === "boolean" ||
                  field.type === "checkBoxGroup" ||
                  field.type === "radioButtonGroup" ||
                  (field.type === "number" && field.name !== "totalPrice"),
              )
              .map((field: any) => (
                <Grid item xs={12} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
          </Box>
        )
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment & Confirmation
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo form. In a real application, this would include payment processing.
            </Alert>
            <Typography variant="subtitle1" gutterBottom>
              Registration Summary
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Event: {event.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date: {new Date(event.startingDate).toLocaleDateString()}
              </Typography>

              {/* Display dynamic price if available */}
              {event.registrationFields?.find((field: any) => field.name === "totalPrice") ? (
                <Typography variant="body1" gutterBottom>
                  Price: ${calculatedValues["totalPrice"] || event.priceConfig?.amount || 0}
                </Typography>
              ) : (
                <Typography variant="body1" gutterBottom>
                  Price:{" "}
                  {event.paymentType === "Free"
                    ? "Free"
                    : event.priceConfig?.type === "fixed"
                      ? `$${event.priceConfig.amount}`
                      : "Variable pricing"}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary">
                Total: ${calculatedValues["totalPrice"] || event.priceConfig?.amount || 0}
              </Typography>
            </Paper>
            <Typography variant="body2" color="text.secondary" paragraph>
              By clicking "Complete Registration", you agree to the terms and conditions of this event.
            </Typography>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderStepContent(activeStep)}
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" type="submit">
              Complete Registration
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

