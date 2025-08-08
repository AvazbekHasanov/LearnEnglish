import { ref } from 'vue';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export function useTickets() {
  const tickets = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function fetchTickets() {
    loading.value = true;
    error.value = '';

    try {
      const response = await api.get(API_ENDPOINTS.TICKETS, {
        baseURL: 'https://cbu.uz/oz/',
        headers: { Authorization: 'Bearer your-token' }
      });
      tickets.value = response.data;
    } catch (err) {

    } finally {
      loading.value = false;
    }
  }

  return { tickets, loading, error, fetchTickets };
}
