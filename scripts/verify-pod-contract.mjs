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

// ---------------------------------------------------------------------------
// Build-time credential containment
//
// The Dockerfile builder stage runs `COPY . .`, so every byte in the build
// context becomes a published image layer. A pod credential written there --
// by a CI snippet this scaffold hands a reader, by a build arg, or by a stray
// local dotenv file -- ships to the registry and is readable by anyone who can
// pull the image. Credentials are runtime-only: the platform secret store
// injects them when the container starts.
//
// The credential names and the build-arg spellings are assembled at runtime for
// the same reason as the terms above: so this file does not flag itself.
// ---------------------------------------------------------------------------
const credentialNames = [['MACHINA_API', '_KEY'].join(''), ['MACHINA_PROJECT', '_TOKEN'].join('')];

/** `>> .env`, `> .env.production`, `>>"./.env"` and friends. */
const writesDotenv = /(>>?)\s*["']?[\w./\\-]*\.env(\.[\w-]+)?["']?(\s|$)/;
const buildArgFlag = new RegExp(['--build', '-arg'].join(''));
const buildArgBlock = new RegExp(['build', '-args'].join('') + '\\s*:');

for (const file of trackedFiles) {
  const content = readFileSync(file);
  if (content.includes(0)) continue;
  const lines = content.toString('utf8').split('\n');

  lines.forEach((line, index) => {
    const named = credentialNames.filter((name) => line.includes(name));
    if (named.length > 0 && writesDotenv.test(line)) {
      failures.push(
        `${file}:${index + 1}: writes ${named.join(', ')} into a dotenv file the Docker build can read; inject it at runtime instead`
      );
    }
    if (named.length > 0 && buildArgFlag.test(line)) {
      failures.push(
        `${file}:${index + 1}: passes ${named.join(', ')} as a Docker build arg; build args are baked into the image`
      );
    }
    // A YAML build-args block lists one credential per following line.
    if (buildArgBlock.test(line)) {
      for (const following of lines.slice(index + 1, index + 12)) {
        if (!/^\s/.test(following) || following.trim() === '') break;
        const inBlock = credentialNames.filter((name) => following.includes(name));
        if (inBlock.length > 0) {
          failures.push(
            `${file}:${index + 1}: build-arg block passes ${inBlock.join(', ')} into the image`
          );
        }
      }
    }
  });
}

// The Dockerfile itself must never accept a credential at build time.
const dockerfile = readFileSync('Dockerfile', 'utf8');
for (const name of credentialNames) {
  if (new RegExp(`^\\s*(ARG|ENV)\\s+${name}\\b`, 'm').test(dockerfile)) {
    failures.push(`Dockerfile: ${name} must not be a build-time ARG or ENV`);
  }
}

// Without a .dockerignore, `COPY . .` sweeps a developer's local .env into the
// image even though git never sees it.
if (!existsSync('.dockerignore')) {
  failures.push('.dockerignore: missing, so the Docker build context can include .env');
} else {
  const patterns = readFileSync('.dockerignore', 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  for (const pattern of ['.env', '.env.*']) {
    if (!patterns.includes(pattern)) {
      failures.push(`.dockerignore: must exclude ${pattern} from the build context`);
    }
  }
  const reincluded = patterns.filter(
    (pattern) => pattern.startsWith('!') && pattern.includes('env')
  );
  if (reincluded.length > 0) {
    failures.push(`.dockerignore: re-includes ${reincluded.join(', ')} into the build context`);
  }
}

if (failures.length > 0) {
  console.error(`FAIL: pod-only contract\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}

console.log(
  `PASS: ${trackedFiles.length} tracked files use pod-only setup, both auth mappings are correct, and no build step can bake a pod credential into the image`
);
