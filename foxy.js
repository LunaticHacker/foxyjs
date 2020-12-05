const data = {
  name: "John",
  place: "Earth",
  friends: [{ name: "Jamie" }],
};
const methods = {
  fn: function () {
    this.friends.push({ name: "Jane" });
  },
};
class Foxy {
  constructor(selector) {
    const txt = document.querySelector(selector).innerHTML;
    this.template = Handlebars.compile(txt);
    this.handler = {
      set: (target, prop, receiver) => {
        Reflect.set(target, prop, receiver);
        this.render();
        return true;
      },
      get: (target, prop) => {
        if (target[prop] instanceof Array) {
          return new Proxy(target[prop], this.handler);
        } else return target[prop];
      },
    };
  }

  registerData(data) {
    this.data = new Proxy(data, this.handler);
  }
  registerMethods(methods) {
    if (methods) {
      this.methods = methods;
    }
    var nodesSnapshot = document.evaluate(
      '//*/attribute::*[starts-with(name(), "f-")]',
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
      const element = nodesSnapshot.snapshotItem(i).ownerElement;
      const name = nodesSnapshot.snapshotItem(i).name;
      const eventname = name.substring(2);
      const fn = element.getAttribute(name);
      element.addEventListener(eventname, this.methods[fn].bind(this.data));
    }
  }
  set(arg, value) {
    this.data[arg] = value;
  }
  render() {
    document.body.innerHTML = this.template(this.data);
    this.registerMethods();
  }
}
const f = new Foxy("body");
f.registerData(data);
f.registerMethods(methods);
f.render();
