const fetcher = (request: RequestInfo) => fetch(request).then(res => res.json())

export default fetcher