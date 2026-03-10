import { useState, useRef, useEffect } from 'react';
import { TextInput, Text, Group, ActionIcon, Tooltip } from '@mantine/core';
import { Pencil, Check, X } from 'lucide-react';
import classes from './Dashboard.module.css';

interface EditableTitleProps {
    value: string;
    onSave: (newValue: string) => void;
    placeholder?: string;
    fontSize?: string | number;
    fontWeight?: any;
    textTransform?: 'uppercase' | 'none' | 'capitalize';
    color?: string;
    className?: string;
    autoSelect?: boolean;
}

export const EditableTitle = ({
    value,
    onSave,
    placeholder,
    fontSize = 'xs',
    fontWeight = 700,
    textTransform = 'uppercase',
    color = 'dimmed',
    className,
    autoSelect = true,
}: EditableTitleProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && autoSelect) {
            inputRef.current?.select();
        }
    }, [isEditing, autoSelect]);

    const handleSave = () => {
        const trimmed = tempValue.trim();
        if (trimmed && trimmed !== value) {
            onSave(trimmed);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
    };

    if (isEditing) {
        return (
            <Group
                gap={4}
                wrap="nowrap"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <TextInput
                    ref={inputRef}
                    size="xs"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    autoFocus
                    variant="filled"
                    radius="sm"
                    placeholder={placeholder}
                    styles={{
                        input: {
                            height: 24,
                            minHeight: 24,
                            fontSize: typeof fontSize === 'string' ? `var(--mantine-font-size-${fontSize})` : fontSize,
                            fontWeight,
                            padding: '0 8px',
                            minWidth: 120,
                        }
                    }}
                />
                <ActionIcon
                    size="sm"
                    variant="light"
                    color="blue"
                    onMouseDown={(e) => {
                        e.preventDefault(); // Prevent onBlur from firing first
                        handleSave();
                    }}
                >
                    <Check size={14} />
                </ActionIcon>
                <ActionIcon
                    size="sm"
                    variant="light"
                    color="gray"
                    onMouseDown={(e) => {
                        e.preventDefault(); // Prevent onBlur from firing first
                        handleCancel();
                    }}
                >
                    <X size={14} />
                </ActionIcon>
            </Group>
        );
    }

    return (
        <Tooltip label="Click to edit title" position="top-start" openDelay={500} withArrow>
            <Group
                gap={6}
                wrap="nowrap"
                onClick={(e) => {
                    e.stopPropagation();
                    setTempValue(value);
                    setIsEditing(true);
                }}
                className={`${classes.editableContainer} ${className || ''}`}
            >
                <Text
                    size={fontSize as any}
                    fw={fontWeight}
                    c={color}
                    style={{
                        textTransform,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {value || placeholder}
                </Text>
                <Pencil
                    size={12}
                    className={classes.editIconTrigger}
                    style={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        color: 'var(--mantine-color-gray-5)'
                    }}
                />
            </Group>
        </Tooltip>
    );
};
