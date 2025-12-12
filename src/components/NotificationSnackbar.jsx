import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

function NotificationSnackbar({ open, message, severity = 'info', duration = 3000, onClose }) {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
        if (open) {
            const timer = setTimeout(() => handleClose(), duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: { xs: 2, sm: 4 }, mr: { xs: 2, sm: 4 } }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    maxWidth: { xs: '90vw', sm: '350px' },
                    borderRadius: '8px',
                    boxShadow: 3
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default NotificationSnackbar;