export function parsePoints(x) {
  if (!x) return x;
  return x
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function nFormatter(num) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(2).replace(rx, "$1") + item.symbol
    : "0";
}

export function parseRouletteTime(x) {
  return x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function truncate(text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function send(path, body, type) {
  try {
    let sendCfg = {
      method: type ? type : "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    let bodyObject = JSON.stringify(body);

    if (type !== "GET") {
      sendCfg["body"] = bodyObject;
    }

    const response = await fetch(`${this.$domain}${path}`, sendCfg);

    const res = await response.json();

    if (res.error) {
      this.$alert(res.error, "error");
    }

    if (res.success) {
      this.$alert(res.success, "success");
    }

    return res;
  } catch (e) {
    console.log(e);
  }
}

export function alertSweet(value, type, important = false, timeout = 2500) {
  if (important === true) {
    return this.$swal.fire({
      icon: type,
      title: "Uwaga!",
      timerProgressBar: false,
      html: value,
    });
  }

  this.$swal.fire({
    toast: true,
    position: "bottom-start",
    icon: type,
    title: value,
    showConfirmButton: false,
    timer: timeout,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", this.$swal.stopTimer);
      toast.addEventListener("mouseleave", this.$swal.resumeTimer);
    },
  });
}
