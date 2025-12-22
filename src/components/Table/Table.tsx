import { useState } from 'react';
import { Table, Checkbox, TableProps } from '@mantine/core';
import { data } from 'react-router-dom';

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

export const Table3 = (props: TableProps) => {
    {props.data?.body   }
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rows = (props.data?.body??[]).map((element) => (
    <Table.Tr
    //   key={element.name}
    //   bg={selectedRows.includes(element.position) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        {/* <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(element.position)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.position]
                : selectedRows.filter((position) => position !== element.position)
            )
          }
        /> */}
        {JSON.stringify(element)}
      </Table.Td>
      {element.map((value, index) => (
        <Table.Td key={index}>{value}</Table.Td>
        ))} 
    </Table.Tr>
  ));

return (
    <Table {...props}>          

      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th> {JSON.stringify(props.data?.head)}</Table.Th>
          <Table.Th>Element name</Table.Th>
          <Table.Th>Symbol</Table.Th>
          <Table.Th>Atomic mass</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}