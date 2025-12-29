import { useDBConnectionsStore } from "../../stores/useDBConnections";
import { Button, Divider, Group, Modal, NumberInput, PasswordInput, Select, Stack, TextInput, Title } from "@mantine/core";
import { Database, Server, Share2, Shield, User } from "lucide-react";


type DBType = 'postgres' | 'mysql' | 'mssql' | 'mariadb' | 'cockroachdb';

const DB_TEMPLATES: Record<DBType, { label: string; port: number; user: string }> = {
    postgres: { label: 'PostgreSQL', port: 5432, user: 'postgres' },
    mysql: { label: 'MySQL', port: 3306, user: 'root' },
    mssql: { label: 'Microsoft SQL Server', port: 1433, user: 'sa' },
    mariadb: { label: 'MariaDB', port: 3306, user: 'root' },
    cockroachdb: { label: 'CockroachDB', port: 26257, user: 'root' },
};

export const AddDatabaseModal: React.FC = () => {
    const onClose = useDBConnectionsStore((state) => state.toggleDBModal);
    const dbModalOpen = useDBConnectionsStore((state) => state.dbModalOpen);
    return (
        <Modal
            closeOnClickOutside
            opened={dbModalOpen}
            onClose={onClose}
            title={<Group gap="xs"><Database size={20} /> <Title order={4}>Add Database</Title></Group>}
            centered
            size="lg"
        >
            <Stack gap="md">
                <Select
                    label="Database Type"
                    placeholder="Pick one"
                    data={[
                        { value: 'postgres', label: 'PostgreSQL' },
                        { value: 'mysql', label: 'MySQL' },
                        { value: 'mssql', label: 'Microsoft SQL Server' },
                        { value: 'mariadb', label: 'MariaDB' },
                        { value: 'cockroachdb', label: 'CockroachDB' },
                    ]}
                    allowDeselect={false}
                />

                <TextInput
                    label="Connection Name"
                    placeholder="My Production DB"
                    description="A friendly name for your connection"
                    withAsterisk
                />

                <Divider label="Connection Details" labelPosition="center" />

                <Group grow align="flex-start">
                    <TextInput
                        label="Host"
                        placeholder="localhost"
                        leftSection={<Server size={16} />}
                        withAsterisk
                        style={{ flex: 2 }}
                    />
                    <NumberInput
                        label="Port"
                        placeholder="5432"
                        allowDecimal={false}
                        allowNegative={false}
                        withAsterisk
                    />
                </Group>

                <TextInput
                    label="Database Name"
                    placeholder="postgres"
                    leftSection={<Share2 size={16} />}
                    withAsterisk
                />

                <Group grow align="flex-start">
                    <TextInput
                        label="Username"
                        placeholder="postgres"
                        leftSection={<User size={16} />}
                        withAsterisk
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        leftSection={<Shield size={16} />}
                    />
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Connect</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
