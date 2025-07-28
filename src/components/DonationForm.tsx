import React, { useState } from 'react';
import { Heart, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RAZORPAY_CONFIG, RazorpayResponse, DonationPayload } from '@/config/razorpay';

// Add Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonationFormProps {
  onDonate: (donationData: DonationData) => void;
  isLoading?: boolean;
}

export interface DonationData {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  purpose?: string;
  isAnonymous: boolean;
}



const DonationForm: React.FC<DonationFormProps> = ({ onDonate, isLoading = false }) => {
  const [form, setForm] = useState({
    amount: '',
    customAmount: '',
    name: '',
    email: '',
    phone: '',
    purpose: '',
    is_anonymous: false,
  });

  const presetAmounts = [500, 2000, 5000];

  const handleAmountSelect = (amt: number) => {
    setForm((prev) => ({ ...prev, amount: amt.toString(), customAmount: '' }));
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, customAmount: value, amount: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDonate = async () => {
    const finalAmount = form.amount || form.customAmount;
    
    if (!form.name || !form.email || !finalAmount) {
      alert('Please fill all required fields');
      return;
    }

    if (parseInt(finalAmount) < 100) {
      alert('Minimum donation amount is ₹100');
      return;
    }

    console.log('Starting donation process...');
    console.log('Environment:', import.meta.env.MODE);
    console.log('Razorpay Key:', RAZORPAY_CONFIG.getKeyId());
    console.log('Edge Function URL:', RAZORPAY_CONFIG.EDGE_FUNCTION_URL);

    const amountInPaise = parseInt(finalAmount) * 100;

    const options = {
      key: RAZORPAY_CONFIG.getKeyId(),
      amount: amountInPaise,
      currency: RAZORPAY_CONFIG.CURRENCY,
      name: RAZORPAY_CONFIG.NGO_NAME,
      description: RAZORPAY_CONFIG.NGO_DESCRIPTION,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        purpose: form.purpose || "General Donation",
        anonymous: form.is_anonymous ? "Yes" : "No",
      },
      theme: {
        color: RAZORPAY_CONFIG.THEME_COLOR,
      },
      handler: async function (response: RazorpayResponse) {
        try {
          // ✅ Razorpay sends back payment_id, order_id, signature
          const payload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            donor_name: form.name,
            donor_email: form.email,
            donor_phone: form.phone,
            amount: finalAmount,
            purpose: form.purpose || "donation", // Added fallback for empty purpose
            is_anonymous: form.is_anonymous,
          };

          // ✅ Send to Supabase Edge Function (Step 3)
          console.log('Sending payload:', payload);
          console.log('Using URL:', RAZORPAY_CONFIG.EDGE_FUNCTION_URL);
          console.log('Using API key:', import.meta.env.VITE_SUPABASE_ANON_KEY || 'FALLBACK_KEY');
          
          const res = await fetch(
            RAZORPAY_CONFIG.EDGE_FUNCTION_URL,
            {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvdmt5ZWplZ3F2cXhlam14cmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTk0ODUsImV4cCI6MjA2OTI3NTQ4NX0.Y4LFBB3fBnTdRTZDINi-9kknNFZvXmSduGXnCk4ENY8",
              },
              
              body: JSON.stringify(payload),
            }
          );

          console.log('Response status:', res.status);
          console.log('Response headers:', Object.fromEntries(res.headers.entries()));
          
          const data = await res.json();
          console.log('Response data:', data);
          if (data.success) { // Changed from data.status === "success" to data.success
            alert("✅ Thank you! Your donation was successful.");
            // Call the parent onDonate function to update UI
            const donationData: DonationData = {
              amount: parseInt(finalAmount),
              donorName: form.name.trim(),
              donorEmail: form.email.trim(),
              donorPhone: form.phone.trim() || undefined,
              purpose: form.purpose.trim() || undefined,
              isAnonymous: form.is_anonymous
            };
            onDonate(donationData);
          } else {
            console.error('Donation failed:', data);
            const errorMessage = data.error || data.message || 'Unknown error occurred';
            alert(`❌ Payment failed: ${errorMessage}`);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          alert(`❌ Payment verification failed: ${errorMessage}`);
        }
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Failed to open Razorpay:', error);
      alert("❌ Payment gateway error. Please try again.");
    }
  };

  const getImpactMessage = (amount: string) => {
    const amt = parseInt(amount);
    if (amt >= 5000) return "Can support child home for a week";
    if (amt >= 2000) return "Can restore temple artwork";
    if (amt >= 500) return "Can skill one woman for a month";
    return "Will make a significant difference";
  };

  const finalAmount = form.amount || form.customAmount;

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-turmeric/10 p-3 rounded-full">
              <Heart className="w-8 h-8 text-turmeric" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Make a Donation
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your contribution creates lasting impact in rural communities
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Donation Amount</Label>
            
            <div className="flex justify-center gap-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAmountSelect(amt)}
                  className={`px-4 py-2 border-2 rounded-xl transition-all duration-200 font-semibold ${
                    form.amount === amt.toString()
                      ? 'bg-turmeric text-white border-turmeric'
                      : 'bg-gray-100 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <Input
              type="number"
              name="customAmount"
              placeholder="Or enter custom amount"
              value={form.customAmount}
              onChange={handleCustomAmount}
              className="w-full"
              min="100"
            />
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Your Information</Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm">Full Name *</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number (Optional)</Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="purpose" className="text-sm">Purpose (Optional)</Label>
                <Input
                  type="text"
                  name="purpose"
                  placeholder="Purpose (optional)"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_anonymous"
                name="is_anonymous"
                checked={form.is_anonymous}
                onCheckedChange={(checked) => 
                  setForm(prev => ({ ...prev, is_anonymous: checked as boolean }))
                }
              />
              <Label htmlFor="is_anonymous" className="text-sm">
                Make this donation anonymous
              </Label>
            </div>
          </div>

          {/* Impact Preview */}
          {finalAmount && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600">
                <strong>Your Impact:</strong> {getImpactMessage(finalAmount)}
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Your payment is secured with bank-level encryption</span>
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={isLoading}
            className="w-full bg-turmeric hover:bg-turmeric/90 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Donate ₹{finalAmount ? parseInt(finalAmount).toLocaleString() : '0'}
              </div>
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Tax Deductible</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Instant Receipt</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Receipt Note */}
          <p className="text-xs text-gray-500 text-center">
            You'll receive an email receipt after payment
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationForm; 