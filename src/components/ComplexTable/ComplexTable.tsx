import { useMemo, useState } from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  Filter,
  X
} from 'lucide-react'
import {
  Box,
  Text,
  ScrollArea,
  Group,
  Flex,
  Divider,
  Card,
  Table,
  TextInput,
  ActionIcon,
  Tooltip,
  Badge,
  Stack,
  Pagination
} from '@mantine/core'
import classes from './ComplexTable.module.css'
import { TableParser, ParsedTableData } from './TableParser'

export interface ColumnConfig {
  key: string
  label?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string | number
  render?: (value: any, row: any) => React.ReactNode
}

export interface ComplexTableProps {
  data?: any[]
  columns?: ColumnConfig[]
  children?: React.ReactNode
  title?: string
  searchable?: boolean
  maxRows?: number
}

export function ComplexTable({
  data: propsData,
  columns: propsColumns,
  children,
  title,
  searchable = true,
  maxRows = 10
}: ComplexTableProps) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState<number>(1)

  // 1. Parse or use provided data
  const { data, columns } = useMemo(() => {
    let finalData: any[] = []
    let finalColumns: ColumnConfig[] = []

    if (children) {
      const parsed = TableParser.parse(children)
      finalData = parsed.rows
      finalColumns = parsed.columns.map(col => ({
        key: col,
        label: col,
        sortable: true
      }))
    } else if (propsData) {
      finalData = propsData
      if (propsColumns) {
        finalColumns = propsColumns
      } else if (propsData.length > 0) {
        finalColumns = Object.keys(propsData[0]).map(key => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          sortable: true
        }))
      }
    }

    // Merge with propsColumns if they exist to allow overriding labels/renderers
    if (propsColumns) {
      finalColumns = finalColumns.map(col => {
        const override = propsColumns.find(pc => pc.key === col.key)
        return override ? { ...col, ...override } : col
      })
    }

    return { data: finalData, columns: finalColumns }
  }, [children, propsData, propsColumns])

  // 2. Filter data
  const filteredData = useMemo(() => {
    setCurrentPage(1)
    if (!search) return data
    const s = search.toLowerCase()
    return data.filter(row => {
      return Object.values(row).some(val => {
        const anyVal = val as any;
        const text = typeof anyVal === 'object' && anyVal !== null && 'text' in anyVal ? String(anyVal.text) : String(anyVal)
        return text.toLowerCase().includes(s)
      })
    })
  }, [data, search])

  // 3. Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField] as any
      const bVal = b[sortField] as any

      const aText = typeof aVal === 'object' && aVal !== null && 'text' in aVal ? String(aVal.text) : String(aVal)
      const bText = typeof bVal === 'object' && bVal !== null && 'text' in bVal ? String(bVal.text) : String(bVal)

      // Try numeric sort
      const aNum = parseFloat(aText)
      const bNum = parseFloat(bText)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Default string sort
      const comparison = aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' })
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortField, sortDirection])

  // 4. Handle sorting
  const handleSort = (key: string) => {
    const col = columns.find(c => c.key === key)
    if (!col || col.sortable === false) return

    if (sortField === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(key)
      setSortDirection('asc')
    }
  }
  const displayData = maxRows ? sortedData.slice((currentPage - 1) * maxRows, currentPage * maxRows) : sortedData

  if (data.length === 0) {
    return (
      <Card withBorder radius="md" p="xl" bg="transparent">
        <Stack align="center" gap="xs">
          <Text c="dimmed" size="sm">No data found in table</Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Card radius="md" p={0} className={classes.tableCard} bg="transparent">
      {(title || searchable) && (
        <Box p="sm" className={classes.tableHeader} >
          <Flex justify="space-between" align="center" gap="md">
            {title && <Text fw={600} size="sm">{title}</Text>}
            {searchable && (
              <TextInput
                placeholder="Search table..."
                size="xs"
                variant="filled"
                leftSection={<Search size={14} />}
                value={search}
                rightSection={
                  search ? (
                    <ActionIcon variant="subtle" size="xs" c="dimmed" onClick={() => setSearch('')}>
                      <X size={14} />
                    </ActionIcon>
                  ) : null
                }
                onChange={(e) => setSearch(e.currentTarget.value)}
                style={{ flex: 1, maxWidth: 300 }}
              />
            )}
            <Group gap={8}>
              <Tooltip label="Export CSV" color="dark">
                <ActionIcon variant="subtle" size="sm">
                  <Download size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Flex>
        </Box>
      )}

      <Divider />

      <ScrollArea scrollbarSize={4} h="50vh" offsetScrollbars>
        <Table
          c="gray.1"
          verticalSpacing="xs"
          horizontalSpacing="md"
          highlightOnHover
          className={classes.table}
        // style={{ minWidth: columns.length * 120 }}
        >
          <Table.Thead className={classes.thead}>
            <Table.Tr>
              {columns.map(col => (
                <Table.Th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={col.sortable !== false ? classes.sortableHeader : ''}
                  style={{ width: col.width }}
                >
                  <Group gap={4} wrap="nowrap" justify={col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'}>
                    <Text size="xs" fw={700} className={classes.headerText}>
                      {col.label || col.key}
                    </Text>
                    {col.sortable !== false && (
                      <Box className={classes.sortIcon}>
                        {sortField === col.key ? (
                          sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        ) : (
                          <ArrowUpDown size={12} style={{ opacity: 0.3 }} />
                        )}
                      </Box>
                    )}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {displayData.map((row, i) => (
              <Table.Tr key={i} >
                {columns.map(col => {
                  const cellData = row[col.key]
                  const text = typeof cellData === 'object' && cellData !== null && 'text' in cellData ? cellData.text : String(cellData)
                  const node = typeof cellData === 'object' && cellData !== null && 'node' in cellData ? cellData.node : cellData

                  return (
                    <Table.Td
                      key={col.key}
                      align={col.align}
                      height={10}
                    >
                      <Box className={classes.cellContent} title={text}>
                        {col.render ? col.render(cellData, row) : (
                          node || <Text size="xs" c="dimmed">—</Text>
                        )}
                      </Box>
                    </Table.Td>
                  )
                })}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <Divider />
      <Group justify="space-between" align="center" px="md">

        <Pagination
          mt="xs"
          mb="xs"
          classNames={{
            root: classes.pagination,
            control: classes.paginationControl
          }}
          size="xs"
          total={Math.max(1, Math.ceil(sortedData.length / maxRows))}
          value={currentPage}
          onChange={setCurrentPage}
          variant="subtle"
          withEdges

        />
        <Text size="xs" c="dimmed" ta="center">
          {maxRows * (currentPage - 1) + 1} - {maxRows * (currentPage - 1) + displayData.length} / {sortedData.length}
        </Text>
      </Group>

      {/* {displayData.length < sortedData.length && (
        <Box p="xs" className={classes.footer}>
          <Text size="xs" c="dimmed" ta="center">
            Showing {displayData.length} of {sortedData.length} rows
          </Text>
        </Box>
      )} */}
    </Card>
  )
}
