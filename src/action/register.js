class RegisterAction {
  constructor(client, store, grpc, nav, notification, clipboard) {
    this._client = client;
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
    this._clipboard = clipboard;
  }

  async init(wallet) {
    if (!this._store.settings.authentication.username) {
      this._nav.goRegister();
    } else {
      this._client.setAuthentication();
      await wallet.init();
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

  async register() {
    await this._client.register();
  }
}

export default RegisterAction;
