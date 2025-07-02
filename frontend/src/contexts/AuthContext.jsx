import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Configurar la base URL de axios
axios.defaults.baseURL = ''

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthContext - Token inicial:', token)
    if (token) {
      // Configurar el token en axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('AuthContext - Token configurado en axios:', token)
      // Verificar si el token es válido
      checkAuthStatus()
    } else {
      console.log('AuthContext - No hay token, estableciendo loading en false')
      setLoading(false)
    }
  }, [token])

  const checkAuthStatus = async () => {
    try {
      // Por ahora, asumimos que si hay token, el usuario está autenticado
      // En una implementación real, harías una llamada para verificar el token
      const userData = JSON.parse(localStorage.getItem('user'))
      console.log('AuthContext - Datos de usuario del localStorage:', userData)
      if (userData) {
        setUser(userData)
      } else {
        // Si no hay datos del usuario, crear un usuario demo
        setUser({ id: 1, name: 'Usuario Demo', email: 'demo@example.com' })
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('AuthContext - Intentando login con:', email)
      const response = await axios.post('/api/user/login', { email, password })
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data
        console.log('AuthContext - Login exitoso, token recibido:', newToken)
        console.log('AuthContext - Datos de usuario recibidos:', userData)
        
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Error en el inicio de sesión' 
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      const errorMessage = error.response?.data?.message || 'Error en el inicio de sesión'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log('AuthContext - Intentando registro con:', email)
      const response = await axios.post('/api/user/register', { name, email, password })
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data
        console.log('AuthContext - Registro exitoso, token recibido:', newToken)
        console.log('AuthContext - Datos de usuario recibidos:', userData)
        
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Error en el registro' 
        }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      const errorMessage = error.response?.data?.message || 'Error en el registro'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = () => {
    console.log('AuthContext - Cerrando sesión')
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 