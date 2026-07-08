import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import Dashboard from './pages/Dashboard'
import MatrizPage from './pages/MatrizPage'
import CatalogosPage from './pages/CatalogosPage'
import { useData } from './context/DataContext'

const titles = {
  '/': 'Dashboard SSO',
  '/matriz': 'Matriz de Riesgos',
  '/catalogos': 'Catálogos',
}

function App() {
  const { loading } = useData()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

        <main className="flex min-w-0 flex-1 flex-col">
          <Navbar
            title={titles[location.pathname] || 'SSO Manager'}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((prev) => !prev)}
          />

          <section className="flex-1 p-4 md:p-6">
            {loading ? (
              <Loader />
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/matriz" element={<MatrizPage />} />
                <Route path="/planificacion" element={<Navigate to="/matriz" replace />} />
                <Route path="/catalogos" element={<CatalogosPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
