# Garuda Dhruvam Foundation Website

A modern, responsive website for the Garuda Dhruvam Foundation built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-simple-webspace-63
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your Supabase credentials if needed.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🌐 Netlify Deployment

### Prerequisites
- Netlify account
- Supabase project configured

### Deployment Steps

1. **Connect to Netlify**
   - Push your code to GitHub/GitLab
   - Connect your repository to Netlify
   - Or drag and drop the `dist` folder after building

2. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

3. **Set Environment Variables**
   In your Netlify dashboard, go to **Site settings** > **Environment variables** and add:
   ```
   VITE_SUPABASE_URL=https://qcfyyjwcxutxbljhgsbi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZnl5andjeHV0eGJsamhnc2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjM1MTIsImV4cCI6MjA2ODk5OTUxMn0.LX3rKUgSsw46cy3VTCJmYLlZBOV_caHc8x6qRe5xu7Q
   ```

4. **Update Supabase Configuration**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** > **Settings**
   - Update **Site URL** to: `https://garudadhruvam.netlify.app`
   - Add to **Redirect URLs**: `https://garudadhruvam.netlify.app`

5. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your site will be available at: `https://garudadhruvam.netlify.app`

### Troubleshooting

**"Page not found" error:**
- Ensure `_redirects` file is in the `public` directory
- Check that environment variables are set correctly
- Verify build logs for any errors

**Authentication issues:**
- Confirm Supabase site URL and redirect URLs are updated
- Check that the Supabase project is accessible
- Verify API keys are correct

**Build failures:**
- Ensure Node.js version is 18 or higher
- Check that all dependencies are properly installed
- Review build logs for specific error messages

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Netlify
- **State Management**: React Query
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
