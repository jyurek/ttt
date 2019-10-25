export type Either<E, R> = ['left', E] | ['right', R]
export const Either = {
    left: <T>(data: T): Either<T, any> => ['left', data],
    right: <T>(data: T): Either<any, T> => ['right', data],
}

export interface Err {
    error: boolean
    message: string
}
