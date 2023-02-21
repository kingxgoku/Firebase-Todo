// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot,getDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyArfH5FR3krdsAu93nmua0TwqqZuH3VpLw",
    authDomain: "todo-live-6c1b3.firebaseapp.com",
    projectId: "todo-live-6c1b3",
    storageBucket: "todo-live-6c1b3.appspot.com",
    messagingSenderId: "264373105003",
    appId: "1:264373105003:web:9f5bac35a6e86a26ef1c2e",
    measurementId: "G-GFL2ZZ2TTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const docRef = collection(db,'todo-items');



// Adding item 

document.getElementById('todo').addEventListener('keypress',(e)=>{
    if(e.key === "Enter"){
        addDoc(docRef,{
            text: e.target.value,
            status: 'active'
        });
        e.target.value = '';
    }
});


// getting the data
const listContainer = document.getElementById('list-container');

onSnapshot(docRef, (docs)=>{
    let count = 0;
    let reItems = [];
    docs.forEach(doc=>{
        reItems.push({
            id:doc.id,
            ...doc.data(),
        });

    });
    reItems.forEach(item =>{
        if(item.status ==="active"){
            count +=1
        }
    })
    document.getElementById("list-count").innerHTML = count;


    genrateItems(reItems)

    document.querySelectorAll('.form-check-input').forEach(item => item.addEventListener('click', e => markCompleted(e)));
    document.querySelectorAll(".bi-x-lg").forEach(x =>{

        x.addEventListener('click', e => testFunc(e));
    });

    document.querySelectorAll('.item').forEach(item =>{
        item.addEventListener('dragstart',(e)=>{
            
            item.classList.add('dragging')
        });

        item.addEventListener('dragend',()=>{
            
            item.classList.remove('dragging')
        })
    })
});


function genrateItems(items){
    listContainer.innerHTML ="";
    items.forEach(item => listContainer.innerHTML += `
    <div class="item flex gap-4 p-3 px-4 border-bottom border-light-subtle" draggable="true">
            <input ${item.status === "active" ? "" :"checked" } data-id ="${item.id}" class="form-check-input rounded-circle" type="checkbox"  value="">
            <input type="text" class="form-control border-0 fs-6 ${item.status === "active" ? "" :"text-decoration-line-through" }" placeholder="${item.text}" disabled>
            <button class="--btn cross-btn"><i class="bi bi-x-lg"></i></button>
        </div>
    `)
};


async function markCompleted(e) {
    console.log(e.target.dataset.id);
    const docSnap = await getDoc(doc(db,'todo-items', e.target.dataset.id));

    if(docSnap.exists()){

        if(docSnap.data().status === 'active'){
            updateDoc(doc(db,'todo-items', e.target.dataset.id),{
                status: 'completed',
            })
        }
        else{
            await updateDoc(doc(db,'todo-items', e.target.dataset.id),{
                status: 'active',
            })
        }
    }
    else{
        console.log('no such file');
    }
    
};

// Removing single item

async function testFunc(e){
    const id = e.target.parentElement.previousElementSibling.previousElementSibling.dataset.id;
    await deleteDoc(doc(db,'todo-items',id));

}


// Clear completed function
document.getElementById('clear-c').addEventListener('click',()=>{
    document.querySelectorAll('[checked]').forEach(item =>{
        deleteDoc(doc(db,'todo-items',item.dataset.id));
    })
})


// display active
document.getElementById('f-active').addEventListener('click',(e)=>{
    reset(e)
    document.querySelectorAll('[checked]').forEach(item =>{
        item.parentElement.style.display = 'none';
    })
});


// display completed
document.getElementById('f-completed').addEventListener('click',(e)=>{
    reset(e)
    document.querySelectorAll('.item .form-check-input:not([checked])').forEach(item =>{
        item.parentElement.style.display = 'none';
    })
});



// display all
document.getElementById('f-all').addEventListener('click',(e)=>reset(e));

function reset(e){
    document.querySelectorAll("#ft-container button").forEach(btn=>{
        btn.classList.remove('active');
    });

    e.target.classList.add('active');

    document.querySelectorAll('.item').forEach(item =>{
        item.style.display = 'flex';
    })
};


// modes
const modeBtn = document.getElementById('mode');
modeBtn.addEventListener('click', (e) => {
    if (modeBtn.firstChild.classList.contains('bi-moon-fill')) {
        modeBtn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>'
        document.documentElement.classList.add('dark');
    }
    else {
        document.documentElement.classList.remove('dark');
        modeBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';

    }

});





listContainer.addEventListener('dragover',()=>{
    console.log('dragover');
    const draggable = document.querySelector('.dragging');
    listContainer.appendChild(draggable);
});


