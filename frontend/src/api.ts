import axios from 'axios';
import type { SimulationInput, SimulationOutput } from './types';

const API_URL = 'http://localhost:8000';

export const simulate = async (data: SimulationInput): Promise<SimulationOutput> => {
    const response = await axios.post<SimulationOutput>(`${API_URL}/simulate`, data);
    return response.data;
};
