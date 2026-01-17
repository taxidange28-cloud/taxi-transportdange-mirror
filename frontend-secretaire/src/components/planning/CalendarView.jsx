import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Box } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarView({ missions, onMissionClick }) {
  const events = useMemo(() => {
    return missions.map(mission => {
      const dateStr = mission.date_mission;
      const [heureH, heureM] = mission.heure_prevue.split(':');
      const startDate = new Date(dateStr);
      startDate.setHours(parseInt(heureH), parseInt(heureM), 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);

      let color = '#9e9e9e';
      if (mission.statut === 'brouillon') color = '#FF9800';
      if (mission.statut === 'envoyee' || mission.statut === 'confirmee') color = '#03f488';
      if (mission.statut === 'pec') color = '#F44336';
      if (mission.statut === 'terminee') color = '#4CAF50';

      return {
        id: mission.id,
        title: `${mission.client} - ${mission.adresse_depart}`,
        start: startDate,
        end: endDate,
        resource: mission,
        color: color,
      };
    });
  }, [missions]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
      }
    };
  };

  const handleSelectEvent = (event) => {
    onMissionClick(event.resource);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: 'Suivant',
          previous: 'Précédent',
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
        }}
        culture="fr"
      />
    </Box>
  );
}

export default CalendarView;
