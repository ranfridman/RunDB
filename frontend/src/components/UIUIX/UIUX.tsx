import { Box, Collapse, Group, Input, Text, Tree, TreeNodeData, useTree } from "@mantine/core";
import React, { ReactNode, useMemo, useState } from "react";
import { UIUXComponent } from "./UIUXComponent";
import { useDisclosure } from "@mantine/hooks";

interface CompontentTypeProps {
    classes?: { [key: string]: string };
    name: string;
    withProps: any
    displayName: string
}

export interface CompontentProps {
    children?: CompontentProps[];
    type: CompontentTypeProps | null;
    key?: any;
    props: any
}

interface UIUXProps {
    children: ReactNode;
}


export const Leaf = ({ node, expanded, hasChildren, elementProps, setSelectedElement, isSelected }: any) => {
    return (
        <Group gap={5} {...elementProps} bg={isSelected ? "red" : "transparent"} onClick={() => {
            setSelectedElement(node.value)
        }}>
            <Text size="sm">{node.label}</Text>
        </Group>
    )
}

const getChildren = (children: ReactNode, parent: string = "") => {
    const data: TreeNodeData[] = [];
    React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            const componentName = (child.type as any)?.displayName || (child.type as any)?.name;

            data.push({
                value: `${parent}-${index}-${componentName}`,
                label: componentName,
                children: getChildren(child?.props?.children, `${parent}-${index}-${componentName}`)
            })
        }
    })
    return data;
}

export const UIUX = ({ children }: UIUXProps) => {
    const t = useMemo(() => getChildren(children), [children])
    const [opened, { toggle }] = useDisclosure(true);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const tree = useTree({
    })
    const toggleExpandAllNodes = () => {
        if (Object.values(tree.expandedState).every((value) => value))
            tree.collapseAllNodes();
        else
            tree.expandAllNodes();
    };
    console.log(t);
    return (
        <Box style={{ position: "relative" }}>
            <UIUXComponent selectedElement={selectedElement ?? ""}
                children={children as any}
                parent={`-0-${children?.type?.name ?? children?.type.displayName}`}
            />
            <Box pos="absolute" m="xs" top={0} left={0} bg="var(--mantine-primary-color-filled)">
                <Text onClick={toggleExpandAllNodes}>UIUX</Text>
                <Collapse in={opened}>
                    <Tree
                        data={t}
                        levelOffset={10}
                        tree={tree}
                        renderNode={(payload) => <Leaf {...payload} isSelected={selectedElement === payload.node.value} setSelectedElement={setSelectedElement} />}
                    />

                </Collapse>
            </Box>
        </Box>
    );
};
