// Test script for authentication flow
import { signIn, signOut, getUserType } from '../lib/firebase/auth';

// Mock user data
const testCustomerEmail = 'customer@example.com';
const testStaffEmail = 'staff@example.com';

async function testAuthenticationFlow() {
  console.log('Starting authentication flow tests...');
  
  try {
    // Test customer sign in
    console.log('Testing customer sign in...');
    const customerResult = await signIn(testCustomerEmail, 'customer');
    console.log('Customer sign in result:', customerResult);
    
    // Verify user type is stored correctly
    const customerType = getUserType();
    console.log('Retrieved customer type:', customerType);
    
    if (customerType !== 'customer') {
      throw new Error('Customer type not stored correctly');
    }
    
    // Test sign out
    console.log('Testing sign out...');
    await signOut();
    
    // Verify user type is cleared
    const typeAfterSignOut = getUserType();
    console.log('User type after sign out:', typeAfterSignOut);
    
    if (typeAfterSignOut !== null) {
      throw new Error('User type not cleared after sign out');
    }
    
    // Test staff sign in
    console.log('Testing staff sign in...');
    const staffResult = await signIn(testStaffEmail, 'staff');
    console.log('Staff sign in result:', staffResult);
    
    // Verify user type is stored correctly
    const staffType = getUserType();
    console.log('Retrieved staff type:', staffType);
    
    if (staffType !== 'staff') {
      throw new Error('Staff type not stored correctly');
    }
    
    // Final sign out
    console.log('Final sign out...');
    await signOut();
    
    console.log('Authentication flow tests completed successfully!');
  } catch (error) {
    console.error('Authentication flow test failed:', error);
  }
}

// Run the test
testAuthenticationFlow();
