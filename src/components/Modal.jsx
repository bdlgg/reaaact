import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

function Modal({ isOpen, onClose, title, children }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 2,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                }}
            >
                {title}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ py: 1 }}>
                    {children}
                </Box>
            </DialogContent>
            {children && !children.type?.name?.includes('DeadlineForm') && (
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Закрыть</Button>
                </DialogActions>
            )}
        </Dialog>
    );
}

export default Modal;