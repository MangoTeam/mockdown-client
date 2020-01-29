import { ILayoutViewTree } from '../views';

import { ConstraintParser } from '../solver'

export class MockdownClient {
    private _host: string;
    private _port: string;
    private _synthesizeEndpoint: string;

    constructor(options: MockdownClient.IOptions) {
        let { host, port } = options;
        host = this._host = host || 'localhost';
        port = this._port = port || '8000';

        this._synthesizeEndpoint = `http://${host}:${port}/api/synthesize`;
    }

    async fetch(examples: Array<ILayoutViewTree.JSON>, dims: [number, number], filter: MockdownClient.SynthType = MockdownClient.SynthType.NONE): Promise<ConstraintParser.IConstraintJSON[]> {
        // console.log(filter);
        const body = JSON.stringify({ 'examples': examples, 'pruning': filter, 'lower': dims[0], 'upper': dims[1]});

        const response = await fetch(this._synthesizeEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        return response.json();
    }
}

export namespace MockdownClient {
    export interface IOptions {
        host?: string
        port?: string
    }
    export enum SynthType {
        NONE = "none",
        BASE = "baseline",
        FANCY = "fancy"
    }
}
