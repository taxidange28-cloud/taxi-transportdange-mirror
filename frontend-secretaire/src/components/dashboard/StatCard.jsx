import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function StatCard({ title, count, color, icon, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        background:  `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `3px solid ${color}`, // ✅ 2px → 3px (plus visible)
        borderRadius: 2, // ✅ Ajout de coins arrondis pour un look moderne
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-3px)', // ✅ -2px → -3px (effet hover plus prononcé)
          boxShadow: 4, // ✅ 3 → 4 (ombre plus visible au survol)
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 1, px: 1.5 }}> {/* ✅ py: 0.75 → 1, px: 1 → 1.5 (meilleur équilibre) */}
        <Typography variant="h2" sx={{ fontSize: '1rem', mb: 0.5, color: color }}> {/* ✅ 0.75rem → 1rem (icône plus visible), ajout color */}
          {icon}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: color, mb: 0.25, fontSize: '1.5rem' }}> {/* ✅ 1rem → 1.5rem (nombre plus lisible) */}
          {count}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}> {/* ✅ 0.625rem → 0.75rem (titre plus lisible) */}
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text. disabled', fontSize: '0.625rem', mt: 0.5, display: 'block' }}> {/* ✅ 0.5rem → 0.625rem, mt: 0.25 → 0.5 (meilleur espacement) */}
          Cliquer pour voir le détail
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard;
