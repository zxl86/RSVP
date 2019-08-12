// use function e to replace document.querySelector
const e = function (selector) {
    return document.querySelector(selector);
};

// append HTML to page
const appendHtml = function (element, html) {
    element.insertAdjacentHTML('beforeend', html);
};

// bindEvent
const bindEvent = function (elem, eventType, selector, callback) {
    if (callback === undefined) {
        callback = selector;
        selector = null;
    }
    elem.addEventListener(eventType, function (event) {
        if (selector) {
            const target = event.target;
            if (target.matches(selector)) {
                callback.call(target);
            }
        } else {
            callback(event);
        }
    });
};

// click Add button to add name
const bindEventAdd = function () {
    const form = e('#id-form-registrar');
    const inputForm = form.querySelector('input');
    bindEvent(form, 'submit', function (event) {
        event.preventDefault();
        let name = inputForm.value;
        if (name) {
            inputForm.value = '';
            insertList(name, false);
        } else {
            alert("Please enter your name.");
        }
        saveLists();
    });
};

// click Edit/Save/Remove button to modify name
const bindEventChange = function () {
    const ul = e('#id-ul-invitedList')
    // button is the selector that truly triggers the event
    bindEvent(ul, 'click', 'button', function () {
        const listItem = this.parentNode;
        const action = this.textContent;
        const nameActions = {
            Remove: () => {
                listItem.remove();
                saveLists();
            },

            Edit: () => {
                const span = listItem.firstElementChild;
                const name = span.textContent;
                span.insertAdjacentHTML('beforebegin', `
            <input type='text' value=${name}>`);
                span.remove();
                this.textContent = 'Save';
            },

            Save: () => {
                const input = listItem.firstElementChild;
                const name = input.value;
                input.insertAdjacentHTML('beforebegin', `
            <span class="rsvp-name">${name}</span>`);
                input.remove();
                this.textContent = 'Edit';
                saveLists();
            }
        };
        nameActions[action]();
    })
};

// click checkbox to confirm
const bindEventConfirm = function () {
    const ul = e('#id-ul-invitedList');
    bindEvent(ul, 'change', 'input', function () {
        if (this.className === 'confirm') {
            const listItem = this.parentNode.parentNode;
            if (this.checked) {
                listItem.className = 'responded';
                saveLists();
            } else {
                listItem.className = '';
                saveLists();
            }
        }
    });
};

// click filter to filter confirm status
const bindEventFilter = function () {
    const filterCheckbox = e('.respond');
    bindEvent(filterCheckbox, 'change', function (event) {
        const ul = e('#id-ul-invitedList');
        const listItem = ul.children;
        const isChecked = event.target.checked;
        if (isChecked) {
            for (let i = 0; i < listItem.length; i++) {
                if (listItem[i].className) {
                    const checkbox = listItem[i].querySelector('input');
                    checkbox.style.display = 'none';
                } else {
                    listItem[i].style.display = 'none';
                }
            }
        } else {
            for (let i = 0; i < listItem.length; i++) {
                if (listItem[i].className) {
                    const checkbox = listItem[i].querySelector('input');
                    checkbox.style.display = '';
                } else {
                    listItem[i].style.display = '';
                }
            }
        }
    });
};

// templates of label
const templateLabel = function () {
    let t = `
        <div>
        <label>Hide those who haven't responded<input class="respond" type="checkbox">
        </label>
        </div>
    `;
    return t;
};

// templates of list
const templateLists = function (name, status) {
    if (status) {
        const t = `
        <li class="responded">
          <span class="rsvp-name">${name}</span>
          <label>Confirmed<input class="confirm" type="checkbox" checked=""></label>
          <button>Edit</button>
          <button>Remove</button>
        </li>
      `;
        return t;
    } else {
        const t = `
        <li>
          <span class="rsvp-name">${name}</span>
          <label>Confirmed<input class="confirm" type="checkbox"></label>
          <button>Edit</button>
          <button>Remove</button>
        </li>
      `;
        return t;
    }
};

// insert label to mainDiv
const insertLabel = function () {
    const header = e('.title');
    const t = templateLabel();
    header.insertAdjacentHTML("afterend", t);
};

// insert list to ul
const insertList = function (name, status) {
    const ulContainer = e('#id-ul-invitedList');
    const t = templateLists(name, status);
    appendHtml(ulContainer, t);
};

// serialize array to string
const save = function (array) {
    const r = JSON.stringify(array);
    localStorage.rsvpLists = r;
};

// unserialize string to array
const load = function () {
    const r = localStorage.rsvpLists || '[]';
    return JSON.parse(r);
};

// save lists to localStorage
const saveLists = function () {
    // create empty array
    var rsvp = [];
    const names = document.querySelectorAll('.rsvp-name');
    for (let i = 0; i < names.length; i++) {
        let name = names[i].innerHTML;
        let status = names[i].parentElement.classList.contains('responded');
        let person = {
            name: name,
            status: status
        };
        rsvp.push(person);
    }
    save(rsvp);
};

// load lists from localStorage
const loadLists = function () {
    const rsvp = load();
    for (let i = 0; i < rsvp.length; i++) {
        let name = rsvp[i].name;
        let status = rsvp[i].status;
        insertList(name, status);
    }
};

const bindEvents = function () {
    bindEventAdd();
    bindEventChange();
    bindEventConfirm();
    bindEventFilter();
};

const __main = function () {
    insertLabel();
    loadLists();
    bindEvents();
};

__main();