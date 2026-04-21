const BASE_URL = '';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('auth_token');

export const setToken = (token: string): void =>
  localStorage.setItem('auth_token', token);

export const clearToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn(`[API] No token found for authenticated request: ${path}`);
    }
  }

  const url = `${BASE_URL}${path}`;
  console.debug(`[API] ${options.method ?? 'GET'} ${url}`);

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let message = `HTTP ${response.status} — ${response.statusText}`;
    try {
      const err = await response.json();
      message = err.message || err.error || err.detail || JSON.stringify(err);
    } catch (_) {}
    console.error(`[API] Error ${response.status} on ${url}:`, message);
    throw new Error(message);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// Postman paths: /api/v1/auth/...  (no /tujipange prefix)
// ─────────────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInPayload {
  userName: string;   // ← field name from Postman: "userName"
  userPassword: string; // ← field name from Postman: "userPassword"
}

export interface SignInResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  [key: string]: any;
}

export interface ActivateUserPayload {
  email: string;
  option: string; // "True" or "False"
}

export const authApi = {
  // POST /api/v1/auth/register
  register: (payload: RegisterPayload) =>
    // apiFetch<any>('/api/v1/auth/register', {
  apiFetch('/tujipange/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, false),

  // POST /api/v1/auth/sign_in  — NOT authenticated (no token needed)
  signIn: (payload: SignInPayload) =>
    // apiFetch<SignInResponse>('/api/v1/auth/sign_in', {
   apiFetch<SignInResponse>('/tujipange/api/v1/auth/sign_in', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, false),

  // POST /api/v1/auth/enable_user  — authenticated
  activateUser: (payload: ActivateUserPayload) =>
    apiFetch<any>('/tujipange/api/v1/auth/enable_user', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true),
};

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERS
//
// NOTE on path inconsistency from Postman:
//   • add-member       → POST /tujipange/api/v1/members   (has /tujipange)
//   • get-all-members  → GET  /tujipange/api/v1/members   (has /tujipange)
//   • get-by-number    → GET  /api/v1/members?memberNumber (NO /tujipange)
//   • next-of-kin      → POST /api/v1/members/:id/...     (NO /tujipange)
//   • beneficiaries    → POST /api/v1/members/:id/...     (NO /tujipange)
//
// The Vite proxy maps BOTH /tujipange and /api to Railway, so this works.
// ─────────────────────────────────────────────────────────────────────────────

export interface NextOfKinPayload {
  fullName: string;
  relationship: string;
  identificationNumber: string; // ← Postman field: "identificationNumber"
  phone: string;
  email?: string;
  address: string;
}

export interface BeneficiaryPayload {
  fullName: string;
  relationship: string;
  identification: string; // ← Postman field: "identification" (no "Number")
  phone: string;
  email?: string;
  beneficiaryPercentage: number;
}

export interface AddMemberPayload {
  firstName: string;
  lastName: string;
  otherNames?: string;
  nationalId: string;
  email: string;
  phone: string;
  dateOfBirth: string;        // format: "YYYY-MM-DD"
  employeeNumber?: string;
  department?: string;
  memberType: 'MEMBER' | 'ADMIN';
  welfareJoinDate: string;    // format: "YYYY-MM-DD"
  nextOfKin: NextOfKinPayload[];
  beneficiaries: BeneficiaryPayload[];
}

export interface GetMembersParams {
  search?: string;
  status?: string;
  memberType?: string;
  department?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const membersApi = {
  // POST /tujipange/api/v1/members  — authenticated
  addMember: (payload: AddMemberPayload) =>
    apiFetch<any>('/tujipange/api/v1/members', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true),

  // GET /tujipange/api/v1/members  — authenticated
  getAllMembers: (params?: GetMembersParams) => {
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
            .map(([k, v]) => [k, String(v)])
        )
      : {};
    const query = Object.keys(cleanParams).length
      ? '?' + new URLSearchParams(cleanParams).toString()
      : '';
    return apiFetch<any>(`/tujipange/api/v1/members${query}`, {}, true);
  },

  // GET /api/v1/members?memberNumber=X  — authenticated
  getMemberByNumber: (memberNumber: string) =>
    apiFetch<any>(
      // `/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`,
      `/tujipange/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`,
      {},
      true
    ),

  // PUT /tujipange/api/v1/members/:memberNumber
  // updateMember: (memberNumber: string, payload: any) =>
  // apiFetch<any>(
  //   `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}`,
  //   {
  //     method: 'PUT', // or PATCH
  //     body: JSON.stringify(payload),
  //   },
  //   true
  // ),

  // POST /api/v1/members/:memberNumber/next-of-kin  — authenticated
  addNextOfKin: (memberNumber: string, payload: NextOfKinPayload) =>
    apiFetch<any>(
      // `/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`,
      `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`,
      { method: 'POST', body: JSON.stringify(payload) },
      true
    ),

  // POST /api/v1/members/:memberNumber/beneficiaries  — authenticated
  addBeneficiary: (memberNumber: string, payload: BeneficiaryPayload) =>
    apiFetch<any>(
      // `/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`,
      `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`,
      { method: 'POST', body: JSON.stringify(payload) },
      true
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTIONS
// Postman paths: /api/v1/contributions  (no /tujipange prefix)
// ─────────────────────────────────────────────────────────────────────────────

export interface ContributionPayload {
  memberNumber: string;
  contributedAmount: number;
}

export const contributionsApi = {
  // POST /api/v1/contributions  — authenticated
  makeContribution: (payload: ContributionPayload) =>
    apiFetch<any>('/tujipange/api/v1/contributions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true),

  // GET /api/v1/contributions  — authenticated
  listContributions: () =>
    apiFetch<any>('/tujipange/api/v1/contributions', {}, true),

  // GET /api/v1/contributionsStatement/:memberNumber  — authenticated
  getMemberContributions: (memberNumber: string) =>
    apiFetch<any>(
      `/tujipange/api/v1/contributionsStatement/${encodeURIComponent(memberNumber)}`,
      {},
      true
    ),
};