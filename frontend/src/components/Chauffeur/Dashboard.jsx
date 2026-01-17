import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMissionsChauffeur } from '../../services/api';
import Card from '../Common/Card';
import { Calendar, Clock, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import useGeolocation from '../../hooks/useGeolocation';
import locationService from '../../services/locationService';

const Dashboard = () => {
  const { user } = useAuth();
  const { position, error: gpsError, isTracking, startTracking, stopTracking } = useGeolocation();
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    startTracking();
    locationService.startTracking();

    return () => {
      stopTracking();
      locationService.stopTracking();
    };
  }, [startTracking, stopTracking]);

  useEffect(() => {
    if (position && isTracking) {
      locationService.updatePosition(position);
    }
  }, [position, isTracking]);

  const loadStats = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
      
      const response = await getMissionsChauffeur(user.id, {
        date_debut: today,
        date_fin: nextWeek,
      });

      const missions = response.data;
      const todayMissions = missions.filter(m => m.date_mission === today);
      const pendingCount = missions.filter(m => m.statut === 'envoyee' || m.statut === 'confirmee').length;
      const inProgressCount = missions.filter(m => m.statut === 'pec').length;
      const completedCount = missions.filter(m => m.statut === 'terminee').length;

      setStats({
        today: todayMissions.length,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Missions aujourd\'hui',
      value: stats.today,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'En attente',
      value: stats.pending,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
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
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isTracking && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <Navigation className="w-4 h-4" />
          <span className="font-semibold text-sm">GPS Actif</span>
          {position && (
            <span className="text-xs opacity-90">
              ±{Math.round(position.accuracy)}m
            </span>
          )}
        </div>
      )}

      {gpsError && (
        <div className="fixed top-20 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{gpsError}</span>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Chauffeur</h2>
      <p className="text-gray-600 mb-6">Bienvenue, {user?.nom || user?.username}!</p>
      
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
          Consultez vos missions dans le menu "Mes Missions". Vous pouvez confirmer la réception,
          prendre en charge et terminer vos missions directement depuis l'application.
        </p>
        {isTracking && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>🛰️ Géolocalisation activée :</strong> Votre position est partagée avec le dispatching en temps réel.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
