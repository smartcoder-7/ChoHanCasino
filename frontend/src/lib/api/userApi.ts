import { FormData } from '../../data/models/FormData';
import { fetchWithErrorHandling } from '../fetch';

export async function apiGetAllUserData() {
  return await fetchWithErrorHandling<null, Array<FormData>>({
    endpoint: '/user',
    method: 'get',
  });
}

export async function apiPostUserData(input: FormData) {
  return await fetchWithErrorHandling<null, FormData>({
    endpoint: '/customer-support',
    jsonBody: input,
    method: 'post',
  });
}
