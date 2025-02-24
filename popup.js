document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("input");
    const saveButton = document.getElementById("save");
    const clipboardList = document.getElementById("clipboardList");

    function loadClipboardItems() { 
        chrome.storage.sync.get(["clipboard"], function (data) {
            clipboardList.innerHTML = "";
            let items = data.clipboard || [];

            items.forEach((item, index) => {
                const li = document.createElement("li");
                li.textContent = item;

                const copyButton = document.createElement("button");
                copyButton.textContent = "Copy";
                copyButton.onclick = function () {
                    navigator.clipboard.writeText(item);
                };

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = function () {
                    items.splice(index, 1); // Remove item by index
                    chrome.storage.sync.set({ clipboard: items }, function () {
                        loadClipboardItems();
                    });
                };

                li.appendChild(deleteButton);
                li.appendChild(copyButton);
                clipboardList.appendChild(li);
            });
        });
    }

    saveButton.addEventListener("click", function () {
        const value = inputField.value.trim();
        if (!value) return;

        chrome.storage.sync.get(["clipboard"], function (data) {
            let items = data.clipboard || [];
            items.push(value);
            chrome.storage.sync.set({ clipboard: items }, function () {
                inputField.value = ""; // Clear input field
                loadClipboardItems();  // Refresh list
            });
        });
    });

    loadClipboardItems();
});
