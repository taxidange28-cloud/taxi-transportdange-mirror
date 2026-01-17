const { query } = require('../config/database');

class Mission {
  // Créer une mission
  static async create(missionData) {
    console.log('📝 Mission.create called with:', JSON.stringify(missionData, null, 2));
    
    const {
      date_mission,
      heure_prevue,
      client,
      client_telephone = null,
      type,
      adresse_depart,
      adresse_arrivee,
      nombre_passagers = 1,
      prix_estime = null,
      chauffeur_id = null,
      vehicule_id = null,
      notes = '',
      statut = 'brouillon'
    } = missionData;

    // Convert prix_estime to proper format with validation
    let prixEstimeValue = null;
    if (prix_estime != null) {
      const parsed = parseFloat(prix_estime);
      prixEstimeValue = !isNaN(parsed) ? parsed : null;
    }
    
    let nombrePassagersValue = 1;
    if (nombre_passagers != null) {
      const parsed = parseInt(nombre_passagers);
      nombrePassagersValue = !isNaN(parsed) ? parsed : 1;
    }
    
    console.log('📝 Processed values:');
    console.log('  - prix_estime:', prixEstimeValue, typeof prixEstimeValue);
    console.log('  - nombre_passagers:', nombrePassagersValue, typeof nombrePassagersValue);
    console.log('  - client_telephone:', client_telephone);

    try {
      const result = await query(
        `INSERT INTO missions 
         (date_mission, heure_prevue, client, client_telephone, type, 
          adresse_depart, adresse_arrivee, nombre_passagers, prix_estime,
          chauffeur_id, vehicule_id, notes, statut)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [date_mission, heure_prevue, client, client_telephone, type,
         adresse_depart, adresse_arrivee, nombrePassagersValue, prixEstimeValue,
         chauffeur_id, vehicule_id, notes, statut]
      );
      
      console.log('✅ Mission inserted successfully:', result.rows[0].id);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Database INSERT error:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error detail:', error.detail);
      throw error;
    }
  }

  // Récupérer toutes les missions avec filtres
  static async findAll(filters = {}) {
    let queryText = `
      SELECT m.*, 
             c.nom as chauffeur_nom, 
             c.username as chauffeur_username,
             v.immatriculation as vehicule_immatriculation
      FROM missions m
      LEFT JOIN chauffeurs c ON m.chauffeur_id = c.id
      LEFT JOIN vehicules v ON m.vehicule_id = v.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.date_debut) {
      queryText += ` AND m.date_mission >= $${paramCount}`;
      params.push(filters.date_debut);
      paramCount++;
    }

    if (filters.date_fin) {
      queryText += ` AND m.date_mission <= $${paramCount}`;
      params.push(filters.date_fin);
      paramCount++;
    }

    if (filters.chauffeur_id) {
      queryText += ` AND m.chauffeur_id = $${paramCount}`;
      params.push(filters.chauffeur_id);
      paramCount++;
    }

    if (filters.statut) {
      queryText += ` AND m.statut = $${paramCount}`;
      params.push(filters.statut);
      paramCount++;
    }

    queryText += ' ORDER BY m.date_mission, m.heure_prevue';

    const result = await query(queryText, params);
    return result.rows;
  }

  // Récupérer une mission par ID
  static async findById(id) {
    const result = await query(
      `SELECT m.*, 
              c.nom as chauffeur_nom, 
              c.username as chauffeur_username,
              v.immatriculation as vehicule_immatriculation,
              v.modele as vehicule_modele
       FROM missions m
       LEFT JOIN chauffeurs c ON m.chauffeur_id = c.id
       LEFT JOIN vehicules v ON m.vehicule_id = v.id
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Récupérer les missions d'un chauffeur (envoyées seulement)
  static async findByChauffeur(chauffeurId, filters = {}) {
    let queryText = `
      SELECT m.*, 
             c.nom as chauffeur_nom,
             v.immatriculation as vehicule_immatriculation,
             v.modele as vehicule_modele
      FROM missions m
      LEFT JOIN chauffeurs c ON m.chauffeur_id = c.id
      LEFT JOIN vehicules v ON m.vehicule_id = v.id
      WHERE m.chauffeur_id = $1 AND m.statut != 'brouillon'
    `;
    const params = [chauffeurId];
    let paramCount = 2;

    if (filters.date_debut) {
      queryText += ` AND m.date_mission >= $${paramCount}`;
      params.push(filters.date_debut);
      paramCount++;
    }

    if (filters.date_fin) {
      queryText += ` AND m.date_mission <= $${paramCount}`;
      params.push(filters.date_fin);
      paramCount++;
    }

    queryText += ' ORDER BY m.date_mission, m.heure_prevue';

    const result = await query(queryText, params);
    return result.rows;
  }

  // Mettre à jour une mission
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const queryText = `
      UPDATE missions 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(queryText, values);
    return result.rows[0];
  }

  // Supprimer une mission
  static async delete(id) {
    await query('DELETE FROM missions WHERE id = $1', [id]);
  }

  // Envoyer une mission (changer statut à envoyée)
  static async envoyer(id) {
    const result = await query(
      `UPDATE missions 
       SET statut = 'envoyee', envoyee_le = CURRENT_TIMESTAMP
       WHERE id = $1 AND statut = 'brouillon'
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Envoyer toutes les missions d'une date
  static async envoyerParDate(date) {
    const result = await query(
      `UPDATE missions 
       SET statut = 'envoyee', envoyee_le = CURRENT_TIMESTAMP
       WHERE date_mission = $1 AND statut = 'brouillon'
       RETURNING *`,
      [date]
    );
    return result.rows;
  }

  // Confirmer réception (chauffeur)
  static async confirmer(id) {
    const result = await query(
      `UPDATE missions 
       SET statut = 'confirmee', confirmee_le = CURRENT_TIMESTAMP
       WHERE id = $1 AND statut = 'envoyee'
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Prise en charge (PEC)
  static async priseEnCharge(id) {
    const result = await query(
      `UPDATE missions 
       SET statut = 'pec', heure_pec = CURRENT_TIMESTAMP
       WHERE id = $1 AND statut IN ('envoyee', 'confirmee')
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Terminer mission
  static async terminer(id) {
    const result = await query(
      `UPDATE missions 
       SET statut = 'terminee', heure_depose = CURRENT_TIMESTAMP
       WHERE id = $1 AND statut = 'pec'
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Ajouter commentaire chauffeur
  static async ajouterCommentaire(id, commentaire) {
    const result = await query(
      `UPDATE missions 
       SET commentaire_chauffeur = $1
       WHERE id = $2
       RETURNING *`,
      [commentaire, id]
    );
    return result.rows[0];
  }
}

module.exports = Mission;
