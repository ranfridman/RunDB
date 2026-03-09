import { useEffect, useState } from 'react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { common, createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ContentCard } from '../ContentCard/ContentCard';
import { Collapse, Group, ActionIcon, Text, Stack, Button, Avatar } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { Pencil, Save } from 'lucide-react';

const lowlight = createLowlight(common);

interface CustomRichTextEditorProps {
    initialContent: string;
    isEditable: boolean;
    onChange?: (content: string) => void;
    rightSettings?: React.ReactNode;
    icon?: React.ReactNode;
}

export const CustomRichTextEditor = ({ initialContent, isEditable, onChange, rightSettings, icon }: CustomRichTextEditorProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { hovered, ref } = useHover();

    // If global isEditable changes, reset local edit state.
    useEffect(() => {
        if (!isEditable) {
            setIsEditing(false);
        }
    }, [isEditable]);
    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit.configure({
                link: false,
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({ lowlight }),
            Link,
            Underline,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: initialContent,
        editable: isEditing,
        onUpdate({ editor }) {
            onChange?.(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditing);
        }
    }, [isEditing, editor]);

    // Update editor content when initialContent prop changes
    useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor]);

    if (!editor) return null;

    return (
        <Stack gap="5" ref={ref}>
            <Group justify="space-between">

                <Group gap="5" >
                    {icon}
                    <Text fw={600} fz="sm" >
                        Description
                    </Text>
                    {isEditable && !isEditing && (
                        <ActionIcon
                            size={16}
                            variant={'transparent'}
                            c={isEditing ? undefined : "dimmed"}
                            color="blue"
                            onClick={() => setIsEditing(!isEditing)}
                            style={{
                                opacity: isEditing || hovered ? 1 : 0,
                                transition: 'opacity 0.1s ease',
                            }}
                        >
                            <Pencil size={12} />
                        </ActionIcon>
                    )}
                </Group>
                {rightSettings}
            </Group>
            <RichTextEditor
                p={0}
                editor={editor}
            // style={{
            //     backgroundColor: 'transparent',
            // }}sticky stickyOffset={0}
            >
                <Collapse in={isEditing}>
                    <RichTextEditor.Toolbar bg="transparent" >
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            {/* <RichTextEditor.Code /> */}
                            <RichTextEditor.CodeBlock />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>

                            <ActionIcon
                                ml="auto"
                                size={26}
                                color="var(--mantine-color-default-border)"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                <Save size={12} color="light-dark(var(--mantine-color-gray-7),var(--mantine-color-dark-1))" />
                            </ActionIcon>
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                </Collapse>

                <RichTextEditor.Content
                    bg="transparent"
                    p={0}
                />
            </RichTextEditor>

        </Stack>
    );
};
