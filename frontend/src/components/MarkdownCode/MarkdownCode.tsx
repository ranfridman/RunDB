import React from 'react';
import { Code } from '@mantine/core';
import { Mermaid } from '../Mermaid/Mermaid';
import mermaid from 'mermaid';

export const MarkdownCode = ({ className, isStreaming, children, ...props }: { className?: string, isStreaming?: boolean, children?: React.ReactNode, [key: string]: any }) => {
  const isMermaid = className?.includes('language-mermaid');


  if (isStreaming) {
    return <Code className={className} {...props}>{children}</Code>;
  }

  if (isMermaid) {
    // Wrap the Mermaid diagram in your custom container
    return (
      <>
        {/* {mermaid.getRegisteredDiagramsMetadata()} */}
        <Mermaid
          chart={String(children)}
        />
      </>
    );
  }

  // Return default for standard code blocks
  return <Code className={className} {...props}>{children}</Code>;
};
