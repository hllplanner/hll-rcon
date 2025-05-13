class Message {
  client = null;
  name = null;
  contentBody = null;

  populated = false;
  populatedData = null;

  constructor(client, name, contentBody) {
    this.client = client;
    this.name = name;
    this.contentBody = contentBody;

    this.populate();
  }

  populate() {
    if (!this.name) throw new Error('Tried to populate empty message.');

    let ContentBody = this.contentBody || "";
    if (typeof this.contentBody === "object") ContentBody = JSON.stringify(this.contentBody);

    this.populated = true;
    this.populatedData = {
      AuthToken: this.client.authToken || "",
      Version: 2,
      Name: this.name,
      ContentBody
    }
  }

  wrap() {
    if(!this.populated) throw new Error('Tried to wrap unpopulated message.');

    return JSON.stringify(this.populatedData);
  }
}

module.exports = Message;