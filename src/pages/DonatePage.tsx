import React from 'react';
import DonationFormNew from '@/components/DonationFormNew';
import { DonationData } from '@/config/payment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Shield, Users, Target } from 'lucide-react';

const DonatePage: React.FC = () => {
  const handleDonation = (donationData: DonationData) => {
    console.log('Donation successful:', donationData);
    // You can add additional logic here like showing a success message
    alert('Thank you for your donation! Your contribution will help us continue our mission.');
  };

  const impactAreas = [
    {
      icon: Target,
      title: "Temple Restoration",
      description: "Reviving ancient temples and preserving cultural heritage",
      impact: "₹5000 can restore temple artwork"
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Skill development and economic independence for rural women",
      impact: "₹2000 can skill one woman for a month"
    },
    {
      icon: Heart,
      title: "Child Homes",
      description: "Supporting children with education and care",
      impact: "₹5000 can support child home for a week"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Make a Difference
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your donation helps us revive India's spiritual heritage and empower rural communities. 
              Every contribution, no matter how small, makes a significant impact.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div className="order-2 lg:order-1">
              <Card className="shadow-xl border-0">
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-turmeric/10 p-4 rounded-full">
                      <Heart className="w-10 h-10 text-turmeric" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Donate Securely
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Your contribution is processed securely via Razorpay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonationFormNew 
                    onDonate={handleDonation}
                    isLoading={false}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Impact Information */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Why Donate */}
              <Card className="bg-gradient-to-br from-turmeric/10 to-orange-100 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Why Donate to Garuda Dhruvam?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    We are dedicated to preserving India's rich cultural heritage while empowering 
                    rural communities through sustainable development initiatives.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">100% Transparent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Tax Deductible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Regular Updates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Areas */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Your Impact</h3>
                <div className="space-y-4">
                  {impactAreas.map((area, index) => {
                    const Icon = area.icon;
                    return (
                      <Card key={index} className="border-l-4 border-l-turmeric">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-turmeric/10 p-2 rounded-lg">
                              <Icon className="w-5 h-5 text-turmeric" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{area.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                              <Badge variant="secondary" className="mt-2">
                                {area.impact}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Security Notice */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Shield className="w-5 h-5" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-800">
                  <p className="text-sm">
                    Your payment is processed securely by Razorpay, a trusted payment gateway. 
                    We never store your payment information on our servers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials or Additional Info */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Join Our Mission
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  "Every donation, no matter the amount, helps us preserve India's spiritual heritage 
                  and empower communities. Your contribution directly supports temple restoration, 
                  women's empowerment programs, and child welfare initiatives."
                </p>
                <div className="mt-6 flex justify-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🕉️ Reviving the Soul of Bharat 🕉️
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage; 