// Test file to demonstrate the new event registration schema
// This file shows how the new schema works with attendance tracking

// Example event data with customAttendance enabled
const exampleEventWithAttendance = {
  name: "Conference 2024",
  description: "Annual tech conference",
  customAttendance: true,
  registrationFields: [
    {
      name: "fullName",
      displayName: "Full Name",
      type: "text",
      valueType: "userInput"
    },
    {
      name: "email",
      displayName: "Email",
      type: "text",
      valueType: "userInput"
    },
    {
      name: "attendees",
      displayName: "Number of Attendees",
      type: "number",
      valueType: "attendanceInput"
    },
    {
      name: "vipSeats",
      displayName: "VIP Seats",
      type: "number",
      valueType: "attendanceInput"
    }
  ]
};

// Example registration data that would be sent to the API
const exampleRegistrationData = {
  eventId: "event123",
  userId: "user456", // Only for authenticated users
  email: "user@example.com",
  eventData: [
    {
      fieldName: "fullName",
      fieldValue: "John Doe"
    },
    {
      fieldName: "email", 
      fieldValue: "user@example.com"
    },
    {
      fieldName: "attendees",
      fieldValue: 3
    },
    {
      fieldName: "vipSeats",
      fieldValue: 1
    }
  ],
  price: "150.00",
  currency: "USD",
  status: "pending",
  paymentStatus: "unpaid",
  // New attendance fields (only included when customAttendance is true)
  totalAttendance: 0, // Always 0 initially
  totalSeats: 4, // Sum of all attendanceInput fields (3 + 1 = 4)
  attendanceStatus: "registered"
};

// Example without customAttendance (traditional registration)
const exampleTraditionalRegistration = {
  eventId: "event789",
  email: "user@example.com",
  eventData: [
    {
      fieldName: "fullName",
      fieldValue: "Jane Smith"
    },
    {
      fieldName: "email",
      fieldValue: "user@example.com"
    }
  ],
  price: "50.00",
  currency: "USD", 
  status: "pending",
  paymentStatus: "unpaid"
  // No attendance fields for traditional events
};

export { exampleEventWithAttendance, exampleRegistrationData, exampleTraditionalRegistration };