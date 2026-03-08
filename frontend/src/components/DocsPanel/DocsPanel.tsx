import { useState, useId, lazy, Suspense } from 'react';
import { Box, Divider, Text, Center, Stack, ThemeIcon, Group, UnstyledButton, MantineProvider, createTheme, ScrollArea, Loader } from '@mantine/core';
import { FileText, GitBranch, Share2, MoreHorizontal } from 'lucide-react';
import { DocsOverview } from '../DocsOverview/DocsOverview';
import { DocsHeader } from '../DocsHeader/DocsHeader';
import { typeToColor } from '../TypesTheme/TypesTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { DocsPanelContext, useDocsPanelProvider, useDocsPanelStore } from './DocsPanelStore';
import { DocsRightPanel } from './DocsRightPanel';

const ERDChart = lazy(() => import('../ERDChart/ERDChart').then(m => ({ default: m.ERDChart })));

const theme = createTheme({
    primaryColor: typeToColor['Docs'],
});

const DocsPanelContent = () => {
    const uniqueId = useId();
    const [activeTab, setActiveTab] = useState<string>('overview');

    // Zustand (localized) usage
    const isEditing = useDocsPanelStore(state => state.isEditing);
    const setIsEditing = useDocsPanelStore(state => state.setIsEditing);
    const selectedItemId = useDocsPanelStore(state => state.selectedItemId);
    const selectedItemType = useDocsPanelStore(state => state.selectedItemType);
    const setSelected = useDocsPanelStore(state => state.setSelected);

    const tabs = [
        { value: 'overview', label: 'Overview', icon: <FileText size={14} /> },
        { value: 'erd', label: 'ERD', icon: <GitBranch size={14} /> },
        { value: 'versions', label: 'Versions', icon: <Share2 size={14} /> },
        { value: 'more', label: 'More', icon: <MoreHorizontal size={14} /> },
    ];

    const tabContent: Record<string, React.ReactNode> = {
        overview: <DocsOverview isEditing={isEditing} />,
        erd: (
            <Suspense fallback={<Center h="60vh"><Loader size="sm" /></Center>}>
                <ERDChart />
            </Suspense>
        ),
        versions: (
            <Box pt="xl">

            </Box>
        ),
        more: (
            <Box pt="xl">

            </Box>
        ),
    };

    return (
        <MantineProvider theme={theme} cssVariablesSelector={`#${uniqueId}`}>
            <Group
                id={uniqueId}
                h="100%"
                w="100%"
                align='top'
                gap={0}
            // px="sm"
            >
                <Box h="100%" w="100%" >
                    <DocsHeader
                        isEditing={isEditing}
                        onToggleEditing={() => setIsEditing(!isEditing)}
                    />
                    <Divider w="100%" mt="xs" />
                    <Group gap={0} align='top'>
                        <Box w={selectedItemId ? "calc(100% - 620px)" : "100%"}>

                            <Group
                                gap={0}
                                bg="var(--mantine-color-secondary-9)"
                                style={{ borderBottom: '1px solid var(--mantine-color-dark-4)' }}
                            >
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.value;
                                    return (
                                        <UnstyledButton
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                            py="xs"
                                            px="md"
                                            style={{
                                                position: 'relative', // REQUIRED for absolute indicator positioning
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                color: isActive ? `var(--mantine-color-${typeToColor['Docs']}-filled)` : 'var(--mantine-color-text)',
                                                fontWeight: isActive ? 600 : 400,
                                                fontSize: 'var(--mantine-font-size-sm)',
                                            }}
                                        >
                                            {tab.icon}
                                            <span>{tab.label}</span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-docs-tab"
                                                    initial={false}
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 500,
                                                        damping: 30,
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -1,
                                                        left: 0,
                                                        right: 0,
                                                        height: 2,
                                                        backgroundColor: `var(--mantine-color-${typeToColor['Docs']}-filled)`,
                                                        borderRadius: '2px 2px 0 0',
                                                    }}
                                                />
                                            )}
                                        </UnstyledButton>
                                    );
                                })}
                            </Group>

                            <ScrollArea h="77.8vh" offsetScrollbars scrollbarSize={2} scrollbars="y">
                                <AnimatePresence mode="sync">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        style={{ height: '100%' }}
                                    >
                                        <Box px="sm" pt="xs">
                                            {tabContent[activeTab]}
                                        </Box>
                                    </motion.div>
                                </AnimatePresence>
                            </ScrollArea>
                        </Box>
                        {selectedItemId &&
                            <Divider orientation="vertical" />
                        }
                        {selectedItemId &&
                            <div style={{ width: 600, height: '100%' }}>
                                <DocsRightPanel />
                            </div>
                        }
                    </Group>
                </Box>
            </Group>
        </MantineProvider >
    );
};

export const DocsPanel = () => {
    const store = useDocsPanelProvider();

    return (
        <DocsPanelContext.Provider value={store}>
            <DocsPanelContent />
        </DocsPanelContext.Provider>
    );
};
