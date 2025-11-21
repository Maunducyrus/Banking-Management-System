// Java backend data models
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'suspended' | 'blacklisted';
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    zipCode?: string;
    country?: string;
  };
  status: 'active' | 'suspended' | 'blacklisted';
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LoanProduct {
  id: string;
  code: string;
  name: string;
  description: string;
  interestType: 'flat' | 'reducing' | 'declining_balance';
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  repaymentFrequency: 'monthly' | 'weekly' | 'daily';
  gracePeriodDays: number;
  status: 'active' | 'inactive';
  createdBy: string;
  updatedAt: string;
}

export interface LoanApplication {
  id: string;
  memberId: string;
  productId: string;
  amountRequested: number;
  term: number;
  purpose: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  creditScore?: number;
  applicationData?: any;
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
}

export interface Loan {
  id: string;
  loanNumber: string;
  memberId: string;
  productId: string;
  principalAmount: number;
  interestRate: number;
  term: number;
  startDate: string;
  maturityDate: string;
  status: 'active' | 'closed' | 'defaulted' | 'written_off';
  balancePrincipal: number;
  balanceInterest: number;
  nextDueDate: string | null;
  createdAt: string;
  disbursedAt: string;
}

export interface RepaymentSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  feesDue: number;
  penaltyDue: number;
  totalDue: number;
  paidPrincipal: number;
  paidInterest: number;
  paidFees: number;
  paidPenalty: number;
  status: 'due' | 'partially_paid' | 'paid' | 'overdue';
}

export interface Transaction {
  id: string;
  loanId: string;
  memberId: string;
  type: 'disbursement' | 'repayment' | 'fee' | 'reversal';
  amount: number;
  appliedTo: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
  reference: string;
  createdBy: string;
  createdAt: string;
}

export interface KYCDocument {
  id: string;
  memberId: string;
  documentType: 'national_id' | 'passport' | 'driving_license' | 'utility_bill' | 'bank_statement' | 'employment_letter' | 'other';
  fileName: string ;
  fileSize: number;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

export interface Guarantor {
  id: string;
  loanApplicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  relationship: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface NextOfKin {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  relationship: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInstruction {
  id: string;
  loanId: string;
  method: 'bank_transfer' | 'mobile_money' | 'cash' | 'card';
  details: {
    accountNumber?: string;
    bankName?: string;
    routingNumber?: string;
    mobileNumber?: string;
    reference?: string;
    instructions?: string;
  };
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}