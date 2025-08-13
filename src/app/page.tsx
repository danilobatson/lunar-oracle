import SimpleDashboard from '@/components/SimpleDashboard';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <SimpleDashboard />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          }
        }}
      />
    </>
  );
}
