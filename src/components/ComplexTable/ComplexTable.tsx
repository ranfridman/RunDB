import { useMemo, useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Box,
  Text,
  ScrollArea,
  Group,
  Center,
  Flex,
  Divider,
  Card,
} from '@mantine/core'
import classes from './ComplexTable.module.css'

import { parseTableChildren } from './TableDataUtils'

interface TableWidgetConfig {
  maxRows: number
  columns?: string[]
  sortBy?: {
    column: string
    direction: 'asc' | 'desc'
  }
}

interface ComplexTableProps {
  config?: Partial<TableWidgetConfig>
  data?: Record<string, unknown>[]
  children?: React.ReactNode
}

/**
 * Format a table cell value into a human-readable string.
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }
  if (value instanceof Date) {
    return value.toLocaleString()
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  const str = String(value)
  if (str.length > 50) {
    return str.slice(0, 47) + '...'
  }
  return str
}

/**
 * Render a sortable table widget using custom Mantine components.
 */
export function ComplexTable({ config = {}, data: propsData, children }: ComplexTableProps) {
  const { maxRows = 10, columns: configColumns, sortBy: initialSort } = config

  const { extractedData, extractedColumns } = useMemo(() => {
    if (children) {
      try {
        const { data, columns } = parseTableChildren(children);
        if (data.length > 0 && columns.length > 0) {
          return { extractedData: data, extractedColumns: columns };
        }
      } catch (error) {
        console.warn('Failed to parse table children:', error);
      }
    }
    return { extractedData: propsData || [], extractedColumns: [] };
  }, [children, propsData])

  const [sortColumn, setSortColumn] = useState<string | null>(initialSort?.column ?? null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    initialSort?.direction ?? 'asc'
  )

  const columns = useMemo(() => {
    if (configColumns && configColumns.length > 0) {
      return configColumns
    }
    if (extractedColumns.length > 0) {
      return extractedColumns
    }
    if (extractedData.length > 0) {
      return Object.keys(extractedData[0])
    }
    return []
  }, [configColumns, extractedColumns, extractedData])

  const sortedData = useMemo(() => {
    if (!sortColumn) return extractedData

    return [...extractedData].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal === null || aVal === undefined) return sortDirection === 'asc' ? 1 : -1
      if (bVal === null || bVal === undefined) return sortDirection === 'asc' ? -1 : 1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      const comparison = aStr.localeCompare(bStr)
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [extractedData, sortColumn, sortDirection])

  const displayData = useMemo(() => {
    return sortedData.slice(0, maxRows)
  }, [sortedData, maxRows])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // If no data was extracted but we have children, render them as-is
  if (extractedData.length === 0 && children) {
    return (
      <ScrollArea h="100%">
        <Box className={classes.simpleTableContainer}>
          {children}
        </Box>
      </ScrollArea>
    )
  }

  // If no data at all
  if (extractedData.length === 0) {
    return (
      <Center h="100%">
        <Text size="sm" c="dimmed">
          No data available
        </Text>
      </Center>
    )
  }

  // Render custom sortable table
  return (
    <Box className={classes.tableContainer}>
      <Card>

        <ScrollArea h="100%">
          {/* Header Row */}
          <Flex className={classes.headerRow}>
            {columns.map((column) => (
              <Box
                key={column}
                className={classes.headerCell}
                onClick={() => handleSort(column)}
              >
                <Group gap={4} wrap="nowrap">
                  <Text size="xs" fw={700} className={classes.headerText}>
                    {column.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Text>
                  {sortColumn === column ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp size={12} style={{ flexShrink: 0 }} />
                    ) : (
                      <ArrowDown size={12} style={{ flexShrink: 0 }} />
                    )
                  ) : (
                    <ArrowUpDown size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
                  )}
                </Group>
              </Box>
            ))}
          </Flex>

          <Divider />

          {/* Data Rows */}
          {displayData.map((row, rowIndex) => (
            <Box key={rowIndex}>
              <Flex className={classes.dataRow}>
                {columns.map((column) => (
                  <Box key={column} className={classes.dataCell}>1
                    <Text
                      size="xs"
                      className={classes.cellContent}
                      c={row[column] === null || row[column] === undefined ? 'dimmed' : undefined}
                      title={String(row[column] ?? '')}
                    >
                      {formatCellValue(row[column])}
                    </Text>
                  </Box>
                ))}
              </Flex>
              {rowIndex < displayData.length - 1 && <Divider />}
            </Box>
          ))}
        </ScrollArea>

        {extractedData.length > maxRows && (
          <Box className={classes.footer}>
            Showing {maxRows} of {extractedData.length} rows
          </Box>
        )}
      </Card>
    </Box>
  )
}
