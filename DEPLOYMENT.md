# Netlify Deployment Guide

## Environment Variables Setup

To deploy this application to Netlify, you need to set up the following environment variables in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variables:

```
VITE_SUPABASE_URL=https://qcfyyjwcxutxbljhgsbi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZnl5andjeHV0eGJsamhnc2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjM1MTIsImV4cCI6MjA2ODk5OTUxMn0.LX3rKUgSsw46cy3VTCJmYLlZBOV_caHc8x6qRe5xu7Q
```

## Build Settings

The application is configured with the following build settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

## Local Development

To run the application locally:

1. Copy `env.example` to `.env`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Troubleshooting

If you encounter a "Page not found" error on Netlify:

1. Ensure the `_redirects` file is present in the `public` directory
2. Check that environment variables are properly set in Netlify
3. Verify that the build is successful in the Netlify build logs
4. Make sure the Supabase project is accessible and the API keys are correct

## Supabase Configuration

The application is configured to use the Supabase project with ID: `qcfyyjwcxutxbljhgsbi`

Make sure your Supabase project has the necessary tables and RLS policies configured. 