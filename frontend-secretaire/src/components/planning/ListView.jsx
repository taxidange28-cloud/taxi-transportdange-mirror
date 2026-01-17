import React from 'react';
import Planning from '../Planning';

function ListView({ missions, chauffeurs, loading, onMissionClick, filters, onFiltersChange, onRefresh }) {
  return (
    <Planning
      missions={missions}
      chauffeurs={chauffeurs}
      loading={loading}
      onMissionClick={onMissionClick}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onRefresh={onRefresh}
    />
  );
}

export default ListView;
