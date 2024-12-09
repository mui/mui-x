async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }

    throw new Error(`Request failed with status ${response.status}`);
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fetchWithRetry(url, options, retries - 1));
      }, Math.random() * 3_000);
    });
  }
}

export { fetchWithRetry };
