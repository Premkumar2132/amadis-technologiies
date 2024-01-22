// SharedStateContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notification } from 'antd';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children, jsonData }) => {
  const [selectedOption, setSelectedOption] = useState('cost');
  const [selectedDate, setSelectedDate] = useState(null);
  const [applyChanges, setApplyChanges] = useState(false);
  const [updateChart, setUpdateChart] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dateRangeApplied, setDateRangeApplied] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [chartId, setChartId] = useState('');

  useEffect(() => {
    if (applyChanges) {
      setApplyChanges(false);
    }
  }, [applyChanges]);

  const fetchDataAndUpdate = async() => {
    try {
        console.log('Fetching data and updating...');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const countData = jsonData.count.map(entry => ({
        date: entry.date,
        productCode: entry.productCode,
        cost: entry.count,
      }));

      const costData = jsonData.cost.map(entry => ({
        date: entry.date,
        productCode: entry.productCode,
        cost: entry.cost,
      }));


      console.log(countData)
      let combinedData = selectedOption === 'count' ? countData : costData;

      if (selectedDate) {
        // Filter data for the selected date range
        combinedData = combinedData.filter(entry => {
          const entryDate = new Date(entry.date);
          const endDate = new Date(selectedDate.endDate);
          endDate.setDate(endDate.getDate() + 1); // Increment the day by 1 to include the end date
          return entryDate >= selectedDate.startDate && entryDate <= endDate;
        });
        if (combinedData.length === 0) {
          setErrorMessage(`No data available for the selected date ${selectedDate}.`);
          setOpen(false);
          return;
        }
      }
      console.log('Fetched data:', combinedData);
      setData(combinedData);
      setDateRangeApplied(true);
    } catch (error) {
      console.error('Error accessing data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (applyChanges) {
      setApplyChanges(false);
      setDateRangeApplied(false); 
      fetchDataAndUpdate();
    }
  }, [applyChanges,selectedDate]);
  const Dates = jsonData.count.map(entry => ({
    date: entry.date,
  }));

  const disabledDates = Dates.map((entry) => new Date(entry.date));


  const disabledDate = (current) => {

    return !disabledDates.some((date) => current.isSame(date, 'day'));
  };

// Correct Usage
const handleDateChange = useCallback((dates) => {
  const startDate = dates?.[0];
  const endDate = dates?.[1];

  console.log('Selected Date Range:', startDate, endDate);

  if (startDate && endDate) {
    setSelectedDate({ startDate, endDate });
  } else {
    notification.error({
      message: 'Invalid Date Range',
      description: 'Please select a valid date range.',
    });
  }
}, [setSelectedDate]);

useEffect(() => {
  // Some effect
}, [handleDateChange]);


  const handleSelectChange = (newOption) => {
    setSelectedOption(newOption);
  };


  const sharedState = {
    selectedOption,
    setSelectedOption,
    selectedDate,
    setSelectedDate,
    applyChanges,
    setApplyChanges,
    errorMessage,
    setErrorMessage,
    data,
    setData,
    loading,
    setLoading,
    open,
    setOpen,
    fetchDataAndUpdate,
    handleSelectChange: (newOption) => {
      setSelectedOption(newOption);
    },
    jsonData,
    disabledDate,
    handleDateChange,
    handleSelectChange,
    dateRangeApplied,
    setDateRangeApplied,
    updateChart,
    setUpdateChart,
    chartId,
    setChartId
  };

  return (
    <SharedStateContext.Provider value={sharedState}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  return useContext(SharedStateContext);
};
