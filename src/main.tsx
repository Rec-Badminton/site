import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(<App />);

// retire the no-op worker the former site registered
navigator.serviceWorker
  ?.getRegistrations()
  .then((registrations) => registrations.forEach((registration) => registration.unregister()));
