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

### Installation

1. **Create a new Google Apps Script project**
   - Go to [Google Apps Script](https://script.google.com/)
   - Click "New Project"

2. **Upload the source code**
   - Copy all files from the `src/` directory to your GAS project
   - Make sure to include the `appsscript.json` configuration

3. **Set up Script Properties**
   - Go to Project Settings → Script Properties
   - Add the following properties:
     - `RECAPTCHA_SECRET`: Your reCAPTCHA v3 secret key
     - `SPREADSHEET_ID_CONFIG`: The ID of your configuration spreadsheet

4. **Configure your spreadsheet**
   - Create a configuration sheet with the following structure:
     ```
     Row 1: Target spreadsheet ID
     Row 2: Target sheet name
     Row 3: (Header row - optional)
     Row 4+: Field configurations (name, maxlength, required)
     ```

5. **Deploy as Web App**
   - Click "Deploy" → "New Deployment"
   - Choose "Web app" as the type
   - Set execute permissions appropriately
   - Copy the web app URL for use in your forms

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

- Node.js (for development tools)
- TypeScript
- Biome (for formatting and linting)

### Setup Development Environment

```bash
# Install dependencies
npm install

# Format code
npm run format

# Lint code
npm run lint

# Check code (format + lint)
npm run check
```

### Scripts

- `npm run format` - Format code with Biome
- `npm run format:write` - Format and write changes
- `npm run lint` - Lint code with Biome
- `npm run lint:write` - Lint and fix issues
- `npm run check` - Run both format and lint checks
- `npm run check:write` - Run checks and fix issues

## File Structure

```
src/
├── appsscript.json         # GAS configuration
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
