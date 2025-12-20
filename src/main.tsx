import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Add Google Fonts for the admin panel
const link1 = document.createElement('link');
link1.href = 'https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap';
link1.rel = 'stylesheet';
document.head.appendChild(link1);

const link2 = document.createElement('link');
link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
link2.rel = 'stylesheet';
document.head.appendChild(link2);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)