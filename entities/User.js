export default class {
  guest = false;
  constructor(nickname, password) {
    this.nickname = nickname;
    this.password = password;
  }
  isUser() {
    return this.guest;    }
}