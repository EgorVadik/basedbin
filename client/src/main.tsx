import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <main className='bg-[#101519] min-h-screen'>
                <App />
            </main>
        </BrowserRouter>
    </React.StrictMode>
)
