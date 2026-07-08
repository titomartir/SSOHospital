/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Administrador SSO',
    role: 'Coordinador de Seguridad',
    email: 'admin@sso.local',
  })

  const login = async () => {
    // Simulación de login para entorno sin backend.
    setUser({
      name: 'Administrador SSO',
      role: 'Coordinador de Seguridad',
      email: 'admin@sso.local',
    })
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
