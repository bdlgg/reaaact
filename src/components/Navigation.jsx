import { useLocation, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function Navigation({ darkMode, toggleDarkMode }) {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Главная' },
        { path: '/technologies', label: 'Все технологии' },
        { path: '/add-technology', label: 'Добавить' },
        { path: '/statistics', label: 'Статистика' },
        { path: '/settings', label: 'Настройки' },
    ];

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(90deg, #1a2a6c, #45b7d1)',
                boxShadow: 3,
                mb: 2,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
                    🚀 Трекер технологий
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                ...(location.pathname === item.path && {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                }),
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
                <IconButton
                    onClick={toggleDarkMode}
                    color="inherit"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                >
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;