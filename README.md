# GAS Post to Sheet

A Google Apps Script (GAS) webhook service that securely posts form data to Google Spreadsheets with reCAPTCHA verification.

## Features

- 🔒 **reCAPTCHA v3 Integration**: Secure form submissions with bot protection
- 📊 **Google Sheets Integration**: Automatically append form data to spreadsheets
- ⚙️ **Configurable Validation**: Dynamic parameter validation based on spreadsheet configuration
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- 📝 **TypeScript Support**: Full TypeScript implementation for better code quality

## Setup

### Prerequisites

- Google Account with access to Google Apps Script
- Google Sheets for data storage and configuration
- reCAPTCHA v3 site key and secret key

### Installation (Local + clasp)

1. Clone this repo locally.
2. Install dependencies:
  ```bash
  npm install
  ```
3. Login to clasp (first time only):
  ```bash
  npx clasp login
  ```
4. Create a new GAS project (standalone) and note the scriptId OR create it directly via clasp:
  ```bash
  npx clasp create --type standalone --title "PostToSheet"
  ```
5. Build TypeScript to `dist/` (transpiles `.ts` and copies `appsscript.json`):
  ```bash
  npm run build
  ```
6. (Optional) Pull remote to ensure sync:
  ```bash
  npx clasp pull
  ```
7. Push compiled code (always push the build output, not `src`):
  ```bash
  npx clasp push -P dist
  ```

### Script Properties

Set in Apps Script UI (Project Settings → Script properties):
* `RECAPTCHA_SECRET` – reCAPTCHA v3 secret key
* `SPREADSHEET_ID_CONFIG` – ID of the config spreadsheet

### Spreadsheet Config

Create a sheet with:
```
Row 1: Target spreadsheet ID
Row 2: Target sheet name
Row 3: (Header row) Name | Maxlength | Required
Row 4+: Field definitions
```

### Deploy as Web App (after push)

1. In Apps Script: Deploy → New deployment → Type: Web app
2. Set "Execute as": Me
3. Set access (e.g. Anyone with the link if public form)
4. Click Deploy and copy the URL

## Configuration

### Spreadsheet Configuration Format

The configuration spreadsheet should follow this format:

| Column A | Column B | Column C |
|----------|----------|----------|
| `target_spreadsheet_id` | | |
| `target_sheet_name` | | |
| Name | Maxlength | Required |
| field_name_1 | max_length | required |
| field_name_2 | max_length | required |
| ... | ... | ... |

Where:
- `field_name`: The name of the form field
- `max_length`: Maximum character length (0 for no limit)
- `required`: TRUE/FALSE for required fields

### Example Configuration

```
1ABcDefGhIjKlMnOpQrStUvWxYz123456789  // Target spreadsheet ID
ContactForm                            // Target sheet name
Name	Maxlength	Required
name	50	TRUE
email	100	TRUE
message	1000	FALSE
```

## API Usage

### Endpoint

```
POST [YOUR_WEB_APP_URL]
```

### Request Body

```json
{
  "type": "your_config_sheet_name",
  "recaptchaToken": "your_recaptcha_token",
  "field_name_1": "value1",
  "field_name_2": "value2"
}
```

### Response

**Success:**
```json
{
  "result": "done"
}
```

**Error:**
```json
{
  "result": "error",
  "error": "Error description"
}
```

## Development

### Requirements

* Node.js (dev only)
* TypeScript compiler
* Biome (format / lint)
* clasp (deploy)

### Dev Commands

```bash
# Install deps
npm install

# Build (outputs to dist/)
npm run build

# Format (check / write)
npm run format
npm run format:write

# Lint (check / fix)
npm run lint
npm run lint:write

# Combined
npm run check
npm run check:write
```

## File Structure

```
src/
├── appsscript.json         # GAS manifest (copied to dist on build)
├── doPost.ts               # Main webhook handler
├── getConfig.ts            # Configuration retrieval
├── validateParameters.ts   # Parameter validation
└── verifyRecaptcha.ts      # reCAPTCHA verification
```

## Security Features

- **reCAPTCHA v3**: Protects against bot submissions
- **Parameter Validation**: Validates all input parameters
- **Error Handling**: Secure error responses without exposing sensitive data
- **Script Properties**: Sensitive data stored securely in GAS properties
