import axios from 'axios';

const API_URL = 'http://localhost:5000/api/gym';

// Define interfaces for our data objects
export interface GymMembership {
  _id?: string;
  member: string;
  membershipType: string;
  startDate: Date;
  endDate: Date;
}

export interface Trainer {
  _id?: string;
  name: string;
  specialty: string;
  availability: string[]; // e.g., ['Monday', 'Wednesday']
}

export interface GymBooking {
  _id?: string;
  sessionName: string;
  trainer: string; // Should be a trainer ID
  member: string; // Should be a member ID
  startTime: Date;
  endTime: Date;
}

// --- Membership Calls ---

export const getGymMemberships = async (): Promise<GymMembership[]> => {
  const response = await axios.get(`${API_URL}/memberships`);
  return response.data;
};

export const createGymMembership = async (membership: GymMembership): Promise<GymMembership> => {
  const response = await axios.post(`${API_URL}/memberships`, membership);
  return response.data;
};

// --- Trainer Calls ---

export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await axios.get(`${API_URL}/trainers`);
  return response.data;
};

export const createTrainer = async (trainer: Trainer): Promise<Trainer> => {
  const response = await axios.post(`${API_URL}/trainers`, trainer);
  return response.data;
};

// --- Booking Calls ---

export const getGymBookings = async (): Promise<GymBooking[]> => {
  const response = await axios.get(`${API_URL}/bookings`);
  return response.data;
};

export const createGymBooking = async (booking: GymBooking): Promise<GymBooking> => {
  const response = await axios.post(`${API_URL}/bookings`, booking);
  return response.data;
};
