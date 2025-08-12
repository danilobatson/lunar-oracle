import CORSDebug from '@/components/debug/CORSDebug';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">LunarCrush CORS Debug</h1>
        <p className="text-gray-300">Testing CORS issues with the LunarCrush API</p>
      </div>
      <CORSDebug />
    </main>
  );
}
