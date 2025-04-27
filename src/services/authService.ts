export const isAuthenticated = (): boolean => {
  // Check if user is logged in
  // You can implement your own authentication logic here
  // For example, check localStorage, cookies, or JWT token
  const token = localStorage.getItem('authToken');
  return !!token;
};
