import { Component, ReactNode } from 'react';
import { Stack, Text, ThemeIcon } from '@mantine/core';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    message: string;
}

export class ChartErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: '' };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    componentDidUpdate(prevProps: Props) {
        // Reset error when children change (e.g. config updated)
        if (prevProps.children !== this.props.children && this.state.hasError) {
            this.setState({ hasError: false, message: '' });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <Stack align="center" justify="center" style={{ height: '100%', opacity: 0.5 }} gap="xs">
                    <ThemeIcon variant="light" color="orange" size="lg" radius="xl">
                        <AlertTriangle size={18} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" ta="center">
                        Chart unavailable — adjust your data settings
                    </Text>
                </Stack>
            );
        }
        return this.props.children;
    }
}
