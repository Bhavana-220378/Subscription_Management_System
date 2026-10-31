# Public judge access deployment

## Recommended: Netlify manual deploy

1. Run `BUILD_FOR_DEPLOYMENT.bat`, or install dependencies in the project folder with `npm.cmd install`.
2. Build the website with `npm.cmd run build`.
3. Open the generated `dist` folder.
4. Log in to Netlify, choose the manual deploy / drag-and-drop deployment flow, and upload the contents of `dist`.
5. Copy the public URL Netlify provides and share it with judges.

The app uses browser-side routing/state only and can be hosted as a static Vite site. Netlify/Vercel do not provide shared database storage for this prototype.

## GitHub-connected deployment

- Push the project to GitHub.
- Import the repository into Netlify or Vercel.
- Build command: `npm run build`
- Publish/output directory: `dist`
- Node version: 20 or newer recommended.

## Judge handoff

Share the public URL and the Admin, Staff and Customer demo credentials from README.md. The login screen includes quick-select demo account rows. Ask judges to test in a private/incognito window if another person has already logged in on the same browser.

## Shared-data requirement

If judges must see the same records and changes from different devices, a hosted backend is required. This ZIP does not include a configured Supabase project or production authentication. Do not present localStorage demo roles as secure access control.
