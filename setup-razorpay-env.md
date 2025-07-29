# 🔧 Quick Razorpay Setup

## Your Razorpay Credentials

**Key ID:** `rzp_test_3qZvN5LXUPhYQK`  
**Key Secret:** `GZRupiKHepRrMgg3XzbKekiI`

## Setup Steps

### 1. Configure Supabase Edge Functions

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `iovkyejegqvqxejmxrla`
3. Go to **Settings** → **Edge Functions**
4. Add these environment variables:

```
RAZORPAY_KEY_ID=rzp_test_3qZvN5LXUPhYQK
RAZORPAY_KEY_SECRET=GZRupiKHepRrMgg3XzbKekiI
```

### 2. Deploy Edge Functions

Run the deployment script:
```bash
./deploy-payment-functions.bat
```

### 3. Test the Payment System

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/test-payment`

3. Make a test donation using:
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits

## ✅ Ready to Use!

Your payment system is now configured with your Razorpay credentials and ready for testing! 