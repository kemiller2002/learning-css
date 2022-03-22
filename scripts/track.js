function generateHash(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function getDocumentKey(document) {
  const body = document.body;

  if (body.documentKey) {
    return body.documentKey;
  }

  const key = generateHash(document.body.innerHTML);
  body.documentKey = key;
  return body.documentKey;
}

function saveDocument(document) {
  const saved = document.querySelectorAll(":checked");
  const checked = Array.from(saved).map((x) => ({ type: "checkbox", id: x.id }));
  const localStorage = window.localStorage;
  const documentKey = getDocumentKey(document);

  localStorage.setItem(documentKey, JSON.stringify(checked));
}

function setup(document, data) {
  let codeItems = document.querySelectorAll("[add-code]");
  let createCheckbox = (document, id) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = id;
    checkbox.id = id;
    checkbox.addEventListener("change", () => saveDocument(document));
    return checkbox;
  };

  let createLabel = (id, text) => {
    const label = document.createElement("label");
    label.name = "lbl" + id;
    label.id = "lbl" + id;
    label.setAttribute("for", id);
    label.innerHTML = text;
    return label;
  };

  let replace = (document, entry) => {
    const id = generateHash(entry.parentElement.parentElement.innerHTML + entry.innerHTML);
    const text = entry.innerHTML;
    entry.innerHTML = null;
    entry.append(createCheckbox(document, id));
    entry.append(createLabel(id, text));
  };

  codeItems.forEach((item) => replace(document, item));
  data.map((x) => x.id).forEach((id) => (document.getElementById(`${id}`).checked = true));
}

(() => {
  document.addEventListener("DOMContentLoaded", (ev) => {
    const documentKey = getDocumentKey(ev.target);
    const data = JSON.parse(window.localStorage.getItem(documentKey) || "[]");

    setup(ev.target, data);
  });
})();
