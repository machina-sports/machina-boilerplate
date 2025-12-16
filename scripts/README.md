# Scripts

Utility scripts for the Machina Frontend Boilerplate.

## Available Scripts

### Production/Development Mode

#### `prepare-production.js`
Prepares the boilerplate for production use by removing example files and optional dependencies.

```bash
npm run prepare:production
npm install  # Update dependencies after
```

**What it does:**
- Adds example files to `.gitignore`
- Removes optional dependencies (`react-markdown`, `react-syntax-highlighter`)
- Cleans up demo pages and components

#### `prepare-development.js`
Restores example files and dependencies for development/contribution.

```bash
npm run prepare:development
npm install  # Restore dependencies
```

**What it does:**
- Removes example files from `.gitignore`
- Restores optional dependencies
- Re-enables demo pages

---

### AI Assistant

#### `test-gemini.js`
Tests if the Gemini API key is configured correctly.

```bash
node scripts/test-gemini.js
```

**What it does:**
- Validates the API key from `.env.local`
- Sends a test request to Gemini
- Shows detailed error messages if something is wrong
- Displays usage information

**Example output (success):**
```
🔍 Testing Gemini API Key...

📝 API Key: AIzaSyBxHb...yadA

⏳ Sending test request...

✅ SUCCESS! API key is working!

📤 Test Response:
──────────────────────────────────────────────────
Hello, Machina!
──────────────────────────────────────────────────

🎉 Your Gemini API is configured correctly!
```

**Example output (rate limit):**
```
❌ ERROR: API key test failed

🚫 Rate Limit Exceeded
   You have exceeded the API quota.
   Wait a few minutes and try again.
   Check usage: https://ai.dev/usage?tab=rate-limit
```

---

## Configuration Files

### `boilerplate-config.json`
Configuration for the prepare scripts. Defines which files are considered "examples" and which dependencies are optional.

```json
{
  "exampleFiles": [
    "app/page.tsx",
    "app/docs/",
    "app/redux-demo/",
    ...
  ],
  "optionalDependencies": [
    "react-markdown",
    "react-syntax-highlighter",
    ...
  ]
}
```

---

## Adding New Scripts

To add a new script:

1. Create the script file in `scripts/`
2. Add execution permissions if needed: `chmod +x scripts/your-script.js`
3. Add to `package.json` scripts section:
   ```json
   {
     "scripts": {
       "your-command": "node scripts/your-script.js"
     }
   }
   ```
4. Document it here in this README

---

## Troubleshooting

### "Cannot find module"
Make sure you've run `npm install` to install all dependencies.

### "Permission denied"
On Unix-based systems, you may need to add execute permissions:
```bash
chmod +x scripts/your-script.js
```

### Script not found
Ensure you're running scripts from the project root directory:
```bash
cd /path/to/machina-frontend-boilerplate
npm run script-name
```

---

For more information about the boilerplate, see the main [README.md](../README.md).
