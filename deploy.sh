#!/bin/bash

# Garuda Dhruvam Foundation - Netlify Deployment Script

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists, if not create from example
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please review and update if needed."
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Deployment ready!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub/GitLab"
    echo "2. Connect your repository to Netlify"
    echo "3. Set environment variables in Netlify dashboard:"
    echo "   - VITE_SUPABASE_URL=https://qcfyyjwcxutxbljhgsbi.supabase.co"
    echo "   - VITE_SUPABASE_ANON_KEY=your_anon_key"
    echo "4. Update Supabase site URL to: https://garudadhruvam.netlify.app"
    echo "5. Deploy!"
    echo ""
    echo "📁 Build output is in the 'dist' directory"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi 