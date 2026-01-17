import React, { useState, useEffect } from 'react';
import { getMissions } from '../../services/api';
import Card from '../Common/Card';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const Dashboard = () => {
  const [stats, setStats] = useState({
    today: 0,
    inProgress: 0,
    completed: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await getMissions({ date_debut: today, date_fin: today });
      const missions = response.data;

      const todayCount = missions.length;
      const inProgressCount = missions.filter(m => m.statut === 'pec').length;
      const completedCount = missions.filter(m => m.statut === 'terminee').length;
      const totalRevenue = missions
        .filter(m => m.statut === 'terminee')
        .reduce((sum, m) => sum + (parseFloat(m.prix) || 0), 0);

      setStats({
        today: todayCount,
        inProgress: inProgressCount,
        completed: completedCount,
        revenue: totalRevenue,
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Missions du jour',
      value: stats.today,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'En cours',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Terminées',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.revenue.toFixed(2)} €`,
      icon: XCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Secrétaire</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vue d'ensemble</h3>
        <p className="text-gray-600">
          Bienvenue dans votre espace de gestion Transport DanGE. Utilisez le menu pour créer de nouvelles missions,
          consulter la liste complète ou voir les statistiques détaillées.
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;
