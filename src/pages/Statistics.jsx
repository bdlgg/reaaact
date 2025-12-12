import { Box, Typography, Paper, Grid, Chip, CircularProgress, LinearProgress } from '@mui/material';
import useTechnologies from '../hooks/useTechnologies';

function Statistics() {
    const { technologies } = useTechnologies();

    const stats = {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length,
    };

    const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Статистика
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">Всего технологий</Typography>
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
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">Не начато</Typography>
                        <Typography variant="h4" color="text.primary">{stats.notStarted}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Прогресс изучения</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{ flex: 1, height: 12, borderRadius: 5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {completionPercentage}%
                    </Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Статусы по технологиям</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {technologies.map(tech => (
                        <Chip
                            key={tech.id}
                            label={tech.title}
                            color={
                                tech.status === 'completed' ? 'success' :
                                    tech.status === 'in-progress' ? 'warning' : 'default'
                            }
                            size="small"
                            variant="outlined"
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}

export default Statistics;