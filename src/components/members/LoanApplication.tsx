import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import type { LoanProduct, Guarantor } from '../../types';
import toast from 'react-hot-toast';

interface LoanApplicationProps {
  onBack: () => void;
}

export const LoanApplication: React.FC<LoanApplicationProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productId: '',
    amountRequested: '',
    term: '',
    purpose: '',
    monthlyIncome: '',
    employmentStatus: '',
    employerName: '',
    guarantors: [] as Omit<Guarantor, 'id' | 'loanApplicationId' | 'status' | 'createdAt'>[]
  });

  // Mock loan products
  const loanProducts: LoanProduct[] = [
    {
      id: '1',
      code: 'M-LOAN',
      name: 'Monthly Loan',
      description: 'Short-term loan with monthly repayments',
      interestType: 'reducing',
      interestRate: 12.5,
      minAmount: 5000,
      maxAmount: 100000,
      minTerm: 3,
      maxTerm: 12,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 5,
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      code: 'Q-LOAN',
      name: 'Quarterly Loan',
      description: 'Medium-term loan with quarterly repayments',
      interestType: 'reducing',
      interestRate: 10.0,
      minAmount: 10000,
      maxAmount: 200000,
      minTerm: 3,
      maxTerm: 24,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 7,
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      code: 'Y-LOAN',
      name: 'Yearly Loan',
      description: 'Long-term loan with flexible repayments',
      interestType: 'declining_balance',
      interestRate: 8.5,
      minAmount: 25000,
      maxAmount: 500000,
      minTerm: 12,
      maxTerm: 60,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 10,
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  const selectedProduct = loanProducts.find(p => p.id === formData.productId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGuarantor = () => {
    setFormData(prev => ({
      ...prev,
      guarantors: [...prev.guarantors, {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationalId: '',
        relationship: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      }]
    }));
  };

  const removeGuarantor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      guarantors: prev.guarantors.filter((_, i) => i !== index)
    }));
  };

  const updateGuarantor = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      guarantors: prev.guarantors.map((guarantor, i) => 
        i === index 
          ? field.includes('.') 
            ? {
                ...guarantor,
                address: {
                  ...guarantor.address,
                  [field.split('.')[1]]: value
                }
              }
            : { ...guarantor, [field]: value }
          : guarantor
      )
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.productId || !formData.amountRequested || !formData.term || !formData.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.monthlyIncome || !formData.employmentStatus) {
      toast.error('Please complete your employment information');
      return;
    }
    if (selectedProduct) {
      const amount = parseFloat(formData.amountRequested);
      const term = parseInt(formData.term);

      if (amount < selectedProduct.minAmount || amount > selectedProduct.maxAmount) {
        toast.error(`Amount must be between $${selectedProduct.minAmount.toLocaleString()} and $${selectedProduct.maxAmount.toLocaleString()}`);
        return;
      }

      if (term < selectedProduct.minTerm || term > selectedProduct.maxTerm) {
        toast.error(`Term must be between ${selectedProduct.minTerm} and ${selectedProduct.maxTerm} months`);
        return;
      }
    }

    // Submit application
    toast.success('Loan application submitted successfully!');
    onBack();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    if (!selectedProduct || !formData.amountRequested || !formData.term) return 0;
    
    const principal = parseFloat(formData.amountRequested);
    const monthlyRate = selectedProduct.interestRate / 100 / 12;
    const numPayments = parseInt(formData.term);
    
    if (selectedProduct.interestType === 'flat') {
      const totalInterest = principal * (selectedProduct.interestRate / 100) * (numPayments / 12);
      return (principal + totalInterest) / numPayments;
    } else {
      // Reducing balance calculation
      return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
             (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
  };

  const steps = [
    { id: 1, title: 'Loan Details', description: 'Choose loan product and amount' },
    { id: 2, title: 'Personal Info', description: 'Employment and income details' },
    { id: 3, title: 'Guarantors', description: 'Add guarantors (optional)' },
    { id: 4, title: 'Review', description: 'Review and submit application' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Apply for Loan</h2>
          <p className="text-gray-600">Complete the application process to request a loan</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {step.id}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Product *
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => handleInputChange('productId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a loan product</option>
                    {loanProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.interestRate}% interest
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProduct && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">{selectedProduct.name}</h4>
                    <p className="text-sm text-blue-700 mb-3">{selectedProduct.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Interest Rate:</span>
                        <span className="ml-2 font-medium">{selectedProduct.interestRate}%</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Amount Range:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(selectedProduct.minAmount)} - {formatCurrency(selectedProduct.maxAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">Term Range:</span>
                        <span className="ml-2 font-medium">
                          {selectedProduct.minTerm} - {selectedProduct.maxTerm} months
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">Repayment:</span>
                        <span className="ml-2 font-medium capitalize">
                          {selectedProduct.repaymentFrequency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <input
                      type="number"
                      value={formData.amountRequested}
                      onChange={(e) => handleInputChange('amountRequested', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Term (months) *
                    </label>
                    <input
                      type="number"
                      value={formData.term}
                      onChange={(e) => handleInputChange('term', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter term"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Loan *
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose of this loan"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income *
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter monthly income"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Status *
                    </label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="employed">Employed</option>
                      <option value="self_employed">Self Employed</option>
                      <option value="business_owner">Business Owner</option>
                      <option value="retired">Retired</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer Name
                  </label>
                  <input
                    type="text"
                    value={formData.employerName}
                    onChange={(e) => handleInputChange('employerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter employer name"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Supporting Documents</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload documents to support your application (optional but recommended)
                  </p>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload Documents
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Guarantors</h3>
                  <Button onClick={addGuarantor} className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Guarantor
                  </Button>
                </div>

                {formData.guarantors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No guarantors added yet</p>
                    <Button onClick={addGuarantor} variant="ghost">
                      Add Your First Guarantor
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.guarantors.map((guarantor, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Guarantor {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGuarantor(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={guarantor.firstName}
                              onChange={(e) => updateGuarantor(index, 'firstName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={guarantor.lastName}
                              onChange={(e) => updateGuarantor(index, 'lastName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={guarantor.email}
                              onChange={(e) => updateGuarantor(index, 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              value={guarantor.phone}
                              onChange={(e) => updateGuarantor(index, 'phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              National ID *
                            </label>
                            <input
                              type="text"
                              value={guarantor.nationalId}
                              onChange={(e) => updateGuarantor(index, 'nationalId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Relationship *
                            </label>
                            <input
                              type="text"
                              value={guarantor.relationship}
                              onChange={(e) => updateGuarantor(index, 'relationship', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Friend, Colleague, Family"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Application</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Loan Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Product:</span>
                        <span className="ml-2 font-medium">{selectedProduct?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(parseFloat(formData.amountRequested) || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Term:</span>
                        <span className="ml-2 font-medium">{formData.term} months</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="ml-2 font-medium">{selectedProduct?.interestRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Employment Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(parseFloat(formData.monthlyIncome) || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Employment Status:</span>
                        <span className="ml-2 font-medium capitalize">
                          {formData.employmentStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Guarantors</h4>
                    {formData.guarantors.length === 0 ? (
                      <p className="text-sm text-gray-600">No guarantors added</p>
                    ) : (
                      <div className="space-y-2">
                        {formData.guarantors.map((guarantor, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">
                              {guarantor.firstName} {guarantor.lastName}
                            </span>
                            <span className="text-gray-600 ml-2">
                              ({guarantor.relationship})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit Application
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {selectedProduct && formData.amountRequested && formData.term && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(formData.amountRequested))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-medium">{selectedProduct.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-medium">{formData.term} months</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-gray-900 font-medium">Est. Monthly Payment:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(calculateMonthlyPayment())}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Ensure all information is accurate and complete</p>
              <p>• Upload supporting documents for faster processing</p>
              <p>• Adding guarantors can improve approval chances</p>
              <p>• Applications are typically processed within 2-3 business days</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};