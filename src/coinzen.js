import { COINZEN_API_ROOT } from './config';

class Client {
  constructor(store, grpc, db, notify) {
    this._store = store;
    this._grpc = grpc;
    this._db = db;
    this._notify = notify;
    let { jwt } = this._store.settings.authentication;

    if (jwt) {
      this.jwt = jwt;
      console.log(this.jwt);
    }

    this.options = {
      // eslint-disable-next-line no-undef
      headers: new Headers({ Accept: 'application/json' }),
    };
  }

  setAuthentication() {
    //  TODO: Ensure not expired

    let { jwt } = this._store.settings.authentication;

    if (jwt) {
      this.jwt = jwt;
    }
  }

  async register() {
    let { username, password, email } = this._store.settings.authentication;
    let data = { username, email, password, organization_set: [] };

    return await this._fetchPost('register/', data)
      .then(() => this._updateJWT(username, password))
      .then(console.log);
  }

  async _updateJWT(username, password) {
    let {
      json: { token },
    } = await this._fetchPost('jwt/', { username, password });
    this._store.settings.authentication.jwt = token;
    this._db.save();
  }

  async _fetchPost(path, data) {
    return await this._fetch(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  _apiHeaders() {
    let headers = {
      'Content-Type': 'application/json',
    };
    if (this.jwt) {
      headers['Authorization'] = `JWT ${this.jwt}`;
    }

    return headers;
  }

  _fetch(path, opts) {
    let url = `${COINZEN_API_ROOT}/${path}`;
    return fetch(url, { headers: this._apiHeaders(), ...opts })
      .then(response =>
        response.text().then(text => ({
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          body: text,
        }))
      )
      .then(({ status, statusText, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return Promise.reject(statusText);
        }
        return Promise.resolve({ status, headers, body, json });
      });
  }

  async registerPeer() {
    let jwt = this.jwt;
    let payload = await this._grpc.sendCommand('SignMessage', {
      msg: Buffer.from(jwt, 'utf8'),
    });
    payload['token'] = jwt;

    return this._fetchPost('peers/register/', payload);
  }
}

export { Client };
