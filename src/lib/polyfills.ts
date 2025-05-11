import { Buffer } from 'buffer';
import process from 'process';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.process = process;

  // Check for existing session
  const checkSession = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='));
    return token ? token.split('=')[1] : null;
  };

  window.__checkSession = checkSession;
}