import { useState } from 'react';
import { Group, Text, rem, Stack, Center, Box, Badge, Divider, ThemeIcon, Alert } from '@mantine/core';
import { Dropzone, type FileWithPath } from '@mantine/dropzone';
import { Upload, X as CloseIcon, FileJson, Database, AlertCircle } from 'lucide-react';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

export const FileDropzone = () => {
    const dbData = useDocsPanelStore(state => state.dbData);
    const setDbData = useDocsPanelStore(state => state.setDbData);
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const setActiveTab = useDocsPanelStore(state => state.setActiveTab);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = async (files: FileWithPath[]) => {
        const file = files[0];
        setError(null);
        if (file) {
            const text = await file.text();
            try {
                const parsed = JSON.parse(text);
                setDbData(parsed);
                setSelected(null, null);
                setActiveTab('overview');
            } catch (err: any) {
                console.error("Failed to parse JSON file", err);
                setError(err.message || "Invalid JSON file structure");
            }
        }
    };

    const dropzoneContent = (
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
                <Upload
                    style={{
                        width: rem(64),
                        height: rem(64),
                        color: 'var(--mantine-color-blue-6)'
                    }}
                />
            </Dropzone.Accept>
            <Dropzone.Reject>
                <CloseIcon
                    style={{
                        width: rem(64),
                        height: rem(64),
                        color: 'var(--mantine-color-red-6)'
                    }}
                />
            </Dropzone.Reject>
            <Dropzone.Idle>
                <FileJson
                    style={{
                        width: rem(52),
                        height: rem(52),
                        color: 'var(--mantine-color-dimmed)'
                    }}
                />
            </Dropzone.Idle>

            <Stack gap={4}>
                <Text size="xl" fw={800} inline>
                    Drop database metadata
                </Text>
                <Text size="sm" c="dimmed" inline>
                    Drag your JSON schema here to populate the documentation
                </Text>
            </Stack>
        </Group>
    );

    if (!dbData) {
        return (
            <Box w="100%" style={{ position: 'relative' }}>
                <Center h="60vh" pt="xl">
                    <Stack align="center" gap="xl" style={{ maxWidth: 400 }}>
                        <Box style={{ position: 'relative' }}>
                            <Box
                                p="xl"
                                style={{
                                    borderRadius: '32px',
                                    backgroundColor: 'var(--mantine-color-blue-filled)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 20px 40px -10px rgba(0, 122, 255, 0.4)',
                                    zIndex: 2
                                }}
                            >
                                <Database size={56} color="white" strokeWidth={1.5} />
                            </Box>
                        </Box>

                        <Stack align="center" gap="lg">
                            <Stack align="center" gap={8}>
                                <Badge
                                    size="sm"
                                    variant="dot"
                                    color="blue"
                                    styles={{ root: { textTransform: 'uppercase' } }}
                                >
                                    Documentation Engine
                                </Badge>
                                <Text size="26px" fw={900} ta="center" style={{ lineHeight: 1.1 }}>
                                    Your Database <br /> Knowledge Base
                                </Text>
                                <Text size="sm" c="dimmed" ta="center" px="md">
                                    Unlock insights, browse schemas, and explore entity relationships. Simply provide your metadata to start.
                                </Text>
                            </Stack>

                            {error && (
                                <Alert
                                    variant="light"
                                    color="red"
                                    title="Syntax Error"
                                    icon={<AlertCircle size={16} />}
                                    styles={{ root: { width: '100%' } }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Divider w={100} label="Get Started" labelPosition="center" />

                            <Dropzone
                                onDrop={handleDrop}
                                accept={['application/json']}
                                multiple={false}
                                radius="md"
                                p="xl"
                                styles={{
                                    root: {
                                        backgroundColor: 'var(--mantine-color-dark-7)',
                                        border: '1px dashed var(--mantine-color-dark-4)',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'var(--mantine-color-dark-6)',
                                            borderColor: 'var(--mantine-color-blue-6)'
                                        }
                                    }
                                }}
                            >
                                <Group gap="md">
                                    <ThemeIcon size={40} variant="light" color="blue" radius="md">
                                        <Upload size={20} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text size="sm" fw={700}>Click or Drag JSON</Text>
                                        <Text size="xs" c="dimmed">Metadata export required</Text>
                                    </Box>
                                </Group>
                            </Dropzone>
                        </Stack>
                    </Stack>
                </Center>

                <Dropzone.FullScreen
                    active={true}
                    accept={['application/json']}
                    onDrop={handleDrop}
                    styles={{
                        root: {
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(8px)',
                            border: '3px dashed var(--mantine-color-blue-6)',
                            margin: rem(24),
                            borderRadius: 'var(--mantine-radius-lg)',
                            zIndex: 10000
                        }
                    }}
                >
                    {dropzoneContent}
                </Dropzone.FullScreen>
            </Box>
        );
    }

    return (
        <Dropzone.FullScreen
            active={false}
            accept={['application/json']}
            onDrop={handleDrop}
            styles={{
                root: {
                    pt: '30em',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '3px dashed var(--mantine-color-blue-6)',
                    margin: rem(24),
                    borderRadius: 'var(--mantine-radius-lg)',
                    zIndex: 10000
                }
            }}
        >
            {dropzoneContent}
        </Dropzone.FullScreen>
    );
};
