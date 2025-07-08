// Test script to verify registration functionality
import { registerUser } from '../src/lib/auth';

async function testRegistration() {
  try {
    console.log("Testing registration...");
    
    const testUser = await registerUser(
      "Test",
      "User", 
      "test@example.com",
      "password123",
      "1234567890"
    );
    
    console.log("Registration successful:", testUser);
  } catch (error) {
    console.error("Registration failed:", error);
  }
}

// Uncomment to run test
// testRegistration();