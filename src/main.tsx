import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress Razorpay Canvas warnings in development
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('Canvas2D') || args[0]?.includes?.('willReadFrequently')) {
      return; // Suppress Canvas warnings
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
