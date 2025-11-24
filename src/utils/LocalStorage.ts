// Local storage utility functions for managing application data

export interface StorageData {
  members: any[];
  loans: any[];
  applications: any[];
  products: any[];
  users: any[];
  transactions: any[];
  kycDocuments: any[];
}

const STORAGE_KEY = 'p2p_loan_data';

// Initialize default data
const defaultData: StorageData = {
  members: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-234-567-8900',
      nationalId: 'ID123456789',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      status: 'active',
      kycStatus: 'verified',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1-234-567-8901',
      nationalId: 'ID123456790',
      dateOfBirth: '1990-03-22',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA'
      },
      status: 'active',
      kycStatus: 'pending',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T16:20:00Z',
      createdBy: 'admin'
    }
  ],
  loans: [
    {
      id: '1',
      loanNumber: 'LN001234',
      memberId: '1',
      productId: '1',
      principalAmount: 50000,
      interestRate: 12.5,
      term: 12,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'active',
      balancePrincipal: 35000,
      balanceInterest: 2500,
      nextDueDate: '2024-02-15',
      createdAt: '2024-01-15T10:30:00Z',
      disbursedAt: '2024-01-16T14:00:00Z'
    }
  ],
  applications: [
    {
      id: '1',
      memberId: '1',
      productId: '1',
      amountRequested: 50000,
      term: 12,
      purpose: 'Business expansion',
      status: 'under_review',
      creditScore: 720,
      applicationData: {},
      documents: [],
      createdAt: '2024-01-25T10:30:00Z',
      updatedAt: '2024-01-25T10:30:00Z',
      submittedBy: '1'
    }
  ],
  products: [
    {
      id: '1',
      code: 'M-LOAN',
      name: 'Monthly Loan',
      description: 'Short-term loan with monthly repayments for quick financial needs',
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
    }
  ],
  users: [
    {
      id: '1',
      email: 'admin@loanmanagement.com',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'user@loanmanagement.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    }
  ],
  transactions: [],
  kycDocuments: []
};

export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  // Initialize with default data if not found
  setStorageData(defaultData);
  return defaultData;
};

export const setStorageData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const updateStorageData = (updates: Partial<StorageData>): void => {
  const currentData = getStorageData();
  const newData = { ...currentData, ...updates };
  setStorageData(newData);
};

// Helper functions for specific data types
export const addMember = (member: any) => {
  const data = getStorageData();
  data.members.push({ ...member, id: Date.now().toString() });
  setStorageData(data);
};

export const updateMember = (id: string, updates: any) => {
  const data = getStorageData();
  const index = data.members.findIndex(m => m.id === id);
  if (index !== -1) {
    data.members[index] = { ...data.members[index], ...updates, updatedAt: new Date().toISOString() };
    setStorageData(data);
  }
};

export const deleteMember = (id: string) => {
  const data = getStorageData();
  data.members = data.members.filter(m => m.id !== id);
  setStorageData(data);
};

export const addApplication = (application: any) => {
  const data = getStorageData();
  data.applications.push({ 
    ...application, 
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  setStorageData(data);
};

export const updateApplication = (id: string, updates: any) => {
  const data = getStorageData();
  const index = data.applications.findIndex(a => a.id === id);
  if (index !== -1) {
    data.applications[index] = { ...data.applications[index], ...updates, updatedAt: new Date().toISOString() };
    setStorageData(data);
  }
};

export const addLoan = (loan: any) => {
  const data = getStorageData();
  data.loans.push({ 
    ...loan, 
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    disbursedAt: new Date().toISOString()
  });
  setStorageData(data);
};

export const addProduct = (product: any) => {
  const data = getStorageData();
  data.products.push({ 
    ...product, 
    id: Date.now().toString(),
    updatedAt: new Date().toISOString()
  });
  setStorageData(data);
};

export const updateProduct = (id: string, updates: any) => {
  const data = getStorageData();
  const index = data.products.findIndex(p => p.id === id);
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...updates, updatedAt: new Date().toISOString() };
    setStorageData(data);
  }
};

export const deleteProduct = (id: string) => {
  const data = getStorageData();
  data.products = data.products.filter(p => p.id !== id);
  setStorageData(data);
};

export const addUser = (user: any) => {
  const data = getStorageData();
  data.users.push({ 
    ...user, 
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  setStorageData(data);
};

export const updateUser = (id: string, updates: any) => {
  const data = getStorageData();
  const index = data.users.findIndex(u => u.id === id);
  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...updates, updatedAt: new Date().toISOString() };
    setStorageData(data);
  }
};

export const deleteUser = (id: string) => {
  const data = getStorageData();
  data.users = data.users.filter(u => u.id !== id);
  setStorageData(data);
};