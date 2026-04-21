export interface StorageData {
  products: any[];
  applications: any[];
  kycDocuments: any[];
  users: any[]; // local cache only — source of truth is the API
}

const STORAGE_KEY = 'p2p_local_data';

const defaultData: StorageData = {
  products: [
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
      updatedAt: new Date().toISOString(),
    },
  ],
  applications: [],
  kycDocuments: [],
  users: [],
};

export const getStorageData = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch (_) {}
  setStorageData(defaultData);
  return defaultData;
};

export const setStorageData = (data: StorageData): void => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
};

const update = (patch: Partial<StorageData>) =>
  setStorageData({ ...getStorageData(), ...patch });

// Products
export const addProduct = (p: any) => {
  const d = getStorageData();
  update({ products: [...d.products, { ...p, id: Date.now().toString(), updatedAt: new Date().toISOString() }] });
};
export const updateProduct = (id: string, patch: any) => {
  const d = getStorageData();
  update({ products: d.products.map(p => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p) });
};
export const deleteProduct = (id: string) => {
  update({ products: getStorageData().products.filter(p => p.id !== id) });
};

// Applications
export const addApplication = (a: any) => {
  const d = getStorageData();
  const now = new Date().toISOString();
  update({ applications: [...d.applications, { ...a, id: Date.now().toString(), createdAt: now, updatedAt: now }] });
};
export const updateApplication = (id: string, patch: any) => {
  const d = getStorageData();
  update({ applications: d.applications.map(a => a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a) });
};

// Users (local cache)
export const addUser = (u: any) => {
  const d = getStorageData();
  const now = new Date().toISOString();
  update({ users: [...d.users, { ...u, id: Date.now().toString(), createdAt: now, updatedAt: now }] });
};
export const updateUser = (id: string, patch: any) => {
  const d = getStorageData();
  update({ users: d.users.map(u => u.id === id ? { ...u, ...patch, updatedAt: new Date().toISOString() } : u) });
};
export const deleteUser = (id: string) => {
  update({ users: getStorageData().users.filter(u => u.id !== id) });
};
