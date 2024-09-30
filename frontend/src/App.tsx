import './App.css'
// import { CodingPage } from './components/CodingPage'
import { CodingPage } from './components/CodingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './components/Landing';
import { GlowTextPage } from './components/Main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/coding" element={<CodingPage />} />
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/" element={<GlowTextPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
