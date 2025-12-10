# Boilerplate Preparation Scripts

Scripts to manage boilerplate example files when preparing the project for production.

## 📋 Usage

### Prepare for Production

Removes example files and optional dependencies from the project:

```bash
npm run prepare:production
```

**What this script does:**
- ✅ Adds example files to `.gitignore`
- ✅ Removes example dependencies from `package.json`:
  - `react-markdown`
  - `react-syntax-highlighter`
  - `@types/react-syntax-highlighter`
- ⚠️ **Important**: Run `npm install` after running this script to update `node_modules`

**Ignored files:**
- `app/page.tsx` (example home page)
- `app/docs/` (boilerplate documentation)
- `app/redux-demo/` (Redux demo)
- `app/components/` (example components)
- `README.md` (boilerplate documentation)

### Restore Development Mode

Restores example files and dependencies:

```bash
npm run prepare:development
```

**What this script does:**
- ✅ Removes example entries from `.gitignore`
- ✅ Restores example dependencies in `package.json`
- ⚠️ **Important**: Run `npm install` after running this script to restore dependencies

## 🔧 Configuration

The managed files and dependencies are configured in `scripts/boilerplate-config.json`. You can edit this file to add or remove items.

## 📝 Recommended Workflow

### When creating a new project from the boilerplate:

1. Clone the repository
2. Run `npm install`
3. Run `npm run prepare:production`
4. Run `npm install` again
5. Commit the changes (example files will be ignored)
6. Start developing!

### To contribute to the boilerplate:

1. Run `npm run prepare:development` to restore examples
2. Make your changes
3. Run `npm run prepare:production` before committing (if needed)

## ⚠️ Warnings

- **Always run `npm install`** after using the preparation scripts
- The scripts modify `.gitignore` and `package.json` - make sure to review the changes
- Already committed files won't be automatically removed - you'll need to remove them manually if needed
