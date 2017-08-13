import axios from 'axios';

export default async ({ url, route }) => {
  route = route || '/_ping';
  const pingUrl = `${url}${route}`;
  try {
    await axios({
      url: `${url}${route}`,
      method: 'get',
    });

    return { status: 200 };
  } catch (e) {
    return {
      status: 500,
      error: e.response && e.response.status,
    };
  }
};
