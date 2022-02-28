import axios from "services";
import { message } from "antd";

export function numberFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

export function handleDownload(url, name = null) {
  name
    ? message.info(`Downloading "${name}"`)
    : alert.info(`Downloading file...`);
  axios
    .get(url, {
      responseType: "blob",
    })
    .then((response) => {
      // if filename is not set, get filename from url
      const filename = name ? name : url.substring(url.lastIndexOf("/") + 1);
      let blob = new Blob([response.data], { type: response.data.type });
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      link.remove();
      message.success(`Downloaded "${filename}"`);
    });
}
