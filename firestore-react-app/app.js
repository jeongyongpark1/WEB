var firebaseConfig = {
    apiKey: "AIzaSyBwPBNK_bPl7qliqHYS57JiY4SebG9GE8Q",
    authDomain: "test-react-app-5d4de.firebaseapp.com",
    databaseURL: "https://test-react-app-5d4de.firebaseio.com",
    projectId: "test-react-app-5d4de",
    storageBucket: "test-react-app-5d4de.appspot.com",
    messagingSenderId: "179896576236",
    appId: "1:179896576236:web:783a3cd5833b5c7006ddc9",
    measurementId: "G-B1835ENEGR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const boardList = document.querySelector('#board-list');
const form = document.querySelector('#add-board-form');

// create element & render board
function renderBoard(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let post = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    post.textContent = doc.data().post;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(post);
    li.appendChild(cross);
    //console.log(li);
    boardList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute('data-id');
      db.collection('board').doc(id).delete();
    })

}

//getting data
/*
db.collection('').where('','==','').orderBy('').get().then(snapshot => {
    //console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        //console.log(doc.data());
        renderBoard(doc);
    });
});
*/

// real-time listener
db.collection('board').orderBy('post').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  //console.log(changes);
  changes.forEach(change => {
      console.log(change.doc.data());
      if(change.type == 'added'){
          renderBoard(change.doc);
      } else if (change.type == 'removed'){
          let li = boardList.querySelector('[data-id=' + change.doc.id + ']');
          boardList.removeChild(li);
      }
  });
});

//db.collection('board').doc('PKMqsKn6BfhLGpvR5VdW').update({post:''})
//db.collection('board').doc('PKMqsKn6BfhLGpvR5VdW').set({name:'',post:''})

// saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('board').add({
      name: form.name.value,
      post: form.post.value
  });
  form.name.value = '';
  form.post.value = '';
});