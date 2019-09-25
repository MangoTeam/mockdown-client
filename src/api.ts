import fetch from 'isomorphic-fetch';

async function fetchConstraints(
    examples: any,
    endpoint: string = 'localhost:8000',
    port: string = '8000'
): Promise<any> {
    const body = JSON.stringify({
        'examples': examples
    });

    const response = await fetch(`${endpoint}:${port}/api/synthesize`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });

    return response.json();
}

export default {
    fetchConstraints: fetchConstraints
}