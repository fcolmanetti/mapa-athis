
import { GraphHopper } from '@graphhopper/directions-api-js-client';

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface ATHISArea {
  id: string;
  name: string;
  coordinates: RoutePoint[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  population: number;
  infrastructure: 'good' | 'poor' | 'inexistent';
}

export class ATHISGraphHopperService {
  private graphhopper: GraphHopper | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeGraphHopper();
  }

  private initializeGraphHopper() {
    try {
      this.graphhopper = new GraphHopper({
        key: this.apiKey,
        host: 'https://graphhopper.com/api/1'
      });
      console.log('GraphHopper ATHIS service initialized');
    } catch (error) {
      console.error('Failed to initialize GraphHopper:', error);
    }
  }

  async calculateRoute(start: RoutePoint, end: RoutePoint) {
    if (!this.graphhopper) {
      throw new Error('GraphHopper not initialized');
    }

    try {
      const response = await this.graphhopper.route({
        points: [[start.lng, start.lat], [end.lng, end.lat]],
        vehicle: 'car',
        instructions: true,
        calc_points: true
      });

      return response;
    } catch (error) {
      console.error('Error calculating route:', error);
      throw error;
    }
  }

  async getOptimalRoute(areas: ATHISArea[]) {
    // Implementar lógica de otimização de rotas para áreas prioritárias
    const priorityOrder = areas.sort((a, b) => {
      const priorityWeight = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
      };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    return priorityOrder;
  }

  getUberabaAreas(): ATHISArea[] {
    return [
      {
        id: 'industrial',
        name: 'Zona Industrial',
        coordinates: [
          { lat: -19.740, lng: -47.940 },
          { lat: -19.740, lng: -47.935 },
          { lat: -19.745, lng: -47.935 },
          { lat: -19.745, lng: -47.940 }
        ],
        priority: 'high',
        population: 12500,
        infrastructure: 'poor'
      },
      {
        id: 'periferia_norte',
        name: 'Periferia Norte',
        coordinates: [
          { lat: -19.755, lng: -47.925 },
          { lat: -19.755, lng: -47.920 },
          { lat: -19.760, lng: -47.920 },
          { lat: -19.760, lng: -47.925 }
        ],
        priority: 'critical',
        population: 8900,
        infrastructure: 'inexistent'
      },
      {
        id: 'centro',
        name: 'Centro Histórico',
        coordinates: [
          { lat: -19.747, lng: -47.932 },
          { lat: -19.747, lng: -47.927 },
          { lat: -19.752, lng: -47.927 },
          { lat: -19.752, lng: -47.932 }
        ],
        priority: 'medium',
        population: 15600,
        infrastructure: 'good'
      }
    ];
  }
}

export default ATHISGraphHopperService;
