// extend imports as needed
import {
    parse
} from 'sicp';
import {
    evaluate, extend_environment, list_of_unassigned, scan_out_declarations, setup_environment, tagged_list_to_record
} from '../src/mce';


let base_env = setup_environment();

test ('literal', () => {
    expect(evaluate(parse("5;"), null)).toStrictEqual(5)
});

test ('constant declaration', () => {
    const program = parse("const x = 5;");
    const locals = scan_out_declarations(program);
    const unassigneds = list_of_unassigned(locals);
    base_env = extend_environment(
                                locals, unassigneds, base_env);
    evaluate(program, base_env);
    expect(evaluate(parse("x;"), base_env)).toStrictEqual(5);
});

test ('binary operator combination', () => {
    expect(evaluate(parse("x + 5;"), base_env)).toStrictEqual(10);
});

test ('function declaration', () => {
    const program = parse("function sum(x, y) { return x + y; }");
    const locals = scan_out_declarations(program);
    const unassigneds = list_of_unassigned(locals);
    base_env = extend_environment(
                                locals, unassigneds, base_env);
    expect(evaluate(program, base_env)).toStrictEqual(undefined);
    expect(evaluate(parse("sum(5, 3);"), base_env)).toStrictEqual(8);
});

test ('conditional', () => {
    expect(evaluate(parse("x > 120 ? true : false;"), base_env)).toStrictEqual(false);
});

test ('assignment', () => {
    evaluate(parse("x = x - 1;"), base_env);
    expect(evaluate(parse("x;"), base_env)).toStrictEqual(4);
});

test ('high-order function', () => {
    const program = parse("function a(x) {function b(x) {return x > 33 ? b(x - 10) : 2;}return x > 66 ? b(x - 1) : 1;}");
    const locals = scan_out_declarations(program);
    const unassigneds = list_of_unassigned(locals);
    base_env = extend_environment(
                                locals, unassigneds, base_env);
    expect(evaluate(program, base_env)).toStrictEqual(undefined);
    expect(evaluate(parse("a(100);"), base_env)).toStrictEqual(2);
});
