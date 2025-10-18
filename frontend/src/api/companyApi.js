import api from './authApi';

export const createCompany = (data) => api.post('/api/company/register', data);
export const getCompany = () => api.get('/api/company/profile');
export const updateCompanyProfile = (data) => api.put('/api/company/profile', data);
export const updateCompanyContact = (data) => api.put('/api/company/contact', data);
export const updateCompanySocials = (data) => api.put('/api/company/social-links', data);
export const updateCompanySecurity = (data) => api.put('/api/company/security', data);
export const deleteCompanyAccount = () => api.delete('/api/company');
