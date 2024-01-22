import React from 'react';
import { useSharedState } from './sharedstate'; 
import { Button, Modal, DatePicker, Space, Select, notification } from 'antd';

const Mainmodals = () => {
  const { setLoading, setOpen, setChartId,open, fetchDataAndUpdate, selectedOption, setUpdateChart, disabledDate,handleDateChange,handleSelectChange, loading } = useSharedState();

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
  

  const { RangePicker } = DatePicker;

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Main Filter
      </Button>
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={applyToAllCharts}>
            Apply to all charts
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

export default Mainmodals;
