interface IResponseType<T> {
    status: boolean
    message: string
    data: T
}
