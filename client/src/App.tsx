import { Routes, Route } from 'react-router-dom'
import NewFileContent from './components/NewFileContent'
import Home from './components/Home'
// import Top from './components/Top'

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/:id' element={<NewFileContent />} />
            </Routes>
        </>
    )
}

export default App
