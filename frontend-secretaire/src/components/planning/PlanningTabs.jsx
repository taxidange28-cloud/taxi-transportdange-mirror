import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ListView from './ListView';
import CalendarView from './CalendarView';
import TimelineView from './TimelineView';
import ChauffeursView from './ChauffeursView';

function PlanningTabs({ missions, chauffeurs, loading, onMissionClick, filters, onFiltersChange, onRefresh }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tab label="📋 Vue Liste" />
        <Tab label="📅 Calendrier" />
        <Tab label="📊 Timeline" />
        <Tab label="👤 Par Chauffeur" />
      </Tabs>

      {activeTab === 0 && (
        <ListView
          missions={missions}
          chauffeurs={chauffeurs}
          loading={loading}
          onMissionClick={onMissionClick}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onRefresh={onRefresh}
        />
      )}

      {activeTab === 1 && (
        <CalendarView
          missions={missions}
          onMissionClick={onMissionClick}
        />
      )}

      {activeTab === 2 && (
        <TimelineView
          missions={missions}
          onMissionClick={onMissionClick}
          filters={filters}
        />
      )}

      {activeTab === 3 && (
        <ChauffeursView
          missions={missions}
          chauffeurs={chauffeurs}
          onMissionClick={onMissionClick}
        />
      )}
    </Box>
  );
}

export default PlanningTabs;
