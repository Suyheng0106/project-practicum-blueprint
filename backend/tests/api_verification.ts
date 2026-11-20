import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

interface TestResult {
  id: string;
  method: string;
  route: string;
  priority: string;
  status: 'PASS' | 'FAIL';
  detail: string;
  sampleResponse: string;
}

interface NegativeTestResult {
  id: string;
  errorCase: string;
  expectedStatus: number;
  actualStatus: number;
  status: 'PASS' | 'FAIL';
}

async function runTests() {
  console.log('Starting comprehensive API verification test suite...');
  const positiveResults: TestResult[] = [];
  const negativeResults: NegativeTestResult[] = [];

  let candidateToken = '';
  let employerToken = '';
  let sampleJobId = '';
  let sampleSkillIds: string[] = [];
  let sampleApplicationId = '';

  // 1. EP-01 Health Check
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.status === 200 && res.data.status === 'ok') {
      positiveResults.push({
        id: 'EP-01',
        method: 'GET',
        route: '/api/v1/health',
        priority: 'Must',
        status: 'PASS',
        detail: 'Health check OK',
        sampleResponse: JSON.stringify(res.data),
      });
    }
  } catch (err: any) {
    positiveResults.push({ id: 'EP-01', method: 'GET', route: '/api/v1/health', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // 2. EP-02 Register Candidate
  const testCandidateEmail = `candidate.${Date.now()}@it.edu.kh`;
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      email: testCandidateEmail,
      password: 'Password123!',
      role: 'CANDIDATE',
    });
    if (res.status === 201 && res.data.email === testCandidateEmail) {
      positiveResults.push({
        id: 'EP-02',
        method: 'POST',
        route: '/api/v1/auth/register',
        priority: 'Must',
        status: 'PASS',
        detail: 'Candidate registration created user',
        sampleResponse: JSON.stringify({ id: res.data.id, email: res.data.email, role: res.data.role }),
      });
    }
  } catch (err: any) {
    positiveResults.push({ id: 'EP-02', method: 'POST', route: '/api/v1/auth/register', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-02 (Password < 8 chars)
  try {
    await axios.post(`${BASE_URL}/auth/register`, {
      email: `fail.${Date.now()}@it.edu.kh`,
      password: '123',
      role: 'CANDIDATE',
    });
    negativeResults.push({ id: 'EP-02', errorCase: 'Password under 8 characters', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-02', errorCase: 'Password under 8 characters', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // Negative EP-02 (Duplicate email)
  try {
    await axios.post(`${BASE_URL}/auth/register`, {
      email: testCandidateEmail,
      password: 'Password123!',
      role: 'CANDIDATE',
    });
    negativeResults.push({ id: 'EP-02', errorCase: 'Duplicate email address', expectedStatus: 409, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-02', errorCase: 'Duplicate email address', expectedStatus: 409, actualStatus: status, status: status === 409 ? 'PASS' : 'FAIL' });
  }

  // 3. EP-03 Login
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'sokha.pech@it.edu.kh',
      password: 'Password123!',
    });
    candidateToken = res.data.token;
    positiveResults.push({
      id: 'EP-03',
      method: 'POST',
      route: '/api/v1/auth/login',
      priority: 'Must',
      status: 'PASS',
      detail: 'Candidate login issued JWT',
      sampleResponse: JSON.stringify({ token: 'eyJhbGciOi...', user: res.data.user }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-03', method: 'POST', route: '/api/v1/auth/login', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Employer Login to get employerToken
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dara.recruiter@techbridge.kh',
      password: 'Password123!',
    });
    employerToken = res.data.token;
  } catch (err: any) {
    console.error('Employer login failed:', err.message);
  }

  // Negative EP-03 (Incorrect password)
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'sokha.pech@it.edu.kh',
      password: 'WrongPassword!',
    });
    negativeResults.push({ id: 'EP-03', errorCase: 'Incorrect password', expectedStatus: 401, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-03', errorCase: 'Incorrect password', expectedStatus: 401, actualStatus: status, status: status === 401 ? 'PASS' : 'FAIL' });
  }

  // 4. EP-04 Current User Identity
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-04',
      method: 'GET',
      route: '/api/v1/auth/me',
      priority: 'Must',
      status: 'PASS',
      detail: 'Retrieved authenticated candidate identity',
      sampleResponse: JSON.stringify(res.data),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-04', method: 'GET', route: '/api/v1/auth/me', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-04 (Missing token)
  try {
    await axios.get(`${BASE_URL}/auth/me`);
    negativeResults.push({ id: 'EP-04', errorCase: 'Missing Authorization header', expectedStatus: 401, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-04', errorCase: 'Missing Authorization header', expectedStatus: 401, actualStatus: status, status: status === 401 ? 'PASS' : 'FAIL' });
  }

  // 5. EP-05 Skills Taxonomy
  try {
    const res = await axios.get(`${BASE_URL}/skills`);
    sampleSkillIds = res.data.slice(0, 2).map((s: any) => s.id);
    positiveResults.push({
      id: 'EP-05',
      method: 'GET',
      route: '/api/v1/skills',
      priority: 'Must',
      status: 'PASS',
      detail: `Retrieved ${res.data.length} skills taxonomy items`,
      sampleResponse: JSON.stringify(res.data.slice(0, 2)),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-05', method: 'GET', route: '/api/v1/skills', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // 6. EP-06 Candidate Profile
  try {
    const res = await axios.get(`${BASE_URL}/candidate/profile`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-06',
      method: 'GET',
      route: '/api/v1/candidate/profile',
      priority: 'Must',
      status: 'PASS',
      detail: 'Retrieved profile with skills, projects, experiences, and achievements',
      sampleResponse: JSON.stringify({ fullName: res.data.fullName, skillsCount: res.data.skills.length }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-06', method: 'GET', route: '/api/v1/candidate/profile', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-06 (Employer token accessing candidate profile)
  try {
    await axios.get(`${BASE_URL}/candidate/profile`, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    negativeResults.push({ id: 'EP-06', errorCase: 'Role restriction (Employer role accessing candidate route)', expectedStatus: 403, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-06', errorCase: 'Role restriction (Employer role accessing candidate route)', expectedStatus: 403, actualStatus: status, status: status === 403 ? 'PASS' : 'FAIL' });
  }

  // 7. EP-07 Update Candidate Profile
  try {
    const res = await axios.put(
      `${BASE_URL}/candidate/profile`,
      {
        fullName: 'Sokha Pech',
        bio: 'Updated IT candidate bio.',
        university: 'Royal University of Phnom Penh',
        major: 'Computer Science',
        yearOfStudy: 4,
        portfolioUrl: 'https://github.com/sokhapech',
      },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    positiveResults.push({
      id: 'EP-07',
      method: 'PUT',
      route: '/api/v1/candidate/profile',
      priority: 'Must',
      status: 'PASS',
      detail: 'Profile updated successfully',
      sampleResponse: JSON.stringify({ fullName: res.data.fullName, yearOfStudy: res.data.yearOfStudy }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-07', method: 'PUT', route: '/api/v1/candidate/profile', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-07 (Missing fullName)
  try {
    await axios.put(
      `${BASE_URL}/candidate/profile`,
      { fullName: '' },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    negativeResults.push({ id: 'EP-07', errorCase: 'Missing fullName field', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-07', errorCase: 'Missing fullName field', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // 8. EP-08 Update Candidate Skills
  try {
    const res = await axios.put(
      `${BASE_URL}/candidate/skills`,
      { skillIds: sampleSkillIds },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    positiveResults.push({
      id: 'EP-08',
      method: 'PUT',
      route: '/api/v1/candidate/skills',
      priority: 'Must',
      status: 'PASS',
      detail: 'Candidate skills updated successfully',
      sampleResponse: JSON.stringify({ skillsCount: res.data.skills.length }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-08', method: 'PUT', route: '/api/v1/candidate/skills', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-08 (Empty skillIds array)
  try {
    await axios.put(
      `${BASE_URL}/candidate/skills`,
      { skillIds: [] },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    negativeResults.push({ id: 'EP-08', errorCase: 'Empty skillIds array submitted', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-08', errorCase: 'Empty skillIds array submitted', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // 9. EP-09 Add Candidate Project
  try {
    const res = await axios.post(
      `${BASE_URL}/candidate/projects`,
      {
        title: 'Portfolio Showcase Website',
        description: 'Responsive web portfolio built with Next.js and Tailwind CSS.',
        projectUrl: 'https://github.com/sokhapech/portfolio',
      },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    positiveResults.push({
      id: 'EP-09',
      method: 'POST',
      route: '/api/v1/candidate/projects',
      priority: 'Must',
      status: 'PASS',
      detail: 'Added candidate coding project',
      sampleResponse: JSON.stringify({ id: res.data.id, title: res.data.title }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-09', method: 'POST', route: '/api/v1/candidate/projects', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-09 (Missing title)
  try {
    await axios.post(
      `${BASE_URL}/candidate/projects`,
      { title: '' },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    negativeResults.push({ id: 'EP-09', errorCase: 'Missing project title', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-09', errorCase: 'Missing project title', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // 10. EP-10 Browse Beginner Jobs
  try {
    const res = await axios.get(`${BASE_URL}/jobs`);
    sampleJobId = res.data.jobs[0]?.id;
    positiveResults.push({
      id: 'EP-10',
      method: 'GET',
      route: '/api/v1/jobs',
      priority: 'Must',
      status: 'PASS',
      detail: `Retrieved ${res.data.total} active entry-level jobs`,
      sampleResponse: JSON.stringify({ total: res.data.total, firstJob: res.data.jobs[0]?.title }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-10', method: 'GET', route: '/api/v1/jobs', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // 11. EP-11 Job Details
  try {
    const res = await axios.get(`${BASE_URL}/jobs/${sampleJobId}`);
    positiveResults.push({
      id: 'EP-11',
      method: 'GET',
      route: `/api/v1/jobs/:id`,
      priority: 'Must',
      status: 'PASS',
      detail: 'Retrieved full job description, company and required skills',
      sampleResponse: JSON.stringify({ title: res.data.title, company: res.data.company.name }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-11', method: 'GET', route: `/api/v1/jobs/:id`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-11 (Non-existent job id)
  try {
    await axios.get(`${BASE_URL}/jobs/00000000-0000-0000-0000-000000000999`);
    negativeResults.push({ id: 'EP-11', errorCase: 'Non-existent job ID', expectedStatus: 404, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-11', errorCase: 'Non-existent job ID', expectedStatus: 404, actualStatus: status, status: status === 404 ? 'PASS' : 'FAIL' });
  }

  // 12. EP-12 Skill Gap Analysis
  try {
    const res = await axios.get(`${BASE_URL}/jobs/${sampleJobId}/fit`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-12',
      method: 'GET',
      route: `/api/v1/jobs/:id/fit`,
      priority: 'Must',
      status: 'PASS',
      detail: `Calculated skill fit: ${res.data.matchScore}%`,
      sampleResponse: JSON.stringify({ matchScore: res.data.matchScore, matchedCount: res.data.matchedCount, missingSkills: res.data.missingSkills.length }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-12', method: 'GET', route: `/api/v1/jobs/:id/fit`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-12 (Forbidden for employer)
  try {
    await axios.get(`${BASE_URL}/jobs/${sampleJobId}/fit`, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    negativeResults.push({ id: 'EP-12', errorCase: 'Employer accessing candidate fit check', expectedStatus: 403, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-12', errorCase: 'Employer accessing candidate fit check', expectedStatus: 403, actualStatus: status, status: status === 403 ? 'PASS' : 'FAIL' });
  }

  // 13. EP-13 List Saved Jobs
  try {
    const res = await axios.get(`${BASE_URL}/candidate/saved-jobs`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-13',
      method: 'GET',
      route: '/api/v1/candidate/saved-jobs',
      priority: 'Must',
      status: 'PASS',
      detail: `Retrieved ${res.data.length} saved jobs for candidate`,
      sampleResponse: JSON.stringify(res.data.slice(0, 1)),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-13', method: 'GET', route: '/api/v1/candidate/saved-jobs', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // 14. EP-14 Save Job Listing
  // First pick job2 (not already saved)
  const jobsRes = await axios.get(`${BASE_URL}/jobs`);
  const jobToSave = jobsRes.data.jobs.find((j: any) => j.id === sampleJobId)?.id || sampleJobId;
  try {
    // Unsave first if saved, then save
    try { await axios.delete(`${BASE_URL}/jobs/${jobToSave}/save`, { headers: { Authorization: `Bearer ${candidateToken}` } }); } catch {}
    const res = await axios.post(`${BASE_URL}/jobs/${jobToSave}/save`, {}, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-14',
      method: 'POST',
      route: `/api/v1/jobs/:id/save`,
      priority: 'Must',
      status: 'PASS',
      detail: 'Bookmarked job listing successfully',
      sampleResponse: JSON.stringify(res.data),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-14', method: 'POST', route: `/api/v1/jobs/:id/save`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-14 (Already saved conflict)
  try {
    await axios.post(`${BASE_URL}/jobs/${jobToSave}/save`, {}, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    negativeResults.push({ id: 'EP-14', errorCase: 'Duplicate save request', expectedStatus: 409, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-14', errorCase: 'Duplicate save request', expectedStatus: 409, actualStatus: status, status: status === 409 ? 'PASS' : 'FAIL' });
  }

  // 15. EP-15 Unsave Job Listing
  try {
    const res = await axios.delete(`${BASE_URL}/jobs/${jobToSave}/save`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-15',
      method: 'DELETE',
      route: `/api/v1/jobs/:id/save`,
      priority: 'Must',
      status: 'PASS',
      detail: 'Removed job listing from bookmarks',
      sampleResponse: JSON.stringify(res.data),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-15', method: 'DELETE', route: `/api/v1/jobs/:id/save`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-15 (Unsave non-saved job)
  try {
    await axios.delete(`${BASE_URL}/jobs/${jobToSave}/save`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    negativeResults.push({ id: 'EP-15', errorCase: 'Unsaving a non-bookmarked job', expectedStatus: 404, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-15', errorCase: 'Unsaving a non-bookmarked job', expectedStatus: 404, actualStatus: status, status: status === 404 ? 'PASS' : 'FAIL' });
  }

  // 16. EP-16 Apply to Job Listing
  const appListRes = await axios.get(`${BASE_URL}/candidate/applications`, {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  const appliedIds = new Set(appListRes.data.map((a: any) => a.job.id));
  let unappliedJob = jobsRes.data.jobs.find((j: any) => !appliedIds.has(j.id))?.id;

  if (!unappliedJob) {
    const newJobRes = await axios.post(
      `${BASE_URL}/employer/jobs`,
      {
        title: `Test Application Role ${Date.now()}`,
        description: 'A dedicated test job listing created for direct application verification.',
        category: 'Software Engineering',
        employmentType: 'INTERNSHIP',
        location: 'Phnom Penh',
        isRemote: false,
        stipendAmountCents: 25000,
        requiredSkillIds: sampleSkillIds,
      },
      { headers: { Authorization: `Bearer ${employerToken}` } }
    );
    unappliedJob = newJobRes.data.id;
  }

  try {
    const res = await axios.post(`${BASE_URL}/jobs/${unappliedJob}/apply`, {}, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-16',
      method: 'POST',
      route: `/api/v1/jobs/:id/apply`,
      priority: 'Must',
      status: 'PASS',
      detail: `Application submitted with match score ${res.data.matchScore}%`,
      sampleResponse: JSON.stringify(res.data),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-16', method: 'POST', route: `/api/v1/jobs/:id/apply`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-16 (Duplicate application)
  try {
    await axios.post(`${BASE_URL}/jobs/${unappliedJob}/apply`, {}, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    negativeResults.push({ id: 'EP-16', errorCase: 'Duplicate job application', expectedStatus: 409, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-16', errorCase: 'Duplicate job application', expectedStatus: 409, actualStatus: status, status: status === 409 ? 'PASS' : 'FAIL' });
  }

  // 17. EP-17 List Candidate Applications
  try {
    const res = await axios.get(`${BASE_URL}/candidate/applications`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-17',
      method: 'GET',
      route: '/api/v1/candidate/applications',
      priority: 'Must',
      status: 'PASS',
      detail: `Retrieved ${res.data.length} candidate applications`,
      sampleResponse: JSON.stringify(res.data.slice(0, 1)),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-17', method: 'GET', route: '/api/v1/candidate/applications', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // 18. EP-18 Create or Update Company Profile
  try {
    const res = await axios.post(
      `${BASE_URL}/employer/company`,
      {
        name: 'TechBridge Solutions Co., Ltd.',
        industry: 'Software Development',
        location: 'Phnom Penh, Cambodia',
        website: 'https://techbridge.kh',
        description: 'Updated digital consultancy providing web and mobile products.',
      },
      { headers: { Authorization: `Bearer ${employerToken}` } }
    );
    positiveResults.push({
      id: 'EP-18',
      method: 'POST',
      route: '/api/v1/employer/company',
      priority: 'Must',
      status: 'PASS',
      detail: 'Company profile created/updated',
      sampleResponse: JSON.stringify({ name: res.data.name, industry: res.data.industry }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-18', method: 'POST', route: '/api/v1/employer/company', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-18 (Missing company name)
  try {
    await axios.post(`${BASE_URL}/employer/company`, { name: '' }, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    negativeResults.push({ id: 'EP-18', errorCase: 'Missing company name', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-18', errorCase: 'Missing company name', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // 19. EP-19 List Employer Job Postings
  try {
    const res = await axios.get(`${BASE_URL}/employer/jobs`, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    positiveResults.push({
      id: 'EP-19',
      method: 'GET',
      route: '/api/v1/employer/jobs',
      priority: 'Must',
      status: 'PASS',
      detail: `Retrieved ${res.data.length} jobs posted by recruiter`,
      sampleResponse: JSON.stringify(res.data.slice(0, 1)),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-19', method: 'GET', route: '/api/v1/employer/jobs', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // 20. EP-20 Publish Entry-Level Job Listing
  try {
    const res = await axios.post(
      `${BASE_URL}/employer/jobs`,
      {
        title: 'Junior QA Engineer Intern',
        description: 'Great internship role focusing on manual and automated web/mobile testing with Jest.',
        category: 'QA & Testing',
        employmentType: 'INTERNSHIP',
        location: 'Phnom Penh',
        isRemote: true,
        stipendAmountCents: 20000,
        requiredSkillIds: sampleSkillIds,
      },
      { headers: { Authorization: `Bearer ${employerToken}` } }
    );
    positiveResults.push({
      id: 'EP-20',
      method: 'POST',
      route: '/api/v1/employer/jobs',
      priority: 'Must',
      status: 'PASS',
      detail: 'Published new job with required skills',
      sampleResponse: JSON.stringify({ id: res.data.id, title: res.data.title }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-20', method: 'POST', route: '/api/v1/employer/jobs', priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-20 (No required skills selected)
  try {
    await axios.post(
      `${BASE_URL}/employer/jobs`,
      {
        title: 'Junior QA Engineer',
        description: 'Test job description with enough characters.',
        requiredSkillIds: [],
      },
      { headers: { Authorization: `Bearer ${employerToken}` } }
    );
    negativeResults.push({ id: 'EP-20', errorCase: 'Empty required skills array', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-20', errorCase: 'Empty required skills array', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // 21. EP-21 Review Job Applicants
  try {
    const employerJobsRes = await axios.get(`${BASE_URL}/employer/jobs`, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    const jobWithApplicants = employerJobsRes.data.find((j: any) => j.applicantCount > 0)?.id || sampleJobId;
    const res = await axios.get(`${BASE_URL}/employer/jobs/${jobWithApplicants}/applications`, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    sampleApplicationId = res.data[0]?.id;
    positiveResults.push({
      id: 'EP-21',
      method: 'GET',
      route: `/api/v1/employer/jobs/:id/applications`,
      priority: 'Must',
      status: 'PASS',
      detail: `Retrieved ${res.data.length} applicants with calculated match percentages`,
      sampleResponse: JSON.stringify({ applicantsCount: res.data.length, firstApplicantScore: res.data[0]?.matchScore }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-21', method: 'GET', route: `/api/v1/employer/jobs/:id/applications`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-21 (Candidate accessing employer applicants list)
  try {
    await axios.get(`${BASE_URL}/employer/jobs/${sampleJobId}/applications`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    negativeResults.push({ id: 'EP-21', errorCase: 'Candidate accessing employer applicants route', expectedStatus: 403, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-21', errorCase: 'Candidate accessing employer applicants route', expectedStatus: 403, actualStatus: status, status: status === 403 ? 'PASS' : 'FAIL' });
  }

  // 22. EP-22 Update Applicant Status
  try {
    const res = await axios.patch(
      `${BASE_URL}/employer/applications/${sampleApplicationId}/status`,
      { status: 'UNDER_REVIEW' },
      { headers: { Authorization: `Bearer ${employerToken}` } }
    );
    positiveResults.push({
      id: 'EP-22',
      method: 'PATCH',
      route: `/api/v1/employer/applications/:id/status`,
      priority: 'Must',
      status: 'PASS',
      detail: 'Updated applicant status to UNDER_REVIEW',
      sampleResponse: JSON.stringify(res.data),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-22', method: 'PATCH', route: `/api/v1/employer/applications/:id/status`, priority: 'Must', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-22 (Invalid status enum)
  try {
    await axios.patch(
      `${BASE_URL}/employer/applications/${sampleApplicationId}/status`,
      { status: 'INVALID_STATUS' },
      { headers: { Authorization: `Bearer ${employerToken}` } }
    );
    negativeResults.push({ id: 'EP-22', errorCase: 'Invalid application status value', expectedStatus: 400, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-22', errorCase: 'Invalid application status value', expectedStatus: 400, actualStatus: status, status: status === 400 ? 'PASS' : 'FAIL' });
  }

  // 23. EP-23 Preparation Guides
  try {
    const res = await axios.get(`${BASE_URL}/candidate/guides`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    positiveResults.push({
      id: 'EP-23',
      method: 'GET',
      route: '/api/v1/candidate/guides',
      priority: 'Should',
      status: 'PASS',
      detail: `Retrieved ${res.data.length} preparation guides with associated skills`,
      sampleResponse: JSON.stringify({ guidesCount: res.data.length, firstGuideSkills: res.data[0]?.skills }),
    });
  } catch (err: any) {
    positiveResults.push({ id: 'EP-23', method: 'GET', route: '/api/v1/candidate/guides', priority: 'Should', status: 'FAIL', detail: err.message, sampleResponse: '' });
  }

  // Negative EP-23 (Employer accessing candidate guides)
  try {
    await axios.get(`${BASE_URL}/candidate/guides`, {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    negativeResults.push({ id: 'EP-23', errorCase: 'Employer accessing candidate guides', expectedStatus: 403, actualStatus: 200, status: 'FAIL' });
  } catch (err: any) {
    const status = err.response?.status;
    negativeResults.push({ id: 'EP-23', errorCase: 'Employer accessing candidate guides', expectedStatus: 403, actualStatus: status, status: status === 403 ? 'PASS' : 'FAIL' });
  }

  console.log('\n=======================================');
  console.log('--- POSITIVE VERIFICATION RESULTS ---');
  console.log('=======================================');
  console.table(positiveResults.map(r => ({ id: r.id, method: r.method, route: r.route, priority: r.priority, status: r.status })));

  console.log('\n=======================================');
  console.log('--- NEGATIVE / ERROR CASE RESULTS ---');
  console.log('=======================================');
  console.table(negativeResults);

  const allPositivePass = positiveResults.every(r => r.status === 'PASS');
  const allNegativePass = negativeResults.every(r => r.status === 'PASS');

  console.log(`\nPositive Tests: ${positiveResults.filter(r => r.status === 'PASS').length} / ${positiveResults.length} PASS`);
  console.log(`Negative Tests: ${negativeResults.filter(r => r.status === 'PASS').length} / ${negativeResults.length} PASS`);

  if (allPositivePass && allNegativePass) {
    console.log('\n>>> ALL 23 ENDPOINTS AND NEGATIVE TEST CASES PASSED SUCCESSFULLY! <<<');
    process.exit(0);
  } else {
    console.error('\n>>> SOME TESTS FAILED! <<<');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
