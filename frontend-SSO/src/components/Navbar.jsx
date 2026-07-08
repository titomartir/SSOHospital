import { FiMoon, FiSun, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ title, darkMode, toggleDarkMode }) => {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900 md:px-6">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
          <FiUser className="text-gray-500" />
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{user?.name || 'Usuario'}</p>
            <p className="text-[11px] text-gray-500">{user?.role || 'Rol'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
