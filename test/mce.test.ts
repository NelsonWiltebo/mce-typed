// extend imports as needed
import {
    parse
} from 'sicp';
import {
    evaluate, tagged_list_to_record, Environment, scan_out_declarations, list_of_unassigned, extend_environment,
    setup_environment
} from '../src/mce';

let base_env: Environment = setup_environment();

test ('literal', () => {
    expect(evaluate(tagged_list_to_record(parse("5;")), null)).toStrictEqual(5)
});

test ('constant declaration', () => {
    const program = tagged_list_to_record(parse("const x = 5;"));
    const locals = scan_out_declarations(program);
    const unassigneds = list_of_unassigned(locals);
    base_env = extend_environment(
                                locals, unassigneds, base_env);
    evaluate(program, base_env);
    expect(evaluate(tagged_list_to_record(parse("x;")), base_env)).toStrictEqual(5);
});

test ('binary operator combination', () => {
    expect(evaluate(tagged_list_to_record(parse("x + 5;")), base_env)).toStrictEqual(10);
});

test ('function declaration', () => {
    const program = tagged_list_to_record(parse("function sum(x, y) { return x + y; }"));
    const locals = scan_out_declarations(program);
    const unassigneds = list_of_unassigned(locals);
    base_env = extend_environment(
                                locals, unassigneds, base_env);
    expect(evaluate(program, base_env)).toStrictEqual(undefined);
    expect(evaluate(tagged_list_to_record(parse("sum(5, 3);")), base_env)).toStrictEqual(8);
});

test ('conditional', () => {
    expect(evaluate(tagged_list_to_record(parse("x > 120 ? true : false;")), base_env)).toStrictEqual(false);
});