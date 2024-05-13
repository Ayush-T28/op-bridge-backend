import rp from 'request-promise';

class Request {
    url: string;

    private rp: rp.RequestPromiseAPI;

    constructor(url: string) {
        this.url = url;
        this.rp = rp;
    }

    public async post(route: string, params: any, headers: any = {}): Promise<rp.RequestPromise> {
        const opts = {
            method: 'POST',
            url: `${this.url}${route}`,
            headers,
            json: true,
            body: params,
        };
        const data = await this.rp(opts);
        return data;
    }

    public async put(route: string, params: any): Promise<rp.RequestPromise> {
        const opts = {
            method: 'PUT',
            url: `${this.url}/${route}`,
            json: true,
            body: params,
        };
        const data = await this.rp(opts);
        return data;
    }

    public async get(route: string, parse: Boolean = false): Promise<rp.RequestPromise> {
        const opts = {
            method: 'GET',
            url: `${this.url}/${route}`,
        };
        const data = await this.rp(opts);
        if (parse) {
            return JSON.parse(data);
        }
        return data;
    }

    public async delete(route: string): Promise<rp.RequestPromise> {
        const opts = {
            method: 'DELETE',
            url: `${this.url}/${route}`,
        };
        const data = await this.rp(opts);
        return data;
    }

    public async getWithHeader(
        route: string,
        headers: any = {},
        parse: Boolean = false,
    ): Promise<rp.RequestPromise> {
        const opts = {
            method: 'GET',
            url: `${this.url}/${route}`,
            headers,
        };
        const data = await this.rp(opts);
        if (parse) {
            return JSON.parse(data);
        }
        return data;
    }
}

export default Request;
