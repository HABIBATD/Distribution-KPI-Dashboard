
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface CompanySalesChartProps {
  data: { name: string; value: number }[];
  dataKey: 'value';
  title: string;
  isAnimationActive?: boolean;
  theme: 'light' | 'dark';
}

const CompanySalesChart: React.FC<CompanySalesChartProps> = ({ data, dataKey, title, isAnimationActive = true, theme }) => {
  const top10Data = data.slice(0, 10);
  const formatter = title.toLowerCase().includes('value') ? formatCurrency : formatNumber;
  
  const isDark = theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#475569' : '#e2e8f0';
  const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const tooltipBorder = isDark ? '#475569' : '#cbd5e1';

  return (
    <div className="h-96 w-full">
        <h3 className="text-lg font-semibold text-center mb-4 text-slate-700 dark:text-white/80">Top 10 Companies by {title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top10Data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis type="number" tickFormatter={(value) => formatNumber(value as number)} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis dataKey="name" type="category" width={150} tick={{ fill: textColor, fontSize: 12 }}/>
          <Tooltip 
            formatter={(value: number) => formatter(value)}
             contentStyle={{
                backgroundColor: tooltipBg,
                backdropFilter: 'blur(5px)',
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '0.5rem',
                color: textColor
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar dataKey={dataKey} fill="#4c9aff" name={title} isAnimationActive={isAnimationActive} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompanySalesChart;