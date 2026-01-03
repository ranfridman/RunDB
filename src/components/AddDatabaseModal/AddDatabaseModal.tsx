import { useDBConnectionsStore } from "../../stores/useDBConnections";
import { Button, Divider, Group, LoadingOverlay, Modal, NumberInput, PasswordInput, Select, Stack, TextInput, Title } from "@mantine/core";
import { Database, Server, Share2, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import styles from './AddDatabaseModal.module.css';
import { useValidateDB } from "@/api/db";

type DBType = 'postgres' | 'mysql' | 'mssql' | 'mariadb' | 'cockroachdb';

const DB_TEMPLATES: Record<DBType, { label: string; port: number; user: string }> = {
    postgres: { label: 'PostgreSQL', port: 5432, user: 'postgres' },
    mysql: { label: 'MySQL', port: 3306, user: 'root' },
    mssql: { label: 'Microsoft SQL Server', port: 1433, user: 'sa' },
    mariadb: { label: 'MariaDB', port: 3306, user: 'root' },
    cockroachdb: { label: 'CockroachDB', port: 26257, user: 'root' },
};

export const AddDatabaseModal: React.FC = () => {
    const dbModalOpen = useDBConnectionsStore((state) => state.dbModalOpen);
    const currentDBConnection = useDBConnectionsStore((state) => state.dbConnections.find((dbConnection) => dbConnection.id === dbModalOpen));
    const onClose = useDBConnectionsStore((state) => state.setDBModal);
    const updatedDBConnection = useDBConnectionsStore((state) => state.editDBConnection);
    const addDBConnection = useDBConnectionsStore((state) => state.addDBConnection);
    const isNewConnection = !currentDBConnection;
    const validateDB = useValidateDB();
    const [dbType, setDbType] = useState<DBType | null>(null);
    const [connectionName, setConnectionName] = useState<string>('');
    const [host, setHost] = useState<string>('');
    const [port, setPort] = useState<number>(0);
    const [database, setDatabase] = useState<string>('');
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const selectDBType = (value: DBType) => {
        setDbType(value);
        setPort(DB_TEMPLATES[value].port);
        setUser(DB_TEMPLATES[value].user);
    };
    useEffect(() => {
        if (dbModalOpen) {
            const dbConnection = currentDBConnection;
            if (dbConnection) {
                setDbType(dbConnection.connection.type);
                setConnectionName(dbConnection.name);
                setHost(dbConnection.connection.host);
                setPort(dbConnection.connection.port);
                setDatabase(dbConnection.connection.database);
                setUser(dbConnection.connection.user);
                setPassword(dbConnection.connection.password);
            }
        }
    }, [dbModalOpen]);
    const handleSubmit = async () => {
        if (!dbModalOpen || !connectionName || !host || !port || !database || !user || !password) {
            return;
        }
        try {
            const isValid = await validateDB.mutateAsync({
                host,
                port,
                database,
                user,
                password,
            });
            if (!isValid) {
                return;
            }
            console.log('Valid credentials');

            if (isNewConnection) {
                addDBConnection({
                    id: dbModalOpen!,
                    name: connectionName,
                    connection: {
                        host,
                        port,
                        database,
                        user,
                        password,
                    },
                });
            } else {
                updatedDBConnection({
                    id: dbModalOpen!,
                    name: connectionName,
                    connection: {
                        host,
                        port,
                        database,
                        user,
                        password,
                    },
                });
            }
            clearForm();
            onClose(null);
        } catch (error) {
            return;
        }
    };
    const clearForm = () => {
        setDbType(null);
        setConnectionName('');
        setHost('');
        setPort(0);
        setDatabase('');
        setUser('');
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
            <LoadingOverlay visible={validateDB.isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
                        onChange={(value) => setPort(Number(value) || 0)}
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
                        label="User"
                        placeholder="postgres"
                        leftSection={<User size={16} />}
                        classNames={styles}
                        withAsterisk
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
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
