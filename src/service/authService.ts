// All API calls automatically include cookies
export const fetchWithAuth = async (url: string, options: any = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
