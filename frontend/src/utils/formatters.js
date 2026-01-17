import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  try {
    return format(new Date(date), formatStr, { locale: fr });
  } catch (error) {
    return date;
  }
};

export const formatDateTime = (date, time) => {
  try {
    const dateTime = new Date(`${date}T${time}`);
    return format(dateTime, 'dd/MM/yyyy HH:mm', { locale: fr });
  } catch (error) {
    return `${date} ${time}`;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
