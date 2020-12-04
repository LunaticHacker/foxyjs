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
    const elements = document.querySelectorAll("*[r-onclick]");
    for (let e of elements) {
      const fn = e.getAttribute("r-onclick");
      e.addEventListener("click", this.methods[fn].bind(this.data));
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
