import { ReactFlowProvider } from '@xyflow/react';
import { ERDChartInner } from './ERDChartInner';

export const ERDChart = () => (
    <ReactFlowProvider>
        <ERDChartInner />
    </ReactFlowProvider>
);
