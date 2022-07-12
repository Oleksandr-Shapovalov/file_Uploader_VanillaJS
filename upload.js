function bytesToSize(bytes) {
  if (bytes == 0) return "0 Byte";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
function removeElementWithAnimation(el, classToAdd, animTime) {
  el.classList.add(classToAdd);
  setTimeout(() => {
    el.classList.remove(classToAdd);
    el.remove();
  }, animTime);
}
const elementCreate = (tag = "div", classes = [], content) => {
  const node = document.createElement(tag);
  if (classes.length) node.classList.add(...classes);
  if (content) node.textContent = content;
  return node;
};
function noop(params) {
  noop;
}
export function upload(selector, options = {}) {
  let files = [];
  const onUpload = options.onUpload ?? noop;
  const input = document.querySelector(selector);
  const preview = elementCreate("div", ["preview"]);
  const open = elementCreate("button", ["btn"], "open");
  const upload = elementCreate("button", ["btn", "primary"], "upload");

  input.setAttribute("multiple", options.multiply);
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute("accept", options.accept.join(", "));
  }

  input.insertAdjacentElement("afterend", preview);
  input.insertAdjacentElement("afterend", open);

  const triggerInput = (e) => input.click();
  const filesToDOM = (files) => {
    files.forEach((file) => {
      if (!file.type.match("image")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target.result;
        preview.insertAdjacentHTML(
          "afterbegin",
          `<div class="preview__image">
          <div class="preview__remove" data-name="${file.name}">
          &times;
          </div>
          <img src="${src}" alt="${file.name}" />
           <div class="preview__info">
           <span>${file.name}</span>
            <span>${bytesToSize(file.size)}</span>
           </div>
          </div>`
        );
      };
      reader.readAsDataURL(file);
    });
  };
  const changeHandler = (e) => {
    if (!e.target.files?.length && e?.dataTransfer?.length) return;

    files = e.target.files?.length
      ? Array.from(e.target.files)
      : Array.from(e.dataTransfer.files);
    preview.innerHTML = "";

    open.insertAdjacentElement("afterend", upload);
    filesToDOM(files);
  };
  const removeHandler = (e) => {
    if (!e.target.dataset.name) return;

    const { name } = e.target.dataset;
    files = files.filter((file) => file.name !== name);

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest(".preview__image");
    removeElementWithAnimation(block, "removing", 350);
    if (upload && !files.length)
      removeElementWithAnimation(upload, "removing", 350);
  };
  const clearPreview = (el) => {
    el.style.transform = "translateY(0)";
    el.innerHTML = `<div class="preview__info_progress"> </div>`;
  };
  const uploadHandler = (e) => {
    preview.querySelectorAll(`.preview__remove`).forEach((el) => el.remove());

    const previewInfo = preview.querySelectorAll(".preview__info");
    previewInfo.forEach(clearPreview);

    onUpload(files, previewInfo);
  };
  const dragoverHandler = (e) => {
    e.preventDefault();
    preview.classList.add("active");
  };
  const dragleaveHandler = (e) => {
    preview.classList.remove("active");
  };
  const dropHandler = (e) => {
    e.preventDefault();
    changeHandler(e);
  };
  open.addEventListener("click", triggerInput);
  input.addEventListener("change", changeHandler);
  preview.addEventListener("click", removeHandler);
  preview.addEventListener("drop", dropHandler);
  preview.addEventListener("dragover", dragoverHandler);
  preview.addEventListener("dragleave", dragleaveHandler);
  upload.addEventListener("click", uploadHandler);
}
