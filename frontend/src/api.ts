import axios from 'axios';
import type {
    SimulationInput, SimulationOutput,
    MonteCarloRequest, MonteCarloResponse,
    SensitivityRequest, SensitivityResponse,
    StressTestRequest, StressTestResponse,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const simulate = async (data: SimulationInput): Promise<SimulationOutput> => {
    const response = await axios.post<SimulationOutput>(`${API_URL}/simulate`, data);
    return response.data;
};

export const simulateMonteCarlo = async (data: MonteCarloRequest): Promise<MonteCarloResponse> => {
    const response = await axios.post<MonteCarloResponse>(`${API_URL}/simulate/monte-carlo`, data);
    return response.data;
};

export const simulateSensitivity = async (data: SensitivityRequest): Promise<SensitivityResponse> => {
    const response = await axios.post<SensitivityResponse>(`${API_URL}/simulate/sensitivity`, data);
    return response.data;
};

export const simulateStressTest = async (data: StressTestRequest): Promise<StressTestResponse> => {
    const response = await axios.post<StressTestResponse>(`${API_URL}/simulate/stress-test`, data);
    return response.data;
};
