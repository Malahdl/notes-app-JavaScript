const newNoteBtn = document.querySelector(".new-note-btn");
const searchText = document.getElementById("search-text");
const searchBtn = document.querySelector(".search-btn");

const mainBody = document.querySelector(".main-body");
const notePage = document.querySelector(".note-page");
const backBtn = document.querySelector(".back-btn");
const titleText = document.getElementById("title");
const bodyText = document.getElementById("note-body");
const errorMsg = document.querySelector(".error");
const addNoteBtn = document.querySelector(".add-btn");
const infoPage = document.querySelector(".info-page");
const infoClose = document.querySelector(".close-btn");
const infoTitle = document.querySelector(".info-title");
const infoBody = document.querySelector(".info-body");

let currentNoteId = "";

loadNotes();

function getRandomId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    return `${timestamp}-${random}`; // Combine timestamp and random number
  }

function loadNotes(textValue = "") {
    mainBody.innerHTML = "";

    let notes = [];

    if(textValue == "") {
      notes = getNotesLS();
    } else {
      notes = getNotesLS();
      notes = notes.filter((note) => note.title.toLowerCase().includes(textValue.toLowerCase()));
    }

    if(notes.length == 0) {
        mainBody.innerHTML = "<h1>No Notes Yet!</h1>";
        mainBody.classList.add("no-notes-body");
      } else {
        mainBody.classList.remove("no-notes-body");
        for (let i = 0; i < notes.length; i++) {
            const element = notes[i];
            const note = document.createElement("div");
            let title = element.title.length > 18 ? element.title.substring(0, 18) + "..." : element.title;
            let body = element.body.length > 150 ? element.body.substring(0, 150) + "..." : element.body;
            
            let titleEl = `<h2>${title}</h2>`;

            if(textValue != "") {
                let letterSpans = "";
                let letters = title.split("");
                for (let i = 0; i < letters.length; i++) {
                    const element = letters[i];
                    if(textValue.toLowerCase().includes(element.toLowerCase())) {
                        letterSpans += `<span class="colored">${element}</span>`;
                    } else {
                        letterSpans += `<span>${element}</span>`;
                    }
                }
                titleEl = "<h2>" + letterSpans + "</h2>";
            }
        
                note.innerHTML = 
                `
                <div class="tools-div">
                    <div class="expand-btn">
                    <i class="fa-sharp fa-solid fa-up-right-and-down-left-from-center"></i>
                    </div>
                    <div class="first-half">
                                            <i class="fa-solid fa-pen-to-square edit-btn"></i>
                                            <i class="fa-solid fa-trash remove-btn"></i>
                    </div>
                </div>`
                + 
                titleEl
                + 
                `<hr>
                <p>${body}</p>
                `;
        
                let toolsDiv = note.querySelector(".tools-div");
        
                let expandBtn = toolsDiv.querySelector(".expand-btn");
                let editBtn = toolsDiv.querySelector(".edit-btn");
                let removeBtn = toolsDiv.querySelector(".remove-btn");
        
                expandBtn.addEventListener("click", () => {
                    infoPage.classList.remove("hidden");
                    infoTitle.innerHTML = `${element.title}`;
                    infoBody.innerHTML = `${element.body}`;
                    window.scrollTo(0, 0);
                });
        
                editBtn.addEventListener("click", () => {
                    notePage.classList.remove("hidden");
                    titleText.value = element.title;
                    bodyText.value = element.body;
                    currentNoteId = element.id;
                    window.scrollTo(0, 0);
                });
        
                removeBtn.addEventListener("click", () => {
                    removeNoteLS(element.id);
                    removeNoteIdLS(element.id);
                    loadNotes();
                });
        
                note.classList.add("note-item");
                mainBody.appendChild(note);
           }
      }
   
   
}

function addNoteIdLS(id) {
    let noteIds = getNoteIdsLS();

    localStorage.setItem(
        "noteIds", JSON.stringify([...noteIds, id])
        );
}

function removeNoteIdLS(id) {
    let noteIds = getNoteIdsLS();

    localStorage.setItem(
        "noteIds", JSON.stringify(noteIds.filter((noteId) => noteId !== id))
        );
}

function getNoteIdsLS() {
    let noteIds = JSON.parse(localStorage.getItem("noteIds"));

    return noteIds === null ? [] : noteIds;
}

function addNoteLS(noteItem) {
    localStorage.setItem(noteItem.id, JSON.stringify(noteItem));
}

function removeNoteLS(id) {
    localStorage.removeItem(id);
}

function getNotesLS() {
    let noteIds = getNoteIdsLS();
    let noteItems = [];

    if(noteIds.length == 0) {
        return [];
    } else {
        noteIds.forEach(element => {
            noteItems.push(JSON.parse(localStorage.getItem(element)));
        });
        
        return noteItems;
    }
}

newNoteBtn.addEventListener("click", () => {
    notePage.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
    notePage.classList.add("hidden");
    errorMsg.innerHTML = "";
    titleText.value = "";
    bodyText.value = "";
});

addNoteBtn.addEventListener("click", () => {
    if (titleText.value.trim() == "" || bodyText.value.trim() == "") {
        errorMsg.innerHTML = "Must Enter Title And Note!";
    } else {
        errorMsg.innerHTML = "";

        if(currentNoteId == "") {
            let newNote = {
                id: getRandomId(),
                title: titleText.value,
                body: bodyText.value,
            }
            
            addNoteIdLS(newNote.id);
            addNoteLS(newNote); 
        } else {
            let newNote = {
                id: currentNoteId,
                title: titleText.value,
                body: bodyText.value,
            }
            
            addNoteLS(newNote);

            currentNoteId = "";
        }
        
        loadNotes();

        notePage.classList.add("hidden");
        titleText.value = "";
        bodyText.value = "";
    }
});

infoClose.addEventListener("click", () => {
    infoPage.classList.add("hidden");
    infoTitle.innerHTML = "";
    infoBody.innerHTML = "";
});

searchBtn.addEventListener("click", () => {
    loadNotes(searchText.value);
});

searchText.addEventListener("input", (event) => {
    loadNotes(event.target.value);
});