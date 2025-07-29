# 💳 Payment System Setup Guide

## 🎯 Overview

This guide will help you set up a complete payment system for your NGO website using Razorpay, Supabase Edge Functions, and React.

## 📋 Prerequisites

1. **Razorpay Account**: Sign up at [razorpay.com](https://razorpay.com)
2. **Supabase Project**: Already configured
3. **Resend Account** (optional): For email receipts at [resend.com](https://resend.com)

## 🚀 Step 1: Deploy Edge Functions

Run the deployment script:

```bash
chmod +x deploy-payment-functions.sh
./deploy-payment-functions.sh
```

Or deploy manually:

```bash
cd supabase
supabase functions deploy create-order --project-ref iovkyejegqvqxejmxrla
supabase functions deploy verify-payment --project-ref iovkyejegqvqxejmxrla
supabase db push --project-ref iovkyejegqvqxejmxrla
```

## 🔧 Step 2: Configure Environment Variables

### In Supabase Dashboard:

1. Go to **Settings** → **Edge Functions**
2. Add these environment variables:

```
RAZORPAY_KEY_ID=rzp_test_3qZvN5LXUPhYQK
RAZORPAY_KEY_SECRET=GZRupiKHepRrMgg3XzbKekiI
RESEND_API_KEY=your_resend_api_key (optional)
```

### In your local `.env` file:

```env
VITE_SUPABASE_URL=https://iovkyejegqvqxejmxrla.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RAZORPAY_TEST_KEY=rzp_test_3qZvN5LXUPhYQK
VITE_RAZORPAY_LIVE_KEY=rzp_test_3qZvN5LXUPhYQK
```

## 🎨 Step 3: Update Your Frontend

### Replace the old donation form:

```tsx
// In your component
import DonationFormNew from '@/components/DonationFormNew';

// Use the new component
<DonationFormNew 
  onDonate={(donationData) => {
    console.log('Donation successful:', donationData);
    // Handle successful donation
  }}
/>
```

### Update your main page:

```tsx
// In your main page component
import DonationFormNew from '@/components/DonationFormNew';

const YourPage = () => {
  const handleDonation = (donationData) => {
    // Handle successful donation
    console.log('Thank you for your donation!', donationData);
  };

  return (
    <div>
      <DonationFormNew onDonate={handleDonation} />
    </div>
  );
};
```

## 🧪 Step 4: Test the Payment Flow

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Make a test donation:**
   - Fill in the donation form
   - Use test card: `4111 1111 1111 1111`
   - Any future expiry date
   - Any 3-digit CVV

3. **Verify the flow:**
   - Order creation ✅
   - Payment processing ✅
   - Database recording ✅
   - Email receipt (if configured) ✅

## 🔒 Security Features

### ✅ What's Secured:

- **Server-side order creation**: Orders are created securely on the server
- **Payment signature verification**: All payments are verified using HMAC signatures
- **Database validation**: Amount validation and proper error handling
- **CORS protection**: Edge functions include proper CORS headers
- **Environment variables**: Sensitive keys are stored securely

### 🛡️ Security Best Practices:

1. **Never expose Razorpay secret key** in frontend code
2. **Always verify payment signatures** on the server
3. **Use HTTPS** in production
4. **Validate all inputs** on both client and server
5. **Log payment attempts** for monitoring

## 📧 Email Receipt Setup (Optional)

### 1. Sign up for Resend:
- Go to [resend.com](https://resend.com)
- Create a free account
- Get your API key

### 2. Configure in Supabase:
- Add `RESEND_API_KEY` to Edge Function environment variables

### 3. Customize email template:
- Edit the HTML template in `verify-payment/index.ts`
- Update NGO branding and contact details

## 🗄️ Database Schema

The donations table includes:

```sql
- id (UUID, Primary Key)
- donor_name (TEXT, Required)
- donor_email (TEXT, Required)
- donor_phone (TEXT, Optional)
- amount (INTEGER, Min 100)
- currency (TEXT, Default 'INR')
- donation_type (TEXT, Default 'one_time')
- purpose (TEXT, Default 'General Donation')
- payment_status (TEXT, Default 'pending')
- payment_method (TEXT, Default 'online')
- transaction_id (TEXT)
- razorpay_order_id (TEXT)
- razorpay_signature (TEXT)
- notes (TEXT)
- is_anonymous (BOOLEAN, Default false)
- receipt_sent (BOOLEAN, Default false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔍 Monitoring & Debugging

### Check Edge Function Logs:
```bash
supabase functions logs create-order --project-ref iovkyejegqvqxejmxrla
supabase functions logs verify-payment --project-ref iovkyejegqvqxejmxrla
```

### Database Queries:
```sql
-- View all donations
SELECT * FROM donations ORDER BY created_at DESC;

-- View successful payments
SELECT * FROM donations WHERE payment_status = 'completed';

-- View total donations
SELECT SUM(amount) FROM donations WHERE payment_status = 'completed';
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Razorpay credentials not configured"**
   - Check environment variables in Supabase Dashboard
   - Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set

2. **"Invalid payment signature"**
   - Verify Razorpay secret key is correct
   - Check if payment was tampered with

3. **"Failed to create order"**
   - Check Razorpay account status
   - Verify API keys are correct
   - Check network connectivity

4. **Email not sending**
   - Verify `RESEND_API_KEY` is set
   - Check email template syntax
   - Verify sender domain is configured

## 📞 Support

For issues with:
- **Razorpay**: Contact Razorpay support
- **Supabase**: Check Supabase documentation
- **Edge Functions**: Check function logs
- **Frontend**: Check browser console

## 🎉 Success!

Once everything is set up, your payment system will:

✅ Create secure payment orders  
✅ Process payments via Razorpay  
✅ Verify payment signatures  
✅ Record donations in database  
✅ Send email receipts  
✅ Handle errors gracefully  
✅ Support anonymous donations  
✅ Track donation purposes  

Your NGO now has a complete, secure payment system! 🚀 