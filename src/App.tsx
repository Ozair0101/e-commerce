import React, { Suspense, lazy } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages (lazy loaded)
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Shop = lazy(() => import('./pages/Shop'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const ShoppingCart = lazy(() => import('./pages/ShoppingCart'))

// Admin pages (lazy loaded)
const Dashboard = lazy(() => import('./admin/pages/dashboard'))
const ProductPage = lazy(() => import('./admin/pages/Product'))
const AddProductPage = lazy(() => import('./admin/pages/AddProduct'))
const ProductDetailPage = lazy(() => import('./admin/pages/ProductDetail'))
const CategoryList = lazy(() => import('./admin/pages/CategoryList'))
const AddCategory = lazy(() => import('./admin/pages/AddCategory'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-gray-800"
          style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'" }}
        >
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
              </div>
            }
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
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="add-product" element={<AddProductPage />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="add-category" element={<AddCategory />} />
              </Route>
              
              {/* Main Site Routes */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex w-full flex-col items-center flex-1">
                    <Suspense
                      fallback={
                        <div className="flex flex-1 items-center justify-center py-20">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
                        </div>
                      }
                    >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<ShoppingCart />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App