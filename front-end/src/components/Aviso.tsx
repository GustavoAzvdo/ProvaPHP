import React from 'react';
import { Snackbar, Alert, type AlertProps } from '@mui/material';

interface AvisoProps {
    open: boolean;
    message: string;
    severity?: AlertProps['severity'];
    duration?: number;
    onClose: () => void;
}

const Aviso: React.FC<AvisoProps> = ({ 
    open, 
    message, 
    severity = 'info', 
    duration = 6000, 
    onClose 
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert 
                onClose={onClose} 
                severity={severity} 
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Aviso;