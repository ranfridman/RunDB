import { Box, Card, Stack, Textarea } from "@mantine/core"
import { ComplexTable } from "../ComplexTable/ComplexTable"
import { highlightSQL } from "../SQLPrewview/SQLPreview"


export const TablePanel: React.FC = () => {
    return (
        <Stack justify="flex-end" bg="gray.9" h="90vh">
            TablePanel
            {highlightSQL("SELECT * FROM table")}d
            <Textarea minRows={5} styles={{ wrapper: { bg: "red" } }} spellCheck={false} size="lg" autosize maxRows={5} placeholder="Enter your input here..." p="xs" itemType="text" />
            <Card p={0} withBorder radius="md" mt="auto">

                <ComplexTable maxRows={20} height="50vh" >
                    <thead>
                        <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                            <th>Column 4</th>
                            <th>Column 5</th>
                            <th>Column 6</th>
                            <th>Column 7</th>
                            <th>Column 8</th>
                            <th>Column 9</th>
                            <th>Column 10</th>
                            <th>Column 11</th>
                            <th>Column 12</th>
                            <th>Column 13</th>
                            <th>Column 14</th>
                            <th>Column 15</th>
                            <th>Column 16</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Row 1, Column 1</td>
                            <td>Row 1, Column 2</td>
                            <td>Row 1, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 2, Column 1</td>
                            <td>Row 2, Column 2</td>
                            <td>Row 2, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 3, Column 1</td>
                            <td>Row 3, Column 2</td>
                            <td>Row 3, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 4, Column 1</td>
                            <td>Row 4, Column 2</td>
                            <td>Row 4, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 5, Column 1</td>
                            <td>Row 5, Column 2</td>
                            <td>Row 5, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 6, Column 1</td>
                            <td>Row 6, Column 2</td>
                            <td>Row 6, Column 3</td>
                            <td>Row 6, Column 4</td>
                            <td>Row 6, Column 5</td>
                            <td>Row 6, Column 6</td>
                            <td>Row 6, Column 7</td>
                            <td>Row 6, Column 8</td>
                            <td>Row 6, Column 9</td>
                            <td>Row 6, Column 10</td>
                            <td>Row 6, Column 11</td>
                            <td>Row 6, Column 12</td>
                            <td>Row 6, Column 13</td>
                            <td>Row 6, Column 14</td>
                            <td>Row 6, Column 15</td>
                            <td>Row 6, Column 16</td>
                        </tr>
                        <tr>
                            <td>Row 7, Column 1</td>
                            <td>Row 7, Column 2</td>
                            <td>Row 7, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 8, Column 1</td>
                            <td>Row 8, Column 2</td>
                            <td>Row 8, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 9, Column 1</td>
                            <td>Row 9, Column 2</td>
                            <td>Row 9, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 10, Column 1</td>
                            <td>Row 10, Column 2</td>
                            <td>Row 10, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 11, Column 1</td>
                            <td>Row 11, Column 2</td>
                            <td>Row 11, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 12, Column 1</td>
                            <td>Row 12, Column 2</td>
                            <td>Row 12, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 13, Column 1</td>
                            <td>Row 13, Column 2</td>
                            <td>Row 13, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 14, Column 1</td>
                            <td>Row 14, Column 2</td>
                            <td>Row 14, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 15, Column 1</td>
                            <td>Row 15, Column 2</td>
                            <td>Row 15, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 16, Column 1</td>
                            <td>Row 16, Column 2</td>
                            <td>Row 16, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 17, Column 1</td>
                            <td>Row 17, Column 2</td>
                            <td>Row 17, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 18, Column 1</td>
                            <td>Row 18, Column 2</td>
                            <td>Row 18, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 19, Column 1</td>
                            <td>Row 19, Column 2</td>
                            <td>Row 19, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 20, Column 1</td>
                            <td>Row 20, Column 2</td>
                            <td>Row 20, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 18, Column 1</td>
                            <td>Row 18, Column 2</td>
                            <td>Row 18, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 19, Column 1</td>
                            <td>Row 19, Column 2</td>
                            <td>Row 19, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 20, Column 1</td>
                            <td>Row 20, Column 2</td>
                            <td>Row 20, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 18, Column 1</td>
                            <td>Row 18, Column 2</td>
                            <td>Row 18, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 19, Column 1</td>
                            <td>Row 19, Column 2</td>
                            <td>Row 19, Column 3</td>
                        </tr>
                        <tr>
                            <td>Row 20, Column 1</td>
                            <td>Row 20, Column 2</td>
                            <td>Row 20, Column 3</td>
                        </tr>
                    </tbody>
                </ComplexTable>
            </Card>
        </Stack>
    )
}