// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items;
      // Check for items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        // Set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get from local storage
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        // Reset LS
        localStorage.setItem("items", JSON.stringify(items));
      }

      // JSON.stringify to put. JSON.parse to take out. because local storage stores strings only
    },
    getItems: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItem: function(newItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function(itemIter, index) {
        if (newItem.id === itemIter.id) {
          items.splice(index, 1, newItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItem: function(item) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function(itemIter, index) {
        if (item.id === itemIter.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItems: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure
  const data = {
    // items: [
    // { id: 0, name: "Soup", calories: 150 },
    // { id: 1, name: "Salad", calories: 100 },
    // { id: 2, name: "Water", calories: 0 }
    // ],
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0
  };

  return {
    logData: function() {
      return data;
    },
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      // Create ID
      if (data.items.length > 0) {
        // next ID will be last ID in data + 1
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);

      // New item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (id === item.id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      // Set total to new total (in data structure)
      data.totalCalories = total;
      return total;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    deleteItem: function(id) {
      ids = data.items.map(function(item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    clearItems: function() {
      data.items = [];
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalCalories: ".total-calories",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn"
  };
  return {
    populateItemList: function(items) {
      // Check if any items are listed
      if (items.length === 0) {
        UICtrl.hideList();
      }

      let html = "";
      items.forEach(function(item) {
        html += `
        <li id="item-${item.id}" class="collection-item"><b>${item.name}: </b>${
          item.calories
        } calories <a href="#" class="secondary-content"
        ><i class="edit-item fa fa-edit"></i
      ></a>
        </li>
        `;
      });
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value
      };
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showList: function() {
      document.querySelector(UISelectors.itemList).style.display = "block";
    },
    getSelectors: function() {
      return UISelectors;
    },
    addListItem: function(item) {
      // Unhide list
      UICtrl.showList();
      // Create li element
      const li = document.createElement("li");
      li.className += "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<b>${item.name}: </b>${
        item.calories
      } calories <a href="#" class="secondary-content"
      ><i class="edit-item fa fa-edit"></i
    ></a>`; // Must use event delegation to address this added button.
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCalories).value = "";
    },
    clearItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems); // turn into array
      listItems.forEach(function(item) {
        item.remove();
      });
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).innerHTML = total;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = ""; // or set to inline, block, inline-block
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none"; // or set to inline, block, inline-block
    },
    addCurrentItemToForm: function() {
      const currentItem = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.itemName).value = currentItem.name;
      document.querySelector(UISelectors.itemCalories).value =
        currentItem.calories;
      UICtrl.showEditState();
    },
    updateItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      console.log(listItems);

      // Turn Node List into array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<b>${
            item.name
          }: </b>${item.calories} calories <a href="#" class="secondary-content"
          ><i class="edit-item fa fa-edit"></i
        ></a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
      console.log(document.querySelector(UISelectors.listItems));
      if (document.querySelector(UISelectors.itemList).innerHTML === "") {
        UICtrl.hideList();
      }
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //Disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Back button click
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", updateItemClick);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear all items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearSubmit);
  };
  // Clear items submit
  clearSubmit = function(e) {
    // Delete all from ds
    ItemCtrl.clearItems();
    // Delete all from ui
    UICtrl.clearItems();

    // Final: update calories, exit edit state
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories
    UICtrl.showTotalCalories(totalCalories);
    // Clear all items in LS
    StorageCtrl.clearAllItems();
    // Clear fields
    UICtrl.clearEditState();

    // Hide UL
    UICtrl.hideList();
  };

  // Add item submit
  itemAddSubmit = function(e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check inputs are not blank
    if (input.name !== "" && input.calories !== "") {
      // Add Item to data
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add Item to UI list
      UICtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories
      UICtrl.showTotalCalories(totalCalories);
      // Store in local storage
      StorageCtrl.storeItem(newItem);
      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Delete Item
  itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories
    UICtrl.showTotalCalories(totalCalories);
    // Delete from LS
    StorageCtrl.deleteItem(currentItem);
    // Clear fields
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Update Item
  updateItemClick = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories
    UICtrl.showTotalCalories(totalCalories);
    // Update to LS
    StorageCtrl.updateItem(updatedItem);
    // Clear fields
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Click edit item button
  itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // event delegation
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into array, and get Id from it. (ListID is test-1)
      const listIdArr = listId.split("-")[1];
      const id = parseInt(listIdArr);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addCurrentItemToForm();
    }
    e.preventDefault();
  };

  // // Back btn clicked
  // backClick = function(e) {
  //   // Go back to normal mode
  //   // Set current item to null?
  //   ItemCtrl.setCurrentItem(null);
  //   // Go back to
  //   UICtrl.clearEditState();
  // };

  return {
    init: function() {
      // Why const, and why in init
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      // Set to non-edit state (Hide update and delete button)
      UICtrl.clearEditState();
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories
      UICtrl.showTotalCalories(totalCalories);

      // Populate list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialise App
App.init();
