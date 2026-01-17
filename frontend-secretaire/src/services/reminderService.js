import { format, addDays } from 'date-fns';

export const checkShouldShowReminder = (missions) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (currentHour < 18) {
    return { show: false, missions: [] };
  }

  const today = format(now, 'yyyy-MM-dd');
  const reminderKey = `reminder_dismissed_${today}`;
  const dismissed = localStorage.getItem(reminderKey);
  
  if (dismissed === 'true') {
    return { show: false, missions: [] };
  }

  const tomorrow = format(addDays(now, 1), 'yyyy-MM-dd');
  
  const tomorrowDraftMissions = missions.filter(m => 
    m.date_mission === tomorrow && m.statut === 'brouillon'
  );

  if (tomorrowDraftMissions.length === 0) {
    return { show: false, missions: [] };
  }

  return { show: true, missions: tomorrowDraftMissions, date: tomorrow };
};

export const dismissReminderForToday = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const reminderKey = `reminder_dismissed_${today}`;
  localStorage.setItem(reminderKey, 'true');
};
