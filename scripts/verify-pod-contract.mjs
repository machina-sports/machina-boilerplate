import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const trackedFiles = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  {
    encoding: 'utf8',
  }
)
  .split('\0')
  .filter((file) => file && existsSync(file));

const forbiddenTerms = [
  ['gem', 'ini'].join(''),
  ['@google', '/generative-ai'].join(''),
  ['@ai-sdk', '/google'].join(''),
  ['x-project', '-token'].join(''),
  ['machina_client', '_url'].join(''),
  ['next_public_machina', '_api_key'].join(''),
];
const failures = [];

for (const file of trackedFiles) {
  const content = readFileSync(file);
  if (content.includes(0)) continue;
  const text = content.toString('utf8').toLowerCase();
  for (const term of forbiddenTerms) {
    if (text.includes(term)) failures.push(`${file}: contains retired reference ${term}`);
  }
}

const setupFiles = [
  '.env.example',
  'README.md',
  'ASSISTANT_SETUP.md',
  'ENV_SETUP.md',
  'ENV_EXAMPLE_LOCAL',
  'ENV_EXAMPLE_PRODUCTION',
  'DEPLOYMENT.md',
  'MACHINA_INTEGRATION.md',
  'TESTING_GUIDE.md',
  'scripts/SECURITY_REVIEW.md',
];
const requiredVariables = [
  'MACHINA_API_URL',
  'MACHINA_API_KEY',
  'MACHINA_PROJECT_TOKEN',
  'MACHINA_AGENT',
];

for (const file of setupFiles) {
  const text = readFileSync(file, 'utf8');
  for (const variable of requiredVariables) {
    if (!text.includes(variable)) failures.push(`${file}: missing ${variable}`);
  }
}

const authSource = readFileSync('lib/pod-auth.ts', 'utf8');
if (!authSource.includes("return { 'X-Api-Token': MACHINA_API_KEY }")) {
  failures.push('lib/pod-auth.ts: API keys must map to X-Api-Token');
}
if (!authSource.includes('return { Authorization: `Bearer ${MACHINA_PROJECT_TOKEN}` }')) {
  failures.push('lib/pod-auth.ts: project tokens must map to Authorization: Bearer');
}

if (failures.length > 0) {
  console.error(`FAIL: pod-only contract\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}

console.log(
  `PASS: ${trackedFiles.length} tracked files use pod-only setup and both auth mappings are correct`
);
