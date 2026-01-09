import { Trash } from 'lucide-react';
import { ActionIcon, Center, Divider, Flex, Group, Text } from '@mantine/core';

export const History: React.FC = () => {
  return (
    <Flex direction="column" mt="auto" gap="xs" mah="500" mih="200">
      <Divider />
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          History
        </Text>
        <Group gap={5}>
          <ActionIcon size="xs" variant="transparent" c="dimmed">
            <Trash />
          </ActionIcon>
        </Group>
      </Group>
      <Center c="dimmed" fz="xs" p="lg">
        No recent history
      </Center>
    </Flex>
  );
};
