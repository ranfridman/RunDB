import * as React from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useMantineColorScheme, useMantineTheme, Box } from '@mantine/core';

// Types
export interface ColumnInfo {
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    ordinalPosition: number;
}

export interface TableInfo {
    name: string;
    type: 'table' | 'view';
    columns: ColumnInfo[];
}

export interface SchemaInfo {
    name: string;
    tables: TableInfo[];
}

export interface Snippet {
    name: string;
    template: string;
    description: string;
    category: string;
    triggerPrefix?: string;
}

const SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'NULL', 'ORDER BY', 'GROUP BY', 'LIMIT', 'JOIN', 'LEFT JOIN'
];

export interface SQLEditorProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    height?: string | number;
    minHeight?: string | number;
    className?: string;
    placeholder?: string;
    compact?: boolean;
    schemas?: SchemaInfo[];
    snippets?: Snippet[];
}

export function SQLEditor({
    value,
    onChange,
    readOnly = false,
    height = 200,
    minHeight,
    className,
    placeholder = 'SELECT * FROM your_table LIMIT 100;',
    compact = false,
}: SQLEditorProps) {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Define your custom themes here
        monaco.editor.defineTheme('my-dark-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: theme.colors.blue[4], fontStyle: 'bold' },
                { token: 'keyword.sql', foreground: theme.colors.blue[4], fontStyle: 'bold' },
                { token: 'operator', foreground: theme.colors.violet[4] },
                { token: 'operator.sql', foreground: theme.colors.violet[4] },
                { token: 'string', foreground: theme.colors.teal[4] },
                { token: 'string.sql', foreground: theme.colors.teal[4] },
                { token: 'number', foreground: theme.colors.orange[4] },
                { token: 'number.sql', foreground: theme.colors.orange[4] },
                { token: 'comment', foreground: theme.colors.gray[6], fontStyle: 'italic' },
                { token: 'comment.sql', foreground: theme.colors.gray[6], fontStyle: 'italic' },
                { token: 'identifier', foreground: theme.colors.gray[3] },
                { token: 'type', foreground: theme.colors.yellow[4] },
                { token: 'delimiter', foreground: theme.colors.gray[5] },

            ],
            colors: {
                'editor.background': theme.colors.dark[7],
                'editor.foreground': theme.colors.gray[3],
                'editorCursor.foreground': theme.colors.blue[4],
                'editor.lineHighlightBackground': theme.colors.dark[6],
                'editorLineNumber.foreground': theme.colors.gray[6],
                'editorLineNumber.activeForeground': theme.colors.gray[3],
                'editorIndentGuide.background': theme.colors.dark[5],
                'editor.selectionBackground': theme.colors.blue[9] + '80', // semi-transparent
            }
        });

        monaco.editor.defineTheme('my-light-theme', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: theme.colors.blue[7], fontStyle: 'bold' },
                { token: 'keyword.sql', foreground: theme.colors.blue[7], fontStyle: 'bold' },
                { token: 'operator', foreground: theme.colors.violet[7] },
                { token: 'operator.sql', foreground: theme.colors.violet[7] },
                { token: 'string', foreground: theme.colors.teal[7] },
                { token: 'string.sql', foreground: theme.colors.teal[7] },
                { token: 'number', foreground: theme.colors.orange[7] },
                { token: 'number.sql', foreground: theme.colors.orange[7] },
                { token: 'comment', foreground: theme.colors.gray[5], fontStyle: 'italic' },
                { token: 'comment.sql', foreground: theme.colors.gray[5], fontStyle: 'italic' },
                { token: 'identifier', foreground: theme.colors.dark[7] },
                { token: 'type', foreground: theme.colors.yellow[7] },
                { token: 'delimiter', foreground: theme.colors.gray[6] },
            ],
            colors: {
                'editor.background': theme.colors.gray[0],
                'editor.foreground': theme.colors.dark[7],
                'editorCursor.foreground': theme.colors.blue[7],
                'editor.lineHighlightBackground': theme.colors.gray[1],
                'editorLineNumber.foreground': theme.colors.gray[4],
                'editorLineNumber.activeForeground': theme.colors.dark[7],
                'editorIndentGuide.background': theme.colors.gray[3],
                'editor.selectionBackground': theme.colors.blue[2] + '80',
            }
        });

        // Set initial theme
        monaco.editor.setTheme(colorScheme === 'dark' ? 'my-dark-theme' : 'my-light-theme');
    };

    // Update theme dynamically if colorScheme changes
    React.useEffect(() => {
        import('monaco-editor').then(monaco => {
            monaco.editor.setTheme(colorScheme === 'dark' ? 'my-dark-theme' : 'my-light-theme');
        }).catch(() => { }); // catch in case monaco isn't loaded yet, though onMount usually handles it 
    }, [colorScheme]);

    return (
        <Box
            style={{
                height: typeof height === 'number' ? `${height}px` : height,
                minHeight: minHeight ? (typeof minHeight === 'number' ? `${minHeight}px` : minHeight) : undefined,
                position: 'relative',
                borderRadius: theme.radius.sm,
                overflow: 'hidden',
            }}
            className={className}
        >
            <Editor
                height="100%"
                defaultLanguage="sql"
                value={value}
                onChange={(val) => onChange(val || '')}
                onMount={handleEditorDidMount}
                theme={colorScheme === 'dark' ? 'my-dark-theme' : 'my-light-theme'}
                loading={
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        Loading editor...
                    </div>
                }
                options={{
                    readOnly,
                    domReadOnly: readOnly,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: compact ? 'off' : 'on',
                    padding: { top: 8, bottom: 8 }
                }}
            />
        </Box>
    );
}

export default SQLEditor;