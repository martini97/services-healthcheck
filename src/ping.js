import axios from 'axios';

export default async url => {
  try {
    await axios({
      url: `${url}/_ping`,
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
