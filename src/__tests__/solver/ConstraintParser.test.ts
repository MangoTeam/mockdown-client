import {
    ConstraintParser, ILayoutSolver
} from '../..';
import VariableMap = ILayoutSolver.VariableMap;

import { Variable, Strength } from 'kiwi.js';

// Note: none of these tests really check that constraints are parsed
// *correctly* because kiwi's Constraint type is really janky to work with.

describe(ConstraintParser, () => {

    test(`does not crash parsing simple constraints.`, () => {
        const variableMap: VariableMap = new Map([
            ["foo.right", new Variable("foo.right")],
            ["bar.left", new Variable("bar.left")],
        ])

        const parser = new ConstraintParser(variableMap);

        expect(() => {
            parser.parse({
                y: "foo.right",
                op: "<=",
                a: 1,
                x: "bar.left",
                b: 0
            });
        }).not.toThrowError();

        expect(() => {
            parser.parse({
                y: "foo.right",
                op: ">=",
                a: 1,
                x: "bar.left",
                b: 0
            }, Strength.medium);
        }).not.toThrowError();
    });

    test(`does not crash parsing a constraint missing a and b.`, () => {
        const variableMap: VariableMap = new Map([
            ["foo.right", new Variable("foo.right")],
            ["bar.left", new Variable("bar.left")],
        ])

        const parser = new ConstraintParser(variableMap);

        const json = {
            y: "foo.right",
            op: "==",
            x: "bar.left"
        };

        expect(() => {
            parser.parse(json);
        }).not.toThrowError();
    });

    test(`does not crash parsing all operator forms.`, () => {
        const variableMap: VariableMap = new Map([
            ["foo.right", new Variable("foo.right")],
            ["bar.left", new Variable("bar.left")],
        ])

        const parser = new ConstraintParser(variableMap);

        expect(() => {
            parser.parse({y: "foo.right", op: "=", x: "bar.left"});
        }).not.toThrowError();

        expect(() => {
            parser.parse({y: "foo.right", op: "==", x: "bar.left"});
        }).not.toThrowError();

        expect(() => {
            parser.parse({y: "foo.right", op: "≥", x: "bar.left"});
        }).not.toThrowError();

        expect(() => {
            parser.parse({y: "foo.right", op: ">=", x: "bar.left"});
        }).not.toThrowError();

        expect(() => {
            parser.parse({y: "foo.right", op: "≤", x: "bar.left"});
        }).not.toThrowError();

        expect(() => {
            parser.parse({y: "foo.right", op: "<=", x: "bar.left"});
        }).not.toThrowError();
    });

    test(`crashes parsing a constraint with an undefined variable.`, () => {
        const variableMap: VariableMap = new Map([
            ["foo.right", new Variable("foo.right")]
        ]);

        const parser = new ConstraintParser(variableMap);

        expect(() => {
            parser.parse({y: "foo.right", op: ">=", x: "bar.left"});
        }).toThrowError();

        expect(() => {
            parser.parse({y: "bar.left", op: "<=", x: "foo.right"});
        }).toThrowError();
    });

    test(`crashes parsing a constraint with a nonsense operator.`, () => {
        const variableMap: VariableMap = new Map([
            ["foo.right", new Variable("foo.right")],
            ["bar.left", new Variable("bar.left")]
        ]);

        const parser = new ConstraintParser(variableMap);

        expect(() => {
            parser.parse({y: "foo.right", op: "~", x: "bar.left"});
        }).toThrowError();
    });
});
