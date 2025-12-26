import { useDisclosure } from "@mantine/hooks";
import { ContentCard } from "../ContentCard/ContentCard"
import { ChevronDown } from "lucide-react";
import { ActionIcon, Text } from "@mantine/core";
import React, { useRef, useEffect, useState } from "react";

interface OptionListProps extends React.ClassAttributes<HTMLUListElement>, React.HTMLAttributes<HTMLUListElement> {
    isAnimating?: boolean;
    title?: string;
}

export const OptionList = ({ isAnimating, title, ...props }: OptionListProps) => {
    const [opened, { toggle }] = useDisclosure(true);
    const [isNested, setIsNested] = useState(false);
    const ulRef = useRef<HTMLUListElement>(null);

    // Detect if this list is nested inside another list
    useEffect(() => {
        if (ulRef.current) {
            // Check if any parent element is an <li> (which would indicate nesting)
            let parent = ulRef.current.parentElement;
            while (parent) {
                if (parent.tagName === 'LI') {
                    setIsNested(true);
                    break;
                }
                parent = parent.parentElement;
            }
        }
    }, []);

    // Count the number of list items
    const itemCount = React.Children.toArray(props.children).length;

    const toggleButton =
        <ActionIcon variant="transparent" size="xs" c="dimmed" onClick={toggle}>
            <ChevronDown
                style={{
                    transform: opened ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.1s ease',
                }} />
        </ActionIcon>

    // If nested, render as a simple styled ul without ContentCard
    if (isNested) {
        return (
            <ul
                ref={ulRef}
                {...props}
                style={{
                    ...props.style,
                    margin: '0.5rem 0',
                    paddingLeft: '1.5rem',
                    listStyleType: 'circle'
                }}
            />
        );
    }

    // Top-level list: render with ContentCard
    return (
        <>
            <ContentCard isStreaming={isAnimating ?? false} icon={toggleButton} type={title ?? "Options"}>
                {opened ? (
                    <ul ref={ulRef} {...props} style={{ margin: 0 }} />
                ) : (
                    <Text size="xs" px="xs" c="dimmed">{itemCount} Options</Text>
                )}
            </ContentCard>
        </>
    );
}