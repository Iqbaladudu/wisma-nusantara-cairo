
export async function register() {
  console.log('--- INSTRUMENTATION LOADED ---');
  if (process.env.NEXT_RUNTIME === 'nodejs') {
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
  }
}
