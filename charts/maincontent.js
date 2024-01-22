import React from 'react';
import { SharedStateProvider } from './sharedstate';
import Mainchart from './chart';
import jsonData from './data.json'; 
import Modals from './modal';
import SecondaryModal from './secondarymodal';
import Mainmodals from './mainmodal';

const Charts = () => {
  return (
    <div className='maincontent'>
      <SharedStateProvider jsonData={jsonData} chartId="mainChart">
          <Mainmodals/><br/><br/>
          <Modals/><br/><br/>
          <Mainchart/><br/><br/>
      </SharedStateProvider>
      <SharedStateProvider jsonData={jsonData} chartId="secondaryChart">  
          <SecondaryModal/><br/><br/>
          <Mainchart/><br/><br/>
      </SharedStateProvider>
    </div>
  )
}

export default Charts