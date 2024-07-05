import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchUserActivity } from '../services/api';

const GraphiqueActiviteQuotidienne = ({ userId }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const activityResponse = await fetchUserActivity(userId);
        console.log('Fetched Activity Data:', activityResponse);

        const activityData = activityResponse.data; // Accéder à l'objet imbriqué
        console.log('Activity Data:', activityData);

        if (activityData && Array.isArray(activityData.sessions)) {
          console.log('Sessions array:', activityData.sessions);
          setData(activityData.sessions);
        } else {
          console.error('Data format is incorrect:', activityData);
          throw new Error('Data format is incorrect');
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setError(error.message);
      }
    };
    getData();
  }, [userId]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
      <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} className="chart-responsive">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="calories" fill="#ff0000" />
          <Bar dataKey="kilogram" fill="#000000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphiqueActiviteQuotidienne;
