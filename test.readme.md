## ReadableStream (直接返回的二进制文件流img)
API Usage:
```javascript
fetch("https://viavacos.live:3002/img", { method: "get" }).then(response => {
  return response.blob()
}).then(res => {
  const url = URL.createObjectURL(res)
  console.log(url)
  const img = document.createElement("img")
  img.src = url
  document.documentElement.appendChild(img)
})
```


## "/upload" 客户端快捷上传
```javascript
const uploadInput = document.createElement("input")
uploadInput.type = "file"
uploadInput.addEventListener("change", e => {
  const file = e.target.files[0]
  const fd = new FormData()
  fd.append("file", file)
  fetch("https://viavacos.live:3002/upload", {
    method: "post",
    body: fd,
    mode: "no-cors"
  })
})
document.body.appendChild(uploadInput)
uploadInput.click()
```