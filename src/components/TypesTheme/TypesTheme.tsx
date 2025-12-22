import { ThemeIcon } from "@mantine/core";
import { ChartArea, Table } from "lucide-react";

export const typeToColor: { [key: string]: string } = {
  Table: 'blue',
  Graph: 'pink',
  SQL: 'teal',
  Analysis: 'violet',
};

export const getIconByType = (type: string, size: number = 16): React.ReactNode => {
  return <ThemeIcon variant='transparent' size={size} c={typeToColor[type]}>
    {typeToIcon2[type]}
  </ThemeIcon>
}

export const typeToIcon2: { [key: string]: React.ReactNode } = {
  Table: (
    <Table />
  ),
  Graph: (
    <ChartArea />
  ),
  SQL: (
    <ChartArea />
  ),
  Analysis: (
    <ChartArea />
  ),

};
export const typeToIcon: { [key: string]: React.ReactNode } = {
  Table: (
    <ThemeIcon variant='transparent' size={16} m={0} p={0} c={typeToColor.Table}>
      <Table />
    </ThemeIcon>
  ),
  Graph: (
    <ThemeIcon size={16} variant='transparent' p={0} c={typeToColor.Graph}>
      <ChartArea />
    </ThemeIcon>
  ),
  SQL: (
    <ThemeIcon size={16} variant='transparent' p={0} c={typeToColor.SQL}>
      <ChartArea />
    </ThemeIcon>
  ),
  Analysis: (
    <ThemeIcon size={16} variant='transparent' p={0} c={typeToColor.Analysis}>
      <ChartArea />
    </ThemeIcon>
  ),

};