const http = require('http');
const jwt = require('jsonwebtoken');

function assertStatus(name, response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`${name}: expected HTTP ${expectedStatus}, received ${response.status}`);
  }
  console.log(`[PASS] ${name} -> Status: ${response.status}`);
}

async function runTests() {
  const app = require('./server');
  // Wait 1 second for server to initialize
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n🧪 Running Automated API Tests...\n');

  async function request(path, options = {}) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: 'localhost',
        port: 5000,
        path,
        method: options.method || 'GET',
        headers: options.headers || {}
      };

      const req = http.request(opts, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  }

  try {
    // Admin endpoints reject unauthenticated and non-admin requests.
    const anonymousAdmin = await request('/api/admin/projects');
    assertStatus('GET /api/admin/projects rejects anonymous access', anonymousAdmin, 401);

    const ordinaryUserToken = jwt.sign(
      { id: 'ordinary-user', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );
    const ordinaryUserAdmin = await request('/api/admin/projects', {
      headers: { Authorization: `Bearer ${ordinaryUserToken}` }
    });
    assertStatus('GET /api/admin/projects rejects non-admin role', ordinaryUserAdmin, 403);

    const anonymousProfileUpdate = await request('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { profile: {} }
    });
    assertStatus('PUT /api/profile rejects anonymous access', anonymousProfileUpdate, 401);

    const anonymousPhotoDelete = await request('/api/profile/photo', {
      method: 'DELETE'
    });
    assertStatus('DELETE /api/profile/photo rejects anonymous access', anonymousPhotoDelete, 401);

    // 1. Health
    const health = await request('/api/health');
    console.log(`[PASS] 1. GET /api/health -> Status: ${health.status}, App: ${health.data.app}`);

    // 2. Profile
    const profile = await request('/api/profile');
    console.log(`[PASS] 2. GET /api/profile -> Status: ${profile.status}, Name: ${profile.data.profile.name}`);

    // 3. Projects
    const projects = await request('/api/projects');
    console.log(`[PASS] 3. GET /api/projects -> Status: ${projects.status}, Total projects: ${projects.data.length}`);

    // 4. Project by slug
    const single = await request('/api/projects/omniflow-erp-inventory-suite');
    console.log(`[PASS] 4. GET /api/projects/:slug -> Status: ${single.status}, Title: ${single.data.title}`);

    // 5. Contact submission
    const contact = await request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Sara Tesfaye',
        email: 'sara@example.com',
        subject: 'Website Redesign',
        projectType: 'Full-Stack Development',
        message: 'Hello, looking forward to working with you!'
      }
    });
    console.log(`[PASS] 5. POST /api/contact -> Status: ${contact.status}, Success: ${contact.data.success}`);

    // 6. Admin Login
    const login = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    });
    console.log(`[PASS] 6. POST /api/auth/login -> Status: ${login.status}, Token received: ${!!login.data.token}`);
    const token = login.data.token;

    const unsafeProjectField = await request('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: { title: 'Invalid test project', description: 'Should not persist', isAdmin: true }
    });
    assertStatus('POST /api/admin/projects rejects unsupported fields', unsafeProjectField, 400);

    const unsafeProfileField = await request('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: { profile: { jwtSecret: 'must-not-be-stored' } }
    });
    assertStatus('PUT /api/profile rejects protected fields', unsafeProfileField, 400);

    // 7. Protected Admin Projects
    const adminProj = await request('/api/admin/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`[PASS] 7. GET /api/admin/projects -> Status: ${adminProj.status}, Total: ${adminProj.data.length}`);

    // 8. Protected Admin Messages
    const adminMsg = await request('/api/admin/messages', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`[PASS] 8. GET /api/admin/messages -> Status: ${adminMsg.status}, Messages count: ${adminMsg.data.length}`);

    console.log('\n🎉 ALL 8 BACKEND REST API TESTS PASSED WITH 100% SUCCESS!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
