import React, { useState } from 'react';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DonationForm, { DonationData } from '@/components/DonationForm';

const DonationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleDonate = async (donationData: DonationData) => {
    setIsLoading(true);
    
    try {
      // TODO: Step 2 - Integrate with Razorpay
      console.log('Starting donation process:', donationData);
      
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Step 3-6 - Handle payment verification and database entry
      setDonationSuccess(true);
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (donationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-turmeric/5 to-primary/5 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg text-center">
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Thank You for Your Donation!
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your contribution will make a real difference in our community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  We've sent a receipt to your email address. 
                  Your donation is tax-deductible.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-turmeric hover:bg-turmeric/90"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-turmeric/5 to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Support Our Mission
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your donation empowers rural communities through cultural heritage, 
            women empowerment, and sustainable development.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-turmeric mb-2">₹500</div>
              <div className="text-sm text-gray-600">Can skill one woman for a month</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-turmeric mb-2">₹2000</div>
              <div className="text-sm text-gray-600">Can restore temple artwork</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-turmeric mb-2">₹5000</div>
              <div className="text-sm text-gray-600">Can support child home for a week</div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Form */}
        <DonationForm onDonate={handleDonate} isLoading={isLoading} />

        {/* Trust Section */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-turmeric" />
              <span>100% Transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Tax Deductible</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage; 