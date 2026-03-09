import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Center, Stack, Text, Button, Box, ThemeIcon, Code, ScrollArea } from '@mantine/core';
import { AlertCircle, RefreshCw, FileWarning } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class DocsErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('DocsPanel Error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Center h="100%" w="100%" p="xl">
                    <Box
                        p="xl"
                        style={{
                            maxWidth: 600,
                            width: '100%',
                            backgroundColor: 'var(--mantine-color-dark-7)',
                            borderRadius: 'var(--mantine-radius-md)',
                            border: '1px solid var(--mantine-color-red-9)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        <Stack align="center" gap="md">
                            <ThemeIcon size={64} radius="xl" color="red" variant="light">
                                <FileWarning size={32} />
                            </ThemeIcon>

                            <Stack align="center" gap={4}>
                                <Text fw={800} size="xl" ta="center">Something went wrong</Text>
                                <Text size="sm" c="dimmed" ta="center">
                                    An unexpected error occurred while rendering the documentation components.
                                </Text>
                            </Stack>

                            <Box w="100%" mt="md">
                                <Text size="xs" fw={700} c="red.4" mb={4} tt="uppercase">Error Details:</Text>
                                <ScrollArea.Autosize mah={200} type="always" variant="inverse">
                                    <Code block color="red.9" p="sm" style={{ fontSize: '11px', whiteSpace: 'pre-wrap' }}>
                                        {this.state.error?.toString()}
                                        {'\n\n'}
                                        {this.state.errorInfo?.componentStack}
                                    </Code>
                                </ScrollArea.Autosize>
                            </Box>

                            <Button
                                variant="light"
                                color="red"
                                leftSection={<RefreshCw size={16} />}
                                onClick={this.handleReset}
                                mt="md"
                            >
                                Reload Application
                            </Button>
                        </Stack>
                    </Box>
                </Center>
            );
        }

        return this.props.children;
    }
}
