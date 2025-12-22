import { TreeNodeData } from '@mantine/core';


export interface DatabaseTreeNodeData extends TreeNodeData {
    type: 'database' | "table" | "column";
    children?: DatabaseTreeNodeData[];
}


export const data: DatabaseTreeNodeData[] = [
  {
    label: 'srcsrcsrcsrcsrcsrcsrcsrc',
    value: 'srcsrcsrcsrcsrcsrcsrcsrc',
    type: 'database',
    children: [
      {
        label: 'components',
        value: 'src/components',
        type: 'table',
        children: [
          { label: 'Accordion.tsx', value: 'src/components/Accordion.tsx', type: 'column' },
          { label: 'Tree.tsx', value: 'src/components/Tree.tsx', type: 'column' },
          { label: 'Button.tsx', value: 'src/components/Button.tsx', type: 'column' },
        ],
      },
    ],
  },
  {
    label: 'node_modules',
    value: 'node_modules',
    type: 'database',
    children: [
      {
        label: 'react',
        value: 'node_modules/react',
        type: 'table',  
        children: [
          { label: 'index.d.ts', value: 'node_modules/react/index.d.ts', type: 'column' },
          { label: 'package.json', value: 'node_modules/react/package.json', type: 'column' },   
        ],
      },
      {
        label: '@mantine',
        value: 'node_modules/@mantine',
        type: 'table',
        children: [
          {
            label: 'core',
            type: 'table',
            value: 'node_modules/@mantine/core',
            children: [
              { label: 'index.d.ts', value: 'node_modules/@mantine/core/index.d.ts', type: 'column' },
              { label: 'package.json', value: 'node_modules/@mantine/core/package.json', type: 'column' },
            ],
          },
          {
            label: 'hooks',
            value: 'node_modules/@mantine/hooks',
            type: 'table',
            children: [
              { label: 'index.d.ts', value: 'node_modules/@mantine/hooks/index.d.ts', type: 'column' },
              { label: 'package.json', value: 'node_modules/@mantine/hooks/package.json', type: 'column'     },
            ],
          },
          {
            label: 'form',
            type: 'table',
            value: 'node_modules/@mantine/form',
            children: [
              { label: 'index.d.ts', value: 'node_modules/@mantine/form/index.d.ts', type: 'column' },
              { label: 'package.json', value: 'node_modules/@mantine/form/package.json', type: 'column' },
            ],
          },
        ],
      },
    ],
  },

];