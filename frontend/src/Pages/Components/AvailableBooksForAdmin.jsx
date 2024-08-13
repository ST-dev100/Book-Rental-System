import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Fiction', value: 54, color: '#1e88e5' },
  { name: 'Self Help', value: 20, color: '#43a047' },
  { name: 'Business', value: 26, color: '#e53935' },
];

const COLORS = data.map((entry) => entry.color);

const AvailableBooksForAdmin = () => {
  return (
    <Card sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Available Books</Typography>
        <Typography variant="caption">Today</Typography>
      </Box>
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Box>
        {data.map((entry, index) => (
          <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%',
                marginRight: 1,
              }}
            />
            <Typography variant="body2">{entry.name}</Typography>
            <Typography variant="body2" sx={{ marginLeft: 'auto' }}>
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default AvailableBooksForAdmin;
