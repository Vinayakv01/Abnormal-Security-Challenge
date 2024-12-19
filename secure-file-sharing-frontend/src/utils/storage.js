export const setStorageItem = (key, value) => {
    localStorage.setItem(key, value);
  };
  
  // utils/storage.js
// utils/storage.js
export const getStorageItem = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  };
  
  
  export const removeStorageItem = (key) => {
    localStorage.removeItem(key);
  };
  