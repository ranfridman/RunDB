import React, { memo, type ComponentProps, useContext, useEffect } from 'react';
import { Streamdown } from 'streamdown';
import { Text, Box, Anchor, Table } from '@mantine/core';
import { MarkdownCode } from '../MarkdownCode/MarkdownCode';
import { ContentCard } from '../ContentCard/ContentCard';
import { ComplexTable } from '../ComplexTable/ComplexTable';
import { OptionList } from '../OptionList/OptionList';
import { HeadingTracker, useHeadingTracking, extractTextFromChildren } from './HeadingContext';

type ResponseProps = ComponentProps<typeof Streamdown>;

const ResponseComponent = memo(
    ({ className, isAnimating, ...props }: ResponseProps) => {
        const { lastHeading, consumedHeadings, consumeHeading, resetConsumedHeadings } = useHeadingTracking();

        // Reset state when animation starts to handle fresh streams
        useEffect(() => {
            if (isAnimating) {
                resetConsumedHeadings();
            }
        }, [isAnimating, resetConsumedHeadings]);

        // Helper to create heading components that track their text and hide if consumed
        const createHeadingComponent = (Component: React.ComponentType<any>) => {
            return (props: any) => {
                const textContent = extractTextFromChildren(props.children);

                // Update the last heading ref for the next list to find
                lastHeading.current = textContent;

                // If this specific heading text has been consumed by a following list, hide it
                if (consumedHeadings.includes(textContent)) {
                    return null;
                }

                return <Component {...props} />;
            };
        };

        return (
            <Streamdown
                key={isAnimating ? 'animating' : 'static'}
                mermaid={{
                    config: { theme: 'dark', securityLevel: 'antiscript', wrap: true },
                }}
                controls={{ mermaid: false }}
                components={{
                    // Map Markdown tags to Mantine components
                    code: (props) => {
                        const { className } = props as any;
                        const isMermaid = className?.includes('language-mermaid');
                        const language = className?.replace('language-', '') || 'Code';
                        const title = isMermaid ? "Graph" : language.charAt(0).toUpperCase() + language.slice(1);

                        return (
                            <ContentCard isStreaming={isAnimating ?? false} type={title}>
                                <MarkdownCode {...props} />
                            </ContentCard>
                        );
                    },
                    h1: createHeadingComponent((props: any) => <Text size="xl" fw={700} px="md" mt="md" {...props} />),
                    h2: createHeadingComponent((props: any) => <Text size="lg" fw={600} px="md" mt="md" {...props} />),
                    h3: createHeadingComponent((props: any) => <Text size="md" fw={600} px="md" mt="sm" {...props} />),
                    h4: createHeadingComponent((props: any) => <Text size="md" fw={500} px="md" mt="sm" {...props} />),
                    p: (props) => <Text size="md" mb="sm" px="md" {...props} />,
                    ul: (props) => {
                        const title = lastHeading.current ?? undefined;
                        if (title) {
                            consumeHeading(title);
                            lastHeading.current = null;
                        }
                        return <OptionList title={title} isAnimating={isAnimating ?? false} {...props} />;
                    },
                    li: (props) => <Box component="li" {...props} />,
                    table: ({ children }) => (
                        <ContentCard isStreaming={isAnimating ?? false} type={"Table"} >
                            <ComplexTable maxRows={12}>
                                {children}
                            </ComplexTable>
                        </ContentCard>
                    ),
                    a: (props) => <Anchor {...props} />,
                }}
                {...props}
            />
        );
    },
    (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.isAnimating === nextProps.isAnimating
);

ResponseComponent.displayName = 'Response';

// Wrap the Response component with HeadingTracker and export as both named and default
export const Response = (props: ResponseProps) => (
    <HeadingTracker>
        <ResponseComponent {...props} />
    </HeadingTracker>
);

export default Response;
