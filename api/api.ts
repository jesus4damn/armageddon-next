import axios, {AxiosResponse} from "axios"


export const API = {
    baseUrl: 'https://api.nasa.gov',
    API_KEY: 'E9pMitzwMFuDNh4ElHuYpfoq8IMCBjsYEcsBsydh',
    config: {
        headers: {
            'Content-Type': 'application/json',
        }
    },
    get(path: string): Promise<AxiosResponse> {
        return axios.get(`${path}`, this.config)
    },
    getWithParams(path: string, params: any): Promise<AxiosResponse> {
        return axios.get(this.baseUrl + path, {...this.config, params: {...params}})
    },
}