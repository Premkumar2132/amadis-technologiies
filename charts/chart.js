import React, { useEffect, useState } from 'react';
import { useSharedState } from './sharedstate'; 
import { Spin } from 'antd';
import { Column } from '@ant-design/plots';

const Mainchart = () => {
  const { jsonData, selectedOption, selectedDate, data,loading,fetchDataAndUpdate,updateChart,setUpdateChart, chartId } = useSharedState();
  

  useEffect(() => {
    console.log('jsonData:', jsonData);
    console.log('Fetching and updating data...');
    console.log('the chart Id is :', chartId)
    if (updateChart && (chartId === 'mainChart' || chartId === 'secondaryChart' || chartId === '' || chartId === null)) {
      fetchDataAndUpdate();
      setUpdateChart(false);
    }
  }, [updateChart, selectedDate, chartId]);
  const config = {
    data,
    isStack: true,
    xField: 'date',
    yField: selectedOption === 'COUNT' ? 'count' : 'cost',
    seriesField: 'productCode',
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Column {...config} />
      )}
    </div>
  );
};

export default Mainchart;
