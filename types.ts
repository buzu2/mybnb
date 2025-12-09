
export interface Amenity {
  id: string;
  label: string;
  icon: string; // key for icon component
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl: string;
  gallery: string[];
  videoUrl?: string; // Optional video URL
  amenities: string[]; // List of amenity IDs
  availableDates: DateRange[];
  isFeatured: boolean;
}

export const BRAND_COLORS = {
  primary: '#d65066',
  secondary: '#e8a633',
};
