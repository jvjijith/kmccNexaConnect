// Test file to verify donation event functionality
import { Event } from '../types/event';

// Test donation event data
const testDonationEvent: Event = {
  name: "Help Build Community Center",
  description: "Support our community by donating to build a new community center",
  eventStatus: "Live",
  startingDate: "2024-02-01T10:00:00Z",
  endingDate: "2024-02-01T18:00:00Z",
  location: "Online",
  totalregisteredSeats: 0,
  seatsAvailable: 1000,
  registrationStartDate: "2024-01-01T00:00:00Z",
  registrationEndDate: "2024-03-01T23:59:59Z",
  paymentType: "registration Payment",
  priceConfig: {
    type: "dynamic",
    amount: 0
  },
  type: "public",
  allowGuest: false,
  allowLogin: true,
  allowMemberLogin: true,
  GeoAllow: {
    location: "Online",
    coordinates: [0, 0]
  },
  registrationFields: [
    {
      name: "donationAmount",
      displayName: "Donation Amount",
      type: "number",
      valueType: "userInput",
      options: [],
      formula: []
    },
    {
      name: "showName",
      displayName: "Display my name publicly",
      type: "boolean",
      valueType: "userInput",
      options: [],
      formula: []
    }
  ],
  metadata: {
    name: "donation",
    description: "Community donation event"
  }
};

// Test regular event data
const testRegularEvent: Event = {
  name: "Annual Conference 2024",
  description: "Join us for our annual conference",
  eventStatus: "Live",
  startingDate: "2024-03-15T09:00:00Z",
  endingDate: "2024-03-15T17:00:00Z",
  location: "Convention Center",
  totalregisteredSeats: 50,
  seatsAvailable: 200,
  registrationStartDate: "2024-01-01T00:00:00Z",
  registrationEndDate: "2024-03-10T23:59:59Z",
  paymentType: "Fixed Price",
  priceConfig: {
    type: "fixed",
    amount: 99
  },
  type: "public",
  allowGuest: true,
  allowLogin: true,
  allowMemberLogin: true,
  GeoAllow: {
    location: "Convention Center",
    coordinates: [-74.006, 40.7128]
  },
  registrationFields: [
    {
      name: "dietaryRestrictions",
      displayName: "Dietary Restrictions",
      type: "text",
      valueType: "userInput",
      options: [],
      formula: []
    }
  ],
  metadata: {
    name: "conference",
    description: "Annual conference event"
  }
};

export { testDonationEvent, testRegularEvent };