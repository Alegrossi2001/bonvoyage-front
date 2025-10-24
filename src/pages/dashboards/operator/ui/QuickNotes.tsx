import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, Typography, IconButton, TextField, Stack, Tooltip, Fade } from '@mui/material';
import { NoteAddOutlined, DeleteOutline, SaveOutlined, EditOutlined, PushPinOutlined } from '@mui/icons-material';

const LOCAL_STORAGE_KEY = 'bonvoyage_operator_quick_notes';

const QuickNotes: React.FC = () => {
    const [note, setNote] = useState('');
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load note from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) setNote(stored);
    }, []);

    // Save note to localStorage
    const handleSave = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, note);
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 1200);
    };

    // Delete note
    const handleDelete = () => {
        setNote('');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setEditing(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
    };

    // Start editing
    const handleEdit = () => {
        setEditing(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
    };

    return (
        <Card
            sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                minHeight: 220,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #fffbe7 0%, #fff 100%)',
                position: 'relative',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PushPinOutlined color="warning" />
                <Typography variant="h6" fontWeight={700} color="text.primary">
                    Quick Notes
                </Typography>
                <Box flexGrow={1} />
                {editing ? (
                    <Tooltip title="Save">
                        <IconButton onClick={handleSave} color="primary">
                            <SaveOutlined />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Edit">
                        <IconButton onClick={handleEdit}>
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete} disabled={!note}>
                        <DeleteOutline />
                    </IconButton>
                </Tooltip>
            </Stack>

            {editing ? (
                <TextField
                    inputRef={textareaRef}
                    multiline
                    minRows={6}
                    maxRows={12}
                    fullWidth
                    variant="outlined"
                    placeholder="Jot down your ideas, reminders, or to-dos..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    sx={{
                        background: '#fffde7',
                        borderRadius: 2,
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        flex: 1,
                        mb: 1,
                    }}
                    onKeyDown={e => {
                        if (e.ctrlKey && e.key === 'Enter') handleSave();
                    }}
                />
            ) : (
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 120,
                        background: '#fffde7',
                        borderRadius: 2,
                        p: 2,
                        fontSize: '1rem',
                        color: note ? 'text.primary' : 'text.disabled',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        '&:hover': { background: '#fff9c4' },
                    }}
                    onClick={handleEdit}
                >
                    {note || <Typography color="text.disabled">No notes yet. Click to add one!</Typography>}
                </Box>
            )}

            <Fade in={saved}>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 24,
                        bgcolor: 'success.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        boxShadow: 2,
                    }}
                >
                    Saved!
                </Box>
            </Fade>
        </Card>
    );
};

export default QuickNotes;