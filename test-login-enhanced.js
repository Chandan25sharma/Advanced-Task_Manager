const testLoginWithLogging = async () => {
  console.log('=== Testing Login with Enhanced Logging ===\n');
  
  // Test 1: Valid Admin Login
  console.log('🔐 Test 1: Valid Admin Login');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3002'
      },
      body: JSON.stringify({
        email: 'admin@taskmanager.com',
        password: 'Admin123!'
      })
    });
    
    const data = await response.json();
    console.log(`Response Status: ${response.status}`);
    console.log('Response:', data);
    console.log('');
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
  
  // Test 2: Invalid Email
  console.log('🔐 Test 2: Invalid Email');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3002'
      },
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'wrongpass'
      })
    });
    
    const data = await response.json();
    console.log(`Response Status: ${response.status}`);
    console.log('Response:', data);
    console.log('');
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
  
  // Test 3: Wrong Password
  console.log('🔐 Test 3: Wrong Password for Admin');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3002'
      },
      body: JSON.stringify({
        email: 'admin@taskmanager.com',
        password: 'wrongpassword'
      })
    });
    
    const data = await response.json();
    console.log(`Response Status: ${response.status}`);
    console.log('Response:', data);
    console.log('');
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
  
  // Test 4: Missing Fields
  console.log('🔐 Test 4: Missing Password');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3002'
      },
      body: JSON.stringify({
        email: 'admin@taskmanager.com'
      })
    });
    
    const data = await response.json();
    console.log(`Response Status: ${response.status}`);
    console.log('Response:', data);
    console.log('');
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
  
  console.log('=== Login Tests Complete ===');
};

testLoginWithLogging();
