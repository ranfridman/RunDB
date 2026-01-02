import { IconTable } from '@tabler/icons-react';
import { ChevronDown, Columns2, Database } from 'lucide-react';
import { Box, Divider, Group, Pill, RenderTreeNodePayload, ScrollArea, Text, Tree, TreeNodeData, useTree, UseTreeReturnType } from '@mantine/core';
import { DatabaseTreeNodeData } from './data';
import classes from './DatabaseTree.module.css';
import { useTabsStore } from '../../stores/useTabs';
import { DatabaseTreeTableMenu } from '../DatabaseTreeTableMenu/DatabaseTreeTableMenu';
// import classes from './Demo.module.css';

// 1. Extend the default TreeNodeData to include your custom 'type'
interface CustomTreeNode extends TreeNodeData {
  label: string;
  value: string;
  type?: 'database' | 'table' | 'column';
  children?: CustomTreeNode[];
}

interface DatabaseTreeIconProps {
  type?: 'database' | 'table' | 'column';
  isFolder: boolean;
  expanded: boolean;
}

function DatabaseTreeIcon({ type }: DatabaseTreeIconProps) {
  // 2. Handle specific types
  if (type === 'database') {
    return <Database size={14} />;
  }

  if (type === 'table') {
    return <IconTable size={14} />;
  }

  if (type === 'column') {
    return <Columns2 size={14} />;
  }

  return null;
}

function Leaf({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) {
  const customNode = node as CustomTreeNode;
  const openTableTab = useTabsStore((state) => state.openTableTab);
  return (
    <Group gap={0}  {...elementProps} p={0} my={0} c="dimmed" align='center' preventGrowOverflow wrap='nowrap'>
      {customNode.type !== 'database' && (
        <Divider orientation="vertical" ml={5} />
      )}
      <Group gap={5}  {...elementProps} align='center' preventGrowOverflow wrap='nowrap' onClick={(e) => node}>
        {hasChildren && (
          <ChevronDown
            size={14}
            style={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.1s ease',
            }}
          />
        )}
        <DatabaseTreeIcon isFolder={hasChildren} expanded={expanded} type={customNode.type} />
      </Group>
      <Text ml={10} mr={10} truncate="end" component='p'>{customNode.label} </Text>
      {customNode.type === 'database' && (
        <Pill ml="auto" mr={0} size="xs" variant="outline" c="gray">
          {node.children?.length}
        </Pill>
      )}
      {customNode.type === 'table' && (
        <Box ml="auto" mr="xs" p={0}>

          <DatabaseTreeTableMenu />
        </Box>
      )}
    </Group>
  );
}

interface DatabaseTreeProps {
  data: DatabaseTreeNodeData[]
  treeExpandState: UseTreeReturnType
}


export const DatabaseTree: React.FC<DatabaseTreeProps> = ({ data, treeExpandState }) => {
  return (
    <ScrollArea scrollbarSize={4} offsetScrollbars={false} classNames={classes}>
      <Tree
        tree={treeExpandState}
        // expandOnClick={false}
        data={data}
        renderNode={(payload) => <Leaf {...payload} />}
      />
    </ScrollArea>
  );
};
