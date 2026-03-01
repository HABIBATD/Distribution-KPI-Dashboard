
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface SalesTrendChartProps {
  data: {
    date: string;
    sales: number;
    returns: number;
  }[];
  isAnimationActive?: boolean;
  theme: 'light' | 'dark';
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data, isAnimationActive = true, theme }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#475569' : '#e2e8f0';
  const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const tooltipBorder = isDark ? '#475569' : '#cbd5e1';

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
          <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis tickFormatter={(value) => formatNumber(value as number)} tick={{ fill: textColor, fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
                backgroundColor: tooltipBg,
                backdropFilter: 'blur(5px)',
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '0.5rem',
                color: textColor
            }}
          />
          <Legend wrapperStyle={{ color: textColor }}/>
          <Line type="monotone" dataKey="sales" stroke="#4c9aff" strokeWidth={2} activeDot={{ r: 8 }} name="Sales" isAnimationActive={isAnimationActive} />
          <Line type="monotone" dataKey="returns" stroke="#ff5630" strokeWidth={2} name="Returns" isAnimationActive={isAnimationActive} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrendChart;