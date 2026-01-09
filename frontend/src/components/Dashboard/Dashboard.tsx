import { Divider, Grid } from "@mantine/core"
import classes from './Dashboard.module.css';
import { clamp, useMove } from "@mantine/hooks";
import { useState } from "react";

export const Dashboard = () => {
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);
    const { ref: ref1 } = useMove(({ x }) => setValue1(value1 + Math.round((x - 0.5) * 2)));
    const { ref: ref2 } = useMove(({ x }) => setValue2(value2 + (x - 0.5) * 2));

    return (
        <Grid p="md" grow gutter="10px" className={classes.grid}>
            <Grid.Col m="xs" mr="0" span={5 + value1} className={classes.cell}>{5 + value1}</Grid.Col>
            <Grid.Col ref={ref1} m="xs" w="0.1em" span={0} bg="gray">
                <Divider orientation="vertical" />
            </Grid.Col><Grid.Col m="xs" ml="0" span={5 - value1} className={classes.cell}>{5 - value1}</Grid.Col>
            <Grid.Col m="xs" span={2 + value2} className={classes.cell}>{value2}</Grid.Col>
            <Grid.Col ref={ref2} m="xs" w="0.1em" span={0} bg="gray">
                <Divider orientation="vertical" />
            </Grid.Col>
            <Grid.Col m="xs" span={2 - value2} className={classes.cell}>5</Grid.Col>
        </Grid >
    )
}