
import { useState, useEffect, useCallback } from 'react';
import ATHISGraphHopperService, { RoutePoint, ATHISArea } from '@/services/graphhopperService';

export const useGraphHopper = (apiKey: string) => {
  const [service, setService] = useState<ATHISGraphHopperService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [areas, setAreas] = useState<ATHISArea[]>([]);

  useEffect(() => {
    if (apiKey) {
      const graphhopperService = new ATHISGraphHopperService(apiKey);
      setService(graphhopperService);
      setAreas(graphhopperService.getUberabaAreas());
    }
  }, [apiKey]);

  const calculateRoute = useCallback(async (start: RoutePoint, end: RoutePoint) => {
    if (!service) return null;
    
    setIsLoading(true);
    try {
      const route = await service.calculateRoute(start, end);
      setCurrentRoute(route);
      return route;
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const optimizeAreaRoutes = useCallback(async () => {
    if (!service) return null;
    
    try {
      const optimizedAreas = await service.getOptimalRoute(areas);
      return optimizedAreas;
    } catch (error) {
      console.error('Error optimizing routes:', error);
      return null;
    }
  }, [service, areas]);

  return {
    service,
    isLoading,
    currentRoute,
    areas,
    calculateRoute,
    optimizeAreaRoutes
  };
};
