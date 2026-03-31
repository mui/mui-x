async function fetchWithRetry(url, options, retries = 3) {
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            return response;
        }
        throw new Error(`MUI X: Request failed with status ${response.status}`);
    }
    catch (error) {
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
