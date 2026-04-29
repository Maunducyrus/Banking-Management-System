// const BASE_URL = '';

// // ── Token helpers ─────────────────────────────────────────────────────────────
// export const getToken = (): string | null => localStorage.getItem('auth_token');

// export const setToken = (token: string): void =>
//   localStorage.setItem('auth_token', token);

// export const clearToken = (): void => {
//   localStorage.removeItem('auth_token');
//   localStorage.removeItem('auth_user');
// };

// // ── Generic fetch wrapper ─────────────────────────────────────────────────────
// async function apiFetch<T>(
//   path: string,
//   options: RequestInit = {},
//   authenticated = true
// ): Promise<T> {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     ...(options.headers as Record<string, string>),
//   };

//   if (authenticated) {
//     const token = getToken();
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     } else {
//       console.warn(`[API] No token found for authenticated request: ${path}`);
//     }
//   }

//   const url = `${BASE_URL}${path}`;
//   console.debug(`[API] ${options.method ?? 'GET'} ${url}`);

//   const response = await fetch(url, { ...options, headers });

//   if (!response.ok) {
//     let message = `HTTP ${response.status} — ${response.statusText}`;
//     try {
//       const err = await response.json();
//       message = err.message || err.error || err.detail || JSON.stringify(err);
//     } catch (_) {}
//     console.error(`[API] Error ${response.status} on ${url}:`, message);
//     throw new Error(message);
//   }

//   const text = await response.text();
//   return text ? (JSON.parse(text) as T) : ({} as T);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // AUTH
// // Postman paths: /api/v1/auth/...  (no /tujipange prefix)
// // ─────────────────────────────────────────────────────────────────────────────

// export interface RegisterPayload {
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface SignInPayload {
//   userName: string;   // ← field name from Postman: "userName"
//   userPassword: string; // ← field name from Postman: "userPassword"
// }

// export interface SignInResponse {
//   token?: string;
//   accessToken?: string;
//   access_token?: string;
//   [key: string]: any;
// }

// export interface ActivateUserPayload {
//   email: string;
//   option: string; // "True" or "False"
// }

// export const authApi = {
//   // POST /api/v1/auth/register
//   register: (payload: RegisterPayload) =>
//     // apiFetch<any>('/api/v1/auth/register', {
//   apiFetch('/tujipange/api/v1/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, false),

//   // POST /api/v1/auth/sign_in  — NOT authenticated (no token needed)
//   signIn: (payload: SignInPayload) =>
//     // apiFetch<SignInResponse>('/api/v1/auth/sign_in', {
//    apiFetch<SignInResponse>('/tujipange/api/v1/auth/sign_in', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, false),

//   // POST /api/v1/auth/enable_user  — authenticated
//   activateUser: (payload: ActivateUserPayload) =>
//     apiFetch<any>('/tujipange/api/v1/auth/enable_user', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MEMBERS
// //
// // NOTE on path inconsistency from Postman:
// //   • add-member       → POST /tujipange/api/v1/members   (has /tujipange)
// //   • get-all-members  → GET  /tujipange/api/v1/members   (has /tujipange)
// //   • get-by-number    → GET  /api/v1/members?memberNumber (NO /tujipange)
// //   • next-of-kin      → POST /api/v1/members/:id/...     (NO /tujipange)
// //   • beneficiaries    → POST /api/v1/members/:id/...     (NO /tujipange)
// //
// // The Vite proxy maps BOTH /tujipange and /api to Railway, so this works.
// // ─────────────────────────────────────────────────────────────────────────────

// export interface NextOfKinPayload {
//   fullName: string;
//   relationship: string;
//   identificationNumber: string; // ← Postman field: "identificationNumber"
//   phone: string;
//   email?: string;
//   address: string;
// }

// export interface BeneficiaryPayload {
//   fullName: string;
//   relationship: string;
//   identification: string; // ← Postman field: "identification" (no "Number")
//   phone: string;
//   email?: string;
//   beneficiaryPercentage: number;
// }

// export interface AddMemberPayload {
//   firstName: string;
//   lastName: string;
//   otherNames?: string;
//   nationalId: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;        // format: "YYYY-MM-DD"
//   employeeNumber?: string;
//   department?: string;
//   memberType: 'MEMBER' | 'ADMIN';
//   welfareJoinDate: string;    // format: "YYYY-MM-DD"
//   nextOfKin: NextOfKinPayload[];
//   beneficiaries: BeneficiaryPayload[];
// }

// export interface GetMembersParams {
//   search?: string;
//   status?: string;
//   memberType?: string;
//   department?: string;
//   page?: number;
//   size?: number;
//   sort?: string;
// }

// export const membersApi = {
//   // POST /tujipange/api/v1/members  — authenticated
//   addMember: (payload: AddMemberPayload) =>
//     apiFetch<any>('/tujipange/api/v1/members', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /tujipange/api/v1/members  — authenticated
//   getAllMembers: (params?: GetMembersParams) => {
//     const cleanParams = params
//       ? Object.fromEntries(
//           Object.entries(params)
//             .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
//             .map(([k, v]) => [k, String(v)])
//         )
//       : {};
//     const query = Object.keys(cleanParams).length
//       ? '?' + new URLSearchParams(cleanParams).toString()
//       : '';
//     return apiFetch<any>(`/tujipange/api/v1/members${query}`, {}, true);
//   },

//   // GET /api/v1/members?memberNumber=X  — authenticated
//   getMemberByNumber: (memberNumber: string) =>
//     apiFetch<any>(
//       // `/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`,
//       `/tujipange/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`,
//       {},
//       true
//     ),

//   // PUT /tujipange/api/v1/members/:memberNumber
//   // updateMember: (memberNumber: string, payload: any) =>
//   // apiFetch<any>(
//   //   `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}`,
//   //   {
//   //     method: 'PUT', // or PATCH
//   //     body: JSON.stringify(payload),
//   //   },
//   //   true
//   // ),

//   // POST /api/v1/members/:memberNumber/next-of-kin  — authenticated
//   addNextOfKin: (memberNumber: string, payload: NextOfKinPayload) =>
//     apiFetch<any>(
//       // `/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`,
//       `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`,
//       { method: 'POST', body: JSON.stringify(payload) },
//       true
//     ),

//   // POST /api/v1/members/:memberNumber/beneficiaries  — authenticated
//   addBeneficiary: (memberNumber: string, payload: BeneficiaryPayload) =>
//     apiFetch<any>(
//       // `/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`,
//       `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`,
//       { method: 'POST', body: JSON.stringify(payload) },
//       true
//     ),
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CONTRIBUTIONS
// // Postman paths: /api/v1/contributions  (no /tujipange prefix)
// // ─────────────────────────────────────────────────────────────────────────────

// export interface ContributionPayload {
//   memberNumber: string;
//   contributedAmount: number;
// }

// export const contributionsApi = {
//   // POST /api/v1/contributions  — authenticated
//   makeContribution: (payload: ContributionPayload) =>
//     apiFetch<any>('/tujipange/api/v1/contributions', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /api/v1/contributions  — authenticated
//   listContributions: () =>
//     apiFetch<any>('/tujipange/api/v1/contributions', {}, true),

//   // GET /api/v1/contributionsStatement/:memberNumber  — authenticated
//   getMemberContributions: (memberNumber: string) =>
//     apiFetch<any>(
//       `/tujipange/api/v1/contributionsStatement/${encodeURIComponent(memberNumber)}`,
//       {},
//       true
//     ),
// };

// const BASE_URL = '';

// // ── Token helpers ─────────────────────────────────────────────────────────────
// export const getToken = (): string | null => localStorage.getItem('auth_token');

// export const setToken = (token: string): void =>
//   localStorage.setItem('auth_token', token);

// export const clearToken = (): void => {
//   localStorage.removeItem('auth_token');
//   localStorage.removeItem('auth_user');
// };

// const handleAuthError = () => {
//   clearToken();

//   // prevent multiple redirects / loops
//   if (window.location.pathname !== '/login') {
//     window.location.href = '/login';
//   }
// };

// // ── Generic fetch wrapper ─────────────────────────────────────────────────────
// async function apiFetch<T>(
//   path: string,
//   options: RequestInit = {},
//   authenticated = true
// ): Promise<T> {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     ...(options.headers as Record<string, string>),
//   };

//   if (authenticated) {
//     const token = getToken();
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     } else {
//       console.warn(`[API] No token found for authenticated request: ${path}`);
//     }
//       // console.log("TOKEN:", token);
//       // console.log("HEADERS:", headers);
//   }

//   const url = `${BASE_URL}${path}`;
//   console.debug(`[API] ${options.method ?? 'GET'} ${url}`);

//   const response = await fetch(url, { ...options, headers });

// if (!response.ok) {
//   let message = `HTTP ${response.status} — ${response.statusText}`;

//   try {
//     const err = await response.json();
//     message = err.message || err.error || err.detail || JSON.stringify(err);
//   } catch (_) {}

//   console.error(`[API] Error ${response.status} on ${url}:`, message);

//   // ✅ HANDLE TOKEN EXPIRY HERE
//   if (response.status === 401) {
//     console.warn('[API] Token expired → logging out user');
//     handleAuthError();
//   }

//   throw new Error(message);
// }

//   // const text = await response.text();
//   // return text ? (JSON.parse(text) as T) : ({} as T);
//   const text = await response.text();

//   if (!text) return {} as T;

//   try {
//     return JSON.parse(text) as T;
//   } catch {
//     // fallback for plain text responses
//     return text as unknown as T;
//   }
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // AUTH
// // Postman paths: /api/v1/auth/...  (no /tujipange prefix)
// // ─────────────────────────────────────────────────────────────────────────────

// export interface RegisterPayload {
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface SignInPayload {
//   userName: string;   // ← field name from Postman: "userName"
//   userPassword: string; // ← field name from Postman: "userPassword"
// }

// export interface SignInResponse {
//   token?: string;
//   accessToken?: string;
//   access_token?: string;
//   [key: string]: any;
// }

// export interface ActivateUserPayload {
//   email: string;
//   option: string; // "True" or "False"
// }

// export const authApi = {
//   // POST /api/v1/auth/register
//   register: (payload: RegisterPayload) =>
//     // apiFetch<any>('/api/v1/auth/register', {
//   apiFetch('/tujipange/api/v1/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, false),

//   // POST /api/v1/auth/sign_in  — NOT authenticated (no token needed)
//   signIn: (payload: SignInPayload) =>
//     // apiFetch<SignInResponse>('/api/v1/auth/sign_in', {
//    apiFetch<SignInResponse>('/tujipange/api/v1/auth/sign_in', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, false),

//   // POST /api/v1/auth/enable_user  — authenticated
//   activateUser: (payload: ActivateUserPayload) =>
//     apiFetch<any>('/tujipange/api/v1/auth/enable_user', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MEMBERS
// //
// // NOTE on path inconsistency from Postman:
// //   • add-member       → POST /tujipange/api/v1/members   (has /tujipange)
// //   • get-all-members  → GET  /tujipange/api/v1/members   (has /tujipange)
// //   • get-by-number    → GET  /api/v1/members?memberNumber (NO /tujipange)
// //   • next-of-kin      → POST /api/v1/members/:id/...     (NO /tujipange)
// //   • beneficiaries    → POST /api/v1/members/:id/...     (NO /tujipange)
// //
// // The Vite proxy maps BOTH /tujipange and /api to Railway, so this works.
// // ─────────────────────────────────────────────────────────────────────────────

// export interface NextOfKinPayload {
//   fullName: string;
//   relationship: string;
//   identificationNumber: string; // ← Postman field: "identificationNumber"
//   phone: string;
//   email?: string;
//   address: string;
// }

// export interface BeneficiaryPayload {
//   fullName: string;
//   relationship: string;
//   identification: string; // ← Postman field: "identification" (no "Number")
//   phone: string;
//   email?: string;
//   beneficiaryPercentage: number;
// }

// export interface AddMemberPayload {
//   firstName: string;
//   lastName: string;
//   otherNames?: string;
//   nationalId: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;        // format: "YYYY-MM-DD"
//   employeeNumber?: string;
//   department?: string;
//   memberType: 'MEMBER' | 'ADMIN';
//   welfareJoinDate: string;    // format: "YYYY-MM-DD"
//   nextOfKin: NextOfKinPayload[];
//   beneficiaries: BeneficiaryPayload[];
// }

// export interface GetMembersParams {
//   search?: string;
//   status?: string;
//   memberType?: string;
//   department?: string;
//   page?: number;
//   size?: number;
//   sort?: string;
// }

// export const membersApi = {
//   // POST /tujipange/api/v1/members  — authenticated
//   addMember: (payload: AddMemberPayload) =>
//     apiFetch<any>('/tujipange/api/v1/members', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /tujipange/api/v1/members  — authenticated
//   getAllMembers: (params?: GetMembersParams) => {
//     const cleanParams = params
//       ? Object.fromEntries(
//           Object.entries(params)
//             .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
//             .map(([k, v]) => [k, String(v)])
//         )
//       : {};
//     const query = Object.keys(cleanParams).length
//       ? '?' + new URLSearchParams(cleanParams).toString()
//       : '';
//     return apiFetch<any>(`/tujipange/api/v1/members${query}`, {}, true);
//   },

//   // GET /api/v1/members?memberNumber=X  — authenticated
//   getMemberByNumber: (memberNumber: string) =>
//     apiFetch<any>(
//       // `/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`,
//       `/tujipange/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`,
//       {},
//       true
//     ),

//   // PUT /tujipange/api/v1/members/:memberNumber
//   // updateMember: (memberNumber: string, payload: any) =>
//   // apiFetch<any>(
//   //   `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}`,
//   //   {
//   //     method: 'PUT', // or PATCH
//   //     body: JSON.stringify(payload),
//   //   },
//   //   true
//   // ),

//   // POST /api/v1/members/:memberNumber/next-of-kin  — authenticated
//   addNextOfKin: (memberNumber: string, payload: NextOfKinPayload) =>
//     apiFetch<any>(
//       // `/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`,
//       `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`,
//       { method: 'POST', body: JSON.stringify(payload) },
//       true
//     ),

//   // POST /api/v1/members/:memberNumber/beneficiaries  — authenticated
//   addBeneficiary: (memberNumber: string, payload: BeneficiaryPayload) =>
//     apiFetch<any>(
//       // `/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`,
//       `/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`,
//       { method: 'POST', body: JSON.stringify(payload) },
//       true
//     ),
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CONTRIBUTIONS
// // Postman paths: /api/v1/contributions  (no /tujipange prefix)
// // ─────────────────────────────────────────────────────────────────────────────

// export interface ContributionPayload {
//   memberNumber: string;
//   contributedAmount: number;
// }

// export const contributionsApi = {
//   // POST /api/v1/contributions  — authenticated
//   makeContribution: (payload: ContributionPayload) =>
//     apiFetch<any>('/tujipange/api/v1/contributions', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /api/v1/contributions  — authenticated
//   listContributions: () =>
//     apiFetch<any>('/tujipange/api/v1/contributions', {}, true),

//   // GET /api/v1/contributionsStatement/:memberNumber  — authenticated
//   getMemberContributions: (memberNumber: string) =>
//     apiFetch<any>(
//       `/tujipange/api/v1/contributionsStatement/${encodeURIComponent(memberNumber)}`,
//       {},
//       true
//     ),
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // LOAN PROCESSING
// // Postman paths: /api/v1/loans (with /tujipange prefix based on Postman collection)
// // ─────────────────────────────────────────────────────────────────────────────

// // Request payload for applying for a loan
// export interface ApplyLoanPayload {
//   memberNumber: string;   // e.g., "WM-30023456-1"
//   productCode: string;    // e.g., "HRW-Y-ADB545"
//   amount: number;         // e.g., 50000.00
// }

// // Query parameters for listing loans
// export interface ListLoansParams {
//   status?: string;        // Loan status filter
//   page?: number;          // Page number for pagination
//   size?: number;          // Page size for pagination
// }

// export const loanApi = {
//   // GET /api/v1/loans — List all loans (with optional filters)
//   // Postman: GET {{base_url}}/api/v1/loans?status=&page=&size=
//   listLoans: (params?: ListLoansParams) => {
//     const cleanParams = params
//       ? Object.fromEntries(
//           Object.entries(params)
//             .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
//             .map(([k, v]) => [k, String(v)])
//         )
//       : {};
//     const query = Object.keys(cleanParams).length
//       ? '?' + new URLSearchParams(cleanParams).toString()
//       : '';
//     return apiFetch<any>(`/tujipange/api/v1/loans${query}`, {}, true);
//   },

//   // POST /api/v1/loans/apply — Apply for a new loan
//   // Postman: POST {{base_url}}/api/v1/loans/apply
//   applyForLoan: (payload: ApplyLoanPayload) =>
//     apiFetch<any>('/tujipange/api/v1/loans/apply', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /api/v1/loans/member/:memberNumber — List loans for a specific member
//   // Postman: list_member_loans endpoint (assumed path)
//   listMemberLoans: (memberNumber: string) =>
//     apiFetch<any>(
//       `/tujipange/api/v1/loans/member/${encodeURIComponent(memberNumber)}`,
//       {},
//       true
//     ),

//   // GET /api/v1/loans/:loanCode — Get loan details by loan code
//   // Postman: loan_details_by_code endpoint
//   getLoanDetailsByCode: (loanCode: string) =>
//     apiFetch<any>(
//       `/tujipange/api/v1/loans/${encodeURIComponent(loanCode)}`,
//       {},
//       true
//     ),

//   // GET /api/v1/loans/status?loanCode=X — Get loan status by loan code
//   // Postman: GET localhost:8081/tujipange/api/v1/loans/status?loanCode
//   getLoanStatus: (loanCode: string) =>
//     apiFetch<any>(
//       `/tujipange/api/v1/loans/status?loanCode=${encodeURIComponent(loanCode)}`,
//       {},
//       true
//     ),

//   // PUT /api/v1/loans/defer?extensionDays=X&loanCode=Y — Defer/Extend loan repayment
//   // Postman: GET localhost:8081/tujipange/api/v1/loans/defer?extensionDays={{$random.integer(100)}}&loanCode
//   // Note: Postman shows GET but this should likely be PUT/PATCH based on the action
//   deferLoan: (loanCode: string, extensionDays: number) =>
//     apiFetch<any>(
//       `/tujipange/api/v1/loans/defer?extensionDays=${extensionDays}&loanCode=${encodeURIComponent(loanCode)}`,
//       {
//         method: 'PUT', // Changed from GET to PUT as deferring is a state-changing action
//       },
//       true
//     ),

//   // POST /api/v1/loans/repay — Repay a loan
//   // Postman: repay-loan endpoint (assumed path and method)
//   repayLoan: (payload: { loanCode: string; amount: number }) =>
//     apiFetch<any>('/tujipange/api/v1/loans/repay', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // LOAN PRODUCTS
// // Postman paths: /api/v1/loan-products
// // ─────────────────────────────────────────────────────────────────────────────

// // Request payload for adding a loan product
// export interface AddLoanProductPayload {
//   loanProductName: string;  // e.g., "YEARLY"
//   percentage: number;       // e.g., 10 (interest rate percentage)
//   loanPeriod: number;       // e.g., 12 (in months)
// }

// // Query parameters for listing loan products
// export interface ListLoanProductsParams {
//   status?: string;          // Filter by status (e.g., "false" for inactive)
//   name?: string;            // Filter by product name
// }

// export const loanProductApi = {
//   // POST /api/v1/loan-products — Add a new loan product
//   // Postman: POST {{base_url}}/api/v1/loan-products
//   addProduct: (payload: AddLoanProductPayload) =>
//     apiFetch<any>('/tujipange/api/v1/loan-products', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /api/v1/loan-products — List all loan products (with optional filters)
//   // Postman: GET {{base_url}}/api/v1/loan-products?status=false&name={{$random.alphanumeric(8)}}
//   listProducts: (params?: ListLoanProductsParams) => {
//     const cleanParams = params
//       ? Object.fromEntries(
//           Object.entries(params)
//             .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
//             .map(([k, v]) => [k, String(v)])
//         )
//       : {};
//     const query = Object.keys(cleanParams).length
//       ? '?' + new URLSearchParams(cleanParams).toString()
//       : '';
//     return apiFetch<any>(`/tujipange/api/v1/loan-products${query}`, {}, true);
//   },
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CONTRIBUTION METRICS
// // Postman paths: /api/v1/contributions_management/metrics
// // ─────────────────────────────────────────────────────────────────────────────

// // Request payload for adding/updating a contribution metric
// export interface AddContributionMetricPayload {
//   periodEnum: 'MONTHLY' | 'WEEKLY' | 'YEARLY';  // Contribution period
//   dueDayOfMonth: number;                         // Day of month when contribution is due (e.g., 5)
//   contributionAmount: number;                    // Amount to contribute (e.g., 5000.00)
//   penaltyPercentage: number;                     // Penalty percentage for late payment (e.g., 2)
// }

// // Request payload for updating a contribution metric
// export interface UpdateContributionMetricPayload {
//   dueDayOfMonth?: number;
//   contributionAmount?: number;
//   penaltyPercentage?: number;
//   metricStatus?: boolean;  // true = active, false = inactive
// }

// export const contributionMetricApi = {
//   // POST /api/v1/contributions_management/metrics — Add a new contribution metric
//   // Postman: POST {{base_url}}/api/v1/contributions_management/metrics
//   addMetric: (payload: AddContributionMetricPayload) =>
//     apiFetch<any>('/tujipange/api/v1/contributions_management/metrics', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     }, true),

//   // GET /api/v1/contributions_management/metrics — List all contribution metrics
//   // Postman: GET {{base_url}}/api/v1/contributions_management/metrics
//   listAllMetrics: () =>
//     apiFetch<any>('/tujipange/api/v1/contributions_management/metrics', {}, true),

//   // PUT /api/v1/contributions_management/metrics/:id — Update a contribution metric
//   // Postman: PUT {{base_url}}/api/v1/contributions_management/metrics/3
//   updateMetric: (id: number, payload: UpdateContributionMetricPayload) =>
//     apiFetch<any>(`/tujipange/api/v1/contributions_management/metrics/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(payload),
//     }, true),

//   // DELETE /api/v1/contributions_management/metrics/:id — Delete a contribution metric
//   // Postman: DELETE {{base_url}}/api/v1/contributions_management/metrics/4
//   deleteMetric: (id: number) =>
//     apiFetch<any>(`/tujipange/api/v1/contributions_management/metrics/${id}`, {
//       method: 'DELETE',
//     }, true),
// };

const BASE_URL = '';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('auth_token');

export const setToken = (token: string): void =>
  localStorage.setItem('auth_token', token);

export const clearToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// ── Auth error handler ────────────────────────────────────────────────────────
// Fires a CustomEvent that AuthContext listens to.
// This avoids a circular dependency between api.ts and AuthContext.tsx,
// and avoids hard redirects that break a SPA with no /login route.
let _authErrorFired = false; // prevent duplicate fires in rapid parallel requests

const handleAuthError = () => {
  clearToken();

  if (!_authErrorFired) {
    _authErrorFired = true;
    window.dispatchEvent(new CustomEvent('auth:token-expired'));
    // Reset flag after a short delay so future sessions can trigger again
    setTimeout(() => { _authErrorFired = false; }, 3000);
  }
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

    // 401 = token expired or invalid → auto-logout
    if (response.status === 401) {
      console.warn('[API] 401 detected — dispatching auth:token-expired');
      handleAuthError();
    }

    throw new Error(message);
  }

  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  firstName: string; lastName: string; phoneNumber: string;
  email: string; password: string; confirmPassword: string;
}
export interface SignInPayload    { userName: string; userPassword: string; }
export interface SignInResponse   { token?: string; accessToken?: string; access_token?: string; [key: string]: any; }
export interface ActivateUserPayload { email: string; option: string; }

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiFetch('/tujipange/api/v1/auth/register', { method: 'POST', body: JSON.stringify(payload) }, false),

  signIn: (payload: SignInPayload) =>
    apiFetch<SignInResponse>('/tujipange/api/v1/auth/sign_in', { method: 'POST', body: JSON.stringify(payload) }, false),

  activateUser: (payload: ActivateUserPayload) =>
    apiFetch<any>('/tujipange/api/v1/auth/enable_user', { method: 'POST', body: JSON.stringify(payload) }, true),
};

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERS
// ─────────────────────────────────────────────────────────────────────────────
export interface NextOfKinPayload   { fullName: string; relationship: string; identificationNumber: string; phone: string; email?: string; address: string; }
export interface BeneficiaryPayload { fullName: string; relationship: string; identification: string; phone: string; email?: string; beneficiaryPercentage: number; }
export interface AddMemberPayload   { firstName: string; lastName: string; otherNames?: string; nationalId: string; email: string; phone: string; dateOfBirth: string; employeeNumber?: string; department?: string; memberType: 'MEMBER' | 'ADMIN'; welfareJoinDate: string; nextOfKin: NextOfKinPayload[]; beneficiaries: BeneficiaryPayload[]; }
export interface GetMembersParams   { search?: string; status?: string; memberType?: string; department?: string; page?: number; size?: number; sort?: string; }

export const membersApi = {
  addMember: (payload: AddMemberPayload) =>
    apiFetch<any>('/tujipange/api/v1/members', { method: 'POST', body: JSON.stringify(payload) }, true),

  getAllMembers: (params?: GetMembersParams) => {
    const q = params ? Object.fromEntries(Object.entries(params).filter(([,v]) => v !== undefined && v !== '' && v !== null).map(([k,v]) => [k, String(v)])) : {};
    const qs = Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '';
    return apiFetch<any>(`/tujipange/api/v1/members${qs}`, {}, true);
  },

  getMemberByNumber: (memberNumber: string) =>
    apiFetch<any>(`/tujipange/api/v1/members?memberNumber=${encodeURIComponent(memberNumber)}`, {}, true),

  addNextOfKin: (memberNumber: string, payload: NextOfKinPayload) =>
    apiFetch<any>(`/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/next-of-kin`, { method: 'POST', body: JSON.stringify(payload) }, true),

  addBeneficiary: (memberNumber: string, payload: BeneficiaryPayload) =>
    apiFetch<any>(`/tujipange/api/v1/members/${encodeURIComponent(memberNumber)}/beneficiaries`, { method: 'POST', body: JSON.stringify(payload) }, true),
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTIONS
// ─────────────────────────────────────────────────────────────────────────────
export interface ContributionPayload { memberNumber: string; contributedAmount: number; }

export const contributionsApi = {
  makeContribution:      (payload: ContributionPayload) => apiFetch<any>('/tujipange/api/v1/contributions', { method: 'POST', body: JSON.stringify(payload) }, true),
  listContributions:     ()                             => apiFetch<any>('/tujipange/api/v1/contributions', {}, true),
  getMemberContributions:(memberNumber: string)         => apiFetch<any>(`/tujipange/api/v1/contributionsStatement/${encodeURIComponent(memberNumber)}`, {}, true),
};

// ─────────────────────────────────────────────────────────────────────────────
// LOANS
// ─────────────────────────────────────────────────────────────────────────────
export interface ApplyLoanPayload { memberNumber: string; productCode: string; amount: number; }
export interface ListLoansParams  { status?: string; page?: number; size?: number; }

export const loanApi = {
  listLoans: (params?: ListLoansParams) => {
    const q = params ? Object.fromEntries(Object.entries(params).filter(([,v]) => v !== undefined && v !== '' && v !== null).map(([k,v]) => [k, String(v)])) : {};
    const qs = Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '';
    return apiFetch<any>(`/tujipange/api/v1/loans${qs}`, {}, true);
  },
  applyForLoan:        (payload: ApplyLoanPayload)            => apiFetch<any>('/tujipange/api/v1/loans/apply', { method: 'POST', body: JSON.stringify(payload) }, true),
  listMemberLoans:     (memberNumber: string)                 => apiFetch<any>(`/tujipange/api/v1/loans/member/${encodeURIComponent(memberNumber)}`, {}, true),
  getLoanDetailsByCode:(loanCode: string)                     => apiFetch<any>(`/tujipange/api/v1/loans/${encodeURIComponent(loanCode)}`, {}, true),
  getLoanStatus:       (loanCode: string)                     => apiFetch<any>(`/tujipange/api/v1/loans/status?loanCode=${encodeURIComponent(loanCode)}`, {}, true),
  deferLoan:           (loanCode: string, extensionDays: number) => apiFetch<any>(`/tujipange/api/v1/loans/defer?extensionDays=${extensionDays}&loanCode=${encodeURIComponent(loanCode)}`, { method: 'PUT' }, true),
  repayLoan:           (payload: { loanCode: string; amount: number }) => apiFetch<any>('/tujipange/api/v1/loans/repay', { method: 'POST', body: JSON.stringify(payload) }, true),
};

// ─────────────────────────────────────────────────────────────────────────────
// LOAN PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
export interface AddLoanProductPayload  { loanProductName: string; percentage: number; loanPeriod: number; }
export interface ListLoanProductsParams { status?: string; name?: string; }

export const loanProductApi = {
  addProduct: (payload: AddLoanProductPayload) =>
    apiFetch<any>('/tujipange/api/v1/loan-products', { method: 'POST', body: JSON.stringify(payload) }, true),

  listProducts: (params?: ListLoanProductsParams) => {
    const q = params ? Object.fromEntries(Object.entries(params).filter(([,v]) => v !== undefined && v !== '' && v !== null).map(([k,v]) => [k, String(v)])) : {};
    const qs = Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : '';
    return apiFetch<any>(`/tujipange/api/v1/loan-products${qs}`, {}, true);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTION METRICS
// ─────────────────────────────────────────────────────────────────────────────
export interface AddContributionMetricPayload    { periodEnum: 'MONTHLY' | 'WEEKLY' | 'YEARLY'; dueDayOfMonth: number; contributionAmount: number; penaltyPercentage: number; }
export interface UpdateContributionMetricPayload { dueDayOfMonth?: number; contributionAmount?: number; penaltyPercentage?: number; metricStatus?: boolean; }

export const contributionMetricApi = {
  addMetric:     (payload: AddContributionMetricPayload)            => apiFetch<any>('/tujipange/api/v1/contributions_management/metrics', { method: 'POST', body: JSON.stringify(payload) }, true),
  listAllMetrics:()                                                  => apiFetch<any>('/tujipange/api/v1/contributions_management/metrics', {}, true),
  updateMetric:  (id: number, payload: UpdateContributionMetricPayload) => apiFetch<any>(`/tujipange/api/v1/contributions_management/metrics/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true),
  deleteMetric:  (id: number)                                        => apiFetch<any>(`/tujipange/api/v1/contributions_management/metrics/${id}`, { method: 'DELETE' }, true),
};
