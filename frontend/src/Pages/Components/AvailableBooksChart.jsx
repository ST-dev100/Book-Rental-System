import React,{useState,useEffect} from 'react';
import { Box, Typography, Card } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const AvailableBooks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://book-rental-system-qctq.vercel.app/owner/api/availabooks`, {
          credentials: "include",
        });
        const result = await response.json();
        // console.log(result); // Log the result to inspect the data

        // Convert the value to number
        const processedData = result.map(entry => ({
          ...entry,
          value: Number(entry.value) // Convert string value to number
        }));

        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 

  const COLORS = data.map((entry) => entry.color);
   
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

export default AvailableBooks;
