document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("cancerTable");
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    const darkModeToggle = document.getElementById("darkModeToggle");

    let data = [];
    let currentPage = 1;
    const rowsPerPage = 10;
    let currentSortColumn = null;
    let ascending = true;

    // Load Data
    fetch("data/Cancer_data.json")
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            renderTable();
        })
        .catch(error => console.error("Error loading data:", error));

    function renderTable() {
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        if (data.length === 0) return;
        const columns = Object.keys(data[0]);

        // Create header with sorting
        const headerRow = document.createElement("tr");
        columns.forEach((column, index) => {
            const th = document.createElement("th");
            th.textContent = column.replace(/_/g, " ");
            th.style.cursor = "pointer";

            // Add sorting icon
            const sortIcon = document.createElement("span");
            sortIcon.textContent = currentSortColumn === column ? (ascending ? " 🔼" : " 🔽") : " ⬍";
            sortIcon.style.marginLeft = "5px";

            th.appendChild(sortIcon);
            th.addEventListener("click", () => sortTable(column, index));

            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        displayData();
    }

    function displayData() {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement("tr");
            Object.values(row).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        // Enable/Disable Pagination Buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = end >= data.length;
    }

    // Sorting Function
    function sortTable(column, columnIndex) {
        if (currentSortColumn === column) {
            ascending = !ascending;
        } else {
            currentSortColumn = column;
            ascending = true;
        }

        data.sort((a, b) => {
            if (typeof a[column] === "number") {
                return ascending ? a[column] - b[column] : b[column] - a[column];
            } else {
                return ascending ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
            }
        });

        renderTable();
    }

    // Pagination
    prevButton.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            displayData();
        }
    });

    nextButton.addEventListener("click", function () {
        if (currentPage * rowsPerPage < data.length) {
            currentPage++;
            displayData();
        }
    });

    // Dark Mode Toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("darkMode", "enabled");
                darkModeToggle.textContent = "☀️ Light Mode";
            } else {
                localStorage.setItem("darkMode", "disabled");
                darkModeToggle.textContent = "🌙 Dark Mode";
            }
        });

        // Apply Dark Mode if it was previously enabled
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
            darkModeToggle.textContent = "☀️ Light Mode";
        } else {
            darkModeToggle.textContent = "🌙 Dark Mode";
        }
    } else {
        console.error("Dark Mode Toggle button not found!");
    }
});
