# GAS Post to Sheet

A Google Apps Script (GAS) webhook service that securely posts form data to Google Spreadsheets with reCAPTCHA verification.

## Features

- 🔒 **reCAPTCHA v3 Integration**: Secure form submissions with bot protection
- 📊 **Google Sheets Integration**: Automatically append form data to spreadsheets
- ⚙️ **Configurable Validation**: Dynamic parameter validation based on spreadsheet configuration
- ⏰ **Form Expiration**: Support for expired forms with status check endpoint
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
  pnpm install
  ```
3. Login to clasp (first time only):
  ```bash
  pnpm dlx @google/clasp login
  ```
4. Setup clasp configuration (choose one):

  **Option A: Use existing GAS project**
  ```bash
  cp .clasp.json.org .clasp.json
  ```
  Then edit `.clasp.json` and set your `scriptId`:
  ```json
  {
    "scriptId": "your-script-id-here",
    "rootDir": "dist"
  }
  ```

  **Option B: Create new GAS project**
  ```bash
  pnpm dlx @google/clasp create --type standalone --title "PostToSheet" --rootDir dist
  ```

5. Build TypeScript:
  ```bash
  pnpm build
  ```
6. Push compiled code:
  ```bash
  pnpm dlx @google/clasp push
  ```

### Script Properties

Set in Apps Script UI (Project Settings → Script properties):
* `RECAPTCHA_SECRET` – reCAPTCHA v3 secret key
* `SPREADSHEET_ID_CONFIG` – ID of the config spreadsheet

### Spreadsheet Config

Create a configuration spreadsheet with two types of sheets:

**1. "list" sheet** (configuration index):

| expired | type | fileId | sheetName |
|---------|------|--------|-----------|
| FALSE | contact | 1ABC...xyz | ContactForm |
| TRUE | inquiry | 1ABC...xyz | InquiryForm |

- `expired`: TRUE/FALSE - whether the form accepts submissions
- `type`: Unique identifier for the form configuration
- `fileId`: Target spreadsheet ID where form data will be stored
- `sheetName`: Target sheet name within the spreadsheet

**2. Type-specific sheets** (field definitions):

Create a sheet named after each `type` value (e.g., "contact", "inquiry"):

| Name | Maxlength | Required |
|------|-----------|----------|
| name | 50 | TRUE |
| email | 100 | TRUE |
| message | 1000 | FALSE |

- `Name`: The name of the form field
- `Maxlength`: Maximum character length (0 for no limit)
- `Required`: TRUE/FALSE for required fields

### Deploy as Web App

1. In Apps Script: Deploy → New deployment → Type: Web app
2. Set "Execute as": Me
3. Set access (e.g. Anyone with the link if public form)
4. Click Deploy and copy the URL

## API Usage

### GET Endpoint (Check Status)

```
GET [YOUR_WEB_APP_URL]?type=your_config_type
```

**Parameters:**
- `type`: The configuration type to check

**Success Response:**
```json
{
  "result": "done",
  "expired": false
}
```

**Error Response:**
```json
{
  "result": "error",
  "error": "Error description"
}
```

### POST Endpoint (Submit Form)

```
POST [YOUR_WEB_APP_URL]
```

**Request Body:**
```json
{
  "type": "your_config_type",
  "recaptchaToken": "your_recaptcha_token",
  "field_name_1": "value1",
  "field_name_2": "value2"
}
```

**Success Response:**
```json
{
  "result": "done"
}
```

**Error Response:**
```json
{
  "result": "error",
  "error": "Error description"
}
```

## Development

### Requirements

* Node.js
* pnpm
* TypeScript compiler
* Biome (format / lint)
* clasp (deploy)

### Dev Commands

```bash
# Install deps
pnpm install

# Build (outputs to dist/)
pnpm build

# Check (format + lint)
pnpm check

# Check and auto-fix
pnpm check:write
```

## File Structure

```
src/
├── appsscript.json         # GAS manifest (copied to dist on build)
├── doGet.ts                # GET request handler (status check)
├── doPost.ts               # POST request handler (form submission)
├── getConfig.ts            # Configuration retrieval
├── validateParameters.ts   # Parameter validation
└── verifyRecaptcha.ts      # reCAPTCHA verification
```

## Security Features

- **reCAPTCHA v3**: Protects against bot submissions
- **Parameter Validation**: Validates all input parameters
- **Error Handling**: Secure error responses without exposing sensitive data
- **Script Properties**: Sensitive data stored securely in GAS properties
