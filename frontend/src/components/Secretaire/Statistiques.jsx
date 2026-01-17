import React, { useState, useEffect } from 'react';
import { getMissions } from '../../services/api';
import Card from '../Common/Card';
import { TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const Statistiques = () => {
  const [stats, setStats] = useState({
    totalMissions: 0,
    missionsTerminees: 0,
    missionsEnCours: 0,
    revenuTotal: 0,
    revenuMoyen: 0,
    tauxReussite: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      
      const response = await getMissions({ date_debut: startDate, date_fin: endDate });
      const missions = response.data;

      const totalMissions = missions.length;
      const missionsTerminees = missions.filter(m => m.statut === 'terminee').length;
      const missionsEnCours = missions.filter(m => m.statut === 'pec').length;
      
      const revenuTotal = missions
        .filter(m => m.statut === 'terminee' && m.prix)
        .reduce((sum, m) => sum + parseFloat(m.prix), 0);
      
      const revenuMoyen = missionsTerminees > 0 ? revenuTotal / missionsTerminees : 0;
      const tauxReussite = totalMissions > 0 ? (missionsTerminees / totalMissions) * 100 : 0;

      setStats({
        totalMissions,
        missionsTerminees,
        missionsEnCours,
        revenuTotal,
        revenuMoyen,
        tauxReussite,
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total missions (ce mois)',
      value: stats.totalMissions,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Missions terminées',
      value: stats.missionsTerminees,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Missions en cours',
      value: stats.missionsEnCours,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Revenu total',
      value: `${stats.revenuTotal.toFixed(2)} €`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Revenu moyen',
      value: `${stats.revenuMoyen.toFixed(2)} €`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Taux de réussite',
      value: `${stats.tauxReussite.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistiques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Statistiques du mois en cours
        </h3>
        <p className="text-gray-600">
          Les statistiques ci-dessus couvrent la période du {format(startOfMonth(new Date()), 'dd MMMM yyyy', { locale: fr })} au {format(endOfMonth(new Date()), 'dd MMMM yyyy', { locale: fr })}.
        </p>
      </Card>
    </div>
  );
};

export default Statistiques;
