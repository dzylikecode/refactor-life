export function getFileContent(fileName: string) {
  return new Promise(function (success: (data: string) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", fileName, true);
    xhr.onload = function () {
      if (xhr.status == 200) {
        success(xhr.responseText);
      } else {
        success("");
      }
    };
    xhr.onerror = xhr.onabort = function () {
      success("");
    };
    xhr.send();
  });
}
