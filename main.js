const columns = document.querySelectorAll(".column");
const tasks = document.querySelectorAll(".drag-element");

const events = {
  dropSuccess: "eventDropSuccess",
};

let selectedElementConfigs = {
  id: "",
  height: 0,
  currentType: "",
};

let positionConfigs = {
  isTransformed: false,
  referenceNode: null,
};

columns.forEach((column) => {
  column.ondragover = (event) => {
    event.preventDefault();
    column.style.borderColor = "blue";
    positionConfigs.isTransformed = false;
    positionConfigs.referenceNode = null;
    let childNodes = event.currentTarget.childNodes;
    childNodes.forEach((child) => {
      if (child.classList && child.classList.contains("drag-element")) {
        let position = child.getBoundingClientRect();
        if (position.top > event.clientY && !positionConfigs.isTransformed) {
          if (!column.children.namedItem(selectedElementConfigs.id)) {
            positionConfigs.isTransformed = true;
            positionConfigs.referenceNode = child;
            child.style.marginTop = selectedElementConfigs.height + 8 + "px";
          } else {
            positionConfigs.isTransformed = false;
            positionConfigs.referenceNode = null;
            child.style.marginTop = "4px";
          }
        } else {
          child.style.marginTop = "4px";
        }
      }
    });
  };

  column.ondragleave = () => {
    column.style.borderColor = "black";
    tasks.forEach((task) => {
      task.style.marginTop = "4px";
    });
  };

  column.ondrop = (event) => {
    event.preventDefault();
    if (!column.children.namedItem(selectedElementConfigs.id)) {
      let data = JSON.parse(event.dataTransfer.getData("data"));
      dropElement(
        positionConfigs.referenceNode,
        document.getElementById(data.id),
        column,
        {
          id: selectedElementConfigs.id,
          fromType: selectedElementConfigs.currentType,
          toType: column.getAttribute("data-status"),
        }
      );
    }
    positionConfigs.isTransformed = false;
    positionConfigs.referenceNode = null;
    selectedElementConfigs.id = "";
    selectedElementConfigs.currentType = "";
    selectedElementConfigs.height = 0;
    column.style.borderColor = "black";
    tasks.forEach((task) => {
      task.style.marginTop = "4px";
    });
  };
});

tasks.forEach((task) => {
  task.ondragstart = (event) => {
    positionConfigs.isTransformed = false;
    positionConfigs.referenceNode = null;
    selectedElementConfigs.id = task.id;
    selectedElementConfigs.height = task.clientHeight;
    selectedElementConfigs.currentType =
      task.parentNode.getAttribute("data-status");
    event.dataTransfer.setData("data", JSON.stringify(selectedElementConfigs));
  };
});

window.addEventListener(events.dropSuccess, (e) => {
  console.log(e.detail);
});

function dropElement(referenceNode, newNode, container, data = {}) {
  if (referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
  } else {
    container.append(newNode);
  }
  window.dispatchEvent(new CustomEvent(events.dropSuccess, { detail: data }));
}
