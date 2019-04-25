export default class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.id = Post.incrementId();
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1
    else this.latestId ++
    return this.latestId
  };
};
  