import { useState } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { Delete, FileDownload, FileUpload, WbSunny, Brightness3 } from '@mui/icons-material';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import NotificationSnackbar from '../components/NotificationSnackbar';

function Settings({ darkMode, toggleDarkMode }) {
    const { setLocalData } = useTechnologies();
    const [showResetModal, setShowResetModal] = useState(false);
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    const [importStatus, setImportStatus] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const showNotification = (message, severity = 'info') => {
        setNotification({ open: true, message, severity });
    };

    const handleResetAll = () => {
        setShowResetModal(false);
        showNotification('Функция сброса реализована на главной странице', 'info');
    };

    const handleClearAll = () => {
        setLocalData({});
        localStorage.removeItem('techTrackerUserData');
        setShowClearAllModal(false);
        showNotification('Все технологии удалены. Обновите страницу.', 'success');
    };

    const handleExport = () => {
        const savedData = localStorage.getItem('techTrackerUserData');
        const localData = savedData ? JSON.parse(savedData) : {};
        const technologies = [];
        for (const [id, data] of Object.entries(localData)) {
            if (data && data.title) {
                technologies.push({
                    id: parseInt(id),
                    title: data.title,
                    description: data.description || '',
                    category: data.category || 'other',
                    resources: data.resources || [],
                    status: data.status || 'not-started',
                    notes: data.notes || '',
                    deadline: data.deadline || '',
                    priority: data.priority || 'medium',
                    createdAt: data.createdAt || new Date().toISOString(),
                    updatedAt: data.updatedAt || new Date().toISOString(),
                });
            }
        }
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotification('Данные экспортированы', 'success');
    };

    const handleImport = (event) => {
        setImportStatus('');
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const parsedData = JSON.parse(content);
                let importedTechs = [];
                if (parsedData && Array.isArray(parsedData.technologies)) {
                    importedTechs = parsedData.technologies;
                } else if (Array.isArray(parsedData)) {
                    importedTechs = parsedData;
                } else {
                    throw new Error('Неверный формат данных. Ожидается объект с полем "technologies" или массив');
                }
                if (importedTechs.length === 0) {
                    setImportStatus('В файле нет данных для импорта');
                    return;
                }
                const newLocalData = {};
                const now = new Date().toISOString();
                let importedCount = 0;
                importedTechs.forEach(tech => {
                    if (tech.id != null && tech.title) {
                        newLocalData[tech.id] = {
                            title: tech.title,
                            description: tech.description || '',
                            category: tech.category || 'other',
                            resources: tech.resources || [],
                            status: tech.status || 'not-started',
                            notes: tech.notes || '',
                            deadline: tech.deadline || '',
                            priority: tech.priority || 'medium',
                            createdAt: tech.createdAt || now,
                            updatedAt: tech.updatedAt || now,
                        };
                        importedCount++;
                    }
                });
                localStorage.setItem('techTrackerUserData', JSON.stringify(newLocalData));
                setLocalData(newLocalData);
                setImportStatus(`Успешно импортировано ${importedCount} технологий. Обновите страницу (F5).`);
                showNotification(`Успешно импортировано ${importedCount} технологий`, 'success');
            } catch (error) {
                console.error('Ошибка импорта:', error);
                setImportStatus(`Ошибка: ${error.message}`);
                showNotification(`Ошибка: ${error.message}`, 'error');
            }
        };
        reader.onerror = () => {
            setImportStatus('Ошибка: Не удалось прочитать файл.');
            showNotification('Ошибка: Не удалось прочитать файл.', 'error');
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleImportClick = () => {
        document.getElementById('import-file-input').click();
    };

    return (
        <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto', width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>Настройки</Typography>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Управление данными</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Button
                        onClick={() => setShowResetModal(true)}
                        startIcon={<Delete />}
                        variant="outlined"
                        color="warning"
                    >
                        Сбросить все статусы и заметки
                    </Button>
                    <Button
                        onClick={() => setShowClearAllModal(true)}
                        startIcon={<Delete />}
                        variant="outlined"
                        color="error"
                    >
                        Удалить все технологии
                    </Button>
                    <Button
                        onClick={handleExport}
                        startIcon={<FileDownload />}
                        variant="outlined"
                        color="info"
                    >
                        Экспорт данных
                    </Button>
                    <Button
                        onClick={handleImportClick}
                        startIcon={<FileUpload />}
                        variant="outlined"
                        color="info"
                    >
                        Импорт данных
                    </Button>
                    <Button
                        onClick={toggleDarkMode}
                        startIcon={darkMode ? <WbSunny /> : <Brightness3 />}
                        variant="outlined"
                        color={darkMode ? "warning" : "inherit"}
                    >
                        {darkMode ? 'Светлая тема' : 'Тёмная тема'}
                    </Button>
                    <input
                        id="import-file-input"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                </Box>
                {importStatus && (
                    <Alert severity={importStatus.startsWith('Ошибка') ? 'error' : 'success'} sx={{ mt: 2 }}>
                        {importStatus}
                    </Alert>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    <strong>Важно:</strong> После импорта обновите страницу (F5)
                </Typography>
            </Paper>

            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Подтверждение сброса"
            >
                <Typography>Вы уверены, что хотите сбросить статусы и заметки для всех технологий?</Typography>
                <Typography color="text.secondary">Это действие нельзя отменить.</Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleResetAll} color="error">Да, сбросить</Button>
                    <Button onClick={() => setShowResetModal(false)} color="secondary">Отмена</Button>
                </Box>
            </Modal>

            <Modal
                isOpen={showClearAllModal}
                onClose={() => setShowClearAllModal(false)}
                title="Подтверждение удаления"
            >
                <Typography>Вы уверены, что хотите удалить ВСЕ технологии?</Typography>
                <Typography color="text.secondary">Все данные будут потеряны. Это действие нельзя отменить.</Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleClearAll} color="error">Да, удалить всё</Button>
                    <Button onClick={() => setShowClearAllModal(false)} color="secondary">Отмена</Button>
                </Box>
            </Modal>

            <NotificationSnackbar
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            />
        </Box>
    );
}

export default Settings;