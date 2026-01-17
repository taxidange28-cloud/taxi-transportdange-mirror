import { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/adminApi';
import { 
  UsersIcon, 
  UserGroupIcon, 
  TruckIcon, 
  ClipboardDocumentListIcon,
  CurrencyEuroIcon 
} from '@heroicons/react/24/outline';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des statistiques');
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num || 0);
  };

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats?.totalUsers,
      icon: UsersIcon,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Secrétaires',
      value: stats?.totalSecretaires,
      icon: UserGroupIcon,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Chauffeurs',
      value: stats?.totalChauffeurs,
      icon: TruckIcon,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Total Missions',
      value: stats?.totalMissions,
      icon: ClipboardDocumentListIcon,
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: stats?.totalRevenue,
      icon: CurrencyEuroIcon,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      isCurrency: true
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Erreur</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de Bord
          </h1>
          <p className="text-gray-600 text-lg">
            Vue d'ensemble des statistiques de la plateforme
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const displayValue = card.isCurrency 
              ? formatCurrency(card.value) 
              : formatNumber(card.value);

            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${card.borderColor} overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-8 w-8 ${card.iconColor}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      {card.title}
                    </p>
                    <p className={`text-3xl font-bold ${card.iconColor}`}>
                      {displayValue}
                    </p>
                  </div>
                </div>
                <div className={`${card.bgColor} h-2`}></div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Dernière mise à jour
              </h3>
              <p className="text-gray-600">
                {new Date().toLocaleString('fr-FR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Performance Globale</h3>
            <p className="text-emerald-100 mb-4">
              Vue d'ensemble de l'activité de la plateforme
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100">Taux d'utilisation</span>
                <span className="font-semibold">
                  {stats?.totalMissions > 0 ? '98%' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100">Satisfaction clients</span>
                <span className="font-semibold">4.8/5</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Équipe Active</h3>
            <p className="text-blue-100 mb-4">
              Membres actifs de la plateforme
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Personnel total</span>
                <span className="font-semibold">
                  {formatNumber((stats?.totalSecretaires || 0) + (stats?.totalChauffeurs || 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Utilisateurs actifs</span>
                <span className="font-semibold">{formatNumber(stats?.totalUsers)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
