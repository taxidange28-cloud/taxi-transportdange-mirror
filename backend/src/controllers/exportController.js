const ExportService = require('../services/exportService');

class ExportController {
  // Exporter les missions en Excel
  static async exporterExcel(req, res) {
    try {
      const { debut, fin } = req.query;

      if (!debut || !fin) {
        return res.status(400).json({ error: 'Dates de début et fin requises' });
      }

      const buffer = await ExportService.exporterMissionsExcel(debut, fin);

      // Nom du fichier avec dates
      const filename = `missions_${debut}_${fin}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Erreur export Excel:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = ExportController;
