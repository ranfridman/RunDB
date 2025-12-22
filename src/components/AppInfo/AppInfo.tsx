import { Database } from 'lucide-react';
import { Code, Group, Text } from '@mantine/core';

export const AppInfo = () => {
  return (
    <>
      <Group justify="space-between" align="center" gap={5}>
        <Group gap={5} align='center'>
        <Database size={20} />
        <Text size="md" fw={600} >
          RunDB
        </Text>
        </Group>

        <Code fw={700} bg="dark" >v1.0.0    </Code>
      </Group>
    </>
  );
};
