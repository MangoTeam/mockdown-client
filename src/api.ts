import fetch from 'isomorphic-fetch';
import { IViewBoxJSON, IViewBox } from './types';

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

// function enrichJSON(box: IViewBoxJSON): IViewBox {
//     for (let child in box.children) {
//         enrichJSON(child);
//     }

//     return Object.defineProperties(box, {
//         left: { get(): number { return this.rect[0]; } },
//         right: { get(): number { return this.rect[1]; } },
//         top: { get(): number { return this.rect[2]; } },
//         bottom: { get(): number { return this.rect[3]; } },
//         width: { get(): number { return this.right - this.left; }},
//         height: { get(): number { return this.bottom - this.top; }},
//     });
// }