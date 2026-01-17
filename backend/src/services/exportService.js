const ExcelJS = require('exceljs');
const Mission = require('../models/Mission');

class ExportService {
  // Exporter les missions en Excel
  static async exporterMissionsExcel(dateDebut, dateFin) {
    try {
      // Récupérer les missions
      const missions = await Mission.findAll({
        date_debut: dateDebut,
        date_fin: dateFin,
      });

      // Créer un nouveau workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Missions');

      // Définir les colonnes
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Heure', key: 'heure', width: 10 },
        { header: 'Client', key: 'client', width: 25 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Départ', key: 'depart', width: 30 },
        { header: 'Arrivée', key: 'arrivee', width: 30 },
        { header: 'Chauffeur', key: 'chauffeur', width: 15 },
        { header: 'Statut', key: 'statut', width: 12 },
        { header: 'Heure PEC', key: 'heure_pec', width: 18 },
        { header: 'Heure Dépose', key: 'heure_depose', width: 18 },
        { header: 'Durée (min)', key: 'duree', width: 12 },
        { header: 'Commentaire', key: 'commentaire', width: 40 },
      ];

      // Formater l'en-tête
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' }, // Vert Transport DanGE
      };
      worksheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

      // Ajouter les données
      missions.forEach(mission => {
        const statutLabels = {
          'brouillon': 'Brouillon',
          'envoyee': 'Envoyée',
          'confirmee': 'Confirmée',
          'pec': 'En cours',
          'terminee': 'Terminée',
        };

        worksheet.addRow({
          date: this.formatDate(mission.date_mission),
          heure: mission.heure_prevue,
          client: mission.client,
          type: mission.type,
          depart: mission.adresse_depart,
          arrivee: mission.adresse_arrivee,
          chauffeur: mission.chauffeur_nom || '-',
          statut: statutLabels[mission.statut] || mission.statut,
          heure_pec: mission.heure_pec ? this.formatDateTime(mission.heure_pec) : '-',
          heure_depose: mission.heure_depose ? this.formatDateTime(mission.heure_depose) : '-',
          duree: mission.duree_minutes ? Math.round(mission.duree_minutes) : '-',
          commentaire: mission.commentaire_chauffeur || '',
        });
      });

      // Appliquer des bordures
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      // Générer le buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      console.error('Erreur export Excel:', error);
      throw error;
    }
  }

  // Formater une date
  static formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Formater une date et heure
  static formatDateTime(datetime) {
    if (!datetime) return '';
    const d = new Date(datetime);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}

module.exports = ExportService;
