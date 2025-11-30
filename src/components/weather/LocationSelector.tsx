import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, RefreshCw, Clock } from 'lucide-react';
import { Location, WeatherFilters } from '@/types/weather';
import { locationService } from '@/services/weatherService';
import { useToast } from '@/hooks/use-toast';

interface LocationSelectorProps {
  filters: WeatherFilters;
  onFiltersChange: (filters: WeatherFilters) => void;
  lastUpdated?: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function LocationSelector({ 
  filters, 
  onFiltersChange, 
  lastUpdated, 
  onRefresh, 
  isLoading 
}: LocationSelectorProps) {
  const { toast } = useToast();
  const [states] = useState(locationService.getStates());
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (selectedState) {
      const stateDistricts = locationService.getDistricts(selectedState);
      setDistricts(stateDistricts);
      setSelectedDistrict('');
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await locationService.getCurrentLocation();
      onFiltersChange({
        ...filters,
        location
      });
      toast({
        title: "Location detected",
        description: "Using your current location for weather forecast",
      });
    } catch (error) {
      toast({
        title: "Location access denied",
        description: "Please select your location manually",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleManualLocation = () => {
    if (!selectedState || !selectedDistrict) return;
    
    const location: Location = {
      lat: 0, // Mock coordinates
      lon: 0,
      name: `${selectedDistrict}, ${selectedState}`,
      state: selectedState,
      district: selectedDistrict
    };
    
    onFiltersChange({
      ...filters,
      location
    });
  };

  const handleUnitsChange = (key: 'temperature' | 'wind', value: 'C' | 'F' | 'kph' | 'mph') => {
    onFiltersChange({
      ...filters,
      units: {
        ...filters.units,
        [key]: value
      }
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft border">
      <div className="flex flex-col space-y-6">
        {/* Location Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Location</h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
            </Button>
            
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedDistrict} 
                onValueChange={setSelectedDistrict}
                disabled={!selectedState}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleManualLocation}
                disabled={!selectedState || !selectedDistrict}
                className="px-6"
              >
                Set Location
              </Button>
            </div>
          </div>
          
          {filters.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-success" />
              <span className="text-sm text-foreground">{filters.location.name}</span>
            </div>
          )}
        </div>

        {/* Units and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center space-x-3">
              <Label htmlFor="temp-units" className="text-sm font-medium">Temperature:</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="temp-units"
                  checked={filters.units.temperature === 'F'}
                  onCheckedChange={(checked) => handleUnitsChange('temperature', checked ? 'F' : 'C')}
                />
                <span className="text-sm text-muted-foreground">
                  °{filters.units.temperature}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Label htmlFor="wind-units" className="text-sm font-medium">Wind:</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="wind-units"
                  checked={filters.units.wind === 'mph'}
                  onCheckedChange={(checked) => handleUnitsChange('wind', checked ? 'mph' : 'kph')}
                />
                <span className="text-sm text-muted-foreground">
                  {filters.units.wind}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading || !filters.location}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}