const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const breadcrumb = document.getElementById("breadcrumb");
const contentDisplay = document.getElementById("contentDisplay");
let currentPath = [];
let currentNode = null; // Track the current directory or file

// File input and drop events
dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = "#e8f0fe";
});
dropzone.addEventListener("dragleave", () => {
    dropzone.style.backgroundColor = "#f1f9ff";
});
dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = "#f1f9ff";
    handleFiles(event.dataTransfer.files);
});
fileInput.addEventListener("change", () => handleFiles(fileInput.files));

// Handle and process uploaded files
async function handleFiles(files) {
    const fileArray = Array.from(files);
    let fileTree = [];
    for (const file of fileArray) {
        const filePath = file.webkitRelativePath.split('/');
        await buildFileTree(fileTree, filePath, file);
    }
    displayFileTree(fileTree, document.getElementById("fileTree"));
}

// Recursively build the file tree structure
async function buildFileTree(tree, pathArray, file) {
    const [currentFolder, ...remainingPath] = pathArray;
    let currentNode = tree.find(item => item.name === currentFolder);
    if (!currentNode) {
        currentNode = {
            name: currentFolder,
            type: remainingPath.length === 0 ? "file" : "directory",
            children: remainingPath.length === 0 ? null : []
        };
        tree.push(currentNode);
    }
    if (remainingPath.length === 0) {
        currentNode.extension = file.name.split('.').pop();
        currentNode.content = await file.text();
    } else {
        await buildFileTree(currentNode.children, remainingPath, file);
    }
}

// Display the file tree structure in the left sidebar
function displayFileTree(tree, container) {
    container.innerHTML = "";
    const ul = document.createElement("ul");
    buildTreeList(tree, ul);
    container.appendChild(ul);
}

// Build tree list with folders and files
function buildTreeList(nodes, parentElement) {
    nodes.forEach(node => {
        const li = document.createElement("li");
        li.textContent = node.name;
        li.classList.add(node.type === "directory" ? "folder" : "file");
        li.addEventListener("click", (event) => {
            event.stopPropagation();
            if (node.type === "directory") {
                navigateToDirectory(node);
            } else {
                navigateToFile(node);
            }
        });
        parentElement.appendChild(li);
    });
}

// Navigate to directory
function navigateToDirectory(node) {
    currentPath = currentPath.filter(item => item.type === "directory" || item === node); // Remove files from path, keep directories
    if (!currentPath.includes(node)) {
        currentPath.push(node); // Add folder to path
    }
    currentNode = node; // Set the current node
    updateBreadcrumb(currentPath); // Refresh breadcrumb based on new path
    displayContent(node.children); // Show folder content
}

// Navigate to file
function navigateToFile(node) {
    currentPath = currentPath.filter(item => item.type === "directory"); // Keep only directories
    currentPath.push(node); // Add file to path
    updateBreadcrumb(currentPath);
    displayFileContent(node.content); // Show file content
}

// Update breadcrumb navigation based on current path
function updateBreadcrumb(path) {
    breadcrumb.innerHTML = "";
    path.forEach((node, index) => {
        const link = document.createElement("span");
        link.textContent = node.name;
        link.style.cursor = "pointer";
        link.addEventListener("click", () => {
            navigateToBreadcrumb(index);
        });
        breadcrumb.appendChild(link);
        if (index < path.length - 1) breadcrumb.append(" > ");
    });
}

// Navigate to breadcrumb
function navigateToBreadcrumb(index) {
    currentPath = currentPath.slice(0, index + 1); // Limit path to clicked breadcrumb level
    updateBreadcrumb(currentPath); // Re-render breadcrumb
    const node = currentPath[index];
    if (node.type === "directory") {
        currentNode = node; // Set the current node
        displayContent(node.children);
    } else {
        displayFileContent(node.content);
    }
}

// Display folder contents in the right content area
function displayContent(children) {
    contentDisplay.innerHTML = "";
    children.forEach(child => {
        const div = document.createElement("div");
        div.classList.add(child.type === "directory" ? "folder-display" : "file-display");
        div.textContent = child.name;
        div.addEventListener("click", () => {
            if (child.type === "directory") {
                navigateToDirectory(child);
            } else {
                navigateToFile(child);
            }
        });
        contentDisplay.appendChild(div);
    });
}

// Show file content in the file content area
function displayFileContent(content) {
    const fileContent = document.getElementById("fileContent");
    fileContent.textContent = content;
    fileContent.classList.add("file-content");
}
