import { useState } from 'react'
const viteLogo = "/vite.svg";
const reactLogo = "/react.svg";


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex gap-8 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 transition-transform hover:scale-110" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 transition-transform hover:scale-110" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-blue-400 mb-4">Vite + React + Tailwind</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors mb-2"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
