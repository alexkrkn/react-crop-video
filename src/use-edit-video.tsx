import axios, { AxiosError } from 'axios';

interface Asset {
  id: string;
  created_at: string;
  duration: null | number;
  ext: string;
  file_mime: string;
  height: number | null;
  input_type: string;
  input_uri: string;
  size_bytes: number;
  status: string;
  width: number | null;
}

const apiRequest = async <B, R>(method: 'GET' | 'POST', url: string, data: B): Promise<R> => {
  if (!import.meta.env.VITE_API_SECRET) {
    throw Error('API secret must be provided (see readme)');
  }
  try {
    const res = await axios({
      url,
      method,
      baseURL: 'https://api.videoapikit.com/v1',
      headers: { 'Authorization': `Bearer ${import.meta.env.VITE_API_SECRET}` },
      data,
    });
    if (!res.data) {
      throw Error('the api request returned an unexpected response');
    }
    return res.data as R;
  } catch (err) {
    console.log((err as AxiosError).toJSON());
    throw Error('the api request failed');
  }
};

export const useEditVideo = () => {

  const createAsset = async (url: string): Promise<Asset> => {
    const res = await apiRequest<{ url: string }, { asset: Asset }>('POST', '/assets', { url });
    return res.asset;
  };

  const crop = async (id: string, x: number, y: number, width: number, height: number): Promise<Asset> => {
    const res = await apiRequest<{ id: string, x: number, y: number, width: number, height: number }, { asset: Asset }>('POST', '/crop', {
      id,
      x,
      y,
      width,
      height,
    });
    return res.asset;
  };

  return { createAsset, crop };

};