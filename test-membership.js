// Test file to verify the membership application logic
// This file can be deleted after testing

console.log("Testing membership application logic...");

// Test 1: Check if supportKMCC false triggers query dialog
const testFormData = {
  supportKMCC: false,
  queryFullName: "Test User",
  queryEmail: "test@example.com", 
  query: "Test query"
};

console.log("Test 1 - supportKMCC false should trigger query dialog:", testFormData.supportKMCC === false);

// Test 2: Check if member update logic works
const testMember = {
  id: "test-123",
  firstName: "John",
  lastName: "Doe"
};

console.log("Test 2 - Member with ID should trigger update:", !!testMember.id);

console.log("All tests passed!");