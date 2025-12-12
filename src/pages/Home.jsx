import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Assignment as AssignmentIcon, BarChart as BarChartIcon, Settings as SettingsIcon, Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import useTechnologies from '../hooks/useTechnologies';

function Home() {
    const { technologies } = useTechnologies();

    const stats = {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
    };

    return (
        <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Добро пожаловать в Трекер Технологий
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Управляйте прогрессом изучения ваших технологий.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">Всего</Typography>
                        <Typography variant="h4" color="primary">{stats.total}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">Завершено</Typography>
                        <Typography variant="h4" color="success.main">{stats.completed}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">В процессе</Typography>
                        <Typography variant="h4" color="warning.main">{stats.inProgress}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Быстрые действия</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/technologies"
                        startIcon={<ListIcon />}
                        variant="contained"
                        color="primary"
                    >
                        Все технологии
                    </Button>
                    <Button
                        component={Link}
                        to="/add-technology"
                        startIcon={<AddIcon />}
                        variant="outlined"
                        color="primary"
                    >
                        Добавить технологию
                    </Button>
                    <Button
                        component={Link}
                        to="/statistics"
                        startIcon={<BarChartIcon />}
                        variant="outlined"
                        color="secondary"
                    >
                        Статистика
                    </Button>
                    <Button
                        component={Link}
                        to="/settings"
                        startIcon={<SettingsIcon />}
                        variant="outlined"
                        color="info"
                    >
                        Настройки
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Недавние изменения</Typography>
                <Typography color="text.secondary">
                    {technologies.filter(t => t.status !== 'not-started').length > 0
                        ? 'Вы начали изучение или завершили несколько технологий.'
                        : 'Начните изучать новую технологию, чтобы увидеть прогресс здесь.'}
                </Typography>
            </Paper>
        </Box>
    );
}

export default Home;