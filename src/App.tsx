import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'

function App() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-gray-800"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'" }}
    >
      <Header />
      <main className="flex w-full flex-1 flex-col items-center">
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App