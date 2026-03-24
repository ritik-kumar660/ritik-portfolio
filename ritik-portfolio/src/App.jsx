import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Achievements from './components/Achievements'
import Resume from './components/Resume'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-[#060608] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Achievements />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}
