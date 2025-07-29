import React, { useState } from 'react';
import DonationFormNew from '@/components/DonationFormNew';
import { DonationData } from '@/config/payment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TestPayment: React.FC = () => {
  const [donationHistory, setDonationHistory] = useState<DonationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDonation = (donationData: DonationData) => {
    setDonationHistory(prev => [donationData, ...prev]);
    console.log('Donation successful:', donationData);
  };

  const totalDonations = donationHistory.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment System Test
            </h1>
            <p className="text-lg text-gray-600">
              Test the new payment system with secure Razorpay integration
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    New Payment System
                  </CardTitle>
                  <CardDescription>
                    Secure payment processing with Razorpay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonationFormNew 
                    onDonate={handleDonation}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Test Information */}
            <div className="space-y-6">
              {/* Test Card Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Test Card Details</CardTitle>
                  <CardDescription className="text-blue-700">
                    Use these details for testing payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Card Number:</span>
                    <Badge variant="secondary">4111 1111 1111 1111</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expiry:</span>
                    <Badge variant="secondary">Any future date</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CVV:</span>
                    <Badge variant="secondary">Any 3 digits</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <Badge variant="secondary">Any name</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Features</CardTitle>
                  <CardDescription>
                    What makes this payment system secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Server-side order creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Payment signature verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Database validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Email receipts (optional)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Anonymous donations</span>
                  </div>
                </CardContent>
              </Card>

              {/* Donation History */}
              {donationHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Donations</CardTitle>
                    <CardDescription>
                      Recent test donations (not real payments)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {donationHistory.map((donation, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">
                              {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {donation.donorEmail}
                            </p>
                            {donation.purpose && (
                              <p className="text-xs text-gray-500">
                                Purpose: {donation.purpose}
                              </p>
                            )}
                          </div>
                          <Badge variant="default" className="text-lg">
                            ₹{donation.amount}
                          </Badge>
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-lg">₹{totalDonations}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <AlertCircle className="w-5 h-5" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-800">
                <ul className="space-y-2 text-sm">
                  <li>• This is a test environment - no real payments will be processed</li>
                  <li>• Minimum donation amount is ₹100</li>
                  <li>• All payments are processed securely via Razorpay</li>
                  <li>• Email receipts are sent automatically (if configured)</li>
                  <li>• Donations are recorded in the database for tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPayment; 