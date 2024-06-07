import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const mockApiData = {
  "data": {
    "AuthorWorklog": {
      "activityMeta": [
        {
          "label": "PR Open",
          "fillColor": "#EF6B6B"
        },
        {
          "label": "PR Merged",
          "fillColor": "#61CDBB"
        },
        {
          "label": "Commits",
          "fillColor": "#FAC76E"
        },
        {
          "label": "PR Reviewed",
          "fillColor": "#C2528B"
        },
        {
          "label": "PR Comments",
          "fillColor": "#0396A6"
        },
        {
          "label": "Incident Alerts",
          "fillColor": "#5F50A9"
        },
        {
          "label": "Incidents Resolved",
          "fillColor": "#8F3519"
        }
      ],
      "rows": [
        {
          "name": "rishi@devdynamics.ai",
          "totalActivity": [
            {
              "name": "PR Open",
              "value": "1"
            },
            {
              "name": "PR Merged",
              "value": "1"
            },
            {
              "name": "Commits",
              "value": "49"
            },
            {
              "name": "PR Reviewed",
              "value": "19"
            },
            {
              "name": "PR Comments",
              "value": "5"
            },
            {
              "name": "Incident Alerts",
              "value": "2"
            },
            {
              "name": "Incidents Resolved",
              "value": "3"
            }
          ]
        },
        {
          "name": "alex@devdynamics.ai",
          "totalActivity": [
            {
              "name": "PR Open",
              "value": "3"
            },
            {
              "name": "PR Merged",
              "value": "2"
            },
            {
              "name": "Commits",
              "value": "35"
            },
            {
              "name": "PR Reviewed",
              "value": "10"
            },
            {
              "name": "PR Comments",
              "value": "8"
            },
            {
              "name": "Incident Alerts",
              "value": "1"
            },
            {
              "name": "Incidents Resolved",
              "value": "4"
            }
          ]
        }
      ]
    }
  }
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setData(mockApiData);
      setLoading(false);
    }, 1000);
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  // Extract activity metadata
  const activityMeta = data.data.AuthorWorklog.activityMeta.reduce((acc, item) => {
    acc[item.label] = item.fillColor;
    return acc;
  }, {});

  // Extract rows and normalize
  const rows = data.data.AuthorWorklog.rows;

  // Prepare data for plotly
  const activities = rows.flatMap(row =>
    row.totalActivity.map(activity => ({
      developer: row.name,
      activity: activity.name,
      count: parseInt(activity.value, 10),
      color: activityMeta[activity.name],
    }))
  );

  const traces = Object.keys(activityMeta).map(activity => {
    return {
      x: activities.filter(item => item.activity === activity).map(item => item.developer),
      y: activities.filter(item => item.activity === activity).map(item => item.count),
      type: 'bar',
      name: activity,
      marker: { color: activityMeta[activity] },
    };
  });

  const layout = {
    title: 'Developer Activities Throughout the Week',
    barmode: 'stack',
    xaxis: { title: 'Developer' },
    yaxis: { title: 'Activity Count' },
  };

  return <Plot data={traces} layout={layout} />;
};

export default Dashboard;

