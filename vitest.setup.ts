// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Workaround for Node 25+ localStorage issue where it might be defined but with missing methods
if (typeof localStorage !== 'undefined' && typeof localStorage.getItem !== 'function') {
  const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  }
  
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
}
