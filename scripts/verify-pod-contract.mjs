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

// The last term is the retired project-JWT scheme: the canonical
// machina-client-api middleware reads project JWTs from X-Project-Token and
// never looks at the Authorization header, so nothing in this scaffold may
// instruct anyone to send a token there. Every term is assembled at runtime so
// this file does not match itself.
const forbiddenTerms = [
  ['gem', 'ini'].join(''),
  ['@google', '/generative-ai'].join(''),
  ['@ai-sdk', '/google'].join(''),
  ['machina_client', '_url'].join(''),
  ['next_public_machina', '_api_key'].join(''),
  ['bear', 'er'].join(''),
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

// Every setup document that names one canonical header must name both, so a
// reader never has to guess which credential travels where.
const canonicalHeaders = [['X-Api', '-Token'].join(''), ['X-Project', '-Token'].join('')];
for (const file of setupFiles) {
  const text = readFileSync(file, 'utf8');
  if (!canonicalHeaders.some((header) => text.includes(header))) continue;
  for (const header of canonicalHeaders) {
    if (!text.includes(header)) failures.push(`${file}: missing canonical header ${header}`);
  }
}

const authSource = readFileSync('lib/pod-auth.ts', 'utf8');
if (!authSource.includes("return { 'X-Api-Token': MACHINA_API_KEY }")) {
  failures.push('lib/pod-auth.ts: API keys must map to X-Api-Token');
}
if (!authSource.includes("return { 'X-Project-Token': MACHINA_PROJECT_TOKEN }")) {
  failures.push('lib/pod-auth.ts: project tokens must map to X-Project-Token');
}
if (/authorization/i.test(authSource.replace(/^\s*\*.*$/gm, ''))) {
  failures.push('lib/pod-auth.ts: no pod request may carry an Authorization header');
}

if (failures.length > 0) {
  console.error(`FAIL: pod-only contract\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}

console.log(
  `PASS: ${trackedFiles.length} tracked files use pod-only setup and both auth mappings are correct`
);
