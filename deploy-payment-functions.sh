#!/bin/bash

# Payment Edge Functions Deployment Script
# This script deploys the payment-related edge functions to Supabase

echo "🚀 Deploying Payment Edge Functions..."

# Navigate to supabase directory
cd supabase

# Deploy create-order function
echo "📦 Deploying create-order function..."
supabase functions deploy create-order --project-ref iovkyejegqvqxejmxrla

# Deploy verify-payment function
echo "📦 Deploying verify-payment function..."
supabase functions deploy verify-payment --project-ref iovkyejegqvqxejmxrla

# Run database migrations
echo "🗄️ Running database migrations..."
supabase db push --project-ref iovkyejegqvqxejmxrla

echo "✅ Payment functions deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Supabase Dashboard:"
echo "   - Go to Settings > Edge Functions"
echo "   - Add RAZORPAY_KEY_ID=rzp_test_3qZvN5LXUPhYQK"
echo "   - Add RAZORPAY_KEY_SECRET=GZRupiKHepRrMgg3XzbKekiI"
echo "   - Add RESEND_API_KEY (optional, for email receipts)"
echo ""
echo "2. Test the payment flow:"
echo "   - Use the new DonationFormNew component"
echo "   - Make a test donation with ₹100 minimum"
echo ""
echo "3. Update your frontend to use the new payment system" 