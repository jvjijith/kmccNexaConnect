// Test file for event authentication flow
// This file demonstrates how to test the authentication and registration functionality

import { 
  checkEventAccess, 
  decodeAccessToken, 
  isAuthenticated,
  getAccessToken 
} from '../apps/web/src/data/loader';

// Mock event data for testing
const mockEvents = {
  publicEvent: {
    allowLogin: false,
    allowGuest: true,
    allowMemberLogin: false
  },
  guestAndLoginEvent: {
    allowLogin: true,
    allowGuest: true,
    allowMemberLogin: false
  },
  loginRequiredEvent: {
    allowLogin: true,
    allowGuest: false,
    allowMemberLogin: false
  },
  memberOnlyEvent: {
    allowLogin: true,
    allowGuest: false,
    allowMemberLogin: true
  }
};

// Test access control logic
function testEventAccess() {
  console.log('Testing Event Access Control...\n');

  // Test public event
  const publicAccess = checkEventAccess(mockEvents.publicEvent);
  console.log('Public Event Access:', publicAccess);
  // Expected: { canAccess: true, requiresLogin: false, requiresMembership: false }

  // Test guest and login event
  const guestLoginAccess = checkEventAccess(mockEvents.guestAndLoginEvent);
  console.log('Guest + Login Event Access:', guestLoginAccess);
  // Expected: { canAccess: true, requiresLogin: false, requiresMembership: false }

  // Test login required event
  const loginRequiredAccess = checkEventAccess(mockEvents.loginRequiredEvent);
  console.log('Login Required Event Access:', loginRequiredAccess);
  // Expected: depends on authentication status

  // Test member only event
  const memberOnlyAccess = checkEventAccess(mockEvents.memberOnlyEvent);
  console.log('Member Only Event Access:', memberOnlyAccess);
  // Expected: depends on authentication and membership status

  console.log('\n');
}

// Test token decoding
function testTokenDecoding() {
  console.log('Testing Token Decoding...\n');

  // Mock JWT token (this is just for testing - use a real token in actual tests)
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.mock_signature';

  try {
    const decoded = decodeAccessToken(mockToken);
    console.log('Decoded Token:', decoded);
    // Expected: { userId: "1234567890" }
  } catch (error) {
    console.log('Token Decoding Error:', error);
  }

  console.log('\n');
}

// Test authentication status
function testAuthenticationStatus() {
  console.log('Testing Authentication Status...\n');

  const token = getAccessToken();
  console.log('Access Token:', token ? 'Found' : 'Not found');

  const authStatus = isAuthenticated();
  console.log('Is Authenticated:', authStatus);

  console.log('\n');
}

// Example usage in a React component
const exampleUsage = `
// Example: Using the authentication flow in a React component

import { useState, useEffect } from 'react';
import { 
  checkEventAccess, 
  isAuthenticated, 
  getMembershipByCustomerId,
  getAccessToken,
  decodeAccessToken 
} from '../src/data/loader';

function EventRegistrationComponent({ eventData }) {
  const [canAccess, setCanAccess] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        // Check basic access permissions
        const accessCheck = checkEventAccess(eventData);
        
        if (!accessCheck.canAccess) {
          setAuthError(accessCheck.message || 'Access denied');
          return;
        }

        // If membership is required, verify membership status
        if (accessCheck.requiresMembership) {
          const token = getAccessToken();
          if (token) {
            const decoded = decodeAccessToken(token);
            if (decoded) {
              const membershipData = await getMembershipByCustomerId(decoded.userId, {
                'Authorization': \`Bearer \${token}\`
              });
              
              if (membershipData?.memberStatus !== 'active') {
                setAuthError('Only active members can access this event');
                return;
              }
            }
          }
        }

        setCanAccess(true);
      } catch (error) {
        setAuthError('Unable to verify access permissions');
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [eventData]);

  if (isLoading) return <div>Checking access...</div>;
  if (authError) return <div>Error: {authError}</div>;
  if (!canAccess) return <div>Access denied</div>;

  return <div>Registration form goes here...</div>;
}
`;

// Run tests (uncomment to run)
// testEventAccess();
// testTokenDecoding();
// testAuthenticationStatus();

console.log('Event Authentication Flow Test Suite');
console.log('====================================');
console.log(exampleUsage);

export {
  testEventAccess,
  testTokenDecoding,
  testAuthenticationStatus,
  mockEvents
};