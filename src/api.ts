import fetch from 'isomorphic-fetch';

export async function fetchConstraints(
    examples: any,
    endpoint: string = 'localhost',
    port: string = '8000'
): Promise<any> {
    const body = JSON.stringify({
        'examples': examples
    });

    const response = await fetch(`http://${endpoint}:${port}/api/synthesize`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });

    return response.json();
}

