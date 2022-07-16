let url = "../user.json";

//---------------------------------------- CLASSES -------------------------------------------
class UserClass {
    constructor(name, height, mass, gender, id, video) {
        this._name = name;
        this._height = height;
        this._mass = mass;
        this._gender = gender;
        this._id = id;
        this._video = video;
    }
    get name() { return this._name; }
    get height() { return this._height; }
    get mass() { return this._mass; }
    get gender() { return this._gender; }
    get id() { return this._id; }
        
    // metodo che apre un div all'interno del div di classe container2 e visualizza i parametri di un'istanza, cioè visualizza i dati dell'utente
    getDetails() {
        let container2 = document.querySelector(".container2"),
            details = document.createElement("div"), //card div
            detailsFront = document.createElement("div"), //card front
            detailsBack = document.createElement("div"), //card back
            cPhoto = document.createElement("img"), //character image
            pName = document.createElement("p"), //character name
            pHeight = document.createElement("p"), //character height
            pMass = document.createElement("p"), //character mass
            pGender = document.createElement("p"), //character gender
            pRotate = document.createElement("div"), //instruction to flip card
            iFrame = document.createElement("iframe"); //character video

        details.className = "details";            
        detailsFront.classList = "detailsFront";
        detailsFront.classList.add("p--hidden");

        cPhoto.src = "/PHOTOS/Characters_photos/" + this._id + ".png";
        cPhoto.className = "c-photo";
        cPhoto.setAttribute("loading", "lazy");

        pRotate.classList = "pRotate";
        pRotate.textContent = "click to flip the card";

        detailsBack.classList.add("detailsBack");
        detailsBack.classList.add("p--hidden");
        detailsBack.style.transform = "rotateY(180deg)";

        iFrame.classList = "iFrame";
        iFrame.src = `${this._video}`;
            
        container2.append(details);
        details.append(detailsFront, detailsBack);
        detailsFront.append(cPhoto, pName, pHeight, pMass, pGender, pRotate);
        detailsBack.append(iFrame);

        pName.innerHTML = `Name: ${this._name}`;
        pHeight.innerHTML = `Height: ${this._height} cm`;
        pMass.innerHTML = `Mass: ${this._mass} kg`;
        pGender.innerHTML = `Gender: ${this._gender}`;

        //flip card event
        let rotateY = 0;
        details.addEventListener("click", function() {
            if (rotateY == 0) {
                rotateY = 180;
                pName.classList.toggle("rotation");
                pHeight.classList.toggle("rotation");
                pMass.classList.toggle("rotation");
                pGender.classList.toggle("rotation");
                cPhoto.classList.toggle("rotation");
                pRotate.classList.toggle("rotation");
            } else {
                rotateY = 0;
                setTimeout(() => {
                    pName.classList.toggle("rotation");
                    pHeight.classList.toggle("rotation");
                    pMass.classList.toggle("rotation");
                    pGender.classList.toggle("rotation");
                    cPhoto.classList.toggle("rotation");
                    pRotate.classList.toggle("rotation");
                }, 300);
            }         
            details.style.transform = `rotateY(${rotateY}deg)`;
        });            
    }

    // metodo che apre un form dove si possono modificare gli utenti nel file json, da modificare ed utilizzare il PUT
    modify(url = "") {
        createForm(this.name, this.height, this.mass, this.gender);
        
        let form = document.querySelector(".form");
        url = "http://localhost:3000/users/";  

        form.addEventListener('submit',(e)=>{
            e.preventDefault();

            let valueName = document.getElementById("name"),
                valueHeight = document.getElementById("height"),
                valueMass = document.getElementById("mass"),
                valueGender = document.getElementById("gender"),
                data = {
                id: this._id,
                name: valueName.value,
                height: valueHeight.value,
                mass: valueMass.value,
                gender: valueGender.value, 
                video: this._video
            };

            fetch(url + this._id, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        })     
    }

    // Metodo che prende l'id dell'istanza selezionata e cancella l'utente nel file JSON
    delete(url = "") {

        url = "http://localhost:3000/users/";

        fetch(url + this._id, {
            method: 'DELETE',
            header: {
                "Content-Type": "application/json"
            }
        })        
    }
}

// ------------------------------------------- PAGINATION CLASS ---------------------------------------
class Pagination {
    constructor(items = [], pageSize) {
        this.items = items;
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.diplayedItems = []; //array of items to display
        this.filteredItems = this.items; //copy of items array to filter with searchbar
        this.tbody = document.querySelector('tbody');
        this.totPages = this.getPages(); //get number of pages
        
        this.getDisplayedItems();
        this.displayItems(); 

        let riga = document.createElement('tr');

        for (let value in this.items[0]){
            let th = document.createElement('th');
            th.innerText = value;
            riga.append(th);
        }
    }

    //--------------------METHODS--------------------------------

    //------- GET NUMBER OF PAGES -----------------
    getPages(list = this.items) {
    
        let totalPages = Math.ceil(list.length / this.pageSize);

        if (totalPages < this.currentPage) {
            this.currentPage = totalPages;
        }
        if (this.currentPage == 0) {
            this.currentPage = 1;
        }
        console.log(`list length: ${list.length}`);
        return totalPages;
    }

    //-------- CHECK USER LIST TO DISPLAY ------------
    checkList() {
        if (this.filteredItems.length < this.items.length) {
            return this.filteredItems;
        }else {
            return this.items;
        }
    }

    //--------- GET PORTION OF ITEMS TO SHOW -------
    getDisplayedItems(list = this.items) {
        let lastItem = this.currentPage * this.pageSize;
        let firstItem = lastItem - this.pageSize;
        this.displayedItems = list.slice(firstItem, lastItem);
    }

    //--------------- SHOW ITEMS ------------------
    displayItems() {
        this.tbody.innerHTML = '';
        this.displayedItems.forEach((e) => {
            let tbody = document.querySelector("tbody");
            let riga = document.createElement("tr");
            let tdName = document.createElement("td");
            let tdHeight = document.createElement("td");
    
            let tdActions = document.createElement("td");
                tdActions.className = "tdActions";
            let tdButtonDetails = document.createElement("button");
                tdButtonDetails.className = "buttonDetails";
                tdButtonDetails.textContent = "DETAILS";
                tdButtonDetails.classList.add("btn", "btn-success", "m-2");
                
            let tdButtonModify = document.createElement("button");
                tdButtonModify.className = "buttonModify";
                tdButtonModify.textContent = "MODIFY";
                tdButtonModify.classList.add("btn", "btn-primary", "m-2");
    
            let tdButtonDelete = document.createElement("button");
                tdButtonDelete.className = "buttonDelete";
                tdButtonDelete.textContent = "DELETE"; 
                tdButtonDelete.classList.add("btn", "btn-danger", "m-2");
    
            tdActions.append(tdButtonDetails, tdButtonModify, tdButtonDelete);
    
            riga.append(tdName, tdHeight, tdActions);
    
            tbody.append(riga);

            tdName.textContent = e.name;
            tdHeight.textContent = e.height;
        
            let detailsFront = document.querySelectorAll(".detailsFront");
            let detailsBack = document.querySelectorAll(".detailsBack");

            tdButtonDetails.addEventListener('click', () => {
                e.getDetails()
                detailsFront.forEach((detail, index) =>{
                    detail.classList.add('p--hidden');
                    detailsBack[index].classList.add('p--hidden');
                })
                detailsFront[e.id - 1].classList.remove('p--hidden');
                detailsBack[e.id - 1].classList.remove('p--hidden'); 
            });
            tdButtonModify.addEventListener('click', () => {e.modify()});
            tdButtonDelete.addEventListener('click', () => {e.delete()});            
        })
        document.querySelector('#p--displayFiltered').textContent = this.filteredItems.length;
        console.log(`totPages: ${this.totPages}`);
        console.log(`currentPages: ${this.currentPage}`);
        console.log(`displayedItems: ${this.displayedItems}`);
        console.log(`pageSize: ${this.pageSize}`);
    };
    
    //----------- GO TO FIRST PAGE ------------TOP SENSEI IN THE WORLD ------------
    first() {
        this.currentPage = 1;
        this.getDisplayedItems(this.checkList());
        this.displayItems();
    };

    //----------- GO TO PREVIOUS PAGE ----------- GRAZIE
    prev() {
        this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
        this.getDisplayedItems(this.checkList());
        this.displayItems();
    };

    //----------- GO TO NEXT PAGE --------------
    next() {
        this.currentPage = this.currentPage < this.totPages ? this.currentPage + 1 : this.totPages;
        this.getDisplayedItems(this.checkList());
        this.displayItems();
    };

    //------------ GO TO LAST PAGE --------------
    last() {
        this.currentPage = this.totPages;
        this.getDisplayedItems(this.checkList());
        this.displayItems();
    };

    //------------ GET NUMBER OF ITEMS TO SHOW ------------
    range(range){ 
        this.pageSize = range <= this.filteredItems.length ? range : this.filteredItems.length;   
        this.totPages = this.getPages(this.checkList());
        this.getDisplayedItems(this.checkList());
        this.displayItems();
        
    };

    //-------------- SEARCHBAR FUNCTION ---------------
    searchbar(searchString){ 
        this.filteredItems = this.items.filter((item)=> {
            return item.name.toLowerCase().includes(searchString);
        })
        if (this.filteredItems.length < this.items.length) {
            this.totPages = this.getPages(this.filteredItems);
        } else {
            this.totPages = this.getPages();
        }      
        this.getDisplayedItems(this.checkList());    
        this.displayItems();
    };
}

//----------------------------------------------- FUNCTIONS -----------------------------------------
//-------------- CREATE FORM --------------------
function createForm(nameF = "", heightF = "", massF = "", genderF = "") {
    let display = document.getElementById('p--display');
    let divGrande = document.createElement('div');
        divGrande.id = 'divGrande';
    let divForm = document.createElement("div");
        divForm.id = "openModal";
    let form = document.createElement('form');
        form.classList = 'form'

    //----------- NAME -----------------
    let div1 = document.createElement("div");
        div1.className = 'mb-3'
        let label1 = document.createElement("label");
        label1.for = 'name';
        label1.className = 'form-label';
        label1.textContent = 'name';
        let name = document.createElement("input");
        name.type = 'text';
        name.className = 'form-control';
        name.id = 'name';
        name.required = true;
        div1.append(label1, name);
        name.value = nameF;

    //------------- HEIGHT ------------------
    let div2 = document.createElement("div");
        div2.className = 'mb-3'
        let label2 = document.createElement("label");
        label2.for = 'height';
        label2.className = 'form-label';
        label2.textContent = 'height';
        let height = document.createElement("input");
        height.type = 'text';
        height.className = 'form-control';
        height.id = 'height';
        height.required = true;
        div2.append(label2, height);
        height.value = heightF;

    //------------- MASS --------------------
    let div3 = document.createElement("div");
        div3.className = 'mb-3'
        let label3 = document.createElement("label");
        label3.for = 'mass';
        label3.className = 'form-label';
        label3.textContent = 'mass';
        let mass = document.createElement("input");
        mass.type = 'text';
        mass.className = 'form-control';
        mass.id = 'mass';
        mass.required = true;
        div2.append(label3, mass);
        mass.value = massF;

    //------------- GENDER -----------------
    let div4 = document.createElement("div");
        div4.className = 'mb-3'
        let label4 = document.createElement("label");
        label4.for = 'gender';
        label4.className = 'form-label';
        label4.textContent = 'gender';
        let gender = document.createElement("input");
        gender.type = 'text';
        gender.className = 'form-control';
        gender.id = 'gender';
        gender.required = true;
        div4.append(label4, gender);
        gender.value = genderF;
    //------------ SUBMIT BUTTON ------------------
    let button = document.createElement("button");
        button.type = 'submit';
        button.id = 'buttonForm'
        button.textContent = 'Submit';
        button.classList.add('btn', 'btn-primary');

    display.append(divGrande)
    divGrande.append(divForm)
    divForm.append(form);

    form.append(div1, div2, div3, div4, button);
    //------- CLOSE FORM ON OUTSIDE CLICK ----------------
    divGrande.addEventListener("click", event => {
        if(!$(event.target).closest('#openModal').length && !$(event.target).is('.form')) {
            let divClose = document.querySelectorAll('#divGrande');            
            divClose.forEach((div) => {
                div.classList.add('p--hidden');
            });
        }
    });
} 


// Funzione asincrona che richiede il file json e lo elabora
async function mainFunction() {

    // L'array user è popolato da istanze dell'oggetto UserClass
    let users = [];

    await fetch(url).then(res=>res.json()).then((res)=>{
        // una volta arrivato il file JSON sotto forma di array di oggetti, facendo un forEach su questo array, popoliamo l'array users.
        res.users.forEach((user) => {            
            users.push(new UserClass(user.name, user.height, user.mass, user.gender, user.id, user.video));
        });
        users.forEach((user) => {
            user.getDetails();
        });   


        ///////////// SEARCHBAR FUNCTIONALITIES // 

        let searchbar = document.getElementById('search'),
            range = document.getElementById('range'),
            rangeForm = document.getElementById('formPage'),
            rangeSubmit = document.getElementById('submit');

        let page = new Pagination (users, range.value);
        // document.getElementById('p--displayFiltered').innerHTML = users.length; // bottone del filtro
        
        ////////////// FUNZIONE SEARCHBAR
        searchbar.addEventListener('keyup', (e) => {
            page.searchbar(e.target.value);
        });

        ////////////// FUNZIONE DEL RANGE // RNGF (CTRL + F)
        range.addEventListener('change',() => {
            rangeSubmit.textContent = range.value;
        })

            ///////////// PULSANTE CON IL NUMERO DI PAGINE DEL RANGE
            rangeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                page.range(range.value);
            });

        // FUNZIONALITA' BOTTONI DI INPAGINAZIONE
        let buttonFirst = document.getElementById('first'),
            buttonPrev = document.getElementById('prev'),
            buttonNext = document.getElementById('next'),
            buttonLast = document.getElementById('last');

        buttonFirst.addEventListener('click', function(){
            page.first();
        })
        buttonPrev.addEventListener('click', function(){
            page.prev();
        })
        buttonNext.addEventListener('click', function(){
            page.next();
        })
        buttonLast.addEventListener('click', function(){
            page.last();
        })
        
        // FUNZIONALITA' BOTTONE AGGIUNGI UTENTE
        let buttonAdd = document.getElementById('addUser');
        buttonAdd.addEventListener('click', ()=>{
            createForm();            
            let form = document.querySelector(".form");
            url = "http://localhost:3000/users/";

            form.addEventListener('submit',(e)=>{
                e.preventDefault();

                let valueName = document.getElementById("name");
                let valueHeight = document.getElementById("height");
                let valueMass = document.getElementById("mass");
                let valueGender = document.getElementById("gender");
                let data = {
                    id: `${users.length + 1}`,
                    name: valueName.value,
                    height: valueHeight.value,
                    mass: valueMass.value,
                    gender: valueGender.value 
                };

                fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
            })
        });        
    })
}

/* 
    RUUUUUUUUUUUUUUUUUN!!!!!
─────────────────────────────▄██▄
─────────────────────────────▀███
────────────────────────────────█
───────────────▄▄▄▄▄────────────█
──────────────▀▄────▀▄──────────█
──────────▄▀▀▀▄─█▄▄▄▄█▄▄─▄▀▀▀▄──█
─────────█──▄──█────────█───▄─█─█
─────────▀▄───▄▀────────▀▄───▄▀─█
──────────█▀▀▀────────────▀▀▀─█─█
──────────█───────────────────█─█
▄▀▄▄▀▄────█──▄█▀█▀█▀█▀█▀█▄────█─█
█▒▒▒▒█────█──█████████████▄───█─█
█▒▒▒▒█────█──██████████████▄──█─█
█▒▒▒▒█────█───██████████████▄─█─█
█▒▒▒▒█────█────██████████████─█─█
█▒▒▒▒█────█───██████████████▀─█─█
█▒▒▒▒█───██───██████████████──█─█
▀████▀──██▀█──█████████████▀──█▄█
──██───██──▀█──█▄█▄█▄█▄█▄█▀──▄█▀
──██──██────▀█─────────────▄▀▓█
──██─██──────▀█▀▄▄▄▄▄▄▄▄▄▀▀▓▓▓█
──████────────█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
──███─────────█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
──██──────────█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
──██──────────█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
──██─────────▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
──██────────▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
──██───────▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▌
──██──────▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▌
──██─────▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▌
──██────▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▌ 
*/
mainFunction();







//CREATED BY PABLO & SENSEI