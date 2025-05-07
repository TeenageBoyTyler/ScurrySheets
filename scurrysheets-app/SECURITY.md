# Security Guidelines for ScurrySheets

## Credential Management

### Local Development

1. **Environment Variables**:
   - Copy `.env.example` to `.env` for local development
   - Add your actual credentials to `.env` (never commit this file)
   - The `.gitignore` file is configured to exclude `.env` from git

2. **API Keys**:
   - Keep your Supabase and Google API keys secure
   - Regularly rotate API keys, especially if you suspect they've been compromised
   - Use key restrictions where possible (e.g., restrict Google API keys by service, IP, etc.)

### Production Environment

1. **Deployment Platforms**:
   - Use the platform's secure environment variable storage:
     - Vercel: Environment Variables in project settings
     - Netlify: Environment Variables in site settings
     - GitHub Codespaces: Repository Secrets

2. **API Key Restrictions**:
   - Restrict Supabase anon key to only the necessary operations
   - Set HTTP referrer restrictions on Google API keys
   - Enable usage quotas to prevent unexpected charges

## User API Key Management

The ScurrySheets application uses a "bring your own API key" model for Google Cloud Vision:

1. **User-Provided Keys**:
   - Each user provides their own Google Cloud Vision API key
   - Keys are stored securely in Supabase with Row-Level Security (RLS)
   - Keys are only used for that specific user's operations

2. **Secure Storage**:
   - API keys are stored in the `user_settings` table with RLS enabled
   - Only the user who owns the profile can access their own API key
   - Keys are only transmitted over HTTPS connections

## Database Security

1. **Row-Level Security**:
   - All tables should have RLS enabled
   - Policies should restrict access to the user's own data
   - Example policy for the `user_settings` table:
     ```sql
     CREATE POLICY "Users can only access their own settings"
     ON user_settings FOR ALL
     USING (auth.uid() = user_id);
     ```

2. **Data Validation**:
   - Validate all user inputs on both client and server
   - Use parameterized queries to prevent SQL injection
   - Implement proper data sanitization before storage

## Frontend Security

1. **API Access**:
   - Never expose API keys in client-side code
   - Use Supabase RLS to enforce access control
   - Implement proper authorization checks in client code

2. **User Data Handling**:
   - Minimize sensitive data collection and storage
   - Only request necessary Google OAuth scopes
   - Don't store or log sensitive user information

## Vulnerability Reporting

If you discover a security vulnerability within ScurrySheets, please send an email to [security@example.com](mailto:security@example.com). All security vulnerabilities will be promptly addressed.