import React from 'react';
import { Poll } from '../../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PollResultsChartProps {
  poll: Poll;
}

const PollResultsChart: React.FC<PollResultsChartProps> = ({ poll }) => {
  // Generate a colorful but consistent palette
  const generateColors = (count: number) => {
    const baseColors = [
      'rgba(138, 43, 226, 0.7)', // Purple
      'rgba(54, 162, 235, 0.7)', // Blue
      'rgba(255, 99, 132, 0.7)', // Pink
      'rgba(75, 192, 192, 0.7)', // Teal
      'rgba(255, 159, 64, 0.7)', // Orange
      'rgba(153, 102, 255, 0.7)', // Purple
    ];
    
    const borderColors = baseColors.map(color => color.replace('0.7', '1'));
    
    // If we need more colors than in our base set, generate them
    if (count > baseColors.length) {
      for (let i = baseColors.length; i < count; i++) {
        const hue = (i * 137) % 360; // Using golden angle to get good distribution
        baseColors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
        borderColors.push(`hsla(${hue}, 70%, 60%, 1)`);
      }
    }
    
    return { 
      backgroundColor: baseColors.slice(0, count),
      borderColor: borderColors.slice(0, count)
    };
  };
  
  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes.length, 0);
  
  const { backgroundColor, borderColor } = generateColors(poll.options.length);
  
  const data = {
    labels: poll.options.map(option => option.text),
    datasets: [
      {
        data: poll.options.map(option => option.votes.length),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = totalVotes ? Math.round((value / totalVotes) * 100) : 0;
            return `${value} votes (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };
  
  // If no votes, show a message
  if (totalVotes === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg text-gray-500 mb-2">No votes yet</p>
        <p className="text-sm text-gray-400">Be the first to vote on this poll!</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold text-gray-800">{totalVotes}</div>
          <div className="text-sm text-gray-500">Total Votes</div>
        </div>
      </div>
    </div>
  );
};

export default PollResultsChart;