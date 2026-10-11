// ===== 1. Starting data: sample Tampa Bay listings =====
let listings = [
  { id: 1, address: "2810 W Bay to Bay Blvd", neighborhood: "South Tampa", price: 610000, beds: 4, baths: 3, sqft: 2400, type: "House", status: "For Sale" },
  { id: 2, address: "10215 Westpark Preserve Blvd", neighborhood: "Westchase", price: 485000, beds: 3, baths: 2, sqft: 1950, type: "House", status: "For Sale" },
  { id: 3, address: "1402 Oakfield Dr", neighborhood: "Brandon", price: 340000, beds: 3, baths: 2, sqft: 1600, type: "Townhome", status: "Pending" },
  { id: 4, address: "711 Channelside Dr, Unit 1205", neighborhood: "Downtown Tampa", price: 395000, beds: 2, baths: 2, sqft: 1150, type: "Condo", status: "For Sale" },
  { id: 5, address: "449 S Harbour Island Blvd, Unit 802", neighborhood: "Downtown Tampa", price: 520000, beds: 2, baths: 2, sqft: 1300, type: "Condo", status: "Sold" },
  { id: 6, address: "31045 Chesapeake Bay Dr", neighborhood: "Wesley Chapel", price: 455000, beds: 4, baths: 3, sqft: 2300, type: "House", status: "For Sale" },
  { id: 7, address: "27640 Cashford Cir", neighborhood: "Wesley Chapel", price: 335000, beds: 3, baths: 2.5, sqft: 1700, type: "Townhome", status: "For Sale" },
  { id: 8, address: "3215 W Sevilla St", neighborhood: "South Tampa", price: 875000, beds: 4, baths: 3.5, sqft: 2900, type: "House", status: "Sold" }
];
let nextId = 9;

// ===== 2. Find the page elements we need =====
const form = document.getElementById("listingForm");
const editIdInput = document.getElementById("editId");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const messageBox = document.getElementById("message");
const tableBody = document.getElementById("listingTable");
const countSpan = document.getElementById("count");
const searchBox = document.getElementById("searchBox");
const filterArea = document.getElementById("filterArea");

// ===== 3. Helper functions =====
function formatPrice(number) {
  return "$" + number.toLocaleString("en-US");
}

function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

function statusBadge(status) {
  if (status === "For Sale") return '<span class="badge bg-success">For Sale</span>';
  if (status === "Pending") return '<span class="badge bg-warning text-dark">Pending</span>';
  return '<span class="badge bg-secondary">Sold</span>';
}

function showMessage(text, type) {
  messageBox.innerHTML = '<div class="alert alert-' + type + ' py-2">' + text + "</div>";
  setTimeout(function () {
    messageBox.innerHTML = "";
  }, 3000);
}

function readForm() {
  return {
    address: document.getElementById("address").value.trim(),
    neighborhood: document.getElementById("neighborhood").value,
    price: Number(document.getElementById("price").value),
    beds: Number(document.getElementById("beds").value),
    baths: Number(document.getElementById("baths").value),
    sqft: Number(document.getElementById("sqft").value),
    type: document.getElementById("type").value,
    status: document.getElementById("status").value
  };
}

function resetForm() {
  form.reset();
  editIdInput.value = "";
  formTitle.textContent = "Add a New Property";
  saveBtn.textContent = "Save Property";
}

// ===== 4. READ: show listings in the table =====
function renderTable() {
  const searchText = searchBox.value.trim().toLowerCase();
  const area = filterArea.value;

  const visible = listings.filter(function (listing) {
    const matchesSearch = listing.address.toLowerCase().includes(searchText);
    const matchesArea = area === "" || listing.neighborhood === area;
    return matchesSearch && matchesArea;
  });

  tableBody.innerHTML = "";

  if (visible.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">No listings found.</td></tr>';
  }

  visible.forEach(function (listing) {
    const row = document.createElement("tr");
    addCell(row, listing.address);
    addCell(row, listing.neighborhood);
    addCell(row, formatPrice(listing.price));
    addCell(row, listing.beds);
    addCell(row, listing.baths);
    addCell(row, listing.sqft.toLocaleString("en-US"));
    addCell(row, listing.type);
    addCell(row, "").innerHTML = statusBadge(listing.status);

    const actions = addCell(row, "");
    actions.className = "text-end text-nowrap";
    actions.innerHTML =
      '<button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-id="' + listing.id + '">Edit</button>' +
      '<button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + listing.id + '">Delete</button>';

    tableBody.appendChild(row);
  });

  countSpan.textContent = visible.length;
}

// ===== 5. CREATE: add a new listing =====
function createListing(data) {
  data.id = nextId;
  nextId = nextId + 1;
  listings.push(data);
  showMessage("Property added successfully.", "success");
}

// ===== UPDATE: load a listing into the form for editing =====
function startEdit(id) {
  const listing = listings.find(function (item) {
    return item.id === id;
  });

  document.getElementById("address").value = listing.address;
  document.getElementById("neighborhood").value = listing.neighborhood;
  document.getElementById("price").value = listing.price;
  document.getElementById("beds").value = listing.beds;
  document.getElementById("baths").value = listing.baths;
  document.getElementById("sqft").value = listing.sqft;
  document.getElementById("type").value = listing.type;
  document.getElementById("status").value = listing.status;

  editIdInput.value = listing.id;
  formTitle.textContent = "Edit Property";
  saveBtn.textContent = "Update Property";
  form.scrollIntoView({ behavior: "smooth" });
}

// ===== UPDATE: save the changes =====
function updateListing(id, data) {
  const index = listings.findIndex(function (item) {
    return item.id === id;
  });
  data.id = id;
  listings[index] = data;
  showMessage("Property updated successfully.", "info");
}

// ===== DELETE: remove a listing =====
function deleteListing(id) {
  listings = listings.filter(function (item) {
    return item.id !== id;
  });
  if (Number(editIdInput.value) === id) {
    resetForm();
  }
  showMessage("Property deleted.", "warning");
}

// ===== Edit / Delete button clicks =====
tableBody.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "edit") {
    startEdit(id);
  }

  if (button.dataset.action === "delete") {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteListing(id);
      renderTable();
    }
  }
});

// ===== 6. Form events =====
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const data = readForm();
  const editId = Number(editIdInput.value);

  if (editId) {
    updateListing(editId, data);
  } else {
    createListing(data);
  }

  resetForm();
  renderTable();
});

clearBtn.addEventListener("click", resetForm);
searchBox.addEventListener("input", renderTable);
filterArea.addEventListener("change", renderTable);

// ===== 7. Show the table when the page first loads =====
renderTable();