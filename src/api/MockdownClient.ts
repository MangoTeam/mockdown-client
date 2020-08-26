import { ILayoutViewTree } from '../views';

import { ConstraintParser } from '../solver';

export type FetchOpts = {
    height: MockdownClient.IBound,
    width: MockdownClient.IBound,
    learningMethod: "simple" | "heuristic" | "noisetolerant"
}

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

    
    // TODO: add 'learningMethod', 'unambig', and 'pruningMethod' to FetchOpts
    async fetch(examples: Array<ILayoutViewTree.POJO>, opts: FetchOpts, unambig: boolean, filter: MockdownClient.SynthType = MockdownClient.SynthType.NONE, timeout: number): Promise<{'constraints': ConstraintParser.IConstraintJSON[], 'axioms': ConstraintParser.IConstraintJSON[]}> {
        // console.log(filter);
        const bounds = {
            'min_w': opts.width.lower,
            'max_w': opts.width.upper,
            'min_h': opts.height.lower,
            'max_h': opts.height.upper,
        };
        // console.log(bounds);
        const body = JSON.stringify({ 'examples': examples, 
            options: {
                'pruning_method': filter, 
                'bounds': bounds, 
                'unambig': unambig,
                'learning_method': opts.learningMethod
        }, timeout: timeout});

        const response = await fetch(this._synthesizeEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (response.status >= 400) {
            // console.log('got an error');
            return Promise.reject('server error');
        }

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
        HIER = "hierarchical"
    }
    export interface IBound {
        lower: number,
        upper: number
    }
}
