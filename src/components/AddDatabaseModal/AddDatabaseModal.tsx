import { useDBConnectionsStore } from "../../stores/useDBConnections";
import { Button, Divider, Group, Modal, NumberInput, PasswordInput, Select, Stack, TextInput, Title } from "@mantine/core";
import { Database, Server, Share2, Shield, User } from "lucide-react";
import { useState } from "react";
import styles from './AddDatabaseModal.module.css';

type DBType = 'postgres' | 'mysql' | 'mssql' | 'mariadb' | 'cockroachdb';

const DB_TEMPLATES: Record<DBType, { label: string; port: number; user: string }> = {
    postgres: { label: 'PostgreSQL', port: 5432, user: 'postgres' },
    mysql: { label: 'MySQL', port: 3306, user: 'root' },
    mssql: { label: 'Microsoft SQL Server', port: 1433, user: 'sa' },
    mariadb: { label: 'MariaDB', port: 3306, user: 'root' },
    cockroachdb: { label: 'CockroachDB', port: 26257, user: 'root' },
};

export const AddDatabaseModal: React.FC = () => {
    const onClose = useDBConnectionsStore((state) => state.setDBModal);
    const dbModalOpen = useDBConnectionsStore((state) => state.dbModalOpen);
    const currentDBConnection = useDBConnectionsStore((state) => state.dbConnections.find((dbConnection) => dbConnection.id === dbModalOpen));
    const updatedDBConnection = useDBConnectionsStore((state) => state.editDBConnection);
    const [dbType, setDbType] = useState<DBType | null>(null);
    const [connectionName, setConnectionName] = useState<string>(currentDBConnection?.name || '');
    const [host, setHost] = useState<string>(currentDBConnection?.connection.host || '');
    const [port, setPort] = useState<number | string>(currentDBConnection?.connection.port || 0);
    const [database, setDatabase] = useState<string>(currentDBConnection?.connection.database || '');
    const [username, setUsername] = useState<string>(currentDBConnection?.connection.username || '');
    const [password, setPassword] = useState<string>(currentDBConnection?.connection.password || '');

    const selectDBType = (value: DBType) => {
        setDbType(value);
        setPort(DB_TEMPLATES[value].port);
        setUsername(DB_TEMPLATES[value].user);
    };

    const handleSubmit = () => {
        if (!dbModalOpen || !connectionName || !host || !port || !database || !username || !password) {
            console.log('Missing required fields');
            return;
        }
        updatedDBConnection({
            id: dbModalOpen!,
            name: connectionName,
            connection: {
                host,
                port,
                database,
                username,
                password,
            },
        });
        onClose(null);
        clearForm();
    };
    const clearForm = () => {
        setDbType(null);
        setConnectionName('');
        setHost('');
        setPort(0);
        setDatabase('');
        setUsername('');
        setPassword('');
    };

    return (
        <Modal
            radius="lg"
            closeOnClickOutside
            opened={!!dbModalOpen}
            onClose={() => { clearForm(); onClose(null) }}
            title={<Group gap="xs"><Database size={20} /> <Title order={4}>Add Database</Title></Group>}
            centered
            size="lg"
        >
            <Stack gap="md">
                <Select
                    label="Database Type"
                    description="Select the type of database you want to connect to"
                    placeholder="Pick one"
                    data={[
                        { value: 'postgres', label: 'PostgreSQL' },
                        { value: 'mysql', label: 'MySQL' },
                        { value: 'mssql', label: 'Microsoft SQL Server' },
                        { value: 'mariadb', label: 'MariaDB' },
                        { value: 'cockroachdb', label: 'CockroachDB' },
                    ]}
                    allowDeselect={false}
                    withAlignedLabels
                    value={dbType}
                    classNames={styles}
                    onChange={(value) => selectDBType(value as DBType)}
                />

                <TextInput
                    label="Connection Name"
                    placeholder="Production DB"
                    description="Give a name for the connection"
                    withAsterisk
                    value={connectionName}
                    color="gray"
                    onChange={(e) => setConnectionName(e.target.value)}
                    classNames={styles}

                />

                <Divider label="Connection Details" labelPosition="center" />

                <Group grow align="flex-start">
                    <TextInput
                        label="Host"
                        placeholder="localhost / Domain"
                        leftSection={<Server size={16} />}
                        withAsterisk
                        classNames={styles}
                        style={{ flex: 2 }}
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                    />
                    <NumberInput
                        label="Port"
                        value={port}
                        onChange={(e) => setPort(e)}
                        placeholder="5432"
                        allowDecimal={false}
                        classNames={styles}
                        allowNegative={false}
                        withAsterisk
                    />
                </Group>

                <TextInput
                    label="Database Name"
                    placeholder="postgres"
                    leftSection={<Share2 size={16} />}
                    withAsterisk
                    classNames={styles}
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                />

                <Group grow align="flex-start">
                    <TextInput
                        label="Username"
                        placeholder="postgres"
                        leftSection={<User size={16} />}
                        classNames={styles}
                        withAsterisk
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        leftSection={<Shield size={16} />}
                        withAsterisk
                        classNames={styles}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => { clearForm(); onClose(null) }}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit}>Connect</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
