import React, { memo, type ComponentProps } from 'react';
import { Streamdown } from 'streamdown';
import { Card, Table, Text } from '@mantine/core';
import { MarkdownCode } from '../MarkdownCode/MarkdownCode';
import { ContentCard } from '../ContentCard/ContentCard';

type ResponseProps = ComponentProps<typeof Streamdown>;


export const Response = memo(
    ({ className, isAnimating, ...props }: ResponseProps) => (
        <Streamdown
            key={isAnimating ? 'animating' : 'static'}

            mermaid={{
                config: { theme: 'dark', securityLevel: 'antiscript', wrap: true },
            }}
            //   className={cn(
            //     "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            //     className
            //   )}
            controls={{ mermaid: false }}
            components={{
                // Map Markdown tags to Mantine components
                code: (props) =>
                    <ContentCard isStreaming={isAnimating ?? false} type={"Graph"}>
                        <MarkdownCode {...props} />,
                    </ContentCard>,
                h1: (props) => <Text size="xl" fw={700} mt="md" {...props} />,
                p: (props) => <Text size="md" mb="sm" {...props} />,
                table: (props) => (
                    <ContentCard isStreaming={isAnimating ?? false} type={"Table"}>
                        <Table theme="dark" withBorder withColumnBorders highlightOnHover>
                            {props.children}
                        </Table>
                    </ContentCard>
                ),

                // code: ({ children }) => (
                //   <Code   > {children}</Code> // Mantine's Code component
                // ),
                // Add other mappings for ul, li, table, etc.
            }}
            {...props}
        />
    ),
    (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.isAnimating === nextProps.isAnimating
);

Response.displayName = 'Response';
