class AuthenticationAction {
  constructor(client, store, grpc, nav, notification, clipboard) {
    this._client = client;
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
    this._clipboard = clipboard;
  }

  async init() {
    let { username, jwt } = this._store.settings.authentication;

    if (!username) {
      this._nav.goRegister();
    } else if (!jwt) {
      this._nav.goSignIn();
    } else {
      await this._client
        .setAuthentication()
        .catch(({ status }) => {
          if (status === 401) {
            this._client.clearAuthentication();
            this._nav.goSignIn();
          }
        })
        .then(() => this._nav.goHome());
    }
  }

  setPassword({ password }) {
    this._store.settings.authentication.password = password;
  }

  setPasswordVerify({ passwordVerify }) {
    this._store.settings.authentication.passwordVerify = passwordVerify;
  }

  setEmail({ email }) {
    this._store.settings.authentication.email = email;
  }

  setUsername({ username }) {
    this._store.settings.authentication.username = username;
  }

  async signIn() {
    let { username, password } = this._store.settings.authentication;
    return this._client
      ._updateJWT(username, password)
      .then(() => this._nav.goHome());
  }

  async register() {
    await this._client.register();
  }
}

export default AuthenticationAction;
