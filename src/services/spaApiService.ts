import axios from 'axios';

const API_URL = 'https://hotel-management-system-project01.onrender.com/api/spa';

// Define interfaces for our data objects to use TypeScript benefits
export interface SpaService {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // Duration in minutes
}

export interface Therapist {
  _id?: string;
  name: string;
  specialty: string;
  availability: string[]; // e.g., ['Monday', 'Wednesday']
}

export interface SpaBooking {
  _id?: string;
  service: string; // Should be a service ID
  therapist: string; // Should be a therapist ID
  customer: string;
  startTime: Date;
  endTime: Date;
}

// --- Service Calls ---

export const getSpaServices = async (): Promise<SpaService[]> => {
  const response = await axios.get(`${API_URL}/services`);
  return response.data;
};

export const createSpaService = async (service: SpaService): Promise<SpaService> => {
  const response = await axios.post(`${API_URL}/services`, service);
  return response.data;
};

export const deleteSpaService = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/services/${id}`);
};

export const updateSpaService = async (id: string, service: SpaService): Promise<SpaService> => {
  const response = await axios.put(`${API_URL}/services/${id}`, service);
  return response.data;
};

// --- Therapist Calls ---

export const getTherapists = async (): Promise<Therapist[]> => {
  const response = await axios.get(`${API_URL}/therapists`);
  return response.data;
};

export const createTherapist = async (therapist: Therapist): Promise<Therapist> => {
  const response = await axios.post(`${API_URL}/therapists`, therapist);
  return response.data;
};

export const deleteTherapist = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/therapists/${id}`);
};

// --- Booking Calls ---

export const getSpaBookings = async (): Promise<SpaBooking[]> => {
  const response = await axios.get(`${API_URL}/bookings`);
  return response.data;
};

export const createSpaBooking = async (booking: SpaBooking): Promise<SpaBooking> => {
  const response = await axios.post(`${API_URL}/bookings`, booking);
  return response.data;
};
