import React from 'react';
import { Card, CardContent, Typography, Box, Select, MenuItem } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'May', current: 240000, previous: 180000 },
  { name: 'Jun', current: 260000, previous: 220000 },
  { name: 'Jul', current: 180000, previous: 190000 },
  { name: 'Aug', current: 240000, previous: 170000 },
  { name: 'Sep', current: 220000, previous: 180000 },
  { name: 'Oct', current: 240000, previous: 160000 },
];

const EarningSummary = () => {
  return (
    <Card sx={{ maxWidth: 800, m: 2, boxShadow: 3, borderRadius: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Earning Summary
          </Typography>
          <Select
            value="Mar 2022 - Oct 2024"
            size="small"
            sx={{ minWidth: 200, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' } }}
          >
            <MenuItem value="Mar 2022 - Oct 2024">Mar 2022 - Oct 2024</MenuItem>
          </Select>
        </Box>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `${value / 1000}k`}
                ticks={[0, 100000, 200000, 300000]}
                domain={[0, 300000]}
                tickCount={4}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="current" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorCurrent)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="previous" 
                stroke="#9ca3af" 
                strokeDasharray="5 5" 
                fill="none" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Typography variant="body2" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6', display: 'inline-block', mr: 1 }} />
            Current Year
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9ca3af', display: 'inline-block', mr: 1 }} />
            Previous Year
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EarningSummary;
