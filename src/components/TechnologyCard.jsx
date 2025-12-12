import { Card, CardContent, Typography, Chip, Box, Link } from '@mui/material';
import TechnologyNotes from "./TechnologyNotes.jsx";

function TechnologyCard({ id, title, description, status, notes, resources, onStatusChange, onNotesChange }) {
    const nextStatus = (current) => {
        if (current === 'not-started') return 'in-progress';
        if (current === 'in-progress') return 'completed';
        return 'not-started';
    };

    const handleClick = () => {
        onStatusChange(nextStatus(status));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in-progress': return 'warning';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return '✅ завершено';
            case 'in-progress': return '⏳ в процессе';
            case 'not-started': return '⚪ не начато';
        }
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                padding: 2,
                marginBottom: 2,
                boxShadow: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderLeft: '4px solid',
                borderColor: status === 'completed' ? 'success.main' :
                    status === 'in-progress' ? 'warning.main' : 'grey.500',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                },
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>

                {resources && resources.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                            Ресурсы:
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            {resources.map((url, idx) => (
                                <Box key={idx} sx={{ mb: 0.5 }}>
                                    <Link href={url.trim()} target="_blank" rel="noopener noreferrer" color="primary" underline="hover">
                                        {url.trim()}
                                    </Link>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    <Chip
                        label={getStatusText(status)}
                        color={getStatusColor(status)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <TechnologyNotes
                    notes={notes}
                    onNotesChange={onNotesChange}
                    techId={id}
                />
            </CardContent>
        </Card>
    );
}

export default TechnologyCard;