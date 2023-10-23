export type IsNever<T> = [T] extends [never] ? true : false
export type Split<S extends string, SEP extends string> = string extends S ? string[]
  : S extends `${infer A}${SEP}${infer B}` ? [A, ...(B extends '' ? [] : Split<B, SEP>)]
  : SEP extends '' ? []
  : [S]
export type Join<T extends unknown[], U extends string | number> = T extends [infer F, ...infer R]
  ? R['length'] extends 0 ? `${F & string}`
  : `${F & string}${U}${Join<R, U>}`
  : never
export type Shift<T extends unknown[]> = T extends [unknown, ...infer U] ? U
  : never
export type First<T extends unknown[]> = T extends [infer A, ...infer rest] ? A
  : never
export type Last<T extends unknown[]> = [unknown, ...T][T['length']]
export type Length<T extends readonly unknown[]> = T['length']
export type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false
export type All<T extends unknown[], U> = T extends [infer L, ...infer R]
  ? IsEqual<L, U> extends true ? All<R, U>
  : false
  : true
export type Push<T extends unknown[], U> = [...T, U]
export type Includes<T extends unknown[], U> = T extends [infer A, ...infer B]
  ? IsEqual<A, U> extends true ? true : Includes<B, U>
  : false
export type Tuple = readonly unknown[]
export type Concat<T extends Tuple, U extends Tuple> = [...T, ...U]
export type Filter<T extends unknown[], F> = T extends [infer R, ...infer Rest]
  ? [R] extends [F] ? Filter<Rest, F>
  : [R, ...Filter<Rest, F>]
  : []

export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0 ? I
  : never
export type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0 ? L
  : never
export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never] ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last]
export type TupleToUnion<T extends readonly unknown[]> = T extends Array<infer R> ? R
  : never

export type StringToUnion<T extends string> = T extends `${infer Letter}${infer Rest}`
  ? Letter | StringToUnion<Rest>
  : never

export type StringToArray<T extends string> = T extends `${infer Letter}${infer Rest}`
  ? [Letter, ...StringToArray<Rest>]
  : []
