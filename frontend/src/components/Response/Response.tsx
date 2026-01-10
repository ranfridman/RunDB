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

        const memoizedComponents = React.useMemo(() => {
            // Helper to create heading components that track their text and hide if consumed
            const createHeadingComponent = (Component: React.ComponentType<any>) => {
                return (headerProps: any) => {
                    const textContent = extractTextFromChildren(headerProps.children);
                    // Update the last heading ref for the next list to find
                    lastHeading.current = textContent;

                    // If this specific heading text has been consumed by a following list, hide it
                    if (consumedHeadings.includes(textContent)) {
                        return null;
                    }
                    return <Component {...headerProps} />;
                };
            };

            return {
                // Map Markdown tags to Mantine components
                code: (codeProps: any) => {
                    const { className } = codeProps;
                    const isMermaid = className?.includes('language-mermaid');
                    const language = className?.replace('language-', '') || 'Code';
                    const title = isMermaid ? "Graph" : language.charAt(0).toUpperCase() + language.slice(1);

                    return (
                        <ContentCard isStreaming={isAnimating ?? false} type={title}>
                            <MarkdownCode {...codeProps} />
                        </ContentCard>
                    );
                },
                h1: createHeadingComponent((hProps: any) => <Text size="xl" fw={700} px="md" mt="md" {...hProps} />),
                h2: createHeadingComponent((hProps: any) => <Text size="lg" fw={600} px="md" mt="md" {...hProps} />),
                h3: createHeadingComponent((hProps: any) => <Text size="md" fw={600} px="md" mt="sm" {...hProps} />),
                h4: createHeadingComponent((hProps: any) => <Text size="md" fw={500} px="md" mt="sm" {...hProps} />),
                p: (pProps: any) => <Text size="md" mb="sm" px="md" {...pProps} />,
                ul: (ulProps: any) => {
                    const title = lastHeading.current ?? undefined;
                    if (title) {
                        consumeHeading(title);
                        lastHeading.current = null;
                    }
                    return <OptionList title={title} isAnimating={false} {...ulProps} />;
                },
                li: (liProps: any) => <Box py="1" component="li" {...liProps} />,
                table: ({ children }: any) => (
                    <ContentCard isStreaming={isAnimating ?? false} type={"Table"} >
                        <ComplexTable maxRows={12}>
                            {children}
                        </ComplexTable>
                    </ContentCard>
                ),
                a: (aProps: any) => <Anchor {...aProps} />,
            };
        }, [isAnimating, consumeHeading, consumedHeadings, lastHeading]);

        return (
            <Streamdown
                key={isAnimating ? 'animating' : 'static'}
                mermaid={{
                    config: { theme: 'dark', securityLevel: 'antiscript', wrap: true },
                }}
                controls={{ mermaid: false }}
                components={memoizedComponents}
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
