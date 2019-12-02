import { SUPPORTED_MIMES } from '../config/supports';

class BabsiHttp {
  constructor() {
    this.requests = [];
    this.activesRequests = [];
  }

  addRequest(url, callback) {
    console.log('requesting, ', url);
    const that = this;
    const r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.responseType = 'blob';
    r.onreadystatechange = () => {
      if (r.readyState != 4 || r.status != 200) return;
      callback(r.response);
      that.removeActive(url);
    };
    r.send();
    this.requests.push({ url, r, });
    this.activesRequests.push({ url, r, });
  }

  removeActive(url) {
    this.activesRequests.forEach((u, i) => {
      if ( u.url === url ) {
        this.activesRequests = this.activesRequests.splice(i, 1);
      }
    })
  }
}

export default BabsiHttp;
