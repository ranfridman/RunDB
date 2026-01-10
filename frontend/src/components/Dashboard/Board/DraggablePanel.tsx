import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mantine/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggablePanelProps {
    id: string;
    children: React.ReactNode;
}

export const DraggablePanel = ({ id, children }: DraggablePanelProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.8 : 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const
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
