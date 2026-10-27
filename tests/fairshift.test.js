import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Load and evaluate pure logic from FairShift.jsx to verify production code
const jsxContent = fs.readFileSync(path.resolve('./FairShift.jsx'), 'utf-8');

// Helper to extract function / object definitions from FairShift.jsx
function extractCode(content) {
  // Extract SECTORS
  const sectorsMatch = content.match(/export const SECTORS = ({[\s\S]*?^};)/m);
  // Extract formatINR
  const formatINRMatch = content.match(/export function formatINR[\s\S]*?^}/m);
  // Extract calculatePay
  const calculatePayMatch = content.match(/export function calculatePay[\s\S]*?^}/m);
  // Extract redactPII
  const redactPIIMatch = content.match(/export function redactPII[\s\S]*?^}/m);
  // Extract generateDemoQrMatrix
  const qrMatch = content.match(/export function generateDemoQrMatrix[\s\S]*?^}/m);

  const clean = [
    sectorsMatch[0].replace('export const SECTORS =', 'const SECTORS ='),
    formatINRMatch[0].replace('export function', 'function'),
    calculatePayMatch[0].replace('export function', 'function'),
    redactPIIMatch[0].replace('export function', 'function'),
    qrMatch[0].replace('export function', 'function'),
    'return { SECTORS, formatINR, calculatePay, redactPII, generateDemoQrMatrix };'
  ].join('\n\n');

  return new Function(clean)();
}

const { SECTORS, formatINR, calculatePay, redactPII, generateDemoQrMatrix } = extractCode(jsxContent);

test('Unit Test 1: Construction 8h Standard Shift Pay Calculation', () => {
  const result = calculatePay({
    hoursWorked: 8,
    sectorConfig: SECTORS.construction,
    isNightShift: false
  });

  assert.strictEqual(result.regularHours, 8);
  assert.strictEqual(result.otHours, 0);
  assert.strictEqual(result.regularPay, 700);
  assert.strictEqual(result.otPay, 0);
  assert.strictEqual(result.allowance, 150);
  assert.strictEqual(result.deductions, 0, 'Deductions must strictly be 0');
  assert.strictEqual(result.netPay, 850);
});

test('Unit Test 2: Construction Overtime Calculation (1.5x Overtime Rate)', () => {
  const result = calculatePay({
    hoursWorked: 10,
    sectorConfig: SECTORS.construction,
    isNightShift: false
  });

  assert.strictEqual(result.regularHours, 8);
  assert.strictEqual(result.otHours, 2);
  assert.strictEqual(result.regularPay, 700);
  assert.strictEqual(result.otPay, 262.5); // 2h * (87.5 * 1.5)
  assert.strictEqual(result.allowance, 150);
  assert.strictEqual(result.deductions, 0);
  assert.strictEqual(result.netPay, 1112.5);
});

test('Unit Test 3: Factory Night Shift Differential (+15%)', () => {
  const result = calculatePay({
    hoursWorked: 8,
    sectorConfig: SECTORS.factory,
    isNightShift: true
  });

  assert.strictEqual(result.regularHours, 8);
  assert.strictEqual(result.otHours, 0);
  assert.strictEqual(result.regularPay, 720); // 8 * 90
  assert.strictEqual(result.nightDifferential, 108); // 8 * 90 * 0.15
  assert.strictEqual(result.allowance, 120);
  assert.strictEqual(result.deductions, 0);
  assert.strictEqual(result.netPay, 948);
});

test('Unit Test 4: Whistleblower PII Redaction Regex Engine', () => {
  const raw = "Contact supervisor Ramesh Kumar at +91 98450 12345 or email worker@site.org regarding ID-4092.";
  const sanitized = redactPII(raw);

  assert.ok(!sanitized.includes("+91 98450 12345"), "Mobile number must be sanitized");
  assert.ok(!sanitized.includes("worker@site.org"), "Email address must be sanitized");
  assert.ok(!sanitized.includes("ID-4092"), "Employee ID must be sanitized");
  assert.ok(sanitized.includes("[REDACTED PHONE]"), "Contains [REDACTED PHONE]");
  assert.ok(sanitized.includes("[REDACTED EMAIL]"), "Contains [REDACTED EMAIL]");
  assert.ok(sanitized.includes("[REDACTED ID]"), "Contains [REDACTED ID]");
  assert.ok(sanitized.includes("[REDACTED NAME]"), "Contains [REDACTED NAME]");
});

test('Unit Test 5: Indian Currency Grouping (INR format)', () => {
  const formatted = formatINR(125000);
  assert.ok(formatted.includes('1,25,000'), "Currency must group using Indian numbering format");
});

test('Unit Test 6: Deterministic 21x21 QR Code Matrix Generation', () => {
  const matrix = generateDemoQrMatrix('did:fairshift:worker:w101');
  assert.strictEqual(matrix.length, 21);
  assert.strictEqual(matrix[0].length, 21);
  assert.strictEqual(matrix[0][0], true, "Top-left finder module is active");
  assert.strictEqual(matrix[0][20], true, "Top-right finder module is active");
  assert.strictEqual(matrix[20][0], true, "Bottom-left finder module is active");
});

test('Unit Test 7: Security Audit - Zero Exposed Keys or Hardcoded Credentials', () => {
  const fileContent = fs.readFileSync(path.resolve('./FairShift.jsx'), 'utf-8');
  assert.ok(!fileContent.includes('AIzaSy'), 'No Google Cloud / Firebase API keys');
  assert.ok(!fileContent.includes('sk_live'), 'No Stripe / private keys');
  assert.ok(!fileContent.includes('localStorage'), 'Strictly no localStorage usage');
});
