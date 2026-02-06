import { Box } from "@mantine/core";
import { CompontentProps, UIUX } from "./UIUX";
import React, { ReactNode } from "react";

interface UIUXComponentProps {
    children: CompontentProps;
    selectedElement?: string;
    parent?: string;
}

export const UIUXComponent = ({ children, selectedElement, parent }: UIUXComponentProps) => {
    if (!React.isValidElement(children)) return <>{children as any}</>;

    const Component = children.type as any;
    const existingProps = children.props as any;
    const { children: childNodes, ...otherProps } = children.props as any;

    const injectedProps = {
        ...otherProps,
        children: childNodes ? (
            React.Children.map(childNodes, (child, index) => {
                if (React.isValidElement(child)) {
                    return (
                        <UIUXComponent
                            children={child as any}
                            selectedElement={selectedElement}
                            parent={`${parent}-${index}-${child.type.name || child.type.displayName}`}
                        />
                    )
                }
                // If it's just text or a number, return it as is
                return child;
            })
        ) : undefined
    };

    {/* {children.type.name || children.type.displayName} */ }
    return (
        <>
            {
                selectedElement === parent &&
                <div style={{ color: "red", position: "absolute", zIndex: 100, top: 0, right: 0 }}>
                    {/* {`${parent}`} */}
                </div>
            }
            <Component {...existingProps} {...injectedProps} style={{ border: selectedElement === parent ? "1px solid red" : "" }} />
        </>
    );
};