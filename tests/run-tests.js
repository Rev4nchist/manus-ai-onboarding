// Test runner script to execute all tests
const { exec } = require('child_process');
const path = require('path');

console.log('Starting test runner...');

// Array of test files to run
const testFiles = [
  'auth-test.js',
  'customer-portal-test.js',
  'staff-dashboard-test.js'
];

// Run tests sequentially
async function runTests() {
  for (const testFile of testFiles) {
    console.log(`\n========== Running ${testFile} ==========\n`);
    
    try {
      // Execute the test file using Node.js
      const testPath = path.join(__dirname, testFile);
      const { stdout, stderr } = await execPromise(`node ${testPath}`);
      
      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }
    } catch (error) {
      console.error(`Error running ${testFile}:`, error.message);
    }
    
    console.log(`\n========== Completed ${testFile} ==========\n`);
  }
  
  console.log('All tests completed!');
}

// Promise wrapper for exec
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner failed:', error);
});
