import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './admin/pages/dashboard'
import ProductPage from './admin/pages/Product'
import AddProductPage from './admin/pages/AddProduct'
import AdminLayout from './admin/AdminLayout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-gray-800"
          style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'" }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes - Protected and require admin role */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="add-product" element={<AddProductPage />} />
            </Route>
            
            {/* Main Site Routes */}
            <Route path="/" element={
              <>
                <Header />
                <main className="flex w-full flex-col items-center flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shop" element={<Shop />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App