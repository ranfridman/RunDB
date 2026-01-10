import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mantine/core';

interface DroppableCellProps {
    id: string;
    children: React.ReactNode;
    className?: string; // Accept className for styling
}

export const DroppableCell = ({ id, children, className }: DroppableCellProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        border: isOver ? '2px dashed var(--mantine-color-yellow-4)' : undefined,
        borderRadius: 'var(--mantine-radius-lg)',
        transition: 'border 0.2s ease',
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            className={className}
        >
            {children}
        </Box>
    );
};
