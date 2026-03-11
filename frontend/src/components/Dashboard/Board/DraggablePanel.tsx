import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mantine/core';
import { useContext } from 'react';
import { PanelActionsContext } from './types';

interface DraggablePanelProps {
    id: string;
    children: React.ReactNode;
}

export const DraggablePanel = ({ id, children }: DraggablePanelProps) => {
    const actions = useContext(PanelActionsContext);
    const isEditMode = actions?.isEditMode ?? false;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: !isEditMode,
    });

    const style = {
        visibility: isDragging ? 'hidden' as const : 'visible' as const,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0 : 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        minHeight: 0,
        minWidth: 0
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            {children}
        </Box>
    );
};
