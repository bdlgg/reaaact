import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: { main: '#45b7d1' },
            secondary: { main: '#6c5ce7' },
            background: {
                default: darkMode ? '#121212' : '#f9fbfd',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
            },
            text: {
                primary: darkMode ? '#e0e0e0' : '#1a1a1a',
                secondary: darkMode ? '#b0b0b0' : '#666666',
            },
        },
        typography: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className="App">
                    <Navigation darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/technologies" element={<TechnologyList />} />
                            <Route path="/technology/:techId" element={<TechnologyDetail />} />
                            <Route path="/add-technology" element={<AddTechnology />} />
                            <Route path="/statistics" element={<Statistics />} />
                            <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;