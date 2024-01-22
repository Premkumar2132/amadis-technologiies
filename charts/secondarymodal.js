// Modals.js
import React from 'react';
import { useSharedState } from './sharedstate';
import { Button, Modal, DatePicker, Space, Select, notification } from 'antd';

const SecondaryModal = () => {
  const {
    setLoading,
    setOpen,
    open,
    fetchDataAndUpdate,
    selectedOption,
    setUpdateChart,
    setSelectedOption,
    disabledDate,
    handleDateChange,
    handleSelectChange,
    setChartId,
    loading,
    chartId,
  } = useSharedState();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      await fetchDataAndUpdate();

      notification.success({
        message: 'Charts Updated',
        description: 'Charts have been updated based on the selected date or date range.',
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const applyToAllCharts = () => {
    setChartId(''); 
    setUpdateChart(true);
    notification.success({
      message: 'Charts Update Requested',
      description: 'Charts will be updated based on the selected date or date range after clicking OK.',
    });
  };
  const applyToThisChart = () => {
    setChartId('secondaryChart'); 
    setUpdateChart(true); 
    notification.success({
      message: 'Chart Update Requested',
      description: 'Chart will be updated based on the selected date or date range after clicking OK.',
    });
  };
  const { RangePicker } = DatePicker;

  return (
    <>
      <Button type="primary" onClick={showModal}>
        SECONDARY CHART FILTER 
      </Button>
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="applyToAll" type="primary" loading={loading} onClick={applyToAllCharts}>
            Apply to all charts
          </Button>,
          <Button key="applyToThis" type="primary" loading={loading} onClick={applyToThisChart}>
            Apply to this chart
          </Button>,
        ]}
      >
        <div className="date">
          <Space direction="vertical" size={12}>
            <RangePicker onChange={handleDateChange} disabledDate={disabledDate} format="MMM-DD-YYYY" />
          </Space>
        </div>
        <div>
          <Select
            defaultValue={selectedOption}
            style={{
              width: 120,
            }}
            onChange={handleSelectChange}
            options={[
              {
                value: 'cost',
                label: 'cost',
              },
              {
                value: 'count',
                label: 'count',
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default SecondaryModal;
