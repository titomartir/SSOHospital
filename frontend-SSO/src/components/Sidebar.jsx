import { NavLink } from 'react-router-dom'
import { FiAlertTriangle, FiGrid, FiMenu, FiSettings } from 'react-icons/fi'

const menuItems = [
  { label: 'Dashboard', icon: FiGrid, to: '/' },
  { label: 'Matriz de Riesgos', icon: FiAlertTriangle, to: '/matriz' },
  { label: 'Catálogos', icon: FiSettings, to: '/catalogos' },
]

const Sidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`sticky top-0 h-screen border-r border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-900 ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-3">
        {!collapsed && <span className="text-lg font-bold text-primary">SSO Manager</span>}
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <FiMenu />
        </button>
      </div>

      <nav className="space-y-1 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="text-base" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
