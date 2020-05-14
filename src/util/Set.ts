export function difference<T>(l: Set<T>, r: Set<T>) {
  const ret = new Set(l);
  for (let elem of r) {
      ret.delete(elem);
  }
  return ret;
}

export function union<T>(l: Set<T>, r: Set<T>) {
  const ret = new Set(l);
  for (let t of r) {
      ret.add(t);
  }
  return ret;
}

export function fold<A, B>(elems: Set<A>, start: B, f: (a: A, b: B) => B): B {
  let ret = start;
  for (let elem of elems) {
      ret = f(elem, ret);
  }
  return ret;
}

export function filter<T>(elems: Set<T>, f: (t:T) => boolean) {
  const out = new Set<T>();
  for (let t of elems){
    if (f(t)) out.add(t);
  }
  return out;
}

export function all<T>(l: Set<T>, f: (t: T) => boolean) {
  return fold(l, true, (t, acc) => acc && f(t));
}

export function any<T>(l: Set<T>, f: (t: T) => boolean) {
  return fold(l, false, (t, acc) => acc || f(t));
}

export function subset<T>(l: Set<T>, r: Set<T>) {
  return all(l, (x) => r.has(x));
}

export function eq<T>(l: Set<T>, r: Set<T>) {
  return subset(l, r) && subset(r, l);
}