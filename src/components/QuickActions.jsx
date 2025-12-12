import { useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemButton, ListItemText, Checkbox } from "@mui/material";
import { CheckCircle, Delete, Shuffle, FileDownload, FileUpload } from "@mui/icons-material";
import useTechnologies from '../hooks/useTechnologies';

function QuickActions({ technologies }) {
    const { markAllCompleted, resetAll, randomNext, bulkUpdateStatus } = useTechnologies();
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [newStatusForSelected, setNewStatusForSelected] = useState('not-started');
    const [showBulkModal, setShowBulkModal] = useState(false);

    const handleExport = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        console.log("Данные для экспорта:", JSON.stringify(exportData, null, 2));
        setShowExportModal(true);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === technologies.length){
            setSelectedIds(new Set());
        }
        else {
            setSelectedIds(new Set(technologies.map(t => t.id)))
        }
    };

    const handleSelectOne = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)){
            newSelected.delete(id);
        }
        else{
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleApplyToSelected = () => {
        if (selectedIds.size === 0) return;
        const idsToUpdate = Array.from(selectedIds);
        bulkUpdateStatus(idsToUpdate, newStatusForSelected);
        setSelectedIds(new Set());
        setShowBulkModal(false);
    };

    const isApplyDisabled = selectedIds.size === 0;

    return (
        <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>Быстрые действия</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button onClick={markAllCompleted} startIcon={<CheckCircle />} variant="outlined" color="success">
                    Отметить все как выполненные
                </Button>
                <Button onClick={resetAll} startIcon={<Delete />} variant="outlined" color="warning">
                    Сбросить все статусы
                </Button>
                <Button onClick={randomNext} startIcon={<Shuffle />} variant="outlined" color="info">
                    Случайный выбор
                </Button>
                <Button onClick={handleExport} startIcon={<FileDownload />} variant="outlined" color="info">
                    Экспорт данных
                </Button>
                <Button onClick={() => setShowBulkModal(true)} startIcon={<FileUpload />} variant="outlined" color="secondary">
                    Массовое редактирование
                </Button>
            </Box>

            <Dialog open={showBulkModal} onClose={() => {setShowBulkModal(false); setSelectedIds(new Set());}}>
                <DialogTitle>Массовое редактирование статусов</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <Button onClick={handleSelectAll} variant="outlined" size="small">
                            {selectedIds.size === technologies.length ? 'Снять выделение' : 'Выделить все'}
                        </Button>
                        <FormControl fullWidth>
                            <InputLabel>Новый статус</InputLabel>
                            <Select
                                value={newStatusForSelected}
                                label="Новый статус"
                                onChange={(e) => setNewStatusForSelected(e.target.value)}
                            >
                                <MenuItem value="not-started">Не начато</MenuItem>
                                <MenuItem value="in-progress">В процессе</MenuItem>
                                <MenuItem value="completed">Завершено</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick={handleApplyToSelected} variant="contained" disabled={isApplyDisabled}>
                            Применить ({selectedIds.size})
                        </Button>
                    </Box>
                    <List dense>
                        {technologies.map(tech => (
                            <ListItem key={tech.id} disablePadding>
                                <ListItemButton role={undefined} onClick={() => handleSelectOne(tech.id)} dense>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedIds.has(tech.id)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText primary={tech.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBulkModal(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showExportModal} onClose={() => setShowExportModal(false)}>
                <DialogTitle>Экспорт данных</DialogTitle>
                <DialogContent>
                    <Typography>Данные успешно подготовлены для экспорта</Typography>
                    <Typography variant="caption" color="text.secondary">Проверьте консоль разработчика</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExportModal(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default QuickActions;