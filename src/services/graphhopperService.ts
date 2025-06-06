
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
  private apiKey: string;
  private baseUrl: string = 'https://graphhopper.com/api/1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('GraphHopper ATHIS service initialized');
  }

  async calculateRoute(start: RoutePoint, end: RoutePoint) {
    if (!this.apiKey) {
      throw new Error('GraphHopper API key not provided');
    }

    try {
      const response = await fetch(`${this.baseUrl}/route?` + new URLSearchParams({
        point: `${start.lat},${start.lng}`,
        point: `${end.lat},${end.lng}`,
        vehicle: 'car',
        instructions: 'true',
        calc_points: 'true',
        key: this.apiKey
      }));

      if (!response.ok) {
        throw new Error(`GraphHopper API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
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
