import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const PurchaseChart = ({ purchases, offers }) => {
  const processData = () => {
    const offerTitles = offers.reduce((acc, offer) => {
      acc[offer.id] = offer.title;
      return acc;
    }, {});

    const dataByDateAndOffer = purchases.reduce((acc, purchase) => {
      const date = new Date(purchase.purchase_date).toLocaleDateString();
      const offerTitle = offerTitles[purchase.offer.id];
      if (!acc[date]) acc[date] = {};
      if (!acc[date][offerTitle]) acc[date][offerTitle] = 0;
      acc[date][offerTitle] += 1;
      return acc;
    }, {});

    const labels = Object.keys(dataByDateAndOffer).sort((a, b) => new Date(a) - new Date(b));
    const datasets = offers.map((offer, index) => {
      const data = labels.map(label => dataByDateAndOffer[label][offer.title] || 0);
      return {
        label: offer.title,
        data,
        backgroundColor: getFixedColor(index),
        borderColor: getFixedColor(index),
        borderWidth: 1,
        barThickness: 20, // grosseur des barres
      };
    });

    return { labels, datasets };
  };

  const getFixedColor = (index) => {
    const colors = [
      '#383838', // gris
      '#888888', // gris clair 
      '#c8c8c8', // gros tres clair 
    ];
    return colors[index % colors.length];
  };

  const data = processData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="admin-chart-container">
      <h2 className='title-ticket'>Nombre de tickets achetés par jour</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PurchaseChart;
