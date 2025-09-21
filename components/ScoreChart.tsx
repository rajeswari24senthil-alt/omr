
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SubjectScores } from '../types';

interface ScoreChartProps {
  data: SubjectScores;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Sub 1', score: data.subject1, total: 20 },
    { name: 'Sub 2', score: data.subject2, total: 20 },
    { name: 'Sub 3', score: data.subject3, total: 20 },
    { name: 'Sub 4', score: data.subject4, total: 20 },
    { name: 'Sub 5', score: data.subject5, total: 20 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
        <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
        <YAxis domain={[0, 20]} tick={{ fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: '#4b5563',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#f9fafb' }}
          itemStyle={{ color: '#3b82f6' }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af' }}/>
        <Bar dataKey="score" fill="#3b82f6" name="Score per Subject" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;
